import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { BounceButton, TopBar } from '@/components/GameUI';

export default function LiveScreen() {
  const colors = useColors();
  const router = useRouter();
  const [phrase, setPhrase] = useState('');
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.navy }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.safeZone}><Text style={styles.safeZoneText}>CAMERA SAFE ZONE</Text></View>
        <TopBar eyebrow="STREAMER MODE" title="Go live with ReVerse" right={<View style={[styles.liveBadge, { backgroundColor: colors.coral }]}><View style={styles.liveDot} /><Text style={styles.liveText}>LIVE</Text></View>} />
        <Text style={styles.intro}>Big cues. Fast rounds. Easy for chat to play along.</Text>
        <View style={[styles.liveCard, { backgroundColor: colors.coral, borderColor: colors.paper }]}>
          <Feather name="radio" size={25} color={colors.paper} />
          <Text style={styles.liveCardTitle}>Chat challenge</Text>
          <Text style={styles.liveCardCopy}>Enter a phrase from your comments, then keep it hidden from the camera.</Text>
        </View>
        <Text style={styles.label}>CHAT SUGGESTION</Text>
        <TextInput value={phrase} onChangeText={setPhrase} placeholder="Type the next challenge" placeholderTextColor="rgba(255,255,255,0.48)" style={styles.input} maxLength={42} />
        <BounceButton label="Start stream round" icon="play-circle" variant="yellow" disabled={phrase.trim().length < 2} onPress={() => router.push({ pathname: '/challenge', params: { phrase, mode: 'live' } })} />
        <View style={styles.streamTip}><Feather name="maximize-2" size={16} color={colors.yellow} /><Text style={styles.streamTipText}>Large mode keeps the result readable on a second screen.</Text></View>
        <View style={styles.safeZoneBottom}><Text style={styles.safeZoneText}>CAMERA SAFE ZONE</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 120 },
  safeZone: { height: 34, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', borderStyle: 'dashed', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 17 },
  safeZoneBottom: { height: 42, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', borderStyle: 'dashed', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 34 },
  safeZoneText: { color: 'rgba(255,255,255,0.45)', fontSize: 9, fontWeight: '900', letterSpacing: 1.4 },
  topBar: { marginBottom: 13 },
  intro: { color: 'rgba(255,255,255,0.7)', fontSize: 16, lineHeight: 22, fontWeight: '600', marginBottom: 19 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 10, paddingVertical: 7, paddingHorizontal: 9 },
  liveDot: { width: 7, height: 7, backgroundColor: '#FFFFFF', borderRadius: 7 },
  liveText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900' },
  liveCard: { borderWidth: 2, borderRadius: 24, padding: 19, marginBottom: 26 },
  liveCardTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: '900', marginTop: 18 },
  liveCardCopy: { color: '#FFFFFF', opacity: 0.85, fontSize: 14, lineHeight: 20, fontWeight: '600', marginTop: 5 },
  label: { color: '#FFFFFF', fontSize: 11, fontWeight: '900', letterSpacing: 1.1, marginBottom: 9 },
  input: { minHeight: 58, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 17, paddingHorizontal: 17, fontSize: 17, fontWeight: '700', color: '#FFFFFF', marginBottom: 17 },
  streamTip: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 20 },
  streamTipText: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '600', flex: 1 },
});