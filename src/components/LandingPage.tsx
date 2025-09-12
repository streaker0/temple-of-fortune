import React, { useState } from 'react';
import { Play, Info, User, X } from 'lucide-react';

const LandingPage = () => {
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 via-green-900 to-green-800 flex flex-col">
      {/* Header */}
      <header className="bg-amber-800 px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-yellow-300">Temple of Fortune</h1>
          </div>
          
          <nav className="flex items-center space-x-6">
            <button
            onClick={() => setIsRulesOpen(true)} 
            className="bg-yellow-600 text-amber-900 px-4 py-2 rounded-full font-semibold hover:bg-yellow-500 transition-colors flex items-center space-x-2">
              <span>How to Play</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 flex-1 flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-6xl font-bold mb-4">
                <span className="text-yellow-300">Temple of</span>
                <br />
                <span className="text-white">Fortune</span>
              </h2>
              <p className="text-xl text-gray-200 max-w-lg leading-relaxed">
                Experience the ultimate casino card game where strategy meets fortune. 
                Make critical decisions with face-up and face-down cards in this thrilling 
                game of skill and luck.
              </p>
            </div>

            <div className="flex space-x-4">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 shadow-lg">
                <Play size={20} />
                <span>Play Now</span>
              </button>
            </div>
          </div>

          {/* Right Content - Game Visual */}
          <div className="relative">
            {/* Temple Background Circle */}
            <div className="w-80 h-80 mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full shadow-2xl"></div>
              <div className="absolute inset-2 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full shadow-inner"></div>
              
              {/* Temple Interior */}
              <div className="absolute inset-6 bg-gradient-to-b from-yellow-500 to-red-700 rounded-full overflow-hidden">
                <div className="w-full h-full bg-gradient-to-b from-yellow-400 via-orange-500 to-red-600 opacity-90"></div>
                {/* Pillars effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300 to-transparent opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-yellow-300 to-transparent opacity-30"></div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-4 -left-8 transform rotate-12">
                <div className="w-16 h-24 bg-white rounded-lg shadow-lg flex items-center justify-center border-2 border-gray-300">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">♠</div>
                    <div className="text-xs font-bold text-black">K</div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-8 -right-4 transform -rotate-12">
                <div className="w-16 h-24 bg-white rounded-lg shadow-lg flex items-center justify-center border-2 border-gray-300">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">♥</div>
                    <div className="text-xs font-bold text-red-500">A</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-8 -right-8 transform rotate-45">
                <div className="w-16 h-24 bg-white rounded-lg shadow-lg flex items-center justify-center border-2 border-gray-300">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">♦</div>
                    <div className="text-xs font-bold text-red-500">Q</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>

      {/* Rules Modal */}
      {isRulesOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-amber-800 via-green-900 to-green-800 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border-2 border-yellow-600 shadow-2xl">
            {/* Header */}
            <div className="bg-amber-900/80 p-6 border-b border-yellow-600/50 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-yellow-300">Temple of Fortune Rules</h2>
              <button
                onClick={() => setIsRulesOpen(false)}
                className="text-yellow-200 hover:text-yellow-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="bg-amber-900/30 p-4 rounded-lg border border-yellow-600/30">
                <h3 className="font-bold mb-2 text-yellow-300">Game Objective</h3>
                <p className="text-gray-100">
                  Get closer to 20 than the dealer without going over. Face cards (J,Q,K) = 0, Ace = 1, 
                  and number cards = face value. The game combines strategy in choosing face-up or face-down cards.
                </p>
              </div>

              <div className="bg-amber-900/30 p-4 rounded-lg border border-yellow-600/30">
                <h3 className="font-bold mb-2 text-yellow-300">Game Flow</h3>
                <div className="space-y-2 text-gray-100">
                  <p>1. Place your ante bet</p>
                  <p>2. Receive your ante card and view the dealer&apos;s up card</p>
                  <p>3. Make decisions for up to 4 additional spots:</p>
                  <ul className="list-disc pl-8 text-sm space-y-1 text-gray-200">
                    <li>Face-Up: See your card immediately (1:1 payout)</li>
                    <li>Face-Down: Higher risk but higher reward (2:1 payout)</li>
                    <li>Each spot requires matching your ante bet</li>
                  </ul>
                  <p>4. Stand when ready to end your turn</p>
                </div>
              </div>

              <div className="bg-amber-900/30 p-4 rounded-lg border border-yellow-600/30">
                <h3 className="font-bold mb-2 text-yellow-300">Winning & Payouts</h3>
                <div className="space-y-2 text-gray-100">
                  <p>• Win (Player closer to 20 than dealer):</p>
                  <ul className="list-disc pl-8 text-sm space-y-1 text-gray-200">
                    <li>Face-Up spots pay 1:1</li>
                    <li>Face-Down spots pay 2:1</li>
                  </ul>
                  <p>• Lose (Dealer closer to 20 or player over 20): Lose all bets</p>
                  <p>• Tie (Equal totals): All bets returned</p>
                  <p>• Both Bust (Both over 20): Lose half of all bets</p>
                </div>
              </div>

              <div className="bg-amber-900/30 p-4 rounded-lg border border-yellow-600/30">
                <h3 className="font-bold mb-2 text-yellow-300">Special Rules</h3>
                <div className="space-y-2 text-gray-100">
                  <p>• Dealer must draw till its total is at least 15</p>
                  <p>• Face-down cards are only revealed at the end of the game</p>
                  <p>• The same bet amount must be used for all spots</p>
                  <p>• You can rebet your last bet amount if you have sufficient balance for the ante</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-amber-900/80 p-6 border-t border-yellow-600/50 flex justify-end">
              <button
                onClick={() => setIsRulesOpen(false)}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors shadow-lg"
              >
                Got It!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;