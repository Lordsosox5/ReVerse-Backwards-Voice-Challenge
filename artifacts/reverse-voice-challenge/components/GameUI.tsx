import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

export function BounceButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
  testID,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'dark' | 'outline' | 'yellow';
  icon?: keyof typeof Feather.glyphMap;
  disabled?: boolean;
  testID?: string;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const colors = useColors();
  const background = variant === 'primary' ? colors.coral : variant === 'yellow' ? colors.yellow : variant === 'dark' ? colors.navy : colors.card;
  const foreground = variant === 'outline' ? colors.navy : variant === 'yellow' ? colors.navy : colors.primaryForeground;

  return (
    <Animated.View style={{ transform: [{ scale }], opacity: disabled ? 0.45 : 1 }}>
      <Pressable
        testID={testID}
        disabled={disabled}
        onPressIn={() => Animated.spring(scale, { toValue: 0.95, useNativeDriver: true, speed: 30, bounciness: 12 }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 25, bounciness: 14 }).start()}
        onPress={() => {
          Haptics.selectionAsync();
          onPress();
        }}
        style={[styles.button, { backgroundColor: background, borderColor: colors.navy }, variant === 'outline' && styles.outline]}
      >
        {icon ? <Feather name={icon} size={18} color={foreground} /> : null}
        <Text style={[styles.buttonText, { color: foreground }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

export function IconButton({ icon, onPress, label }: { icon: keyof typeof Feather.glyphMap; onPress: () => void; label: string }) {
  const colors = useColors();
  return (
    <Pressable accessibilityLabel={label} onPress={onPress} style={[styles.iconButton, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Feather name={icon} size={20} color={colors.navy} />
    </Pressable>
  );
}

export function TopBar({ eyebrow, title, right }: { eyebrow?: string; title: string; right?: React.ReactNode }) {
  const colors = useColors();
  return (
    <View style={styles.topBar}>
      <View>
        {eyebrow ? <Text style={[styles.eyebrow, { color: colors.coral }]}>{eyebrow.toUpperCase()}</Text> : null}
        <Text style={[styles.title, { color: colors.navy }]}>{title}</Text>
      </View>
      {right}
    </View>
  );
}

export function StatPill({ icon, value, label, color }: { icon: keyof typeof Feather.glyphMap; value: string; label: string; color: string }) {
  const colors = useColors();
  return (
    <View style={[styles.statPill, { backgroundColor: color }]}>
      <Feather name={icon} size={15} color={colors.navy} />
      <View>
        <Text style={[styles.statValue, { color: colors.navy }]}>{value}</Text>
        <Text style={[styles.statLabel, { color: colors.navy }]}>{label}</Text>
      </View>
    </View>
  );
}

export function Waveform({ active = false }: { active?: boolean }) {
  const colors = useColors();
  const bars = [16, 28, 42, 24, 52, 32, 20, 44, 58, 28, 45, 20, 38, 50, 25, 42, 18];
  return (
    <View style={styles.waveform}>
      {bars.map((height, index) => (
        <View key={index} style={[styles.waveBar, { height: active ? height + (index % 3) * 8 : height * 0.45, backgroundColor: active ? colors.coral : colors.sky }]} />
      ))}
    </View>
  );
}

export function Confetti() {
  const colors = useColors();
  const pieces = Array.from({ length: 18 });
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((_, index) => (
        <View key={index} style={[styles.confetti, { left: `${(index * 37) % 100}%`, top: 48 + ((index * 19) % 36), backgroundColor: [colors.coral, colors.yellow, colors.sky, colors.purple][index % 4], transform: [{ rotate: `${index * 18}deg` }] }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 4 },
  title: { fontSize: 30, fontWeight: '800', letterSpacing: -0.8 },
  button: { minHeight: 54, borderRadius: 18, borderWidth: 2, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, shadowColor: '#17223B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.14, shadowRadius: 0, elevation: 3 },
  outline: { borderWidth: 2 },
  buttonText: { fontSize: 16, fontWeight: '800' },
  iconButton: { width: 46, height: 46, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  statPill: { borderRadius: 16, paddingVertical: 9, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 8, minWidth: 92 },
  statValue: { fontSize: 15, fontWeight: '900' },
  statLabel: { fontSize: 10, fontWeight: '700', opacity: 0.65, marginTop: 1 },
  waveform: { height: 62, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  waveBar: { width: 5, borderRadius: 6 },
  confetti: { position: 'absolute', width: 9, height: 18, borderRadius: 3 },
});