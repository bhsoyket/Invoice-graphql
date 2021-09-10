process.env.NODE_ENV = 'test';

const server = require('../index');
const chai = require('chai');
const { assert } = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);
require('dotenv').config()
const url = `http://localhost:4000`;
const request = require('supertest')(url);

describe('Test user data', () => {
    it('Returns user by id', (done) => {
        request.post('/graphql/query')
        .send({ query: `{
			user(id: "613a55d888623939fbb4d5ad") {
			  name
			  email
			}
		  }`})
        .expect(200)
        .end((err,res) => {
			assert.equal(res.status, 200, 'Http response code is 200');
			assert.isNull(err, 'Promise error is null');
			assert.isObject(res.body.data, 'Data is object');
			assert.isObject(res.body.data.user, 'Data is object');
    		assert.exists(res.body.data.user.name, 'name exist');
    		assert.exists(res.body.data.user.email, 'email exist');
			done();
        })
    })

    it('Returns all users', (done) => {
        request.post('/graphql/query')
        .send({ query: '{ users { name email } }' })
        .expect(200)
        .end((err, res) => {
            assert.equal(res.status, 200, 'Http response code is 200');
			assert.isNull(err, 'Promise error is null');
			assert.isObject(res.body.data, 'Data is object');
			assert.isArray(res.body.data.users, 'Data.users should be an array');
			assert.isObject(res.body.data.users[0], 'Data is object');
    		assert.exists(res.body.data.users[0].name, 'name exist');
    		assert.exists(res.body.data.users[0].email, 'email exist');
			done();
        })  
    })

    it('Returns all customers', (done) => {
        request.post('/graphql/query')
        .send({ query: '{ customers { name email } }' })
        .expect(200)
        .end((err, res) => {
            assert.equal(res.status, 200, 'Http response code is 200');
			assert.isNull(err, 'Promise error is null');
			assert.isObject(res.body.data, 'Data is object');
			assert.isArray(res.body.data.customers, 'Data.customers should be an array');
			assert.isObject(res.body.data.customers[0], 'Data is object');
    		assert.exists(res.body.data.customers[0].name, 'name exist');
    		assert.exists(res.body.data.customers[0].email, 'email exist');
			done();
        })  
    })
});
