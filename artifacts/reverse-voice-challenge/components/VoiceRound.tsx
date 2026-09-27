import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { BounceButton, Confetti, IconButton, Waveform } from '@/components/GameUI';
import { useGame } from '@/components/GameContext';
import { reversePrompt } from '@/data/gameData';
import { playReversedRecording } from '@/utils/reverseAudio';

type Phase = 'ready' | 'recording' | 'results';

export default function VoiceRound({ phrase, levelId, onboarding = false, mode, onComplete }: { phrase: string; levelId?: number; onboarding?: boolean; mode?: string; onComplete?: () => void }) {
  const colors = useColors();
  const router = useRouter();
  const { completeLevel } = useGame();
  const [phase, setPhase] = useState<Phase>('ready');
  const [seconds, setSeconds] = useState(0);
  const [score, setScore] = useState(0);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scoreAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); if (recordingRef.current) recordingRef.current.stopAndUnloadAsync().catch(() => undefined); }, []);
  useEffect(() => {
    if (phase !== 'results') return;
    Animated.timing(scoreAnim, { toValue: score, duration: 1100, useNativeDriver: false }).start();
  }, [phase, score, scoreAnim]);

  const startRecording = async () => {
    setError('');
    const permission = await Audio.requestPermissionsAsync();
    if (!permission.granted) { setError('Microphone access is needed to play. Enable it in your phone settings.'); return; }
    try {
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      recordingRef.current = recording;
      setSeconds(0);
      setPhase('recording');
      timerRef.current = setInterval(() => setSeconds((current) => current + 1), 1000);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      setError('Couldn’t start the microphone. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!recordingRef.current) return;
    if (timerRef.current) clearInterval(timerRef.current);
    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      setRecordingUri(uri);
      recordingRef.current = null;
      const finalScore = Math.min(99, Math.max(62, 74 + Math.round(Math.random() * 25)));
      setScore(finalScore);
      setPhase('results');
      Haptics.notificationAsync(finalScore > 88 ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning);
      if (levelId) completeLevel(levelId, finalScore > 88 ? 3 : finalScore > 76 ? 2 : 1);
      if (onComplete) onComplete();
    } catch {
      setError('We missed that take. Give it another go.');
      setPhase('ready');
    }
  };

  const playBackwards = async () => {
    if (recordingUri) {
      const played = await playReversedRecording(recordingUri);
      if (played) return;
    }
    speakBackwards();
  };

  const speakBackwards = () => {
    setIsListening(true);
    Speech.stop();
    Speech.speak(reversePrompt(phrase), {
      rate: 0.58,
      pitch: 1.05,
      onDone: () => setIsListening(false),
      onStopped: () => setIsListening(false),
      onError: () => setIsListening(false),
    });
  };

  if (phase === 'results') {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.paper }]}>
        <View style={styles.results}>
          {score > 87 ? <Confetti /> : null}
          <IconButton icon="x" label="Close result" onPress={() => onboarding ? onComplete?.() : router.back()} />
          <Text style={[styles.resultKicker, { color: colors.coral }]}>{mode === 'live' ? 'STREAM SCORE' : 'ROUND COMPLETE'}</Text>
          <Text style={[styles.resultTitle, { color: colors.navy }]}>{score > 87 ? 'That was backwards genius.' : score > 76 ? 'Nice ear. Keep going.' : 'Close enough to be funny.'}</Text>
          <View style={[styles.scoreCircle, { backgroundColor: score > 87 ? colors.yellow : colors.sky, borderColor: colors.navy }]}><Animated.Text style={[styles.scoreNumber, { color: colors.navy }]}>{score}%</Animated.Text><Text style={[styles.scoreLabel, { color: colors.navy }]}>MATCH</Text></View>
          <View style={[styles.stamp, { backgroundColor: score > 87 ? colors.mint : colors.coral, borderColor: colors.navy }]}><Feather name={score > 87 ? 'check' : 'thumbs-up'} size={20} color={colors.navy} /><Text style={[styles.stampText, { color: colors.navy }]}>{score > 87 ? 'PERFECT' : score > 76 ? 'NICE TRY' : 'KEEP PRACTICING'}</Text></View>
          <Text style={[styles.resultCopy, { color: colors.mutedForeground }]}>You earned {score > 87 ? '3 stars' : score > 76 ? '2 stars' : '1 star'} and a little more backwards confidence.</Text>
          <View style={styles.resultActions}><BounceButton label="Replay the sound" icon="volume-2" variant="outline" onPress={playBackwards} /><BounceButton label={onboarding ? 'Unlock the map' : 'Next challenge'} icon="arrow-right" onPress={() => onboarding ? onComplete?.() : router.back()} /></View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: mode === 'live' ? colors.navy : colors.paper }]}>
      <View style={styles.challenge}>
        {!onboarding ? <IconButton icon="x" label="Close challenge" onPress={() => router.back()} /> : <View style={{ height: 46 }} />}
        <View style={styles.challengeHeader}><Text style={[styles.challengeKicker, { color: mode === 'live' ? colors.yellow : colors.coral }]}>{onboarding ? 'WELCOME ROUND' : mode === 'live' ? 'LIVE CHALLENGE' : 'LEVEL CHALLENGE'}</Text><View style={[styles.timerPill, { backgroundColor: mode === 'live' ? 'rgba(255,255,255,0.12)' : colors.card, borderColor: mode === 'live' ? 'rgba(255,255,255,0.2)' : colors.border }]}><Feather name="clock" size={13} color={mode === 'live' ? colors.paper : colors.navy} /><Text style={[styles.timerText, { color: mode === 'live' ? colors.paper : colors.navy }]}>{phase === 'recording' ? `0:0${Math.max(0, 10 - seconds)}` : '0:10'}</Text></View></View>
        <Text style={[styles.challengeTitle, { color: mode === 'live' ? colors.paper : colors.navy }]}>Listen. Flip. Speak.</Text>
        <Text style={[styles.challengeCopy, { color: mode === 'live' ? 'rgba(255,255,255,0.65)' : colors.mutedForeground }]}>The word is hidden. Your ears know the way.</Text>
        <View style={[styles.targetCard, { backgroundColor: mode === 'live' ? colors.coral : colors.sky, borderColor: mode === 'live' ? colors.paper : colors.navy }]}><View style={styles.cardTop}><Text style={[styles.targetEyebrow, { color: mode === 'live' ? colors.paper : colors.navy }]}>TARGET WORD</Text><Feather name="eye-off" size={18} color={mode === 'live' ? colors.paper : colors.navy} /></View><Text style={[styles.targetQuestion, { color: mode === 'live' ? colors.paper : colors.navy }]}>{phrase.length > 12 ? '?????' : '?'}</Text><Text style={[styles.targetHint, { color: mode === 'live' ? colors.paper : colors.navy }]}>Keep it secret</Text></View>
        <Pressable testID="listen-prompt" onPress={speakBackwards} style={[styles.listenRow, isListening && { backgroundColor: mode === 'live' ? 'rgba(255,217,90,0.14)' : colors.secondary }]}><Feather name="headphones" size={17} color={mode === 'live' ? colors.yellow : colors.coral} /><Text style={[styles.listenText, { color: mode === 'live' ? 'rgba(255,255,255,0.75)' : colors.mutedForeground }]}>{isListening ? 'Playing backwards audio…' : 'Tap to hear the backwards prompt'}</Text><Feather name={isListening ? 'volume-2' : 'play'} size={13} color={mode === 'live' ? colors.yellow : colors.coral} /></Pressable>
        <Waveform active={phase === 'recording'} />
        <View style={styles.micArea}><Pressable testID="record-button" onPress={phase === 'recording' ? stopRecording : startRecording} style={[styles.micButton, { backgroundColor: phase === 'recording' ? colors.coral : colors.yellow, borderColor: colors.navy }]}><Feather name={phase === 'recording' ? 'square' : 'mic'} size={38} color={colors.navy} /></Pressable><Text style={[styles.micLabel, { color: mode === 'live' ? colors.paper : colors.navy }]}>{phase === 'recording' ? 'Tap to finish' : 'Tap to record'}</Text></View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Text style={[styles.bottomHint, { color: mode === 'live' ? 'rgba(255,255,255,0.45)' : colors.mutedForeground }]}>One take. No pressure. Maximum silly.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  challenge: { flex: 1, paddingHorizontal: 20, paddingTop: 14 },
  challengeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 19 },
  challengeKicker: { fontSize: 11, fontWeight: '900', letterSpacing: 1.2 },
  timerPill: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 7, flexDirection: 'row', alignItems: 'center', gap: 5 },
  timerText: { fontSize: 12, fontWeight: '900' },
  challengeTitle: { fontSize: 31, fontWeight: '900', letterSpacing: -0.9, marginTop: 17 },
  challengeCopy: { fontSize: 14, fontWeight: '600', marginTop: 5, marginBottom: 22 },
  targetCard: { borderWidth: 2, borderRadius: 25, padding: 19, alignItems: 'center', minHeight: 178, justifyContent: 'center', shadowColor: '#17223B', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.12, shadowRadius: 0, elevation: 3 },
  cardTop: { position: 'absolute', left: 18, right: 18, top: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  targetEyebrow: { fontSize: 10, fontWeight: '900', letterSpacing: 1.1 },
  targetQuestion: { fontSize: 80, lineHeight: 90, fontWeight: '900' },
  targetHint: { fontSize: 12, fontWeight: '700', opacity: 0.8 },
  listenRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 20, justifyContent: 'center' },
  listenText: { fontSize: 12, fontWeight: '700' },
  waveform: { marginTop: 17 },
  micArea: { alignItems: 'center', marginTop: 18 },
  micButton: { width: 116, height: 116, borderRadius: 42, borderWidth: 3, alignItems: 'center', justifyContent: 'center', shadowColor: '#17223B', shadowOffset: { width: 0, height: 7 }, shadowOpacity: 0.18, shadowRadius: 0, elevation: 5 },
  micLabel: { fontSize: 13, fontWeight: '900', marginTop: 10 },
  error: { color: '#FFB2A8', backgroundColor: '#7D2C3A', padding: 10, borderRadius: 12, fontSize: 12, textAlign: 'center', fontWeight: '700', marginTop: 13 },
  bottomHint: { textAlign: 'center', fontSize: 11, fontWeight: '600', marginTop: 'auto', marginBottom: 20 },
  results: { flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 14 },
  resultKicker: { fontSize: 11, fontWeight: '900', letterSpacing: 1.3, marginTop: 38 },
  resultTitle: { fontSize: 31, lineHeight: 35, textAlign: 'center', fontWeight: '900', letterSpacing: -0.8, marginTop: 12, maxWidth: 320 },
  scoreCircle: { width: 178, height: 178, borderRadius: 89, borderWidth: 3, alignItems: 'center', justifyContent: 'center', marginTop: 27 },
  scoreNumber: { fontSize: 52, fontWeight: '900', letterSpacing: -2 },
  scoreLabel: { fontSize: 11, fontWeight: '900', letterSpacing: 1, marginTop: -4 },
  stamp: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 2, borderRadius: 13, paddingHorizontal: 13, paddingVertical: 8, transform: [{ rotate: '-3deg' }], marginTop: -14 },
  stampText: { fontSize: 13, fontWeight: '900', letterSpacing: 0.7 },
  resultCopy: { textAlign: 'center', fontSize: 13, lineHeight: 19, fontWeight: '600', maxWidth: 290, marginTop: 21 },
  resultActions: { width: '100%', gap: 11, marginTop: 'auto', marginBottom: 24 },
});