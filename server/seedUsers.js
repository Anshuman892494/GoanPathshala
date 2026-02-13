const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const connectDB = require('./src/config/db');

dotenv.config();

const seedUsers = async () => {
    try {
        await connectDB();

        console.log('Clearing existing dummy users...');
        await User.deleteMany({ role: 'dummy' });

        console.log('Generating 100 dummy users...');
        const users = [];
        for (let i = 1; i <= 100; i++) {
            users.push({
                username: `user_${i}`,
                role: 'dummy'
            });
        }

        await User.insertMany(users);

        console.log('100 Dummy users seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
};

seedUsers();
