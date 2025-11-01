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
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Bananas',
    description: 'Sweet and creamy bananas, rich in potassium and perfect for breakfast or smoothies.',
    price: 69.00,
    category: 'fruits',
    stock: 50,
    unit: 'kg',
    featured: true,
    image: 'https://images.unsplash.com/photo-1574226516831-e1dff420e38e?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Oranges',
    description: 'Fresh citrus oranges packed with vitamin C. Great for juicing or eating fresh.',
    price: 129.00,
    category: 'fruits',
    stock: 50,
    unit: 'kg',
    featured: false,
    image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Strawberries',
    description: 'Sweet and aromatic strawberries, perfect for desserts or eating fresh.',
    price: 99.00,
    category: 'fruits',
    stock: 500,
    unit: 'g',
    featured: true,
    image: 'https://images.unsplash.com/photo-1437750769469-3b4b2f3c2f0b?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Grapes',
    description: 'Seedless red grapes, sweet and refreshing. Perfect for snacking.',
    price: 149.00,
    category: 'fruits',
    stock: 30,
    unit: 'kg',
    featured: false,
    image: 'https://images.unsplash.com/photo-1568801783698-1ec1e6f03d30?auto=format&fit=crop&w=800&q=60'
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
    image: 'https://images.unsplash.com/photo-1542444459-db3ed4b5e3a6?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Broccoli',
    description: 'Nutritious green broccoli, packed with vitamins and minerals. Perfect for steaming or stir-frying.',
    price: 79.00,
    category: 'vegetables',
    stock: 50,
    unit: 'kg',
    featured: false,
    image: 'https://images.unsplash.com/photo-1617191512170-0b1c5e3e1a9a?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Spinach',
    description: 'Fresh leafy spinach, rich in iron and folate. Great for salads or cooking.',
    price: 69.00,
    category: 'vegetables',
    stock: 500,
    unit: 'g',
    featured: true,
    image: 'https://images.unsplash.com/photo-1542444459-db3ed4b5e3a6?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Tomatoes',
    description: 'Juicy red tomatoes, perfect for salads, cooking, or making sauces.',
    price: 89.00,
    category: 'vegetables',
    stock: 30,
    unit: 'kg',
    featured: false,
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Bell Peppers',
    description: 'Colorful bell peppers, sweet and crunchy. Available in red, yellow, and green.',
    price: 119.00,
    category: 'vegetables',
    stock: 20,
    unit: 'kg',
    featured: true,
    image: 'https://images.unsplash.com/photo-1604908177522-9d3f3e9f8f84?auto=format&fit=crop&w=800&q=60'
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
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e6cb?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Cheddar Cheese',
    description: 'Sharp cheddar cheese, aged to perfection. Great for cooking or snacking.',
    price: 249.00,
    category: 'dairy',
    stock: 500,
    unit: 'g',
    featured: false,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e6cb?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Greek Yogurt',
    description: 'Creamy Greek yogurt, high in protein. Perfect for breakfast or snacks.',
    price: 129.00,
    category: 'dairy',
    stock: 400,
    unit: 'g',
    featured: true,
    image: 'https://images.unsplash.com/photo-1569670522687-6d6a1c3b6f5d?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Butter',
    description: 'Rich and creamy butter, perfect for cooking and baking.',
    price: 199.00,
    category: 'dairy',
    stock: 500,
    unit: 'g',
    featured: false,
    image: 'https://images.unsplash.com/photo-1580913428413-3f4f8a8b3cde?auto=format&fit=crop&w=800&q=60'
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
    image: 'https://images.unsplash.com/photo-1604908177522-9d3f3e9f8f84?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Ground Beef',
    description: 'Fresh ground beef, perfect for burgers, meatballs, or tacos.',
    price: 449.00,
    category: 'meat',
    stock: 30,
    unit: 'kg',
    featured: false,
    image: 'https://images.unsplash.com/photo-1604908177522-9d3f3e9f8f84?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Salmon Fillet',
    description: 'Fresh Atlantic salmon fillet, rich in omega-3 fatty acids.',
    price: 899.00,
    category: 'meat',
    stock: 20,
    unit: 'kg',
    featured: true,
    image: 'https://images.unsplash.com/photo-1561047029-3000e8e3d0ad?auto=format&fit=crop&w=800&q=60'
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
    image: 'https://images.unsplash.com/photo-1542827638-2b12d2f1b7c3?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Croissants',
    description: 'Buttery and flaky croissants, perfect for breakfast or brunch.',
    price: 129.00,
    category: 'bakery',
    stock: 24,
    unit: 'pack',
    featured: false,
    image: 'https://images.unsplash.com/photo-1542827638-2b12d2f1b7c3?auto=format&fit=crop&w=800&q=60'
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
    image: 'https://images.unsplash.com/photo-1571164018491-9f0a6e4a2b3e?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Coffee Beans',
    description: 'Premium coffee beans, roasted to perfection. Great for morning coffee.',
    price: 499.00,
    category: 'beverages',
    stock: 500,
    unit: 'g',
    featured: false,
    image: 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?auto=format&fit=crop&w=800&q=60'
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
    image: 'https://images.unsplash.com/photo-1604908177522-9d3f3e9f8f84?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Granola Bars',
    description: 'Healthy granola bars made with oats, honey, and dried fruits.',
    price: 199.00,
    category: 'snacks',
    stock: 25,
    unit: 'pack',
    featured: false,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=60'
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
    image: 'https://images.unsplash.com/photo-1581579182244-5a5c6f4b28b1?auto=format&fit=crop&w=800&q=60'
  },
  {
    name: 'Dish Soap',
    description: 'Effective dish soap that cuts through grease and leaves dishes sparkling clean.',
    price: 99.00,
    category: 'household',
    stock: 15,
    unit: 'bottle',
    featured: true,
    image: 'https://images.unsplash.com/photo-1581579182244-5a5c6f4b28b1?auto=format&fit=crop&w=800&q=60'
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
