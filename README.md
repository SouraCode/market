# GroceryMart - Full Stack Grocery Market Website

A modern, responsive grocery market website built with React, Node.js, Express, and MongoDB. Features include user authentication, product browsing, shopping cart, order management, and a beautiful UI.

## Features

- 🛒 **Product Catalog**: Browse products by category with search functionality
- 👤 **User Authentication**: Register, login, and user profile management
- 🛍️ **Shopping Cart**: Add, remove, and update items in cart
- 📦 **Order Management**: Place orders and track order status
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- 🎨 **Modern UI**: Clean and intuitive user interface
- 🔍 **Search & Filter**: Find products quickly with advanced filtering
- 💳 **Checkout Process**: Complete order placement with address and payment info

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd grocery-market
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/grocery-market
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system. If using MongoDB Atlas, update the `MONGODB_URI` in your `.env` file.

5. **Seed the database**
   ```bash
   cd server
   node seed.js
   ```

6. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

## Project Structure

```
grocery-market/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts (Auth, Cart)
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── index.js           # Server entry point
│   ├── seed.js            # Database seeding script
│   └── package.json
└── package.json           # Root package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `GET /api/products/categories/list` - Get all categories

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:itemId` - Update cart item quantity
- `DELETE /api/cart/remove/:itemId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `POST /api/orders/create` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order

## Usage

1. **Browse Products**: Visit the homepage to see featured products and categories
2. **Search & Filter**: Use the search bar and category filters to find specific products
3. **Add to Cart**: Click "Add to Cart" on any product to add it to your cart
4. **Manage Cart**: View your cart, update quantities, or remove items
5. **Checkout**: Proceed to checkout to place your order
6. **Track Orders**: View your order history and track order status

## Demo Features

- **Sample Data**: The database is seeded with sample products across different categories
- **User Accounts**: Create accounts to save cart items and order history
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Updates**: Cart updates instantly when items are added or removed

## Development

### Running Tests
```bash
# Frontend tests
cd client
npm test

# Backend tests
cd server
npm test
```

### Building for Production
```bash
# Build frontend
cd client
npm run build

# Start production server
cd server
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you have any questions or need help with the project, please open an issue or contact the development team.

---

**Happy Shopping! 🛒**
# market
