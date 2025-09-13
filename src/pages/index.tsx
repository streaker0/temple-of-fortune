// /src/pages/index.tsx
import { Amarante, Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";
import LandingPage from "../components/LandingPage";
import BettingPage from "../components/BettingPage";
import GameplayPage from "@/components/GameplayPage";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface GameStartData {
  anteBet: number;
  remainingBalance: number;
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [gameState, setGameState] = useState({
    balance: 5000,
    currentBet: 0,
    previousAnte: 0,
  });

  const handlePlayNow = () => {
    setCurrentPage('betting');
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
  };

  const handleStartGame = (gameData: GameStartData) => {
    setGameState(prev => ({
      ...prev,
      balance: gameData.remainingBalance,
      currentBet: gameData.anteBet,
      previousAnte: gameData.anteBet
    }));
    setCurrentPage('gameplay');
  };

  const handleGameComplete = (newBalance: number, previousAnte: number) => {
    setGameState({
      balance: newBalance,
      currentBet: 0,
      previousAnte: previousAnte
    });
    setCurrentPage('betting');
  };

  const renderCurrentPage = () => {
    switch(currentPage) {
      case 'landing':
        return <LandingPage onPlayNow={handlePlayNow} />;
      case 'betting':
        return (
          <BettingPage 
            balance={gameState.balance}
            previousAnte={gameState.previousAnte > 0 ? gameState.previousAnte : undefined}
            onBack={handleBackToLanding}
            onStartGame={handleStartGame}
          />
        );
      case 'gameplay':
        return (
          <GameplayPage
            anteBet={gameState.currentBet}
            balance={gameState.balance}
            onBack={handleBackToLanding}
            onGameComplete={handleGameComplete}
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