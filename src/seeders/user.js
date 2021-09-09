const faker = require('faker');
const User = require('../models/user');
const userType = require('../constant/user')
const db = require('../db/db');

// connect DB
db.connection().then(() => {
    console.log('database is connected');
}).catch((e) => {
    console.error(e);
});

Array(30)
    .fill(Date.now())
    .map(async (item, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (index));
        const name = faker.name.findName();

        const users = {
            name: faker.name.findName(),
            google_id: faker.datatype.uuid(),
            email: faker.internet.email(),
            image: faker.random.image(),
            userType: [userType.user],
            created_at: date.toISOString(),
            updated_at: date.toISOString(),
        };

        await User.insertMany(users);
        console.log(`inserting user for ${date.toLocaleDateString()}`);
        return { date: date.toISOString() };
    });