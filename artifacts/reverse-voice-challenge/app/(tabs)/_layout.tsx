import React from 'react';
import { ColorValue, Platform, StyleSheet, useColorScheme, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { Tabs } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { SymbolView } from 'expo-symbols';

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index"><NativeTabs.Trigger.Icon sf={{ default: 'map', selected: 'map.fill' }} /><NativeTabs.Trigger.Label>Solo</NativeTabs.Trigger.Label></NativeTabs.Trigger>
      <NativeTabs.Trigger name="custom"><NativeTabs.Trigger.Icon sf={{ default: 'wand.and.stars', selected: 'wand.and.stars.inverse' }} /><NativeTabs.Trigger.Label>Custom</NativeTabs.Trigger.Label></NativeTabs.Trigger>
      <NativeTabs.Trigger name="live"><NativeTabs.Trigger.Icon sf={{ default: 'dot.radiowaves.left.and.right', selected: 'dot.radiowaves.left.and.right' }} /><NativeTabs.Trigger.Label>Live</NativeTabs.Trigger.Label></NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings"><NativeTabs.Trigger.Icon sf={{ default: 'gearshape', selected: 'gearshape.fill' }} /><NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label></NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isIOS = Platform.OS === 'ios';
  const isWeb = Platform.OS === 'web';

  const icon = (name: keyof typeof Feather.glyphMap, color: ColorValue) => <Feather name={name} size={21} color={color} />;
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.coral, tabBarInactiveTintColor: colors.mutedForeground, tabBarStyle: { position: 'absolute', backgroundColor: isIOS ? 'transparent' : colors.paper, borderTopWidth: isWeb ? 1 : 0, borderTopColor: colors.border, elevation: 0, height: isWeb ? 84 : 70, paddingTop: 8 }, tabBarBackground: () => isIOS ? <BlurView intensity={100} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} /> : <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.paper }]} /> }}>
      <Tabs.Screen name="index" options={{ title: 'Solo', tabBarIcon: ({ color }) => isIOS ? <SymbolView name="map" tintColor={color} size={22} /> : icon('map', color) }} />
      <Tabs.Screen name="custom" options={{ title: 'Custom', tabBarIcon: ({ color }) => isIOS ? <SymbolView name="wand.and.stars" tintColor={color} size={22} /> : icon('edit-3', color) }} />
      <Tabs.Screen name="live" options={{ title: 'Live', tabBarIcon: ({ color }) => isIOS ? <SymbolView name="dot.radiowaves.left.and.right" tintColor={color} size={22} /> : icon('radio', color) }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: ({ color }) => isIOS ? <SymbolView name="gearshape" tintColor={color} size={22} /> : icon('settings', color) }} />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
