// /src/components/GameplayPage.tsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  GameState,
  createInitialGameState,
  dealInitialCards,
  makePlayerDecision,
  playerStand,
  completeDealerTurn,
  revealAndCalculate,
  getCardImage,
  calculateCurrentTotals,
  isPlayerBusted,
  areAllDecisionsMade
} from '../data/cardData';
import { log } from 'console';

interface GameplayPageProps {
  anteBet: number;
  balance: number;
  onBack: () => void;
  onGameComplete: (newBalance: number) => void;
}

const GameplayPage: React.FC<GameplayPageProps> = ({
  anteBet,
  balance,
  onBack,
  onGameComplete
}) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const initial = createInitialGameState(balance);
    return { ...initial, anteBet };
  });

  // Initialize game when component mounts
  useEffect(() => {
    const dealCards = () => {
      const initialState = createInitialGameState(balance);
      const stateWithBet = { ...initialState, anteBet };
      const dealtState = dealInitialCards(stateWithBet);
      setGameState(dealtState);
    };
    
    dealCards();
  }, [anteBet, balance]);

  const handlePlayerDecision = (choice: 'face-up' | 'face-down') => {
    try {
      const newState = makePlayerDecision(gameState, choice);
      setGameState(newState);
      
      if (newState.gamePhase === 'dealer-turn') {
        setTimeout(() => {
          handleDealerTurn(newState);
        }, 1000);
      }
    } catch (error) {
      console.error('Error making player decision:', error);
    }
  };

  const handleStand = () => {
    const newState = playerStand(gameState);
    setGameState(newState);
    setTimeout(() => {
      handleDealerTurn(newState);
    }, 1000);
  };

  const handleDealerTurn = (gameState: GameState) => {
    try {
      const dealerCompleteState = completeDealerTurn(gameState);
      setGameState(dealerCompleteState);
      
      setTimeout(() => {
        const finalState = revealAndCalculate(dealerCompleteState);
        setGameState(finalState);
        
        // Update balance and complete game
        const newBalance = balance + finalState.totalPayout;
        setTimeout(() => {
          onGameComplete(newBalance);
        }, 3000);
      }, 2000);
    } catch (error) {
      console.error('Error in dealer turn:', error);
    }
  };

  const renderCard = (cardData: any, label: string) => {
    if (!cardData) {
      return (
        <div className="flex flex-col items-center">
          <div className="w-16 h-22 bg-gray-700/30 border-2 border-dashed border-gray-400/50 rounded-lg flex items-center justify-center">
            <div className="text-gray-400/50 text-xs text-center">Empty</div>
          </div>
          <div className="text-gray-400 text-xs mt-1">{label}</div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center">
        <div className="w-32 h-[196px] rounded-lg overflow-hidden shadow-lg">
          <img 
            src={getCardImage(cardData)}
            alt={cardData.card ? `${cardData.card.rank} of ${cardData.card.suit}` : 'Face down card'}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-yellow-300 text-xs mt-1">{label}</div>
      </div>
    );
  };

  const getPhaseMessage = () => {
    switch (gameState.gamePhase) {
      case 'initial-deal':
        return 'Dealing initial cards...';
      case 'player-decisions':
        return `Choose for position ${gameState.currentDecision + 1}`;
      case 'dealer-turn':
        return 'Dealer completing hand...';
      case 'reveal':
        return 'Revealing face-down cards...';
      case 'payout':
        return getResultMessage();
      default:
        return 'Game in progress...';
    }
  };

  const getResultMessage = () => {
    switch (gameState.gameResult) {
      case 'win':
        return `You Win! +$${gameState.totalPayout}`;
      case 'lose':
        return `You Lose! -$${Math.abs(gameState.totalPayout)}`;
      case 'tie':
        return 'Tie! Bets returned.';
      case 'both-bust':
        return `Both Bust! -$${Math.abs(gameState.totalPayout)}`;
      default:
        return '';
    }
  };

  const showDecisionButtons = gameState.gamePhase === 'player-decisions' && 
                              gameState.currentDecision < 4 && 
                              !isPlayerBusted(gameState);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-800 via-amber-700 to-amber-900">
      {/* Header */}
      <header className="bg-green-800 px-4 py-2">
        <div className="flex items-center justify-between text-yellow-300">
          <div className="flex items-center space-x-2">
            <button 
              onClick={onBack}
              className="flex items-center space-x-1 text-yellow-300 hover:text-yellow-100"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
            <span className="text-lg font-bold">Temple of Fortune</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Balance: ${balance}</span>
            <span className="text-sm">Ante: ${anteBet}</span>
          </div>
        </div>
      </header>

      <div className="flex flex-col items-center px-4 py-6 max-w-5xl mx-auto relative">
        {/* Current Wager and Balance - Bottom Left */}
        <div className="absolute bottom-20 left-4 bg-amber-900/90 border-2 border-yellow-500 rounded-lg p-4 min-w-48 z-10">
          <div className="text-yellow-300 text-lg font-bold mb-2">Current Wager: ${gameState.currentWager}</div>
          <div className="h-px bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 mb-2"></div>
          <div className="text-yellow-100 text-md">Balance: ${gameState.balance}</div>
        </div>

        {/* Game Status */}
        <div className="mb-8 text-center">
          <div className="text-yellow-300 text-xl font-bold mb-2">{getPhaseMessage()}</div>
          <div className="flex justify-center space-x-8 text-lg">
            <div className="text-blue-300">
              Player Total: {gameState.gamePhase === 'payout' ? gameState.finalPlayerTotal : gameState.playerTotal}
            </div>
            <div className="text-red-300">
              Dealer Total: {gameState.gamePhase === 'payout' ? gameState.finalDealerTotal : gameState.dealerTotal}
            </div>
          </div>
        </div>

        {/* Dealer Section */}
        <div className="mb-12">
          <h3 className="text-yellow-300 text-xl font-bold mb-4 text-center">Dealer</h3>
          <div className="flex justify-center space-x-6">
            {gameState.dealerCards.map((card, index) => 
              renderCard(card, `Card ${index + 1}`)
            )}
          </div>
        </div>

        {/* Player Cards Section */}
        <div className="mb-12">
          <h3 className="text-yellow-300 text-xl font-bold mb-4 text-center">Your Cards</h3>
          
          {/* Horizontal layout: Ante on left, then player decision cards */}
          <div className="flex items-end justify-center space-x-8">
            {/* Ante Card - Elevated on the left */}
            <div className="mb-6">
              {renderCard(gameState.anteCard, 'Ante Card (2:1)')}
            </div>

            {/* Player Decision Cards */}
            <div className="flex space-x-6">
              {[0, 1, 2, 3].map((index) => {
                const card = gameState.playerCards[index];
                const isCurrentDecision = gameState.currentDecision === index && showDecisionButtons;
                
                return (
                  <div key={index} className={`flex flex-col items-center ${isCurrentDecision ? 'ring-2 ring-yellow-400 rounded-lg p-2' : ''}`}>
                    {card ? 
                      renderCard(card, `Position ${index + 1} (${card.isFaceUp ? '1:1' : '2:1'})`) :
                      <div className="flex flex-col items-center">
                        <div className="w-32 h-[196px] bg-amber-700/30 border-2 border-dashed border-yellow-400/50 rounded-lg flex items-center justify-center">
                          <div className="text-yellow-400/50 text-xs text-center">
                            {isCurrentDecision ? 'Choose!' : 'Waiting'}
                          </div>
                        </div>
                        <div className="text-yellow-400 text-xs mt-1">Position {index + 1}</div>
                      </div>
                    }
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        {showDecisionButtons && (
          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => handlePlayerDecision('face-up')}
              className="bg-gradient-to-b from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-bold hover:from-green-400 hover:to-green-500 shadow-lg"
            >
              Face Up (1:1)
            </button>
            <button
              onClick={() => handlePlayerDecision('face-down')}
              className="bg-gradient-to-b from-amber-600 to-amber-700 text-white px-6 py-3 rounded-lg font-bold hover:from-amber-500 hover:to-amber-600 shadow-lg"
            >
              Face Down (2:1)
            </button>
            <button
              onClick={handleStand}
              className="bg-gradient-to-b from-gray-600 to-gray-700 text-white px-6 py-3 rounded-lg font-bold hover:from-gray-500 hover:to-gray-600 shadow-lg"
            >
              Stand
            </button>
          </div>
        )}

        {/* Game Rules Reminder */}
        <div className="bg-amber-900/30 p-4 rounded-lg border border-yellow-600/30 max-w-2xl">
          <div className="text-yellow-300 text-sm text-center">
            <div className="font-semibold mb-2">Quick Rules:</div>
            <div className="text-yellow-100 text-xs space-y-1">
              <div>• Get closer to 20 than dealer without going over</div>
              <div>• Face cards (J,Q,K) = 0 points, Ace = 1, Numbers = face value</div>
              <div>• Face-up cards pay 1:1, Face-down cards pay 2:1</div>
              <div>• Ante card is always face-down (2:1 payout)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameplayPage;