// /src/types/Card.ts
export interface Card {
  id: string;
  rank: string;
  suit: string;
  value: number;
  imagePath: string;
}

export interface GameCard {
  id: string;
  isFaceUp: boolean;
  card: Card | null;
  wasFaceDown: boolean;
  betAmount: number;
}