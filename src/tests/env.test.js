process.env.NODE_ENV	=	'test';
const { assert } = require('chai');
require('dotenv').config()

describe('ENV Test Suite', () => {
	describe('Testing .evn file to pass', () => {
		it('Should check DEBUGGER PORT exist in env', () => {
			assert.exists(process.env.PORT, 'DEBUGGER PORT exists.');
		});
		it('Should check MONGODB URI exist in env', () => {
			assert.exists(process.env.MONGODB_URI, 'MONGODB URI exists.');
		});
		it('Should check GOOGLE CLIENT ID exist in env', () => {
			assert.exists(process.env.GOOGLE_CLIENT_ID, 'GOOGLE CLIENT ID exists.');
		});
		it('Should check GOOGLE CLIENT SECRET exist in env', () => {
			assert.exists(process.env.GOOGLE_CLIENT_SECRET, 'GOOGLE CLIENT SECRET exists.');
		});
		it('Should check GOOGLE CALLBACK URL exist in env', () => {
			assert.exists(process.env.GOOGLE_CALLBACK_URL, 'GOOGLE CALLBACK URL exists.');
		});
	});
});