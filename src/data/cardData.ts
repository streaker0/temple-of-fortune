// /src/data/cardData.ts
import { log } from 'console';
import { Card, GameCard } from '../types/Card';

export const SUITS = ['club', 'diamond', 'heart', 'spade'] as const;
export const RANKS = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'] as const;

const CARD_VALUES: Record<string, number> = {
  'ace': 1,
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
  'jack': 0,
  'queen': 0,
  'king': 0 
};

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  
  SUITS.forEach(suit => {
    RANKS.forEach(rank => {
      const card: Card = {
        id: `${rank}-${suit}`,
        rank,
        suit,
        value: CARD_VALUES[rank],
        imagePath: `/assets/cards/${rank}-${suit}.JPG`
      };
      deck.push(card);
    });
  });
  
  return deck;
};

export const createFaceDownCard = (id: string, betAmount: number): GameCard => {
  return {
    id,
    isFaceUp: false,
    card: null,
    wasFaceDown:true,
    betAmount
  };
};

export const createFaceUpCard = (id: string, card: Card, betAmount: number): GameCard => {
  return {
    id,
    isFaceUp: true,
    card,
    wasFaceDown:false,
    betAmount
  };
};

export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const getCardImage = (gameCard: GameCard): string => {
  if (gameCard.isFaceUp && gameCard.card) {
    return gameCard.card.imagePath;
  }
  return '/assets/cards/face-down.JPG';
};

export const getCardValue = (gameCard: GameCard): number => {
  if (gameCard.isFaceUp && gameCard.card) {
    return gameCard.card.value;
  }
  return 0;
};

export const flipCardUp = (gameCard: GameCard, deck: Card[]): { 
  flippedCard: GameCard; 
  remainingDeck: Card[] 
} => {
  if (gameCard.isFaceUp) {
    throw new Error('Card is already face-up');
  }
  
  if (deck.length === 0) {
    throw new Error('Cannot flip card - deck is empty');
  }
  
  const drawnCard = deck[0];
  const remainingDeck = deck.slice(1);
  
  const flippedCard: GameCard = {
    ...gameCard,
    isFaceUp: true,
    card: drawnCard
  };
  
  return { flippedCard, remainingDeck };
};

export type GamePhase = 
  | 'betting'           
  | 'initial-deal'      
  | 'player-decisions' 
  | 'dealer-turn' 
  | 'reveal'
  | 'payout'
  | 'finished';


export interface GameState {
  deck: Card[];                   
  dealerCards: GameCard[];
  playerCards: GameCard[]; 
  anteCard: GameCard | null;
  
  anteBet: number;
  currentWager: number;
  balance: number; 
  
  gamePhase: GamePhase; 
  currentDecision: number; 
  dealerTotal: number; 
  playerTotal: number;

  finalPlayerTotal: number;
  finalDealerTotal: number;
  gameResult: 'win' | 'lose' | 'tie' | 'both-bust' | null;
  totalPayout: number;
}

export const createInitialGameState = (balance: number): GameState => {
  return {
    deck: shuffleDeck(createDeck()),
    dealerCards: [],
    playerCards: [],
    anteCard: null,
    anteBet: 0,
    currentWager:0,
    balance,
    gamePhase: 'betting',
    currentDecision: 0,
    dealerTotal: 0,
    playerTotal: 0,
    finalPlayerTotal: 0,
    finalDealerTotal: 0,
    gameResult: null,
    totalPayout: 0
  };
};

export const dealInitialCards = (gameState: GameState): GameState => {
  let { deck } = gameState;
  gameState.currentWager = gameState.anteBet;
  
  const anteCard = createFaceDownCard('ante', gameState.anteBet);
  const { card: dealerUpCard, remainingDeck: deck1 } = drawCard(deck);
  const dealerCard1 = createFaceUpCard('dealer-1', dealerUpCard, 0);
  
  const dealerCard2 = createFaceDownCard('dealer-2', 0);
  
  return {
    ...gameState,
    deck: deck1,
    anteCard,
    dealerCards: [dealerCard1, dealerCard2],
    dealerTotal: dealerUpCard.value,
    gamePhase: 'player-decisions'
  };
};

export const drawCard = (deck: Card[]): { card: Card; remainingDeck: Card[] } => {
  if (deck.length === 0) {
    throw new Error('Cannot draw from empty deck');
  }
  
  const card = deck[0];
  const remainingDeck = deck.slice(1);
  
  return { card, remainingDeck };
};

export const makePlayerDecision = (
  gameState: GameState, 
  choice: 'face-up' | 'face-down'
): GameState => {
  if (gameState.gamePhase !== 'player-decisions') {
    throw new Error('Not in player decision phase');
  }
  
  if (gameState.currentDecision >= 4) {
    throw new Error('All decisions have been made');
  }
  console.log("Game state : ", choice, gameState);
  
  
  const position = gameState.currentDecision;
  const cardId = `player-${position + 1}`;
  
  let newCard: GameCard;
  let newDeck = gameState.deck;
  let newPlayerTotal = gameState.playerTotal;
  gameState.balance -= gameState.anteBet;
  gameState.currentWager += gameState.anteBet;
  
  if (choice === 'face-up') {
    const { card, remainingDeck } = drawCard(gameState.deck);
    newCard = createFaceUpCard(cardId, card, gameState.anteBet);
    newDeck = remainingDeck;
    newPlayerTotal += card.value;
  } else {
    newCard = createFaceDownCard(cardId, gameState.anteBet);
  }
  
  const newPlayerCards = [...gameState.playerCards];
  newPlayerCards[position] = newCard;

  console.log("Game state after card is drawn :", gameState);
  
  
  return {
    ...gameState,
    deck: newDeck,
    playerCards: newPlayerCards,
    currentDecision: gameState.currentDecision + 1,
    playerTotal: newPlayerTotal,
    gamePhase: gameState.currentDecision === 3 ? 'dealer-turn' : 'player-decisions'
  };
};

export const playerStand = (gameState: GameState): GameState => {
  return {
    ...gameState,
    gamePhase: 'dealer-turn'
  };
};

export const completeDealerTurn = (gameState: GameState): GameState => {
  if (gameState.gamePhase !== 'dealer-turn') {
    throw new Error('Not in dealer turn phase');
  }
  
  let { deck, dealerCards, dealerTotal } = gameState;
  
  if (dealerCards[1] && !dealerCards[1].isFaceUp) {
    const { flippedCard, remainingDeck } = flipCardUp(dealerCards[1], deck);
    dealerCards = [dealerCards[0], flippedCard];
    deck = remainingDeck;
    dealerTotal += flippedCard.card!.value;
  }
  
  while (dealerTotal < 15) {
    const { card, remainingDeck } = drawCard(deck);
    const newDealerCard = createFaceUpCard(`dealer-${dealerCards.length + 1}`, card, 0);
    dealerCards = [...dealerCards, newDealerCard];
    deck = remainingDeck;
    dealerTotal += card.value;
  }
  
  return {
    ...gameState,
    deck,
    dealerCards,
    dealerTotal,
    gamePhase: 'reveal'
  };
};

export const revealAndCalculate = (gameState: GameState): GameState => {
  if (gameState.gamePhase !== 'reveal') {
    throw new Error('Not in reveal phase');
  }
  
  let { deck, anteCard, playerCards } = gameState;
  let finalPlayerTotal = gameState.playerTotal;
  
  if (anteCard && !anteCard.isFaceUp) {
    const { flippedCard, remainingDeck } = flipCardUp(anteCard, deck);
    anteCard = flippedCard;
    deck = remainingDeck;
    finalPlayerTotal += flippedCard.card!.value;
  }
  
  for (let i = 0; i < playerCards.length; i++) {
    const playerCard = playerCards[i];
    if (playerCard && !playerCard.isFaceUp) {
      const { flippedCard, remainingDeck } = flipCardUp(playerCard, deck);
      playerCards[i] = flippedCard;
      deck = remainingDeck;
      finalPlayerTotal += flippedCard.card!.value;
    }
  }
  
  const finalDealerTotal = gameState.dealerTotal;
  const playerBust = finalPlayerTotal > 20;
  const dealerBust = finalDealerTotal > 20;
  
  let gameResult: 'win' | 'lose' | 'tie' | 'both-bust';
  let totalPayout = 0;
  
  if (playerBust && dealerBust) {
    gameResult = 'both-bust';
    totalPayout = gameState.currentWager / 2;
  } else if (playerBust) {
    gameResult = 'lose';
    totalPayout = 0;
  } else if (dealerBust || finalPlayerTotal > finalDealerTotal) {
    gameResult = 'win';
    totalPayout = calculateWinnings(gameState, anteCard, playerCards);
  } else if (finalPlayerTotal === finalDealerTotal) {
    gameResult = 'tie';
    totalPayout = gameState.currentWager;
  } else {
    gameResult = 'lose';
    totalPayout = 0;
  }
  
  return {
    ...gameState,
    deck,
    anteCard,
    playerCards,
    finalPlayerTotal,
    finalDealerTotal,
    gameResult,
    totalPayout,
    gamePhase: 'payout'
  };
};

export const calculateTotalBets = (gameState: GameState): number => {
  let total = gameState.anteBet;
  
  gameState.playerCards.forEach(card => {
    if (card) {
      total += card.betAmount;
    }
  });
  
  return total;
};

export const calculateWinnings = (
  gameState: GameState, 
  anteCard: GameCard | null, 
  playerCards: GameCard[]
): number => {
  let totalWinnings = 0;
  
  if (anteCard) {
    totalWinnings += anteCard.betAmount * 2;
  }
  
  playerCards.forEach(card => {
    if (card) {
      if (!card.wasFaceDown) {
        totalWinnings += card.betAmount * 1;
      } else {
        totalWinnings += card.betAmount * 2;
      }
    }
  });
  
  return totalWinnings;
};

export const calculateCurrentTotals = (gameState: GameState): {
  playerTotal: number;
  dealerTotal: number;
} => {
  const playerTotal = gameState.playerCards.reduce((total, card) => {
    return total + getCardValue(card);
  }, 0);
  
  const dealerTotal = gameState.dealerCards.reduce((total, card) => {
    return total + getCardValue(card);
  }, 0);
  
  return { playerTotal, dealerTotal };
};

export const isPlayerBusted = (gameState: GameState): boolean => {
  return gameState.playerTotal > 20;
};

export const areAllDecisionsMade = (gameState: GameState): boolean => {
  return gameState.currentDecision >= 4;
};

export const getPayoutMultiplier = (gameCard: GameCard): number => {
  return gameCard.isFaceUp ? 1 : 2;
};