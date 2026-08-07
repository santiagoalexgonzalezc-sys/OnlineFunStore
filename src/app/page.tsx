'use client';

import { useState, useEffect } from 'react';
import GameCanvas from '@/components/GameCanvas';
import GameControls from '@/components/GameControls';
import GameSetup from '@/components/GameSetup';
import { gameEngine } from '@/lib/game/engine';

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameState, setGameState] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    // Subscribe to game state changes
    const unsubscribe = gameEngine.subscribe((state) => {
      setGameState(state);
    });

    // Set window size
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      unsubscribe();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleGameStart = async (userId: string, userName: string) => {
    setLoading(true);
    try {
      await gameEngine.initializeGame(userId, userName);
      setGameStarted(true);
      gameEngine.start();
    } catch (error) {
      console.error('Failed to start game:', error);
      alert('Failed to start game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-white text-xl">Loading game...</div>
      </main>
    );
  }

  if (!gameStarted) {
    return <GameSetup onGameStart={handleGameStart} />;
  }

  return (
    <main className="flex min-h-screen flex-col bg-gray-900">
      <div className="flex h-full">
        {/* Game Canvas - Full width */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <GameCanvas width={windowSize.width} height={windowSize.height} gameState={gameState} />
          </div>
        </div>

        {/* Game Controls - Floating panel */}
        <div className="fixed top-4 right-4 w-80">
          <GameControls gameEngine={gameEngine} gameState={gameState} />
        </div>
      </div>
    </main>
  );
}