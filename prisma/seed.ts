import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create suppliers
  const wholesaleCo = await prisma.supplier.create({
    data: {
      name: 'Wholesale Co.',
      location: 'Industrial District',
      reputation: 75,
    },
  });

  const freshFoods = await prisma.supplier.create({
    data: {
      name: 'Fresh Foods Ltd',
      location: 'Agricultural Zone',
      reputation: 80,
    },
  });

  const techSupplies = await prisma.supplier.create({
    data: {
      name: 'Tech Supplies Inc',
      location: 'Tech Park',
      reputation: 70,
    },
  });

  const homeGoods = await prisma.supplier.create({
    data: {
      name: 'Home Goods Depot',
      location: 'Commercial Center',
      reputation: 65,
    },
  });

  const fashionHub = await prisma.supplier.create({
    data: {
      name: 'Fashion Hub',
      location: 'Fashion District',
      reputation: 85,
    },
  });

  console.log('Created 5 suppliers');

  // Create products for Wholesale Co (general merchandise and food)
  const wholesaleProducts = [
    { name: 'Bread', category: 'Food', basePrice: 2.50, supplierId: wholesaleCo.id },
    { name: 'Milk (1L)', category: 'Food', basePrice: 3.00, supplierId: wholesaleCo.id },
    { name: 'Eggs (12)', category: 'Food', basePrice: 4.00, supplierId: wholesaleCo.id },
    { name: 'Rice (2kg)', category: 'Food', basePrice: 5.00, supplierId: wholesaleCo.id },
    { name: 'Pasta (500g)', category: 'Food', basePrice: 2.00, supplierId: wholesaleCo.id },
    { name: 'Canned Soup', category: 'Food', basePrice: 1.50, supplierId: wholesaleCo.id },
    { name: 'Cereal', category: 'Food', basePrice: 4.50, supplierId: wholesaleCo.id },
    { name: 'Coffee (500g)', category: 'Food', basePrice: 8.00, supplierId: wholesaleCo.id },
  ];

  for (const product of wholesaleProducts) {
    await prisma.product.create({ data: product });
  }

  // Create products for Fresh Foods (fresh produce)
  const freshFoodProducts = [
    { name: 'Apples (1kg)', category: 'Produce', basePrice: 4.50, supplierId: freshFoods.id },
    { name: 'Bananas (1kg)', category: 'Produce', basePrice: 3.00, supplierId: freshFoods.id },
    { name: 'Carrots (1kg)', category: 'Produce', basePrice: 2.50, supplierId: freshFoods.id },
    { name: 'Tomatoes (1kg)', category: 'Produce', basePrice: 5.00, supplierId: freshFoods.id },
    { name: 'Lettuce', category: 'Produce', basePrice: 1.50, supplierId: freshFoods.id },
    { name: 'Potatoes (2kg)', category: 'Produce', basePrice: 3.50, supplierId: freshFoods.id },
    { name: 'Onions (1kg)', category: 'Produce', basePrice: 2.00, supplierId: freshFoods.id },
    { name: 'Oranges (1kg)', category: 'Produce', basePrice: 5.50, supplierId: freshFoods.id },
    { name: 'Grapes (500g)', category: 'Produce', basePrice: 6.00, supplierId: freshFoods.id },
    { name: 'Strawberries (500g)', category: 'Produce', basePrice: 7.00, supplierId: freshFoods.id },
  ];

  for (const product of freshFoodProducts) {
    await prisma.product.create({ data: product });
  }

  // Create products for Tech Supplies (electronics)
  const techProducts = [
    { name: 'USB Cable', category: 'Electronics', basePrice: 8.00, supplierId: techSupplies.id },
    { name: 'Phone Charger', category: 'Electronics', basePrice: 15.00, supplierId: techSupplies.id },
    { name: 'Headphones', category: 'Electronics', basePrice: 25.00, supplierId: techSupplies.id },
    { name: 'Computer Mouse', category: 'Electronics', basePrice: 20.00, supplierId: techSupplies.id },
    { name: 'Keyboard', category: 'Electronics', basePrice: 35.00, supplierId: techSupplies.id },
    { name: 'Webcam', category: 'Electronics', basePrice: 45.00, supplierId: techSupplies.id },
    { name: 'USB Hub', category: 'Electronics', basePrice: 18.00, supplierId: techSupplies.id },
    { name: 'Power Strip', category: 'Electronics', basePrice: 12.00, supplierId: techSupplies.id },
    { name: 'HDMI Cable', category: 'Electronics', basePrice: 10.00, supplierId: techSupplies.id },
    { name: 'Screen Cleaner', category: 'Electronics', basePrice: 8.00, supplierId: techSupplies.id },
  ];

  for (const product of techProducts) {
    await prisma.product.create({ data: product });
  }

  // Create products for Home Goods (household items)
  const homeProducts = [
    { name: 'Trash Bags (50 pack)', category: 'Household', basePrice: 8.00, supplierId: homeGoods.id },
    { name: 'Paper Towels', category: 'Household', basePrice: 6.00, supplierId: homeGoods.id },
    { name: 'Dish Soap', category: 'Household', basePrice: 4.00, supplierId: homeGoods.id },
    { name: 'Laundry Detergent', category: 'Household', basePrice: 12.00, supplierId: homeGoods.id },
    { name: 'Cleaning Spray', category: 'Household', basePrice: 5.00, supplierId: homeGoods.id },
    { name: 'Sponges (pack)', category: 'Household', basePrice: 3.00, supplierId: homeGoods.id },
    { name: 'Light Bulbs (4 pack)', category: 'Household', basePrice: 10.00, supplierId: homeGoods.id },
    { name: 'Batteries (AA 8 pack)', category: 'Household', basePrice: 12.00, supplierId: homeGoods.id },
  ];

  for (const product of homeProducts) {
    await prisma.product.create({ data: product });
  }

  // Create products for Fashion Hub (clothing and accessories)
  const fashionProducts = [
    { name: 'T-Shirt', category: 'Clothing', basePrice: 15.00, supplierId: fashionHub.id },
    { name: 'Jeans', category: 'Clothing', basePrice: 35.00, supplierId: fashionHub.id },
    { name: 'Socks (3 pack)', category: 'Clothing', basePrice: 8.00, supplierId: fashionHub.id },
    { name: 'Hat', category: 'Clothing', basePrice: 12.00, supplierId: fashionHub.id },
    { name: 'Gloves', category: 'Clothing', basePrice: 10.00, supplierId: fashionHub.id },
    { name: 'Scarf', category: 'Clothing', basePrice: 15.00, supplierId: fashionHub.id },
    { name: 'Belt', category: 'Clothing', basePrice: 18.00, supplierId: fashionHub.id },
    { name: 'Sunglasses', category: 'Clothing', basePrice: 25.00, supplierId: fashionHub.id },
  ];

  for (const product of fashionProducts) {
    await prisma.product.create({ data: product });
  }

  console.log('Created 38 products across 5 suppliers');

  // Summary
  const supplierCount = await prisma.supplier.count();
  const productCount = await prisma.product.count();

  console.log('✅ Database seeded successfully!');
  console.log(`📦 Created ${supplierCount} suppliers`);
  console.log(`🛍️  Created ${productCount} products`);
  console.log('\nSupplier breakdown:');
  console.log(`  - Wholesale Co.: 8 products (Food)`);
  console.log(`  - Fresh Foods Ltd: 10 products (Produce)`);
  console.log(`  - Tech Supplies Inc: 10 products (Electronics)`);
  console.log(`  - Home Goods Depot: 8 products (Household)`);
  console.log(`  - Fashion Hub: 8 products (Clothing)`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });