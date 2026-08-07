import { GameState } from '../state';
import { gameStateManager } from '../state';

export class TimeSystem {
  // Real-world seconds per in-game minute
  private readonly SECONDS_PER_MINUTE = 1; // Adjustable for game pacing
  
  update(deltaTime: number, state: GameState): void {
    // Calculate how many in-game minutes to advance
    const gameMinutesToAdvance = deltaTime / (this.SECONDS_PER_MINUTE * 1000);
    const gameSecondsToAdvance = gameMinutesToAdvance * 60;
    
    // Update game time through state manager
    if (gameSecondsToAdvance > 0) {
      gameStateManager.advanceTime(gameSecondsToAdvance);
    }
  }

  // Get formatted time string
  getFormattedTime(state: GameState): string {
    return `${state.hour.toString().padStart(2, '0')}:${state.minute.toString().padStart(2, '0')}`;
  }

  // Get formatted date string
  getFormattedDate(state: GameState): string {
    return `Day ${state.day}`;
  }

  // Check if store is open (assuming 8 AM - 10 PM)
  isStoreOpen(state: GameState): boolean {
    return state.hour >= 8 && state.hour < 22;
  }

  // Get time until store closes
  getTimeUntilClose(state: GameState): number {
    if (!this.isStoreOpen(state)) return 0;
    const closingHour = 22;
    return (closingHour - state.hour) * 60 - state.minute;
  }

  // Get time until store opens
  getTimeUntilOpen(state: GameState): number {
    if (this.isStoreOpen(state)) return 0;
    const openingHour = 8;
    if (state.hour < openingHour) {
      return (openingHour - state.hour) * 60 - state.minute;
    } else {
      return (24 - state.hour + openingHour) * 60 - state.minute;
    }
  }
}