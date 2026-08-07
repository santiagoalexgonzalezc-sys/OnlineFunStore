import { GameState } from '../state';

export interface InventoryItem {
  productId: string;
  productName: string;
  quantity: number;
  shelfPrice: number;
  reorderLevel: number;
  supplierId: string;
}

export class InventorySystem {
  private inventory: Map<string, InventoryItem> = new Map();

  update(deltaTime: number, state: GameState): void {
    // Check for low stock items
    this.checkLowStock();
    
    // Calculate inventory value
    this.calculateInventoryValue();
  }

  private checkLowStock(): void {
    this.inventory.forEach((item, productId) => {
      if (item.quantity <= item.reorderLevel) {
        console.log(`Low stock alert: ${item.productName} (${item.quantity} remaining)`);
        // Would trigger reorder notification here
      }
    });
  }

  private calculateInventoryValue(): number {
    let totalValue = 0;
    this.inventory.forEach(item => {
      totalValue += item.quantity * item.shelfPrice;
    });
    return totalValue;
  }

  // Add items to inventory
  addStock(productId: string, quantity: number, costPerUnit: number): void {
    const existingItem = this.inventory.get(productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
      // Could implement weighted average cost here
    } else {
      // Create new inventory item
      // This would fetch product details from database
      const newItem: InventoryItem = {
        productId,
        productName: `Product ${productId}`,
        quantity,
        shelfPrice: costPerUnit * 1.5, // Default 50% markup
        reorderLevel: 10,
        supplierId: '',
      };
      this.inventory.set(productId, newItem);
    }
  }

  // Remove items from inventory (when sold)
  removeStock(productId: string, quantity: number): boolean {
    const item = this.inventory.get(productId);
    
    if (!item || item.quantity < quantity) {
      return false;
    }
    
    item.quantity -= quantity;
    return true;
  }

  // Get inventory item
  getInventoryItem(productId: string): InventoryItem | undefined {
    return this.inventory.get(productId);
  }

  // Get all inventory
  getAllInventory(): InventoryItem[] {
    return Array.from(this.inventory.values());
  }

  // Set reorder level
  setReorderLevel(productId: string, level: number): void {
    const item = this.inventory.get(productId);
    if (item) {
      item.reorderLevel = level;
    }
  }

  // Set shelf price
  setShelfPrice(productId: string, price: number): void {
    const item = this.inventory.get(productId);
    if (item) {
      item.shelfPrice = price;
    }
  }

  // Get total inventory count
  getTotalItemCount(): number {
    let total = 0;
    this.inventory.forEach(item => {
      total += item.quantity;
    });
    return total;
  }

  // Get low stock items
  getLowStockItems(): InventoryItem[] {
    return this.getAllInventory().filter(item => item.quantity <= item.reorderLevel);
  }
}