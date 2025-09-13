// /src/components/BettingPage.tsx
import React, { useState } from 'react';

interface GameStartData {
  anteBet: number;
  remainingBalance: number;
}

interface BettingPageProps {
  balance: number;
  previousAnte?: number;
  onBack: () => void;
  onStartGame: (gameData: GameStartData) => void;
}

const BettingPage: React.FC<BettingPageProps> = ({ 
  balance: initialBalance = 5000, 
  previousAnte,
  onBack, 
  onStartGame 
}) => {
  const [balance, setBalance] = useState(initialBalance);
  const [currentBet, setCurrentBet] = useState(0);
  const [selectedChip, setSelectedChip] = useState(5);

  const chipValues = [5, 10, 25, 50, 100, 500, 1000];

  const handleChipSelect = (value: number) => {
    if (balance >= value) {
      setSelectedChip(value);
    }
  };

  const handleBetClick = () => {
    if (balance >= selectedChip && currentBet + selectedChip <= 5000) {
      setBalance(balance - selectedChip);
      setCurrentBet(currentBet + selectedChip);
    }
  };

  const handleClearBet = () => {
    setBalance(balance + currentBet);
    setCurrentBet(0);
  };

  const handleDealCards = () => {
    if (currentBet >= 5) {
      onStartGame({
        anteBet: currentBet,
        remainingBalance: balance
      });
    }
  };

  const canDeal = currentBet >= 5;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-800 via-amber-700 to-amber-900">
      <header className="bg-green-800 px-4 py-2">
        <div className="flex items-center justify-between text-yellow-300">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold">Temple of Fortune</span>
            <span className="text-sm">Balance: ${balance}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
            onClick={onBack}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
              Home
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col items-center px-4 py-6 max-w-5xl mx-auto relative">
        <div className="absolute bottom-20 left-4 bg-amber-900/90 border-2 border-yellow-500 rounded-lg p-4 min-w-48">
          <div className="text-yellow-300 text-lg font-bold mb-2">Current Wager: ${currentBet}</div>
          <div className="h-px bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 mb-2"></div>
          <div className="text-yellow-100 text-md">Balance: ${balance}</div>
        </div>

        <div className="bg-gradient-to-r from-amber-900/90 to-amber-800/90 border-2 border-yellow-500 rounded-lg p-6 mb-8 max-w-2xl w-full">
          <h2 className="text-yellow-300 text-xl font-bold mb-3 text-center">Welcome to Temple of Fortune</h2>
          <p className="text-yellow-100 text-sm mb-4 text-center leading-relaxed">
            Get closer to 20 than the dealer without going over. Choose face-up cards to see your hand 
            immediately (1:1 payout) or face-down cards for higher mystery and bigger rewards (2:1 payout). 
            Your ante card is always face-down for maximum payout potential.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-800/60 border border-green-500 rounded p-3 text-center">
              <div className="text-yellow-300 font-semibold text-sm mb-1">Face-Up Cards</div>
              <div className="text-yellow-100 text-xs">See immediately, pays 1:1</div>
            </div>
            <div className="bg-amber-800/60 border border-amber-500 rounded p-3 text-center">
              <div className="text-yellow-300 font-semibold text-sm mb-1">Face-Down Cards</div>
              <div className="text-yellow-100 text-xs">Mystery cards, pays 2:1</div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h3 className="text-yellow-300 text-xl font-bold mb-4">Dealer</h3>
            
            <div className="flex justify-center space-x-6 mb-4">
              {[1, 2].map((position) => (
                <div key={position} className="flex flex-col items-center">
                  <div className="w-32 h-[196px] bg-red-900/30 border-2 border-dashed border-red-400/50 rounded-lg flex items-center justify-center">
                    <div className="text-red-400/50 text-xs text-center">
                      Dealer<br/>Card
                    </div>
                  </div>
                  <div className="text-red-300 text-xs mt-1">Card {position}</div>
                </div>
              ))}
            </div>
            
            <div className="text-yellow-400">Waiting...</div>
          </div>

          <div className="flex items-end justify-center space-x-8 mb-12">
            <div className="flex flex-col items-center mb-8">
              <div className="w-32 h-[196px] bg-amber-700/30 border-2 border-dashed border-yellow-400/50 rounded-lg mb-3 flex items-center justify-center">
                <div className="text-yellow-400/50 text-xs text-center">
                  Ante<br/>Card
                </div>
              </div>
              <button
                onClick={handleBetClick}
                disabled={balance < selectedChip}
                className={`w-12 h-12 rounded-full font-bold text-xs border-3 transition-all shadow-lg mb-2 flex flex-col items-center justify-center ${
                  balance >= selectedChip
                    ? 'bg-gradient-to-b from-yellow-400 to-yellow-500 border-yellow-300 text-amber-900 hover:scale-105 cursor-pointer'
                    : 'bg-gray-600 border-gray-500 text-gray-300 cursor-not-allowed'
                }`}
              >
                <div className="text-xs font-bold leading-tight">ANTE</div>
                <div className="text-xs font-bold">${currentBet}</div>
              </button>
              <div className="text-yellow-300 text-xs font-semibold">Click to Bet</div>
            </div>
            <div className="flex space-x-6">
              {[1, 2, 3, 4].map((position) => (
                <div key={position} className="flex flex-col items-center">
                  <div className="w-32 h-[196px] bg-amber-700/30 border-2 border-dashed border-yellow-400/50 rounded-lg mb-3 flex items-center justify-center">
                    <div className="text-yellow-400/50 text-xs text-center">
                      Card<br/>Slot
                    </div>
                  </div>
                  <div className="text-yellow-400 text-xs mt-1"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-10">
            <div className="text-yellow-300 font-semibold text-lg">Place your ante bet to begin the game!</div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center space-y-6">
          <div className="flex space-x-4">
            <button
              onClick={handleDealCards}
              disabled={!canDeal}
              className={`px-6 py-2 rounded-lg font-bold shadow-lg ${
                canDeal 
                  ? 'bg-gradient-to-b from-green-500 to-green-600 text-white hover:from-green-400 hover:to-green-500' 
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
            >
              Deal Cards
            </button>
            <button
              onClick={handleClearBet}
              disabled={currentBet === 0}
              className={`px-4 py-2 rounded-lg font-bold shadow-lg ${
                currentBet > 0 
                  ? 'bg-gradient-to-b from-gray-500 to-gray-600 text-white hover:from-gray-400 hover:to-gray-500' 
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed'
              }`}
            >
              Clear Bet
            </button>
            <button className="bg-gradient-to-b from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:from-blue-400 hover:to-blue-500 shadow-lg">
              Rules
            </button>
          </div>

          <div className="flex space-x-3">
            {chipValues.map((value) => {
              const canAfford = balance >= value;
              const isSelected = selectedChip === value;
              
              return (
                <button
                  key={value}
                  onClick={() => handleChipSelect(value)}
                  disabled={!canAfford}
                  className={`w-14 h-14 rounded-full font-bold text-sm border-3 transition-all shadow-lg ${
                    isSelected 
                      ? 'bg-gradient-to-b from-yellow-400 to-yellow-500 border-yellow-300 text-amber-900 scale-110 shadow-xl' 
                      : 'bg-gradient-to-b from-amber-600 to-amber-700 border-amber-500 text-yellow-100'
                  } ${canAfford ? 'hover:scale-105 cursor-pointer' : 'opacity-30 cursor-not-allowed grayscale'}`}
                >
                  ${value}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BettingPage;