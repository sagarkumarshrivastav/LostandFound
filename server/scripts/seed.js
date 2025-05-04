
require('dotenv').config({ path: '../.env' }); // Load .env from the parent directory
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const connectDB = require('../config/db');
const User = require('../models/User');
const Item = require('../models/Item');

// Sample Data
const usersData = [
    {
        displayName: 'Alice Smith',
        email: 'alice@example.com',
        password: 'password123', // Plain text password, will be hashed
        address: {
            street: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zip: '12345',
            country: 'USA',
        },
        photoURL: 'https://picsum.photos/seed/alice/200/200',
    },
    {
        displayName: 'Bob Johnson',
        email: 'bob@example.com',
        password: 'password123',
        phoneNumber: '+15551234567',
         address: {
            street: '456 Oak Ave',
            city: 'Someville',
            state: 'NY',
            zip: '54321',
            country: 'USA',
        },
        photoURL: 'https://picsum.photos/seed/bob/200/200',
    },
    {
        displayName: 'Charlie Brown',
        email: 'charlie@example.com',
        password: 'password123',
        photoURL: 'https://picsum.photos/seed/charlie/200/200', // Placeholder
    },
];

const itemsData = (userIds) => [
    {
        user: userIds[0], // Alice
        type: 'lost',
        title: 'Lost Black Leather Wallet',
        description: 'Lost my black leather wallet near the city park fountain. Contains ID and credit cards.',
        imageUrl: 'https://picsum.photos/seed/wallet/400/300',
        location: 'City Park Fountain Area, Anytown, CA',
        dateLostOrFound: new Date('2024-04-28T14:00:00.000Z'),
    },
    {
        user: userIds[1], // Bob
        type: 'found',
        title: 'Found Set of Keys',
        description: 'Found a set of keys with a blue keychain on the subway platform (Oak St Station).',
        imageUrl: 'https://picsum.photos/seed/keys/400/300',
        location: 'Oak St Subway Station, Someville, NY',
        dateLostOrFound: new Date('2024-05-01T09:30:00.000Z'),
    },
    {
        user: userIds[0], // Alice
        type: 'found',
        title: 'Found Brown Teddy Bear',
        description: 'Found a small brown teddy bear left on a bench at the playground.',
        location: 'Playground, Anytown, CA',
        dateLostOrFound: new Date('2024-05-02T16:15:00.000Z'),
    },
     {
        user: userIds[2], // Charlie
        type: 'lost',
        title: 'Lost Blue Umbrella',
        description: 'Left my large blue umbrella on the bus (Route 5) this morning.',
        location: 'Bus Route 5',
        dateLostOrFound: new Date('2024-05-03T08:45:00.000Z'),
    },
];

// --- Seeding Functions ---

const importData = async () => {
    try {
        // Clear existing data
        await User.deleteMany();
        await Item.deleteMany();
        console.log('Existing data cleared...');

        // Hash passwords before creating users
        const createdUsersData = await Promise.all(usersData.map(async (userData) => {
            // Note: The pre-save hook in the User model handles hashing automatically
            // We just need to pass the plain password here.
            return { ...userData }; // Spread to avoid modifying original array
        }));

        // Insert users
        const createdUsers = await User.insertMany(createdUsersData);
        console.log(`${createdUsers.length} Users Imported...`);

        // Get user IDs
        const userIds = createdUsers.map(user => user._id);

        // Prepare items with user IDs
        const sampleItems = itemsData(userIds);

        // Insert items
        const createdItems = await Item.insertMany(sampleItems);
        console.log(`${createdItems.length} Items Imported...`);

        console.log('Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
};

const deleteData = async () => {
    try {
        await User.deleteMany();
        await Item.deleteMany();
        console.log('Data Destroyed Successfully!');
        process.exit();
    } catch (error) {
        console.error('Error destroying data:', error);
        process.exit(1);
    }
};

// --- Main Execution ---

const runSeed = async () => {
    await connectDB(); // Establish database connection

    if (process.argv[2] === '--delete') {
        await deleteData();
    } else if (process.argv[2] === '--import') {
        await importData();
    } else {
        console.log('Please use --import or --delete flag.');
        process.exit();
    }
};

runSeed();
