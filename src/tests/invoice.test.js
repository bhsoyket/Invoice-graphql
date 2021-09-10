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

describe('Invoice data test', () => {
	it('Returns invoice after create', (done) => {
		request.post('/api/v1/graphql/mutation')
			.send({
				query: `mutation {
			addInvoice(user_id: "613a55d888623939fbb4d5ad", contact_number: "01814949159", address: "yyyyyyyyyyyyyyy", status: "pending", total: 200) {
			  user_id
			  contact_number
			  address
			  status
			  total
			}
		  }`})
			.expect(200)
			.end((err, res) => {
				assert.equal(res.status, 200, 'Http response code is 200');
				assert.isNull(err, 'Promise error is null');
				assert.isObject(res.body.data, 'Data is object');
				assert.isObject(res.body.data.addInvoice, 'Data is object');
				assert.exists(res.body.data.addInvoice.user_id, 'user_id exist');
				assert.exists(res.body.data.addInvoice.address, 'address exist');
				assert.exists(res.body.data.addInvoice.contact_number, 'contact_number exist');
				done();
			})
	})

	it('Returns invoice after update', (done) => {
		request.post('/api/v1/graphql/mutation')
			.send({
				query: `mutation {
			updateInvoiceById(id: "613a55e75739c11cd16abb6b", user_id: "613a55d888623939fbb4d5ad", contact_number: "01814949159", address: "yyyyyyyyyyyyyyy", status: "pending", total: 200) {
			  user_id
			  contact_number
			  address
			  status
			  total
			}
		  }`})
			.expect(200)
			.end((err, res) => {
				assert.equal(res.status, 200, 'Http response code is 200');
				assert.isNull(err, 'Promise error is null');
				assert.isObject(res.body.data, 'Data is object');
				assert.isObject(res.body.data.updateInvoiceById, 'Data is object');
				assert.exists(res.body.data.updateInvoiceById.user_id, 'user_id exist');
				assert.exists(res.body.data.updateInvoiceById.address, 'address exist');
				assert.exists(res.body.data.updateInvoiceById.contact_number, 'contact_number exist');
				done();
			})
	})

	it('Returns invoice by id', (done) => {
		request.post('/graphql/query')
			.send({
				query: `{
			invoice (id: "613a55e75739c11cd16abb6b") {
			  invoice_no
			  user {
				name
				email
				google_id
				phone
			  }
			  total
			}
		  }`})
			.expect(200)
			.end((err, res) => {
				assert.equal(res.status, 200, 'Http response code is 200');
				assert.isNull(err, 'Promise error is null');
				assert.isObject(res.body.data, 'Data is object');
				assert.isObject(res.body.data.invoice, 'Data is object');
				assert.exists(res.body.data.invoice.invoice_no, 'invoice exist');
				assert.exists(res.body.data.invoice.user.name, 'user name exist');
				done();
			})
	})

	it('Returns all invoices', (done) => {
		request.post('/graphql/query')
			.send({
				query: `{
			invoices {
			  invoice_no
			  user {
				name
				email
				google_id
				phone
			  }
			  total
			}
		  }` })
			.expect(200)
			.end((err, res) => {
				assert.equal(res.status, 200, 'Http response code is 200');
				assert.isNull(err, 'Promise error is null');
				assert.isObject(res.body.data, 'Data is object');
				assert.isArray(res.body.data.invoices, 'Data.invoices should be an array');
				assert.isObject(res.body.data.invoices[0], 'Data is object');
				assert.exists(res.body.data.invoices[0].invoice_no, 'invoice exist');
				assert.exists(res.body.data.invoices[0].user.name, 'user name exist');
				done();
			})
	})

	it('Returns all invoices with items', (done) => {
		request.post('/graphql/query')
			.send({
				query: `{
			invoiceWithItems {
				invoice_no
				user {
				  name
				  email
				  google_id
				}
				total
				items {
				  name
				  quantity
				  price
				}
			  }
		  }` })
			.expect(200)
			.end((err, res) => {
				assert.equal(res.status, 200, 'Http response code is 200');
				assert.isNull(err, 'Promise error is null');
				assert.isObject(res.body.data, 'Data is object');
				assert.isArray(res.body.data.invoiceWithItems, 'invoiceWithItems should be an array');
				assert.isObject(res.body.data.invoiceWithItems[0], 'Data is object');
				assert.exists(res.body.data.invoiceWithItems[0].invoice_no, 'invoice exist');
				assert.exists(res.body.data.invoiceWithItems[0].user.name, 'user name exist');
				assert.isArray(res.body.data.invoiceWithItems[0].items, 'items should be an array');
				assert.exists(res.body.data.invoiceWithItems[0].items[0].name, 'items name exist');
				done();
			})
	})

	it('Returns one month invoice summary', (done) => {
		request.post('/graphql/query')
			.send({
				query: `{
			summary {
				date
				total_invoice_count
				customers {
					invoice_count
					user {
					name
					email
					google_id
					phone
					}
				}
				}
		  }` })
			.expect(200)
			.end((err, res) => {
				assert.equal(res.status, 200, 'Http response code is 200');
				assert.isNull(err, 'Promise error is null');
				assert.isObject(res.body.data, 'Data is object');
				assert.isArray(res.body.data.summary, 'summary should be an array');
				assert.isObject(res.body.data.summary[0], 'summary 0 index is object');
				assert.exists(res.body.data.summary[0].date, 'date exist');
				assert.exists(res.body.data.summary[0].total_invoice_count, 'total_invoice_count exist');
				assert.isArray(res.body.data.summary[0].customers, 'customers should be an array');
				assert.isObject(res.body.data.summary[0].customers[0], 'customers 0 index is object');
				assert.exists(res.body.data.summary[0].customers[0].invoice_count, 'invoice_count exist');
				assert.exists(res.body.data.summary[0].customers[0].user.name, 'user name exist');
				done();
			})
	})
});
