import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Keyboard, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { BounceButton, TopBar } from '@/components/GameUI';

export default function CustomScreen() {
  const colors = useColors();
  const router = useRouter();
  const [phrase, setPhrase] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const canStart = phrase.trim().length > 1;
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.paper }]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TopBar eyebrow="MAKE YOUR OWN" title="Custom challenge" />
        <View style={[styles.hero, { backgroundColor: colors.yellow, borderColor: colors.navy }]}>
          <View style={[styles.heroIcon, { backgroundColor: colors.paper }]}><Feather name="edit-3" size={23} color={colors.navy} /></View>
          <Text style={[styles.heroTitle, { color: colors.navy }]}>Anything goes.</Text>
          <Text style={[styles.heroCopy, { color: colors.navy }]}>Type a word or phrase. We’ll turn it into your next backwards brain-twister.</Text>
        </View>
        <Text style={[styles.label, { color: colors.navy }]}>YOUR SECRET PHRASE</Text>
        <TextInput value={phrase} onChangeText={(value) => { setPhrase(value); setSubmitted(false); }} placeholder="Try “pancake party”" placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.navy, backgroundColor: colors.card, borderColor: submitted && !canStart ? colors.coral : colors.border }]} maxLength={60} returnKeyType="done" onSubmitEditing={() => { Keyboard.dismiss(); if (canStart) setSubmitted(true); }} />
        <Text style={[styles.counter, { color: colors.mutedForeground }]}>{phrase.length}/60</Text>
        {submitted && canStart ? (
          <View style={[styles.maskedCard, { backgroundColor: colors.sky, borderColor: colors.navy }]}>
            <View style={styles.maskedTop}><Text style={[styles.maskedEyebrow, { color: colors.navy }]}>PHRASE LOCKED</Text><Feather name="eye-off" size={17} color={colors.navy} /></View>
            <View style={styles.questionRow}>{phrase.slice(0, Math.min(phrase.length, 8)).split('').map((_, index) => <View key={index} style={[styles.questionBlock, { backgroundColor: colors.paper, borderColor: colors.navy }]}><Text style={[styles.questionMark, { color: colors.navy }]}>?</Text></View>)}</View>
            <Text style={[styles.maskedCopy, { color: colors.navy }]}>Your challenge is ready. No peeking.</Text>
          </View>
        ) : null}
        <BounceButton label={submitted ? 'Play this challenge' : 'Lock the phrase'} icon={submitted ? 'play' : 'lock'} disabled={!canStart} onPress={() => { Keyboard.dismiss(); if (!submitted) setSubmitted(true); else router.push({ pathname: '/challenge', params: { phrase, mode: 'custom' } }); }} />
        <View style={styles.tip}><Feather name="info" size={16} color={colors.coral} /><Text style={[styles.tipText, { color: colors.mutedForeground }]}>For the funniest results, keep it under five words.</Text></View>
        <View style={{ height: 110 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 18 },
  hero: { borderWidth: 2, borderRadius: 24, padding: 19, marginBottom: 28 },
  heroIcon: { width: 43, height: 43, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  heroTitle: { fontSize: 28, fontWeight: '900', letterSpacing: -0.6 },
  heroCopy: { fontSize: 14, lineHeight: 20, fontWeight: '600', marginTop: 5, maxWidth: 290 },
  label: { fontSize: 11, fontWeight: '900', letterSpacing: 1.1, marginBottom: 9 },
  input: { minHeight: 58, borderWidth: 1.5, borderRadius: 17, paddingHorizontal: 17, fontSize: 17, fontWeight: '700' },
  counter: { fontSize: 11, fontWeight: '700', textAlign: 'right', marginTop: 7, marginBottom: 23 },
  maskedCard: { borderWidth: 2, borderRadius: 23, padding: 18, marginBottom: 22 },
  maskedTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  maskedEyebrow: { fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  questionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginVertical: 20 },
  questionBlock: { width: 30, height: 37, borderWidth: 1.5, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  questionMark: { fontSize: 19, fontWeight: '900' },
  maskedCopy: { fontSize: 13, fontWeight: '700' },
  tip: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 21, paddingHorizontal: 4 },
  tipText: { fontSize: 12, fontWeight: '600', flex: 1 },
});