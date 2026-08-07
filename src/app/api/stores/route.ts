import { NextRequest, NextResponse } from 'next/server';
import { storeQueries } from '@/lib/database/queries';

// GET /api/stores - Get all stores for a user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const stores = await storeQueries.getStoresByUser(userId);
    return NextResponse.json(stores);
  } catch (error) {
    console.error('Error fetching stores:', error);
    return NextResponse.json({ error: 'Failed to fetch stores' }, { status: 500 });
  }
}

// POST /api/stores - Create a new store
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, storeType, initialCash } = body;

    if (!userId || !name || !storeType) {
      return NextResponse.json(
        { error: 'User ID, name, and store type are required' },
        { status: 400 }
      );
    }

    const store = await storeQueries.createStore(
      userId,
      name,
      storeType,
      initialCash || 1000
    );

    return NextResponse.json(store, { status: 201 });
  } catch (error) {
    console.error('Error creating store:', error);
    return NextResponse.json({ error: 'Failed to create store' }, { status: 500 });
  }
}