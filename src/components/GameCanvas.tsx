'use client';

import { useEffect, useRef, useState } from 'react';

interface GameCanvasProps {
  width?: number;
  height?: number;
  gameState?: any;
}

export default function GameCanvas({ width = 800, height = 600, gameState }: GameCanvasProps) {
  const gameRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || typeof window === 'undefined' || gameRef.current) return;

    const initGame = async () => {
      const PhaserModule = await import('phaser');
      const MainMenuModule = await import('@/game/scenes/MainMenu');
      const StoreViewModule = await import('@/game/scenes/StoreView');

      const config: any = {
        type: PhaserModule.AUTO,
        width,
        height,
        parent: 'game-container',
        backgroundColor: '#1a1a2e',
        scene: [MainMenuModule.default, StoreViewModule.default],
      };

      gameRef.current = new PhaserModule.Game(config);
    };

    initGame();

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [width, height, isClient]);

  // Update Phaser scene when game state changes
  useEffect(() => {
    if (gameRef.current && gameState && isClient) {
      const scene = gameRef.current.scene.getScene('StoreView');
      if (scene && scene.updateStoreInfo) {
        scene.updateStoreInfo(
          gameState.store?.name || 'My Store',
          gameState.store?.cash || 1000,
          gameState.day || 1,
          gameState.hour || 8,
          gameState.minute || 0
        );
      }
    }
  }, [gameState, isClient]);

  if (!isClient) {
    return <div className="flex justify-center items-center text-white">Loading game...</div>;
  }

  return (
    <div 
      id="game-container" 
      className="flex justify-center items-center"
      style={{ width: '100%', height: '100%' }}
    />
  );
}