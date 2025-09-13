// /src/components/GameResult.tsx
import React from 'react';

interface GameResultProps {
  gameResult: 'win' | 'lose' | 'tie' | 'both-bust';
  totalPayout: number;
  newBalance: number;
  wager: number;
  onNewGame: () => void;
}

const GameResult: React.FC<GameResultProps> = ({
  gameResult,
  totalPayout,
  newBalance,
  wager,
  onNewGame
}) => {
  const getResultTitle = () => {
    switch (gameResult) {
      case 'win':
        return "Congratulations! You've beaten the dealer!";
      case 'lose':
        return "Better luck next time!";
      case 'tie':
        return "It's a tie!";
      case 'both-bust':
        return "Both bust! House wins half.";
      default:
        return "Game Over";
    }
  };

  const getResultColor = () => {
    switch (gameResult) {
      case 'win':
        return 'text-green-400';
      case 'lose':
      case 'both-bust':
        return 'text-red-400';
      case 'tie':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getPayoutText = () => {
    switch (gameResult) {
      case 'tie':
        return `$${wager} Returned`;
      case 'both-bust':
        return `$${Math.floor(wager / 2)} Returned`;
      case 'win':
        return `$${totalPayout} Won`;
      case 'lose':
        return '';
      default:
        return '';
    }
  };

  const shouldShowPayout = () => {
    return gameResult !== 'lose';
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-amber-800 to-amber-900 border-4 border-yellow-500 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className={`text-2xl font-bold text-center mb-6 ${getResultColor()}`}>
          {getResultTitle()}
        </div>
        {shouldShowPayout() && (
          <div className="bg-amber-700/50 border-2 border-yellow-400 rounded-lg p-6 mb-6 text-center">
            <div className={`text-4xl font-bold ${getResultColor()}`}>
              {getPayoutText()}
            </div>
          </div>
        )}
        <div className="text-center mb-6">
          <div className="text-yellow-300 text-lg">
            New Balance: <span className="font-bold text-yellow-100">${newBalance + totalPayout}</span>
          </div>
        </div>
        <div className="text-center">
          <button
            onClick={onNewGame}
            className="bg-gradient-to-b from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameResult;