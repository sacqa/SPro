const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const categories = [
  { name: 'Fruit & Veg', slug: 'fruit-veg', icon: '🥦', sortOrder: 1 },
  { name: 'Poultry Meat & Seafood', slug: 'meat-seafood', icon: '🍗', sortOrder: 2 },
  { name: 'Beverages', slug: 'beverages', icon: '🧃', sortOrder: 3 },
  { name: 'Snacks & Chocolate', slug: 'snacks', icon: '🍫', sortOrder: 4 },
  { name: 'Frozen Food', slug: 'frozen', icon: '🧊', sortOrder: 5 },
  { name: 'Coffee & Tea', slug: 'coffee-tea', icon: '☕', sortOrder: 6 },
  { name: 'Condiments', slug: 'condiments', icon: '🧂', sortOrder: 7 },
  { name: 'Bakery', slug: 'bakery', icon: '🍞', sortOrder: 8 },
  { name: 'Dairy & Eggs', slug: 'dairy-eggs', icon: '🥛', sortOrder: 9 },
  { name: 'Milk', slug: 'milk', icon: '🍼', sortOrder: 10 },
  { name: 'Ice Cream', slug: 'ice-cream', icon: '🍦', sortOrder: 11 },
  { name: 'Deli', slug: 'deli', icon: '🥪', sortOrder: 12 },
  { name: 'Ready to Eat', slug: 'ready-to-eat', icon: '🍱', sortOrder: 13 },
  { name: 'Cooking & Baking', slug: 'cooking-baking', icon: '🫙', sortOrder: 14 },
];

const products = [
  // Fruit & Veg
  { name: 'Fresh Tomatoes', price: 80, unit: 'per kg', categorySlug: 'fruit-veg', isFeatured: true },
  { name: 'Green Capsicum', price: 120, unit: 'per kg', categorySlug: 'fruit-veg' },
  { name: 'Bananas', price: 60, unit: 'per dozen', categorySlug: 'fruit-veg', isFeatured: true },
  { name: 'Red Apples', price: 200, unit: 'per kg', categorySlug: 'fruit-veg' },
  { name: 'Potatoes', price: 50, unit: 'per kg', categorySlug: 'fruit-veg' },
  // Meat
  { name: 'Chicken Breast', price: 550, unit: 'per kg', categorySlug: 'meat-seafood', isFeatured: true },
  { name: 'Mutton Boneless', price: 1400, unit: 'per kg', categorySlug: 'meat-seafood' },
  { name: 'Whole Chicken', price: 420, unit: 'per kg', categorySlug: 'meat-seafood' },
  { name: 'Fish Fillets', price: 650, unit: 'per kg', categorySlug: 'meat-seafood' },
  // Beverages
  { name: 'Coca-Cola 1.5L', price: 130, unit: 'per bottle', categorySlug: 'beverages', isFeatured: true },
  { name: '7UP 1.5L', price: 125, unit: 'per bottle', categorySlug: 'beverages' },
  { name: 'Sprite 500ml', price: 70, unit: 'per bottle', categorySlug: 'beverages' },
  { name: 'Nestle Pure Life 1.5L', price: 60, unit: 'per bottle', categorySlug: 'beverages' },
  { name: 'Tang Orange Sachet', price: 20, unit: 'per sachet', categorySlug: 'beverages' },
  // Snacks
  { name: 'Lay\'s Classic 100g', price: 80, unit: 'per pack', categorySlug: 'snacks', isFeatured: true },
  { name: 'KitKat 4 Finger', price: 120, unit: 'per bar', categorySlug: 'snacks' },
  { name: 'Pringles Original 165g', price: 450, unit: 'per can', categorySlug: 'snacks' },
  { name: 'Candyland Cocomo', price: 30, unit: 'per pack', categorySlug: 'snacks' },
  { name: 'Kurkure Masala Munch', price: 40, unit: 'per pack', categorySlug: 'snacks' },
  // Frozen
  { name: 'Khaas Frozen Paratha 5pcs', price: 180, unit: 'per pack', categorySlug: 'frozen' },
  { name: 'Chicken Nuggets 500g', price: 650, unit: 'per pack', categorySlug: 'frozen', isFeatured: true },
  { name: 'French Fries 1kg', price: 400, unit: 'per pack', categorySlug: 'frozen' },
  // Coffee & Tea
  { name: 'Tapal Danedar 500g', price: 350, unit: 'per pack', categorySlug: 'coffee-tea', isFeatured: true },
  { name: 'Lipton Yellow Label 200g', price: 280, unit: 'per box', categorySlug: 'coffee-tea' },
  { name: 'Nescafe Classic 200g', price: 950, unit: 'per jar', categorySlug: 'coffee-tea' },
  // Condiments
  { name: 'National Ketchup 800g', price: 220, unit: 'per bottle', categorySlug: 'condiments' },
  { name: 'Chef\'s Pride Mayo 1kg', price: 380, unit: 'per jar', categorySlug: 'condiments' },
  { name: 'Knorr Chicken Cube 12pcs', price: 120, unit: 'per box', categorySlug: 'condiments', isFeatured: true },
  { name: 'Soya Supreme Oil 5L', price: 2800, unit: 'per can', categorySlug: 'condiments' },
  // Bakery
  { name: 'Bake Parlour White Bread', price: 90, unit: 'per loaf', categorySlug: 'bakery', isFeatured: true },
  { name: 'English Muffins 6pcs', price: 150, unit: 'per pack', categorySlug: 'bakery' },
  { name: 'Croissant 2pcs', price: 120, unit: 'per pack', categorySlug: 'bakery' },
  // Dairy & Eggs
  { name: 'Nestlé Milk Pak 1L', price: 180, unit: 'per carton', categorySlug: 'dairy-eggs', isFeatured: true },
  { name: 'Eggs 12pcs', price: 260, unit: 'per dozen', categorySlug: 'dairy-eggs', isFeatured: true },
  { name: 'Olper\'s Cream 200ml', price: 120, unit: 'per pack', categorySlug: 'dairy-eggs' },
  { name: 'Cheddar Cheese 200g', price: 450, unit: 'per pack', categorySlug: 'dairy-eggs' },
  { name: 'Yogurt 1kg', price: 180, unit: 'per pack', categorySlug: 'dairy-eggs' },
  // Milk
  { name: 'Olper\'s Milk 1L', price: 170, unit: 'per carton', categorySlug: 'milk' },
  { name: 'Good Milk 1.5L', price: 230, unit: 'per bottle', categorySlug: 'milk' },
  // Ice Cream
  { name: 'Wall\'s Magnum Classic', price: 180, unit: 'per bar', categorySlug: 'ice-cream', isFeatured: true },
  { name: 'Omore Vanilla Tub 1L', price: 550, unit: 'per tub', categorySlug: 'ice-cream' },
  // Deli
  { name: 'Chicken Shawarma Roll', price: 250, unit: 'per piece', categorySlug: 'deli', isFeatured: true },
  { name: 'Beef Burger Patty 4pcs', price: 380, unit: 'per pack', categorySlug: 'deli' },
  // Ready to Eat
  { name: 'Shan Biryani Mix', price: 120, unit: 'per pack', categorySlug: 'ready-to-eat' },
  { name: 'Cup Noodles Masala', price: 80, unit: 'per cup', categorySlug: 'ready-to-eat', isFeatured: true },
  // Cooking & Baking
  { name: 'Fortune Rice 5kg', price: 1100, unit: 'per bag', categorySlug: 'cooking-baking', isFeatured: true },
  { name: 'Pillsbury Cake Mix', price: 350, unit: 'per pack', categorySlug: 'cooking-baking' },
  { name: 'National Salt 1kg', price: 80, unit: 'per pack', categorySlug: 'cooking-baking' },
  { name: 'Rafhan Corn Oil 3L', price: 1650, unit: 'per bottle', categorySlug: 'cooking-baking' },
];

async function main() {
  console.log('Seeding database...');

  // Admin user
  const adminHash = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { phone: '03001234567' },
    update: {},
    create: {
      name: 'Speedo Admin',
      phone: '03001234567',
      email: 'admin@speedo.pk',
      passwordHash: adminHash,
      role: 'ADMIN',
    },
  });

  // Test customer
  const customerHash = await bcrypt.hash('Test@123', 10);
  const customer = await prisma.user.upsert({
    where: { phone: '03111234567' },
    update: {},
    create: {
      name: 'Test Customer',
      phone: '03111234567',
      email: 'customer@test.com',
      passwordHash: customerHash,
      role: 'CUSTOMER',
    },
  });

  // Add default address for customer
  await prisma.address.upsert({
    where: { id: 'default-address-1' },
    update: {},
    create: {
      id: 'default-address-1',
      userId: customer.id,
      label: 'Home',
      street: 'Main Bazaar Road',
      area: 'Dipalpur',
      city: 'Okara',
      isDefault: true,
    },
  });

  // Categories
  const categoryMap = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryMap[cat.slug] = created.id;
  }

  // Products
  for (const prod of products) {
    const { categorySlug, ...rest } = prod;
    await prisma.product.create({
      data: {
        ...rest,
        price: rest.price,
        categoryId: categoryMap[categorySlug],
      },
    }).catch(() => {});
  }

  // Banners
  await prisma.banner.createMany({
    skipDuplicates: true,
    data: [
      { title: 'Fresh Groceries Delivered in 40 Mins', image: '/banners/banner1.jpg', sortOrder: 1 },
      { title: 'Grocery Essentials - Order Now', image: '/banners/banner2.jpg', sortOrder: 2 },
      { title: 'Medicines Delivered to Your Door', image: '/banners/banner3.jpg', sortOrder: 3 },
    ],
  });

  // Pricing rules
  await prisma.pricingRule.upsert({
    where: { key: 'delivery_fee' },
    update: {},
    create: { key: 'delivery_fee', value: 50, label: 'Delivery Fee' },
  });
  await prisma.pricingRule.upsert({
    where: { key: 'service_charge' },
    update: {},
    create: { key: 'service_charge', value: 20, label: 'Service Charge' },
  });

  console.log('✅ Seed complete!');
  console.log('Admin: 03001234567 / Admin@123');
  console.log('Customer: 03111234567 / Test@123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
