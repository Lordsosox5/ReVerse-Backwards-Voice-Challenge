import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import VoiceRound from '@/components/VoiceRound';

export default function ChallengeScreen() {
  const params = useLocalSearchParams<{ phrase?: string; levelId?: string; mode?: string }>();
  return <VoiceRound phrase={params.phrase ?? 'Penguin'} levelId={params.levelId ? Number(params.levelId) : undefined} mode={params.mode} />;
}