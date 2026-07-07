const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_DB;
    if (!mongoUri) {
      console.error('MONGO_DB environment variable is missing in .env');
      process.exit(1);
    }

    console.log('Connecting to MongoDB Atlas to seed admin...');
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const email = 'admin@gmail.com';
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log(`Admin user with email ${email} already exists! Checking role and updating password...`);
      existingAdmin.role = 'Admin';
      existingAdmin.name = 'System Administrator';
      // Set plain password; Mongoose pre('save') hook will hash it exactly once
      existingAdmin.password = 'admin123';
      await existingAdmin.save();
      console.log('Admin password updated successfully to "admin123".');
    } else {
      console.log('Admin user not found. Creating new admin user...');
      // Use plain password; Mongoose pre('save') hook will hash it exactly once
      await User.create({
        name: 'System Administrator',
        email: email,
        password: 'admin123',
        phone: 9999999999,
        role: 'Admin'
      });
      console.log('New admin user registered successfully!');
    }

    mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
