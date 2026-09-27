import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type GameState = {
  hasOnboarded: boolean;
  xp: number;
  streak: number;
  stars: Record<string, number>;
  soundOn: boolean;
  hapticsOn: boolean;
  completedRounds: number;
};

type GameContextValue = GameState & {
  completeOnboarding: () => void;
  completeLevel: (levelId: number, stars: number) => void;
  toggleSound: () => void;
  toggleHaptics: () => void;
  resetProgress: () => void;
};

const STORAGE_KEY = '@reverse-game-state';
const initialState: GameState = {
  hasOnboarded: false,
  xp: 0,
  streak: 0,
  stars: {},
  soundOn: true,
  hapticsOn: true,
  completedRounds: 0,
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored) setState({ ...initialState, ...JSON.parse(stored) });
    });
  }, []);

  useEffect(() => {
    if (state !== initialState) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo<GameContextValue>(() => ({
    ...state,
    completeOnboarding: () =>
      setState((current) => ({ ...current, hasOnboarded: true, xp: Math.max(current.xp, 25), streak: Math.max(current.streak, 1) })),
    completeLevel: (levelId, earnedStars) =>
      setState((current) => ({
        ...current,
        xp: current.xp + earnedStars * 25,
        streak: current.streak + 1,
        completedRounds: current.completedRounds + 1,
        stars: { ...current.stars, [String(levelId)]: Math.max(current.stars[String(levelId)] ?? 0, earnedStars) },
      })),
    toggleSound: () => setState((current) => ({ ...current, soundOn: !current.soundOn })),
    toggleHaptics: () => setState((current) => ({ ...current, hapticsOn: !current.hapticsOn })),
    resetProgress: () => setState({ ...initialState, hasOnboarded: true }),
  }), [state]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const value = useContext(GameContext);
  if (!value) throw new Error('useGame must be used inside GameProvider');
  return value;
}