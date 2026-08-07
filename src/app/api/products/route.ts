import { NextRequest, NextResponse } from 'next/server';
import { productQueries } from '@/lib/database/queries';

// GET /api/products - Get all products or filter by category/supplier
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const supplierId = searchParams.get('supplierId');

    let products;
    
    if (category) {
      products = await productQueries.getProductsByCategory(category);
    } else if (supplierId) {
      products = await productQueries.getProductsBySupplier(supplierId);
    } else {
      products = await productQueries.getAllProducts();
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}