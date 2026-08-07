import { NextRequest, NextResponse } from 'next/server';
import { staffQueries } from '@/lib/database/queries';

// GET /api/staff?storeId=xxx - Get store staff
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const storeId = searchParams.get('storeId');

    if (!storeId) {
      return NextResponse.json({ error: 'Store ID is required' }, { status: 400 });
    }

    const staff = await staffQueries.getStoreStaff(storeId);
    return NextResponse.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
  }
}

// POST /api/staff - Hire new staff
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storeId, name, role, wage } = body;

    if (!storeId || !name || !role || !wage) {
      return NextResponse.json(
        { error: 'Store ID, name, role, and wage are required' },
        { status: 400 }
      );
    }

    const staffMember = await staffQueries.hireStaff(storeId, name, role, wage);
    return NextResponse.json(staffMember, { status: 201 });
  } catch (error) {
    console.error('Error hiring staff:', error);
    return NextResponse.json({ error: 'Failed to hire staff' }, { status: 500 });
  }
}

// DELETE /api/staff?staffId=xxx - Fire staff
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const staffId = searchParams.get('staffId');

    if (!staffId) {
      return NextResponse.json({ error: 'Staff ID is required' }, { status: 400 });
    }

    await staffQueries.fireStaff(staffId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error firing staff:', error);
    return NextResponse.json({ error: 'Failed to fire staff' }, { status: 500 });
  }
}