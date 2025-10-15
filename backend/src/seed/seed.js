const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/user.model');
const Address = require('../models/address.model');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    // Clear existing data
    await User.deleteMany({});
    await Address.deleteMany({});
    // Create test user
    const testUser = await User.create({
      firebaseUid: 'testuid123',
      name: 'Test User',
      email: 'test@example.com',
      isAdmin: true
    });
    // Create sample public addresses
    const addresses = [
      {
        title: 'Le Bistro du Coin',
        description: 'Cozy little bistro with great food.',
        location: { latitude: 48.8566, longitude: 2.3522 },
        isPublic: true,
        owner: testUser._id
      },
      {
        title: 'Parc de la Tour',
        description: 'Beautiful park near the river.',
        location: { latitude: 48.8530, longitude: 2.3499 },
        isPublic: true,
        owner: testUser._id
      },
      {
        title: 'Librairie Centrale',
        description: 'Wide selection of books.',
        location: { latitude: 48.8584, longitude: 2.2945 },
        isPublic: true,
        owner: testUser._id
      }
    ];
    await Address.insertMany(addresses);
    console.log('Seed data created.');
    process.exit();
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
