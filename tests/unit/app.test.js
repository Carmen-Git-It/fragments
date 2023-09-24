const request = require('supertest');

const app = require('../../src/app');

describe('App test', () => {
  test('invalid route returns 404', () => request(app).get('/invalid').expect(404));
});
