// Core game state interface
export interface GameState {
  // Time
  gameTime: number; // In-game time in seconds
  day: number;
  hour: number;
  minute: number;
  
  // Store
  store: {
    id: string;
    name: string;
    cash: number;
    reputation: number;
    storeType: string;
  };
  
  // Player
  player: {
    id: string;
    name: string;
  };
  
  // Game status
  isPaused: boolean;
  gameSpeed: number; // 1 = normal, 2 = fast, 0.5 = slow
}

// Initial game state
export const createInitialGameState = (): GameState => ({
  gameTime: 0,
  day: 1,
  hour: 8, // Start at 8 AM
  minute: 0,
  store: {
    id: '',
    name: 'My Store',
    cash: 1000, // Starting cash
    reputation: 0,
    storeType: 'general',
  },
  player: {
    id: '',
    name: 'Player',
  },
  isPaused: false,
  gameSpeed: 1,
});

// Game state manager
class GameStateManager {
  private state: GameState;
  private listeners: Set<(state: GameState) => void> = new Set();

  constructor(initialState: GameState = createInitialGameState()) {
    this.state = initialState;
  }

  getState(): GameState {
    return { ...this.state };
  }

  setState(newState: Partial<GameState>): void {
    this.state = { ...this.state, ...newState };
    this.notifyListeners();
  }

  subscribe(listener: (state: GameState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  // Time management
  advanceTime(seconds: number): void {
    if (this.state.isPaused) return;

    const newGameTime = this.state.gameTime + (seconds * this.state.gameSpeed);
    const timeDifference = newGameTime - this.state.gameTime;
    
    // Calculate new day/hour/minute
    const totalMinutes = Math.floor(newGameTime / 60);
    const days = Math.floor(totalMinutes / (24 * 60)) + 1;
    const dayMinutes = totalMinutes % (24 * 60);
    const hours = Math.floor(dayMinutes / 60);
    const minutes = dayMinutes % 60;

    this.setState({
      gameTime: newGameTime,
      day: days,
      hour: hours,
      minute: minutes,
    });
  }

  // Store management
  updateCash(amount: number): void {
    this.setState({
      store: {
        ...this.state.store,
        cash: this.state.store.cash + amount,
      },
    });
  }

  updateReputation(amount: number): void {
    this.setState({
      store: {
        ...this.state.store,
        reputation: Math.max(0, this.state.store.reputation + amount),
      },
    });
  }

  // Game controls
  togglePause(): void {
    this.setState({ isPaused: !this.state.isPaused });
  }

  setGameSpeed(speed: number): void {
    this.setState({ gameSpeed: speed });
  }
}

// Singleton instance
export const gameStateManager = new GameStateManager();