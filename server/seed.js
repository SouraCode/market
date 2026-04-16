const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const sampleProducts = [
  // Fruits
  {
    name: 'Fresh Apples',
    description: 'Crisp and juicy red apples, perfect for snacking or baking. Grown locally and picked at peak ripeness.',
    price: 199.00,
    category: 'fruits',
    stock: 100,
    unit: 'kg',
    featured: true,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Bananas',
    description: 'Sweet and creamy bananas, rich in potassium and perfect for breakfast or smoothies.',
    price: 69.00,
    category: 'fruits',
    stock: 50,
    unit: 'kg',
    featured: true,
    image: 'https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Oranges',
    description: 'Fresh citrus oranges packed with vitamin C. Great for juicing or eating fresh.',
    price: 129.00,
    category: 'fruits',
    stock: 50,
    unit: 'kg',
    featured: false,
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Strawberries',
    description: 'Sweet and aromatic strawberries, perfect for desserts or eating fresh.',
    price: 99.00,
    category: 'fruits',
    stock: 500,
    unit: 'g',
    featured: true,
    image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Grapes',
    description: 'Seedless red grapes, sweet and refreshing. Perfect for snacking.',
    price: 149.00,
    category: 'fruits',
    stock: 30,
    unit: 'kg',
    featured: false,
    image: 'https://images.unsplash.com/photo-1537640538966-79f36943f303?auto=format&fit=crop&w=800&q=60'
  },

  // Vegetables
  {
    name: 'Fresh Carrots',
    description: 'Crunchy and sweet carrots, rich in beta-carotene. Great for cooking or snacking.',
    price: 49.00,
    category: 'vegetables',
    stock: 80,
    unit: 'kg',
    featured: true,
    image: 'https://images.unsplash.com/photo-1582515073490-39981397c445?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Broccoli',
    description: 'Nutritious green broccoli, packed with vitamins and minerals. Perfect for steaming or stir-frying.',
    price: 79.00,
    category: 'vegetables',
    stock: 50,
    unit: 'kg',
    featured: false,
    image: 'https://images.unsplash.com/photo-1459411621453-7e7715a9b4e8?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Spinach',
    description: 'Fresh leafy spinach, rich in iron and folate. Great for salads or cooking.',
    price: 69.00,
    category: 'vegetables',
    stock: 500,
    unit: 'g',
    featured: true,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Tomatoes',
    description: 'Juicy red tomatoes, perfect for salads, cooking, or making sauces.',
    price: 89.00,
    category: 'vegetables',
    stock: 30,
    unit: 'kg',
    featured: false,
    image: 'https://images.unsplash.com/photo-1546470427-e9e826f4b5e5?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Bell Peppers',
    description: 'Colorful bell peppers, sweet and crunchy. Available in red, yellow, and green.',
    price: 119.00,
    category: 'vegetables',
    stock: 20,
    unit: 'kg',
    featured: true,
    image: 'https://images.unsplash.com/photo-1561136594-7f6846a1cd25?auto=format&fit=crop&w=800&q=60'
  },

  // Dairy
  {
    name: 'Whole Milk',
    description: 'Fresh whole milk from local dairy farms. Rich and creamy.',
    price: 89.00,
    category: 'dairy',
    stock: 50,
    unit: 'liter',
    featured: true,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Cheddar Cheese',
    description: 'Sharp cheddar cheese, aged to perfection. Great for cooking or snacking.',
    price: 249.00,
    category: 'dairy',
    stock: 500,
    unit: 'g',
    featured: false,
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Greek Yogurt',
    description: 'Creamy Greek yogurt, high in protein. Perfect for breakfast or snacks.',
    price: 129.00,
    category: 'dairy',
    stock: 400,
    unit: 'g',
    featured: true,
    image: 'https://images.unsplash.com/photo-1488477304112-4944851de03d?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Butter',
    description: 'Rich and creamy butter, perfect for cooking and baking.',
    price: 199.00,
    category: 'dairy',
    stock: 500,
    unit: 'g',
    featured: false,
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=60'
  },

  // Meat
  {
    name: 'Chicken Breast',
    description: 'Fresh chicken breast, lean and protein-rich. Perfect for grilling or baking.',
    price: 399.00,
    category: 'meat',
    stock: 40,
    unit: 'kg',
    featured: true,
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Ground Beef',
    description: 'Fresh ground beef, perfect for burgers, meatballs, or tacos.',
    price: 449.00,
    category: 'meat',
    stock: 30,
    unit: 'kg',
    featured: false,
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Salmon Fillet',
    description: 'Fresh Atlantic salmon fillet, rich in omega-3 fatty acids.',
    price: 899.00,
    category: 'meat',
    stock: 20,
    unit: 'kg',
    featured: true,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=60'
  },

  // Bakery
  {
    name: 'Fresh Bread',
    description: 'Artisan bread baked daily, crusty on the outside and soft on the inside.',
    price: 79.00,
    category: 'bakery',
    stock: 20,
    unit: 'loaf',
    featured: true,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Croissants',
    description: 'Buttery and flaky croissants, perfect for breakfast or brunch.',
    price: 129.00,
    category: 'bakery',
    stock: 24,
    unit: 'pack',
    featured: false,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=60'
  },

  // Beverages
  {
    name: 'Orange Juice',
    description: 'Freshly squeezed orange juice, rich in vitamin C.',
    price: 149.00,
    category: 'beverages',
    stock: 40,
    unit: 'liter',
    featured: true,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Coffee Beans',
    description: 'Premium coffee beans, roasted to perfection. Great for morning coffee.',
    price: 499.00,
    category: 'beverages',
    stock: 500,
    unit: 'g',
    featured: false,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=60'
  },

  // Snacks
  {
    name: 'Mixed Nuts',
    description: 'Premium mixed nuts, including almonds, walnuts, and cashews.',
    price: 399.00,
    category: 'snacks',
    stock: 500,
    unit: 'g',
    featured: true,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Granola Bars',
    description: 'Healthy granola bars made with oats, honey, and dried fruits.',
    price: 199.00,
    category: 'snacks',
    stock: 25,
    unit: 'pack',
    featured: false,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=60'
  },

  // Household
  {
    name: 'Paper Towels',
    description: 'Absorbent paper towels, perfect for cleaning and spills.',
    price: 249.00,
    category: 'household',
    stock: 20,
    unit: 'pack',
    featured: false,
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031e21f?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Dish Soap',
    description: 'Effective dish soap that cuts through grease and leaves dishes sparkling clean.',
    price: 99.00,
    category: 'household',
    stock: 15,
    unit: 'bottle',
    featured: true,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=60'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    await Product.deleteMany({});
    console.log('Cleared existing products');
    await Product.insertMany(sampleProducts);
    console.log('Inserted sample products');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
