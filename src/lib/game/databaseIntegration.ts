import { gameStateManager, GameState } from './state';
import { prisma } from '../database/prisma';

export class GameDatabaseIntegration {
  // Initialize game with user data
  async initializeGameForUser(userId: string, userName: string): Promise<void> {
    try {
      // For local development with SQLite, we'll use a simple approach
      // Check if we have a store in the database
      const storeCount = await prisma.store.count();
      
      if (storeCount === 0) {
        // Create initial store
        const store = await prisma.store.create({
          data: {
            userId: userId,
            name: `${userName}'s Store`,
            storeType: 'general',
            cash: 1000,
            reputation: 0,
          },
        });

        // Initialize game state with new store
        gameStateManager.setState({
          player: {
            id: userId,
            name: userName,
          },
          store: {
            id: store.id,
            name: store.name,
            cash: store.cash,
            reputation: store.reputation,
            storeType: store.storeType,
          },
        });

        console.log('Created new store for user:', store.name);
      } else {
        // Load existing store
        const store = await prisma.store.findFirst();
        if (store) {
          gameStateManager.setState({
            player: {
              id: userId,
              name: userName,
            },
            store: {
              id: store.id,
              name: store.name,
              cash: store.cash,
              reputation: store.reputation,
              storeType: store.storeType,
            },
          });

          console.log('Loaded existing store:', store.name);
        }
      }
    } catch (error) {
      console.error('Error initializing game for user:', error);
      throw error;
    }
  }

  // Save game state to database
  async saveGame(saveName: string): Promise<void> {
    try {
      const state = gameStateManager.getState();
      
      // Update store cash and reputation in database
      await prisma.store.update({
        where: { id: state.store.id },
        data: {
          cash: state.store.cash,
          reputation: state.store.reputation,
        },
      });

      // Create or update game save
      const existingSave = await prisma.gameSave.findFirst({
        where: { storeId: state.store.id },
      });

      if (existingSave) {
        await prisma.gameSave.update({
          where: { id: existingSave.id },
          data: { gameTime: state.gameTime },
        });
      } else {
        await prisma.gameSave.create({
          data: {
            userId: state.player.id,
            saveName,
            gameTime: state.gameTime,
            storeId: state.store.id,
          },
        });
      }

      console.log('Game saved successfully:', saveName);
    } catch (error) {
      console.error('Error saving game:', error);
      throw error;
    }
  }

  // Load game state from database
  async loadGame(gameSaveId: string): Promise<void> {
    try {
      const save = await prisma.gameSave.findUnique({
        where: { id: gameSaveId },
      });
      
      if (!save) {
        throw new Error('Game save not found');
      }

      // Load store data
      const store = await prisma.store.findUnique({
        where: { id: save.storeId },
      });
      
      if (!store) {
        throw new Error('Store not found');
      }

      // Update game state
      gameStateManager.setState({
        gameTime: save.gameTime,
        store: {
          id: store.id,
          name: store.name,
          cash: store.cash,
          reputation: store.reputation,
          storeType: store.storeType,
        },
      });

      console.log('Game loaded successfully:', save.saveName);
    } catch (error) {
      console.error('Error loading game:', error);
      throw error;
    }
  }

  // Sync inventory with database
  async syncInventory(): Promise<void> {
    try {
      const state = gameStateManager.getState();
      const inventory = await prisma.inventory.findMany({
        where: { storeId: state.store.id },
        include: { product: true },
      });

      console.log('Inventory synced:', inventory.length, 'items');
    } catch (error) {
      console.error('Error syncing inventory:', error);
    }
  }

  // Sync staff with database
  async syncStaff(): Promise<void> {
    try {
      const state = gameStateManager.getState();
      const staff = await prisma.staff.findMany({
        where: { storeId: state.store.id },
      });

      console.log('Staff synced:', staff.length, 'employees');
    } catch (error) {
      console.error('Error syncing staff:', error);
    }
  }

  // Record transaction in database
  async recordTransaction(type: string, amount: number, description: string): Promise<void> {
    try {
      const state = gameStateManager.getState();
      await prisma.transaction.create({
        data: {
          storeId: state.store.id,
          type,
          amount,
          description,
        },
      });

      // Update store cash in game state
      if (type === 'sale') {
        gameStateManager.updateCash(amount);
      } else {
        gameStateManager.updateCash(-amount);
      }

      console.log('Transaction recorded:', type, amount);
    } catch (error) {
      console.error('Error recording transaction:', error);
      throw error;
    }
  }

  // Get financial summary
  async getFinancialSummary(): Promise<any> {
    try {
      const state = gameStateManager.getState();
      const transactions = await prisma.transaction.findMany({
        where: { storeId: state.store.id },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
      
      const revenue = transactions
        .filter(t => t.type === 'sale')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = transactions
        .filter(t => t.type !== 'sale')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        cash: state.store.cash,
        revenue,
        expenses,
        profit: revenue - expenses,
        transactionCount: transactions.length,
      };
    } catch (error) {
      console.error('Error getting financial summary:', error);
      throw error;
    }
  }
}

// Singleton instance
export const gameDatabaseIntegration = new GameDatabaseIntegration();