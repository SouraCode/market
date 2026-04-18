const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/grocery-market');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword123';

    // Check if admin exists
    const adminExists = await User.findOne({ email: adminEmail });
    if (adminExists) {
      console.log('Admin already exists');
      // Update password just in case or make sure role is admin
      adminExists.role = 'admin';
      await adminExists.save();
      console.log('Admin role ensured');
    } else {
      const admin = new User({
        name: 'Soura Roy Mahapatra',
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

createAdmin();
