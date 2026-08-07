'use client';

import { useState, useEffect } from 'react';
import SaveLoadManager from './SaveLoadManager';

interface GameControlsProps {
  gameEngine?: any;
  gameState?: any;
}

export default function GameControls({ gameEngine, gameState }: GameControlsProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(1);
  const [gameTime, setGameTime] = useState({ day: 1, hour: 8, minute: 0 });
  const [cash, setCash] = useState(1000);
  const [showSaveLoad, setShowSaveLoad] = useState(false);

  useEffect(() => {
    if (gameState) {
      setGameTime({
        day: gameState.day,
        hour: gameState.hour,
        minute: gameState.minute,
      });
      setCash(gameState.store?.cash || 1000);
    }
  }, [gameState]);

  const handlePause = () => {
    if (gameEngine) {
      gameEngine.pause();
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    if (gameEngine) {
      gameEngine.resume();
      setIsPaused(false);
    }
  };

  const handleSpeedChange = (speed: number) => {
    if (gameEngine) {
      gameEngine.setSpeed(speed);
      setGameSpeed(speed);
    }
  };

  const handleSave = async () => {
    if (gameEngine) {
      try {
        await gameEngine.saveGame('Auto Save');
        alert('Game saved successfully!');
      } catch (error) {
        alert('Failed to save game');
        console.error(error);
      }
    }
  };

  const formatTime = () => {
    return `${gameTime.hour.toString().padStart(2, '0')}:${gameTime.minute.toString().padStart(2, '0')}`;
  };

  if (showSaveLoad) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <SaveLoadManager 
          gameEngine={gameEngine} 
          onClose={() => setShowSaveLoad(false)} 
        />
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="text-white">
          <div className="text-sm text-gray-400">Game Time</div>
          <div className="text-xl font-bold">Day {gameTime.day}, {formatTime()}</div>
        </div>
        <div className="text-white text-right">
          <div className="text-sm text-gray-400">Store Cash</div>
          <div className="text-xl font-bold text-green-400">${cash.toFixed(2)}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={isPaused ? handleResume : handlePause}
          className={`px-4 py-2 rounded font-semibold ${
            isPaused
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-yellow-600 hover:bg-yellow-700 text-white'
          }`}
        >
          {isPaused ? '▶ Resume' : '⏸ Pause'}
        </button>

        <div className="flex items-center gap-1 bg-gray-700 rounded px-2">
          <button
            onClick={() => handleSpeedChange(0.5)}
            className={`px-2 py-1 rounded text-sm ${
              gameSpeed === 0.5 ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'
            }`}
          >
            0.5x
          </button>
          <button
            onClick={() => handleSpeedChange(1)}
            className={`px-2 py-1 rounded text-sm ${
              gameSpeed === 1 ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'
            }`}
          >
            1x
          </button>
          <button
            onClick={() => handleSpeedChange(2)}
            className={`px-2 py-1 rounded text-sm ${
              gameSpeed === 2 ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'
            }`}
          >
            2x
          </button>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-semibold"
        >
          💾 Save
        </button>

        <button
          onClick={() => setShowSaveLoad(true)}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-semibold"
        >
          📂 Load
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span>Status:</span>
        <span className={isPaused ? 'text-yellow-400' : 'text-green-400'}>
          {isPaused ? 'Paused' : 'Running'}
        </span>
        <span>•</span>
        <span>Speed: {gameSpeed}x</span>
      </div>
    </div>
  );
}