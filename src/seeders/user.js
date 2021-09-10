const faker = require('faker');
const User = require('../models/User');
const db = require('../db/db');

// connect DB
db.connection().then(() => {
    console.log('database is connected');
}).catch((e) => {
    console.error(e);
});

Array(10)
    .fill(Date.now())
    .map(async (item, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (index));
        const name = faker.name.findName();

        const users = {
            name: faker.name.findName(),
            email: faker.internet.email(),
            phone: faker.random.phone(),
            image: faker.random.image(),
            google_id: faker.datatype.uuid(),
            created_at: date.toISOString(),
            updated_at: date.toISOString(),
        };

        await User.insertMany(users);
        console.log(`inserting user for ${date.toLocaleDateString()}`);
        return { date: date.toISOString() };
    });