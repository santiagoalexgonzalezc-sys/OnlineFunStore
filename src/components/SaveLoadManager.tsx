'use client';

import { useState, useEffect } from 'react';

interface SaveLoadManagerProps {
  gameEngine?: any;
  onClose?: () => void;
}

interface GameSave {
  id: string;
  saveName: string;
  gameTime: number;
  createdAt: string;
  updatedAt: string;
}

export default function SaveLoadManager({ gameEngine, onClose }: SaveLoadManagerProps) {
  const [saves, setSaves] = useState<GameSave[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveName, setSaveName] = useState('');

  useEffect(() => {
    loadSaves();
  }, []);

  const loadSaves = async () => {
    setLoading(true);
    try {
      // This would load from the database
      // For now, simulate with local storage
      const savedGames = localStorage.getItem('gameSaves');
      if (savedGames) {
        setSaves(JSON.parse(savedGames));
      }
    } catch (error) {
      console.error('Failed to load saves:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSave = async () => {
    if (!saveName.trim()) {
      alert('Please enter a save name');
      return;
    }

    try {
      if (gameEngine) {
        await gameEngine.saveGame(saveName);
        
        // Add to local storage for demo
        const newSave: GameSave = {
          id: `save_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          saveName,
          gameTime: gameEngine.getState().gameTime,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          storeId: gameEngine.getState().store.id,
        };
        
        const updatedSaves = [...saves, newSave];
        setSaves(updatedSaves);
        localStorage.setItem('gameSaves', JSON.stringify(updatedSaves));
        
        setSaveName('');
        alert('Game saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save game:', error);
      alert('Failed to save game');
    }
  };

  const loadGame = async (saveName: string) => {
    try {
      if (gameEngine) {
        await gameEngine.loadGame(saveName);
        alert('Game loaded successfully!');
        if (onClose) onClose();
      }
    } catch (error) {
      console.error('Failed to load game:', error);
      alert('Failed to load game');
    }
  };

  const deleteSave = (saveName: string) => {
    if (confirm('Are you sure you want to delete this save?')) {
      const updatedSaves = saves.filter(s => s.saveName !== saveName);
      setSaves(updatedSaves);
      localStorage.setItem('gameSaves', JSON.stringify(updatedSaves));
    }
  };

  const formatGameTime = (gameTime: number) => {
    const totalMinutes = Math.floor(gameTime / 60);
    const days = Math.floor(totalMinutes / (24 * 60)) + 1;
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    return `Day ${days}, ${hours}h`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-2xl w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Save / Load Game</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        )}
      </div>

      {/* Create New Save */}
      <div className="mb-6 p-4 bg-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-3">Create New Save</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            placeholder="Enter save name"
            className="flex-1 px-4 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={createSave}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
          >
            Save
          </button>
        </div>
      </div>

      {/* Existing Saves */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Existing Saves</h3>
        {loading ? (
          <div className="text-gray-400 text-center py-4">Loading saves...</div>
        ) : saves.length === 0 ? (
          <div className="text-gray-400 text-center py-4">No saved games found</div>
        ) : (
          <div className="space-y-2">
            {saves.map((save) => (
              <div
                key={save.id}
                className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <div className="flex-1">
                  <div className="text-white font-semibold">{save.saveName}</div>
                  <div className="text-sm text-gray-400">
                    {formatGameTime(save.gameTime)} • {formatDate(save.updatedAt)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => loadGame(save.saveName)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-semibold"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => deleteSave(save.saveName)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}