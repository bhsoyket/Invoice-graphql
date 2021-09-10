process.env.NODE_ENV = 'test';

const server = require('../index');
const chai = require('chai');
const { assert } = require('chai');
const chaiHttp = require('chai-http');
const User = require('../models/User');
const mongoose = require('mongoose');
const expect = chai.expect;

chai.use(chaiHttp);
require('dotenv').config()
const url = `http://localhost:4000`;
const request = require('supertest')(url);
let user;
let invoiceItem;

beforeEach(async () => {
	user = await User.findOne().lean();
	if (!user) {
		user = await User.create({
			google_id: '116283247407139549681',
			name: 'Belayet',
			email: 'belayet@gmail.com',
			phone: '123-456-565',
		});
	}
});

describe('Invoice item data test', () => {
    it('Returns invoice item after create', (done) => {
        request.post('/api/v1/graphql/mutation')
        .send({ query: `mutation {
            addItem(invoice: "613b30d418945e99e8a14452", name: "gggggggggg", quantity: 2, price: 100) {
              invoice
              name
              quantity
              price
            }
          }`})
        .expect(200)
        .end((err,res) => {
			assert.equal(res.status, 200, 'Http response code is 200');
			assert.isNull(err, 'Promise error is null');
			assert.isObject(res.body.data, 'Data is object');
			assert.isObject(res.body.data.addItem, 'Data is object');
    		assert.exists(res.body.data.addItem.invoice, 'invoice exist');
    		assert.exists(res.body.data.addItem.name, 'name exist');
    		assert.exists(res.body.data.addItem.quantity, 'quantity exist');
    		assert.exists(res.body.data.addItem.price, 'price exist');
			done();
        })
    })

    it('Returns invoice item after update', (done) => {
        request.post('/api/v1/graphql/mutation')
        .send({ query: `mutation {
            updateItemById(id: "613b3a465858fd6978e641ee", invoice: "613b30d418945e99e8a14452", name: "gggggggggg", quantity: 2, price: 100) {
              invoice
              name
              quantity
              price
            }
          }`})
        .expect(200)
        .end((err,res) => {
			assert.equal(res.status, 200, 'Http response code is 200');
			assert.isNull(err, 'Promise error is null');
			assert.isObject(res.body.data, 'Data is object');
			assert.isObject(res.body.data.updateItemById, 'Data is object');
    		assert.exists(res.body.data.updateItemById.invoice, 'invoice exist');
    		assert.exists(res.body.data.updateItemById.name, 'name exist');
    		assert.exists(res.body.data.updateItemById.quantity, 'quantity exist');
    		assert.exists(res.body.data.updateItemById.price, 'price exist');
			done();
        })
    })

    it('Returns invoice item by id', (done) => {
        request.post('/graphql/query')
        .send({ query: `{
            invoiceItem (id: "613a55e95739c11cd16abba0") {
              invoice {
                invoice_no
                user {
                  name
                  email
                  google_id
                  phone
                }
                total
              }
              name
              quantity
              price
            }
          }`})
        .expect(200)
        .end((err,res) => {
			invoiceItem = res.body.data.invoiceItem;
			assert.equal(res.status, 200, 'Http response code is 200');
			assert.isNull(err, 'Promise error is null');
			assert.isObject(res.body.data, 'Data is object');
			assert.isObject(res.body.data.invoiceItem, 'Data.invoiceItem is object');
    		assert.exists(res.body.data.invoiceItem.invoice, 'invoice exist');
    		assert.exists(res.body.data.invoiceItem.name, 'user name exist');
    		assert.exists(res.body.data.invoiceItem.quantity, 'quantity exist');
    		assert.exists(res.body.data.invoiceItem.price, 'price exist');
			done();
        })
    })

    it('Returns all invoiceItems', (done) => {
        request.post('/graphql/query')
        .send({ query: `{
            invoiceItems {
              invoice {
                invoice_no
                user {
                  name
                  email
                  google_id
                  phone
                }
                total
              }
              name
              quantity
              price
            }
          }` })
        .expect(200)
        .end((err, res) => {
            assert.equal(res.status, 200, 'Http response code is 200');
			assert.isNull(err, 'Promise error is null');
			assert.isObject(res.body.data, 'Data is object');
			assert.isArray(res.body.data.invoiceItems, 'Data.invoiceItems should be an array');
			assert.isObject(res.body.data.invoiceItems[0], 'Data is object');
    		assert.exists(res.body.data.invoiceItems[0].invoice, 'invoice exist');
    		assert.exists(res.body.data.invoiceItems[0].name, 'name exist');
    		assert.exists(res.body.data.invoiceItems[0].quantity, 'quantity exist');
    		assert.exists(res.body.data.invoiceItems[0].price, 'price exist');
			done();
        })  
    })
});