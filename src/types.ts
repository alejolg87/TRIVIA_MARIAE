export interface Question {
  q: string;
  options: string[];
  a: number;
}

export interface Player {
  name: string;
  score: number;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export type GameState = 'start' | 'categories' | 'loading' | 'game' | 'end' | 'ranking';

export interface AppState {
  currentScreen: GameState;
  difficulty: Difficulty;
  category: string;
  questions: Question[];
  currentQIndex: number;
  score: number;
  lives: number;
  combo: number;
  maxCombo: number;
  timeLeft: number;
  maxTime: number;
}
