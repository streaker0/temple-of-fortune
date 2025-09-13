// /src/components/LandingPage.tsx
import React, { useState } from 'react';
import { Play } from 'lucide-react';
import RulesModal from './RulesModal';

interface LandingPageProps {
  onPlayNow: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onPlayNow }) => {
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 via-green-900 to-green-800 flex flex-col">
      <header className="bg-amber-800 px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-yellow-300">Temple of Fortune</h1>
          </div>        
          <nav className="flex items-center space-x-6">
            <button
              onClick={() => setIsRulesOpen(true)} 
              className="bg-yellow-600 text-amber-900 px-4 py-2 rounded-full font-semibold hover:bg-yellow-500 transition-colors flex items-center space-x-2"
            >
              <span>How to Play</span>
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 flex-1 flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
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
              <button 
                onClick={onPlayNow}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 shadow-lg"
              >
                <Play size={20} />
                <span>Play Now</span>
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="w-80 h-80 mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full shadow-2xl"></div>
              <div className="absolute inset-2 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full shadow-inner"></div>
              <div className="absolute inset-6 bg-gradient-to-b from-yellow-500 to-red-700 rounded-full overflow-hidden">
                <div className="w-full h-full bg-gradient-to-b from-yellow-400 via-orange-500 to-red-600 opacity-90"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300 to-transparent opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-yellow-300 to-transparent opacity-30"></div>
              </div>
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
      <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
      <RulesModal 
        isOpen={isRulesOpen} 
        onClose={() => setIsRulesOpen(false)} 
      />
    </div>
  );
};

export default LandingPage;