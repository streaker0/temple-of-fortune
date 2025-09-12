// /src/pages/index.tsx
import { Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";
import LandingPage from "../components/LandingPage";
import BettingPage from "../components/BettingPage";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'betting', 'gameplay', 'results'
  const [gameState, setGameState] = useState({
    balance: 5000,
    currentBet: 0,
    // Add other game state as needed
  });

  const handlePlayNow = () => {
    setCurrentPage('betting');
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
  };

 

  const renderCurrentPage = () => {
    switch(currentPage) {
      case 'landing':
        return <LandingPage onPlayNow={handlePlayNow} />;
      case 'betting':
        return (
          <BettingPage 
            balance={gameState.balance}
            onBack={handleBackToLanding}
            onStartGame={()=>{}}
          />
        );

      default:
        return <LandingPage onPlayNow={handlePlayNow} />;
    }
  };

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
      {renderCurrentPage()}
    </div>
  );
}