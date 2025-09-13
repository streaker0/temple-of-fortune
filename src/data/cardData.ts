// /src/data/cardData.ts
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
    wasFaceDown: true,
    betAmount
  };
};

export const createFaceUpCard = (id: string, card: Card, betAmount: number): GameCard => {
  return {
    id,
    isFaceUp: true,
    card,
    wasFaceDown: false,
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

export const drawCard = (deck: Card[]): { card: Card; remainingDeck: Card[] } => {
  if (deck.length === 0) {
    throw new Error('Cannot draw from empty deck');
  }
  
  const card = deck[0];
  const remainingDeck = deck.slice(1);
  
  return { card, remainingDeck };
};

export type GamePhase = 
  | 'betting'           
  | 'initial-dealing'   
  | 'player-decisions' 
  | 'dealer-turn'
  | 'dealer-revealing'
  | 'dealer-drawing'
  | 'player-revealing'
  | 'payout'
  | 'finished';

export interface DealingState {
  currentCardIndex: number;  
  isDealing: boolean;        
}

export interface RevealingState {
  currentRevealIndex: number;
  isRevealing: boolean;
  revealType: 'dealer' | 'player' | null; 
}

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
  
  dealingState: DealingState;
  revealingState: RevealingState;
}

export const createInitialGameState = (balance: number): GameState => {
  return {
    deck: shuffleDeck(createDeck()),
    dealerCards: [],
    playerCards: [],
    anteCard: null,
    anteBet: 0,
    currentWager: 0,
    balance,
    gamePhase: 'betting',
    currentDecision: 0,
    dealerTotal: 0,
    playerTotal: 0,
    finalPlayerTotal: 0,
    finalDealerTotal: 0,
    gameResult: null,
    totalPayout: 0,
    dealingState: {
      currentCardIndex: 0,
      isDealing: false
    },
    revealingState: {
      currentRevealIndex: 0,
      isRevealing: false,
      revealType: null
    }
  };
};

export const startInitialDealing = (gameState: GameState): GameState => {
  return {
    ...gameState,
    gamePhase: 'initial-dealing',
    currentWager: gameState.anteBet,
    dealingState: {
      currentCardIndex: 0,
      isDealing: true
    }
  };
};

export const dealNextInitialCard = (gameState: GameState): GameState => {
  if (gameState.gamePhase !== 'initial-dealing') {
    throw new Error('Not in initial dealing phase');
  }

  const { currentCardIndex } = gameState.dealingState;
  let { deck, dealerCards, anteCard, dealerTotal } = gameState;
  
  if (currentCardIndex === 0) {
    anteCard = createFaceDownCard('ante', gameState.anteBet);
    
  } else if (currentCardIndex === 1) {
    const { card, remainingDeck } = drawCard(deck);
    deck = remainingDeck;
    const dealerCard = createFaceUpCard('dealer-1', card, 0);
    dealerCards = [...dealerCards, dealerCard];
    dealerTotal += card.value;
    
  } else if (currentCardIndex === 2) {
    const dealerCard = createFaceDownCard('dealer-2', 0);
    dealerCards = [...dealerCards, dealerCard];
  }
  
  const nextIndex = currentCardIndex + 1;
  const isLastInitialCard = nextIndex >= 3;
  
  return {
    ...gameState,
    deck,
    dealerCards,
    anteCard,
    dealerTotal,
    dealingState: {
      currentCardIndex: nextIndex,
      isDealing: !isLastInitialCard
    },
    gamePhase: isLastInitialCard ? 'player-decisions' : 'initial-dealing'
  };
};

export const isCurrentlyDealingCard = (gameState: GameState, cardType: 'ante' | 'dealer1' | 'dealer2'): boolean => {
  if (gameState.gamePhase !== 'initial-dealing') return false;
  
  const index = gameState.dealingState.currentCardIndex;
  switch (cardType) {
    case 'ante': return index === 0;
    case 'dealer1': return index === 1;
    case 'dealer2': return index === 2;
    default: return false;
  }
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
  
  const position = gameState.currentDecision;
  const cardId = `player-${position + 1}`;
  
  let newCard: GameCard;
  let newDeck = gameState.deck;
  let newPlayerTotal = gameState.playerTotal;
  let newBalance = gameState.balance - gameState.anteBet;
  let newWager = gameState.currentWager + gameState.anteBet;
  
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
  
  return {
    ...gameState,
    deck: newDeck,
    playerCards: newPlayerCards,
    currentDecision: gameState.currentDecision + 1,
    playerTotal: newPlayerTotal,
    balance: newBalance,
    currentWager: newWager,
    gamePhase: gameState.currentDecision === 3 ? 'dealer-revealing' : 'player-decisions'
  };
};

export const playerStand = (gameState: GameState): GameState => {
  return {
    ...gameState,
    gamePhase: 'dealer-revealing'
  };
};

export const startDealerReveal = (gameState: GameState): GameState => {
  if (gameState.gamePhase !== 'dealer-revealing') {
    throw new Error('Not in dealer revealing phase');
  }
  
  return {
    ...gameState,
    revealingState: {
      currentRevealIndex: 0,
      isRevealing: true,
      revealType: 'dealer'
    }
  };
};

export const revealDealerCard = (gameState: GameState): GameState => {
  if (gameState.gamePhase !== 'dealer-revealing') {
    throw new Error('Not in dealer revealing phase');
  }
  
  let { deck, dealerCards, dealerTotal } = gameState;
  
  if (dealerCards[1] && !dealerCards[1].isFaceUp) {
    const { flippedCard, remainingDeck } = flipCardUp(dealerCards[1], deck);
    dealerCards = [dealerCards[0], flippedCard];
    deck = remainingDeck;
    dealerTotal += flippedCard.card!.value;
  }
  
  return {
    ...gameState,
    deck,
    dealerCards,
    dealerTotal,
    gamePhase: 'dealer-drawing',
    revealingState: {
      ...gameState.revealingState,
      isRevealing: false
    }
  };
};

export const shouldDealerDraw = (gameState: GameState): boolean => {
  if (gameState.dealerCards.length >= 10) {
    console.warn('Dealer has too many cards, stopping draw to prevent infinite loop');
    return false;
  }
  
  return gameState.dealerTotal < 15;
};

export const dealerDrawCard = (gameState: GameState): GameState => {
  if (gameState.gamePhase !== 'dealer-drawing') {
    throw new Error('Not in dealer drawing phase');
  }
    if (gameState.dealerCards.length >= 10) {
    throw new Error('Dealer has too many cards');
  }
  
  let { deck, dealerCards, dealerTotal } = gameState;
  
  const { card, remainingDeck } = drawCard(deck);
  const newDealerCard = createFaceUpCard(`dealer-${dealerCards.length + 1}`, card, 0);
  dealerCards = [...dealerCards, newDealerCard];
  deck = remainingDeck;
  dealerTotal += card.value;
    
  return {
    ...gameState,
    deck,
    dealerCards,
    dealerTotal
  };
};

export const completeDealerDrawing = (gameState: GameState): GameState => {
  return {
    ...gameState,
    finalPlayerTotal: gameState.playerTotal,
    gamePhase: 'player-revealing',
    revealingState: {
      currentRevealIndex: 0,
      isRevealing: true,
      revealType: 'player'
    }
  };
};

export const getNextPlayerCardToReveal = (gameState: GameState): { cardIndex: number; cardType: 'ante' | 'player' } | null => {
  
  if (gameState.anteCard && !gameState.anteCard.isFaceUp) {
    console.log('Next to reveal: ante');
    return { cardIndex: -1, cardType: 'ante' };
  }
  
  for (let i = 0; i < gameState.playerCards.length; i++) {
    const card = gameState.playerCards[i];
    if (card && !card.isFaceUp) {
      console.log(`Next to reveal: player-${i + 1}`);
      return { cardIndex: i, cardType: 'player' };
    }
  }
  
  console.log('No more cards to reveal');
  return null;
};

export const revealNextPlayerCard = (gameState: GameState): GameState => {
  if (gameState.gamePhase !== 'player-revealing') {
    throw new Error('Not in player revealing phase');
  }
  
  const nextCard = getNextPlayerCardToReveal(gameState);
  if (!nextCard) {
    throw new Error('No more cards to reveal');
  }
  
  let { deck, anteCard, playerCards } = gameState;
  let finalPlayerTotal = gameState.finalPlayerTotal;
  
  if (nextCard.cardType === 'ante' && anteCard && !anteCard.isFaceUp) {
    const { flippedCard, remainingDeck } = flipCardUp(anteCard, deck);
    anteCard = flippedCard;
    deck = remainingDeck;
    finalPlayerTotal += flippedCard.card!.value;
    console.log(`Revealed ante card: ${flippedCard.card!.rank} of ${flippedCard.card!.suit} (value: ${flippedCard.card!.value})`);
  } else if (nextCard.cardType === 'player') {
    const playerCard = playerCards[nextCard.cardIndex];
    if (playerCard && !playerCard.isFaceUp) {
      const { flippedCard, remainingDeck } = flipCardUp(playerCard, deck);
      playerCards[nextCard.cardIndex] = flippedCard;
      deck = remainingDeck;
      finalPlayerTotal += flippedCard.card!.value;
      console.log(`Revealed player card ${nextCard.cardIndex + 1}: ${flippedCard.card!.rank} of ${flippedCard.card!.suit} (value: ${flippedCard.card!.value})`);
    }
  }
  
  const newRevealIndex = gameState.revealingState.currentRevealIndex + 1;
  
  const updatedGameState = {
    ...gameState,
    deck,
    anteCard,
    playerCards,
    finalPlayerTotal,
    revealingState: { ...gameState.revealingState, currentRevealIndex: newRevealIndex }
  };
  
  const hasMoreToReveal = getNextPlayerCardToReveal(updatedGameState) !== null;
  
  return {
    ...updatedGameState,
    revealingState: {
      ...updatedGameState.revealingState,
      isRevealing: hasMoreToReveal
    },
    gamePhase: hasMoreToReveal ? 'player-revealing' : 'payout'
  };
};

// NEW: Calculate final results after all reveals
export const calculateFinalResults = (gameState: GameState): GameState => {
  const finalDealerTotal = gameState.dealerTotal;
  const finalPlayerTotal = gameState.finalPlayerTotal;
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
    totalPayout = calculateWinnings(gameState, gameState.anteCard, gameState.playerCards);
  } else if (finalPlayerTotal === finalDealerTotal) {
    gameResult = 'tie';
    totalPayout = gameState.currentWager;
  } else {
    gameResult = 'lose';
    totalPayout = 0;
  }
  
  return {
    ...gameState,
    finalDealerTotal,
    gameResult,
    totalPayout,
    gamePhase: 'payout'
  };
};

export const calculateWinnings = (
  gameState: GameState, 
  anteCard: GameCard | null, 
  playerCards: GameCard[]
): number => {
  let totalWinnings = 0;
  
  if (anteCard) {
    totalWinnings += anteCard.betAmount * 3;
  }
  
  playerCards.forEach(card => {
    if (card) {
      if (!card.wasFaceDown) {
        totalWinnings += card.betAmount * 2;
      } else {
        totalWinnings += card.betAmount * 3;
      }
    }
  });
  
  return totalWinnings;
};

export const isPlayerBusted = (gameState: GameState): boolean => {
  return gameState.playerTotal > 20;
};

