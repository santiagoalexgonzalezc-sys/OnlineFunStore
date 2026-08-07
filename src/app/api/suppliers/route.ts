import { NextRequest, NextResponse } from 'next/server';
import { supplierQueries } from '@/lib/database/queries';

// GET /api/suppliers - Get all suppliers
export async function GET() {
  try {
    const suppliers = await supplierQueries.getAllSuppliers();
    return NextResponse.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return NextResponse.json({ error: 'Failed to fetch suppliers' }, { status: 500 });
  }
}