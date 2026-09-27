import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { BounceButton, IconButton, StatPill, TopBar } from '@/components/GameUI';
import { useGame } from '@/components/GameContext';
import { LEVELS, TUTORIAL_PHRASE } from '@/data/gameData';
import VoiceRound from '@/components/VoiceRound';

function Onboarding() {
  const colors = useColors();
  const { completeOnboarding } = useGame();
  const [started, setStarted] = useState(false);
  if (started) return <VoiceRound phrase={TUTORIAL_PHRASE} onboarding onComplete={completeOnboarding} />;
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.paper }]}>
      <View style={styles.onboarding}>
        <View style={[styles.logoBubble, { backgroundColor: colors.yellow, borderColor: colors.navy }]}><Feather name="rewind" size={48} color={colors.navy} /></View>
        <Text style={[styles.brand, { color: colors.navy }]}>ReVerse</Text>
        <Text style={[styles.onboardingTitle, { color: colors.navy }]}>Say it forward.{'\n'}Beat it backwards.</Text>
        <Text style={[styles.onboardingCopy, { color: colors.mutedForeground }]}>A voice challenge where your ears learn the trick before your mouth does.</Text>
        <View style={[styles.warmupCard, { backgroundColor: colors.sky, borderColor: colors.navy }]}>
          <View style={styles.cardTop}><Text style={[styles.cardEyebrow, { color: colors.navy }]}>FIRST CHALLENGE</Text><View style={[styles.xpBadge, { backgroundColor: colors.paper }]}><Text style={[styles.xpText, { color: colors.navy }]}>+25 XP</Text></View></View>
          <Text style={[styles.warmupWord, { color: colors.navy }]}>?</Text>
          <Text style={[styles.warmupHint, { color: colors.navy }]}>Your warm-up word is hidden.</Text>
        </View>
        <BounceButton label="Play the warm-up" icon="play" onPress={() => setStarted(true)} />
        <Text style={[styles.smallNote, { color: colors.mutedForeground }]}>Takes about 30 seconds</Text>
      </View>
    </SafeAreaView>
  );
}

export default function SoloScreen() {
  const colors = useColors();
  const router = useRouter();
  const { hasOnboarded, xp, streak, stars } = useGame();
  if (!hasOnboarded) return <Onboarding />;
  const unlocked = Math.max(1, Math.min(LEVELS.length, Object.keys(stars).length + 1));
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.paper }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TopBar eyebrow="SOLO CAMPAIGN" title="Your voice map" right={<IconButton icon="bell" label="Notifications" onPress={() => {}} />} />
        <View style={styles.statsRow}><StatPill icon="zap" value={`${xp}`} label="XP earned" color={colors.yellow} /><StatPill icon="trending-up" value={`${streak}`} label="day streak" color={colors.mint} /></View>
        <View style={[styles.progressCard, { backgroundColor: colors.navy }]}>
          <View style={styles.progressHeader}><View><Text style={styles.progressKicker}>NEXT UP</Text><Text style={styles.progressTitle}>The first flip</Text></View><Text style={[styles.progressFraction, { color: colors.yellow }]}>{unlocked} / {LEVELS.length}</Text></View>
          <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${(unlocked / LEVELS.length) * 100}%`, backgroundColor: colors.yellow }]} /></View>
          <Text style={styles.progressCopy}>Earn 3 stars to unlock the next phrase.</Text>
        </View>
        <View style={styles.sectionRow}><Text style={[styles.sectionTitle, { color: colors.navy }]}>Phrase path</Text><View style={styles.legend}><View style={[styles.dot, { backgroundColor: colors.yellow }]} /><Text style={[styles.legendText, { color: colors.mutedForeground }]}>unlocked</Text></View></View>
        <View style={styles.map}>
          {LEVELS.map((level, index) => {
            const isUnlocked = level.id <= unlocked;
            const earned = stars[String(level.id)] ?? 0;
            return (
              <View key={level.id} style={styles.levelRow}>
                <View style={styles.connectorWrap}>{index < LEVELS.length - 1 ? <View style={[styles.connector, { backgroundColor: level.id < unlocked ? colors.coral : colors.border }]} /> : null}<Pressable disabled={!isUnlocked} onPress={() => router.push({ pathname: '/challenge', params: { phrase: level.phrase, levelId: String(level.id) } })} style={[styles.levelNode, { backgroundColor: isUnlocked ? level.color : colors.muted, borderColor: isUnlocked ? colors.navy : colors.border }]}><Feather name={isUnlocked ? level.icon : 'lock'} size={22} color={isUnlocked ? colors.navy : colors.mutedForeground} /></Pressable></View>
                <Pressable disabled={!isUnlocked} onPress={() => router.push({ pathname: '/challenge', params: { phrase: level.phrase, levelId: String(level.id) } })} style={styles.levelInfo}><View style={styles.levelHeading}><Text style={[styles.levelTitle, { color: isUnlocked ? colors.navy : colors.mutedForeground }]}>{level.title}</Text><Text style={[styles.levelDifficulty, { color: isUnlocked ? colors.coral : colors.mutedForeground }]}>{level.difficulty}</Text></View><Text style={[styles.levelPhrase, { color: isUnlocked ? colors.navy : colors.mutedForeground }]}>{isUnlocked ? level.phrase : 'Locked phrase'}</Text><View style={styles.stars}>{[0, 1, 2].map((star) => <Feather key={star} name="star" size={15} color={star < earned ? colors.yellow : colors.border} />)}</View></Pressable>
              </View>
            );
          })}
        </View>
        <View style={{ height: 96 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 18 },
  onboarding: { flex: 1, padding: 28, alignItems: 'center', justifyContent: 'center' },
  logoBubble: { width: 102, height: 102, borderRadius: 36, borderWidth: 3, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-8deg' }], marginBottom: 18 },
  brand: { fontSize: 17, fontWeight: '900', letterSpacing: 1, marginBottom: 22 },
  onboardingTitle: { fontSize: 34, lineHeight: 37, fontWeight: '900', textAlign: 'center', letterSpacing: -1 },
  onboardingCopy: { fontSize: 15, lineHeight: 22, textAlign: 'center', maxWidth: 300, marginTop: 14, marginBottom: 30 },
  warmupCard: { width: '100%', borderWidth: 2, borderRadius: 24, padding: 18, alignItems: 'center', marginBottom: 24, shadowColor: '#17223B', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.12, shadowRadius: 0, elevation: 3 },
  cardTop: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardEyebrow: { fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  xpBadge: { borderRadius: 10, paddingVertical: 6, paddingHorizontal: 8 },
  xpText: { fontSize: 11, fontWeight: '900' },
  warmupWord: { fontSize: 72, lineHeight: 88, fontWeight: '900', marginTop: 14 },
  warmupHint: { fontSize: 13, fontWeight: '700', marginBottom: 3 },
  smallNote: { fontSize: 12, fontWeight: '600', marginTop: 14 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  progressCard: { borderRadius: 24, padding: 19, marginBottom: 27 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  progressKicker: { color: '#FFFFFF', opacity: 0.65, fontSize: 10, fontWeight: '900', letterSpacing: 1.2, marginBottom: 4 },
  progressTitle: { color: '#FFFFFF', fontSize: 21, fontWeight: '900' },
  progressFraction: { fontSize: 17, fontWeight: '900' },
  progressTrack: { height: 9, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 9, marginTop: 18, overflow: 'hidden' },
  progressFill: { height: 9, borderRadius: 9 },
  progressCopy: { color: '#FFFFFF', opacity: 0.7, fontSize: 12, fontWeight: '600', marginTop: 12 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 },
  sectionTitle: { fontSize: 20, fontWeight: '900' },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 8, height: 8, borderRadius: 8 },
  legendText: { fontSize: 11, fontWeight: '700' },
  map: { paddingBottom: 12 },
  levelRow: { flexDirection: 'row', minHeight: 88 },
  connectorWrap: { width: 58, alignItems: 'center' },
  connector: { position: 'absolute', top: 53, width: 3, height: 50 },
  levelNode: { width: 52, height: 52, borderRadius: 18, borderWidth: 2, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  levelInfo: { flex: 1, paddingTop: 1, paddingLeft: 13 },
  levelHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  levelTitle: { fontSize: 15, fontWeight: '900' },
  levelDifficulty: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  levelPhrase: { fontSize: 13, fontWeight: '600', marginTop: 4, marginBottom: 7 },
  stars: { flexDirection: 'row', gap: 3 },
});
