import { gameStateManager, GameState } from './state';
import { TimeSystem } from './systems/TimeSystem';
import { TradingSystem } from './systems/TradingSystem';
import { InventorySystem } from './systems/InventorySystem';
import { StaffSystem } from './systems/StaffSystem';
import { FinancialSystem } from './systems/FinancialSystem';

class GameEngine {
  private isRunning: boolean = false;
  private lastFrameTime: number = 0;
  private targetFPS: number = 60;
  private frameInterval: number = 1000 / this.targetFPS;

  // Game systems
  private timeSystem: TimeSystem;
  private tradingSystem: TradingSystem;
  private inventorySystem: InventorySystem;
  private staffSystem: StaffSystem;
  private financialSystem: FinancialSystem;

  constructor() {
    this.timeSystem = new TimeSystem();
    this.tradingSystem = new TradingSystem();
    this.inventorySystem = new InventorySystem();
    this.staffSystem = new StaffSystem();
    this.financialSystem = new FinancialSystem();
  }

  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    this.gameLoop();
    
    console.log('Game engine started');
  }

  stop(): void {
    this.isRunning = false;
    console.log('Game engine stopped');
  }

  private gameLoop = (): void => {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastFrameTime;

    if (deltaTime >= this.frameInterval) {
      this.update(deltaTime);
      this.lastFrameTime = currentTime - (deltaTime % this.frameInterval);
    }

    requestAnimationFrame(this.gameLoop);
  };

  private update(deltaTime: number): void {
    const state = gameStateManager.getState();
    
    if (state.isPaused) return;

    // Update all game systems
    this.timeSystem.update(deltaTime, state);
    this.tradingSystem.update(deltaTime, state);
    this.inventorySystem.update(deltaTime, state);
    this.staffSystem.update(deltaTime, state);
    this.financialSystem.update(deltaTime, state);
  }

  // Public API for game controls
  pause(): void {
    gameStateManager.togglePause();
  }

  resume(): void {
    const state = gameStateManager.getState();
    if (state.isPaused) {
      gameStateManager.togglePause();
    }
  }

  setSpeed(speed: number): void {
    gameStateManager.setGameSpeed(speed);
  }

  // Get game state
  getState(): GameState {
    return gameStateManager.getState();
  }

  // Subscribe to state changes
  subscribe(listener: (state: GameState) => void): () => void {
    return gameStateManager.subscribe(listener);
  }

  // Initialize game with user data (local only for now)
  async initializeGame(userId: string, userName: string): Promise<void> {
    // For now, just initialize local state without database
    gameStateManager.setState({
      player: {
        id: userId,
        name: userName,
      },
      store: {
        id: 'local-store',
        name: `${userName}'s Store`,
        cash: 1000,
        reputation: 0,
        storeType: 'general',
      },
    });
    
    console.log('Game initialized for user:', userName);
  }

  // Save game (local storage for now)
  async saveGame(saveName: string): Promise<void> {
    const state = gameStateManager.getState();
    
    // Save to local storage
    const saveData = {
      saveName,
      gameState: state,
      timestamp: new Date().toISOString(),
    };
    
    const saves = JSON.parse(localStorage.getItem('gameSaves') || '[]');
    const existingIndex = saves.findIndex((s: any) => s.storeId === state.store.id);
    
    if (existingIndex >= 0) {
      saves[existingIndex] = saveData;
    } else {
      saves.push(saveData);
    }
    
    localStorage.setItem('gameSaves', JSON.stringify(saves));
    console.log('Game saved successfully:', saveName);
  }

  // Load game (from local storage for now)
  async loadGame(saveName: string): Promise<void> {
    const saves = JSON.parse(localStorage.getItem('gameSaves') || '[]');
    const save = saves.find((s: any) => s.saveName === saveName);
    
    if (save) {
      gameStateManager.setState(save.gameState);
      console.log('Game loaded successfully:', save.saveName);
    } else {
      throw new Error('Game save not found');
    }
  }

  // Sync data (placeholder for now)
  async syncWithDatabase(): Promise<void> {
    console.log('Database sync - placeholder for now');
  }

  // Record transaction (local for now)
  async recordTransaction(type: string, amount: number, description: string): Promise<void> {
    const state = gameStateManager.getState();
    
    // Update store cash in game state
    if (type === 'sale') {
      gameStateManager.updateCash(amount);
    } else {
      gameStateManager.updateCash(-amount);
    }

    console.log('Transaction recorded:', type, amount);
  }

  // Get financial summary (local for now)
  async getFinancialSummary(): Promise<any> {
    const state = gameStateManager.getState();
    return {
      cash: state.store.cash,
      revenue: 0,
      expenses: 0,
      profit: 0,
      transactionCount: 0,
    };
  }
}

// Singleton instance
export const gameEngine = new GameEngine();