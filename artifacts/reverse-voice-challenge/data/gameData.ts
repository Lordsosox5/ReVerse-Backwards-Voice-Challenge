export type Level = {
  id: number;
  title: string;
  phrase: string;
  difficulty: string;
  color: string;
  icon: 'mic' | 'star' | 'zap' | 'award';
};

export const LEVELS: Level[] = [
  { id: 1, title: 'Warm up', phrase: 'Penguin', difficulty: 'Easy', color: '#FFD95A', icon: 'mic' },
  { id: 2, title: 'Space talk', phrase: 'Astronaut', difficulty: 'Easy', color: '#A8D7EE', icon: 'star' },
  { id: 3, title: 'Juicy words', phrase: 'Watermelon', difficulty: 'Medium', color: '#9ED8B7', icon: 'zap' },
  { id: 4, title: 'Tropical twist', phrase: 'Pineapple', difficulty: 'Medium', color: '#FFB86B', icon: 'award' },
  { id: 5, title: 'Tongue twister', phrase: 'She sells seashells', difficulty: 'Hard', color: '#C8B8FF', icon: 'mic' },
  { id: 6, title: 'Bear necessity', phrase: 'Fuzzy Wuzzy was a bear', difficulty: 'Hard', color: '#FFB2A8', icon: 'star' },
  { id: 7, title: 'Ice cream', phrase: 'I scream for ice cream', difficulty: 'Hard', color: '#A8D7EE', icon: 'zap' },
  { id: 8, title: 'Woodchuck', phrase: 'How much wood would a woodchuck chuck', difficulty: 'Expert', color: '#FFD95A', icon: 'award' },
];

export const TUTORIAL_PHRASE = 'Apple';

export const reversePrompt = (phrase: string) =>
  phrase
    .trim()
    .split(/\s+/)
    .map((word) => [...word].reverse().join(''))
    .join(' ');