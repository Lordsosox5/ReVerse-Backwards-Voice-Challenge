import React from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { TopBar } from '@/components/GameUI';
import { useGame } from '@/components/GameContext';

function SettingRow({ icon, title, copy, value, onValueChange }: { icon: keyof typeof Feather.glyphMap; title: string; copy: string; value: boolean; onValueChange: () => void }) {
  const colors = useColors();
  return <View style={[styles.settingRow, { borderBottomColor: colors.border }]}><View style={[styles.settingIcon, { backgroundColor: colors.sky }]}><Feather name={icon} size={18} color={colors.navy} /></View><View style={styles.settingCopy}><Text style={[styles.settingTitle, { color: colors.navy }]}>{title}</Text><Text style={[styles.settingSub, { color: colors.mutedForeground }]}>{copy}</Text></View><Switch value={value} onValueChange={onValueChange} trackColor={{ false: colors.border, true: colors.mint }} thumbColor={colors.paper} /></View>;
}

export default function SettingsScreen() {
  const colors = useColors();
  const { soundOn, hapticsOn, toggleSound, toggleHaptics, resetProgress, xp, completedRounds } = useGame();
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.paper }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <TopBar eyebrow="YOUR PROFILE" title="Settings" />
        <View style={[styles.profileCard, { backgroundColor: colors.yellow, borderColor: colors.navy }]}><View style={[styles.avatar, { backgroundColor: colors.coral }]}><Feather name="mic" size={25} color={colors.paper} /></View><View><Text style={[styles.profileTitle, { color: colors.navy }]}>Backwards beginner</Text><Text style={[styles.profileSub, { color: colors.navy }]}>Keep playing to unlock your voice stats.</Text></View></View>
        <View style={styles.miniStats}><View><Text style={[styles.miniValue, { color: colors.navy }]}>{xp}</Text><Text style={[styles.miniLabel, { color: colors.mutedForeground }]}>TOTAL XP</Text></View><View><Text style={[styles.miniValue, { color: colors.navy }]}>{completedRounds}</Text><Text style={[styles.miniLabel, { color: colors.mutedForeground }]}>ROUNDS</Text></View><View><Text style={[styles.miniValue, { color: colors.navy }]}>v1</Text><Text style={[styles.miniLabel, { color: colors.mutedForeground }]}>REVERSE</Text></View></View>
        <Text style={[styles.section, { color: colors.navy }]}>Game feel</Text>
        <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}><SettingRow icon="volume-2" title="Sound effects" copy="Chimes, taps, and the reveal" value={soundOn} onValueChange={toggleSound} /><SettingRow icon="smartphone" title="Haptics" copy="Feel each button and big score" value={hapticsOn} onValueChange={toggleHaptics} /></View>
        <Text style={[styles.section, { color: colors.navy }]}>Progress</Text>
        <Pressable onPress={() => Alert.alert('Reset progress?', 'This clears stars, XP, and streaks on this device.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Reset', style: 'destructive', onPress: resetProgress }])} style={[styles.resetRow, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.settingIcon, { backgroundColor: '#FFE0D8' }]}><Feather name="refresh-cw" size={18} color={colors.coral} /></View><View style={styles.settingCopy}><Text style={[styles.settingTitle, { color: colors.navy }]}>Reset game progress</Text><Text style={[styles.settingSub, { color: colors.mutedForeground }]}>Start the map from the beginning</Text></View><Feather name="chevron-right" size={19} color={colors.mutedForeground} /></Pressable>
        <Text style={[styles.footer, { color: colors.mutedForeground }]}>ReVerse is designed for quick, silly voice moments with friends.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 120 },
  profileCard: { borderRadius: 24, borderWidth: 2, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18 },
  avatar: { width: 54, height: 54, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  profileTitle: { fontSize: 17, fontWeight: '900' },
  profileSub: { fontSize: 12, fontWeight: '600', marginTop: 3, maxWidth: 210 },
  miniStats: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 28 },
  miniValue: { textAlign: 'center', fontSize: 22, fontWeight: '900' },
  miniLabel: { textAlign: 'center', fontSize: 9, fontWeight: '900', letterSpacing: 0.8, marginTop: 3 },
  section: { fontSize: 18, fontWeight: '900', marginBottom: 10 },
  settingsCard: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 16, marginBottom: 26 },
  settingRow: { minHeight: 78, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, gap: 12 },
  settingIcon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  settingCopy: { flex: 1 },
  settingTitle: { fontSize: 14, fontWeight: '900' },
  settingSub: { fontSize: 11, fontWeight: '600', marginTop: 3 },
  resetRow: { borderWidth: 1, borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  footer: { textAlign: 'center', fontSize: 12, lineHeight: 17, fontWeight: '600', marginTop: 30, paddingHorizontal: 25 },
});