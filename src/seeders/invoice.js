const faker = require('faker');
const User = require('../models/User');
const Invoice = require('../models/Invoice');
const InvoiceItem = require('../models/InvoiceItem');
const { invoiceStatus } = require('../constant/invoice')
const db = require('../db/db');

// connect DB
db.connection().then(() => {
  console.log('database is connected');
}).catch((e) => {
  console.error(e);
});

Promise.all(Array(5)
  .fill(Date.now())
  .map(async (item, index) => {
    const users = await User.find().limit(10).lean();

    const date = new Date();
    date.setDate(date.getDate() - (index));
    const userIndex = Math.floor(Math.random() * 8) + 1;
    const user = users[userIndex];
    const items = [
      {
        name: faker.commerce.productName(),
        quantity: faker.datatype.number(),
        price: faker.commerce.price(),
      },
      {
        name: faker.commerce.productName(),
        quantity: faker.datatype.number(),
        price: faker.commerce.price(),
      },
    ];
    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const payload = {
      user_id: user._id,
      address: faker.address.streetAddress(),
      contact_number: faker.phone.phoneNumber(),
      status: invoiceStatus.p,
      total,
      created_at: date,
      updated_at: date,
    };

    const invoice = await Invoice.create(payload);
    const invoiceItems = items.map(invItem => ({ ...invItem, invoice: invoice._id }));

    await InvoiceItem.insertMany(invoiceItems);

    console.log(`inserting invoice for ${date.toLocaleDateString()}`);
    return { date: date.toISOString() };
  }));