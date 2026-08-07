'use client';

import { useState } from 'react';

interface GameSetupProps {
  onGameStart: (userId: string, userName: string) => void;
}

export default function GameSetup({ onGameStart }: GameSetupProps) {
  const [userName, setUserName] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  const handleStartGame = async () => {
    if (!userName.trim()) {
      alert('Please enter your name');
      return;
    }

    setIsStarting(true);
    // Generate a simple user ID for now (in production, this would come from auth)
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      await onGameStart(userId, userName);
    } catch (error) {
      console.error('Failed to start game:', error);
      alert('Failed to start game. Please try again.');
      setIsStarting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-8">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          Store Management Simulator
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Build your retail empire from scratch
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-300 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleStartGame()}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              disabled={isStarting}
            />
          </div>

          <button
            onClick={handleStartGame}
            disabled={isStarting || !userName.trim()}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
          >
            {isStarting ? 'Starting...' : 'Start Game'}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>You'll start with $1,000 to build your first store</p>
        </div>
      </div>
    </div>
  );
}