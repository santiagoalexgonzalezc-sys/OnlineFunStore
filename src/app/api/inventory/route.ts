import { NextRequest, NextResponse } from 'next/server';
import { inventoryQueries } from '@/lib/database/queries';

// GET /api/inventory?storeId=xxx - Get store inventory
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const storeId = searchParams.get('storeId');

    if (!storeId) {
      return NextResponse.json({ error: 'Store ID is required' }, { status: 400 });
    }

    const inventory = await inventoryQueries.getStoreInventory(storeId);
    return NextResponse.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

// POST /api/inventory - Add inventory item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storeId, productId, quantity, shelfPrice, reorderLevel } = body;

    if (!storeId || !productId || !quantity || !shelfPrice) {
      return NextResponse.json(
        { error: 'Store ID, product ID, quantity, and shelf price are required' },
        { status: 400 }
      );
    }

    const inventoryItem = await inventoryQueries.addInventoryItem({
      storeId,
      productId,
      quantity,
      shelfPrice,
      reorderLevel: reorderLevel || 10,
    });

    return NextResponse.json(inventoryItem, { status: 201 });
  } catch (error) {
    console.error('Error adding inventory item:', error);
    return NextResponse.json({ error: 'Failed to add inventory item' }, { status: 500 });
  }
}

// PUT /api/inventory - Update inventory
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { storeId, productId, quantity, shelfPrice } = body;

    if (!storeId || !productId) {
      return NextResponse.json(
        { error: 'Store ID and product ID are required' },
        { status: 400 }
      );
    }

    let updatedInventory;

    if (quantity !== undefined) {
      updatedInventory = await inventoryQueries.updateInventoryQuantity(
        storeId,
        productId,
        quantity
      );
    }

    if (shelfPrice !== undefined) {
      updatedInventory = await inventoryQueries.updateShelfPrice(
        storeId,
        productId,
        shelfPrice
      );
    }

    return NextResponse.json(updatedInventory);
  } catch (error) {
    console.error('Error updating inventory:', error);
    return NextResponse.json({ error: 'Failed to update inventory' }, { status: 500 });
  }
}