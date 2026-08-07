import { prisma } from './prisma';
import { Product, Supplier, Store, Inventory, Staff, Transaction } from '@prisma/client';

// User operations
export const userQueries = {
  async createUser(email: string, name?: string) {
    return await prisma.user.create({
      data: { email, name },
    });
  },

  async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      include: { stores: true, gameSaves: true },
    });
  },

  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: { stores: true, gameSaves: true },
    });
  },
};

// Store operations
export const storeQueries = {
  async createStore(userId: string, name: string, storeType: string, initialCash: number = 1000) {
    return await prisma.store.create({
      data: {
        userId,
        name,
        storeType,
        cash: initialCash,
      },
    });
  },

  async getStoreById(id: string) {
    return await prisma.store.findUnique({
      where: { id },
      include: {
        inventory: { include: { product: true } },
        staff: true,
        transactions: true,
        suppliers: { include: { supplier: true } },
      },
    });
  },

  async getStoresByUser(userId: string) {
    return await prisma.store.findMany({
      where: { userId },
      include: {
        inventory: { include: { product: true } },
        staff: true,
      },
    });
  },

  async updateStoreCash(storeId: string, amount: number) {
    return await prisma.store.update({
      where: { id: storeId },
      data: { cash: amount },
    });
  },

  async updateStoreReputation(storeId: string, reputation: number) {
    return await prisma.store.update({
      where: { id: storeId },
      data: { reputation },
    });
  },
};

// Product operations
export const productQueries = {
  async getAllProducts() {
    return await prisma.product.findMany({
      include: { supplier: true },
    });
  },

  async getProductById(id: string) {
    return await prisma.product.findUnique({
      where: { id },
      include: { supplier: true },
    });
  },

  async getProductsByCategory(category: string) {
    return await prisma.product.findMany({
      where: { category },
      include: { supplier: true },
    });
  },

  async getProductsBySupplier(supplierId: string) {
    return await prisma.product.findMany({
      where: { supplierId },
    });
  },

  async createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    return await prisma.product.create({
      data,
    });
  },
};

// Supplier operations
export const supplierQueries = {
  async getAllSuppliers() {
    return await prisma.supplier.findMany({
      include: { products: true },
    });
  },

  async getSupplierById(id: string) {
    return await prisma.supplier.findUnique({
      where: { id },
      include: { products: true },
    });
  },

  async createSupplier(name: string, location?: string) {
    return await prisma.supplier.create({
      data: { name, location },
    });
  },
};

// Inventory operations
export const inventoryQueries = {
  async getStoreInventory(storeId: string) {
    return await prisma.inventory.findMany({
      where: { storeId },
      include: { product: true },
    });
  },

  async getInventoryItem(storeId: string, productId: string) {
    return await prisma.inventory.findUnique({
      where: {
        storeId_productId: { storeId, productId },
      },
      include: { product: true },
    });
  },

  async addInventoryItem(data: Omit<Inventory, 'id' | 'createdAt' | 'updatedAt'>) {
    return await prisma.inventory.create({
      data,
    });
  },

  async updateInventoryQuantity(storeId: string, productId: string, quantity: number) {
    return await prisma.inventory.update({
      where: {
        storeId_productId: { storeId, productId },
      },
      data: { quantity },
    });
  },

  async updateShelfPrice(storeId: string, productId: string, price: number) {
    return await prisma.inventory.update({
      where: {
        storeId_productId: { storeId, productId },
      },
      data: { shelfPrice: price },
    });
  },

  async getLowStockItems(storeId: string) {
    return await prisma.inventory.findMany({
      where: {
        storeId,
        quantity: { lte: prisma.inventory.fields.reorderLevel },
      },
      include: { product: true },
    });
  },
};

// Staff operations
export const staffQueries = {
  async getStoreStaff(storeId: string) {
    return await prisma.staff.findMany({
      where: { storeId },
    });
  },

  async hireStaff(storeId: string, name: string, role: string, wage: number) {
    return await prisma.staff.create({
      data: {
        storeId,
        name,
        role,
        wage,
      },
    });
  },

  async fireStaff(staffId: string) {
    return await prisma.staff.delete({
      where: { id: staffId },
    });
  },

  async updateStaffSkill(staffId: string, skill: number) {
    return await prisma.staff.update({
      where: { id: staffId },
      data: { skill },
    });
  },

  async updateStaffMorale(staffId: string, morale: number) {
    return await prisma.staff.update({
      where: { id: staffId },
      data: { morale },
    });
  },
};

// Transaction operations
export const transactionQueries = {
  async createStoreTransaction(
    storeId: string,
    type: string,
    amount: number,
    description?: string
  ) {
    return await prisma.transaction.create({
      data: {
        storeId,
        type,
        amount,
        description,
      },
    });
  },

  async getStoreTransactions(storeId: string, limit: number = 50) {
    return await prisma.transaction.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  async getTransactionsByType(storeId: string, type: string) {
    return await prisma.transaction.findMany({
      where: { storeId, type },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getDailyRevenue(storeId: string, date: Date) {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const transactions = await prisma.transaction.findMany({
      where: {
        storeId,
        type: 'sale',
        createdAt: { gte: startOfDay, lte: endOfDay },
      },
    });

    return transactions.reduce((sum, txn) => sum + txn.amount, 0);
  },
};

// Game save operations
export const gameSaveQueries = {
  async createGameSave(userId: string, saveName: string, gameTime: number, storeId: string) {
    return await prisma.gameSave.create({
      data: {
        userId,
        saveName,
        gameTime,
        storeId,
      },
    });
  },

  async getGameSavesByUser(userId: string) {
    return await prisma.gameSave.findMany({
      where: { userId },
      include: { user: true },
      orderBy: { updatedAt: 'desc' },
    });
  },

  async updateGameSave(gameSaveId: string, gameTime: number) {
    return await prisma.gameSave.update({
      where: { id: gameSaveId },
      data: { gameTime },
    });
  },

  async deleteGameSave(gameSaveId: string) {
    return await prisma.gameSave.delete({
      where: { id: gameSaveId },
    });
  },
};

// Supplier relationship operations
export const supplierRelationshipQueries = {
  async createStoreSupplierRelationship(
    storeId: string,
    supplierId: string,
    discount: number = 0,
    deliveryTime: number = 3
  ) {
    return await prisma.supplierRelationship.create({
      data: {
        storeId,
        supplierId,
        discount,
        deliveryTime,
      },
    });
  },

  async getStoreSuppliers(storeId: string) {
    return await prisma.supplierRelationship.findMany({
      where: { storeId },
      include: { supplier: { include: { products: true } } },
    });
  },

  async updateDiscount(storeId: string, supplierId: string, discount: number) {
    return await prisma.supplierRelationship.update({
      where: {
        storeId_supplierId: { storeId, supplierId },
      },
      data: { discount },
    });
  },
};