// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');
const hash = require('../../src/hash');

describe('GET /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('test123', 'test123');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  // Returns the correct set of fragments for an ownerId
  test('get a correctly sized array of fragments for an authenticated user', async () => {
    await request(app)
      .post('/v1/fragments')
      .set('content-type', 'text/plain')
      .auth('test123', 'test123')
      .send('Hello World')
      .then(async () => {
        const res = await request(app).get('/v1/fragments').auth('test123', 'test123');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
        expect(res.body.fragments.length).toBe(1);
      });

    await request(app)
      .post('/v1/fragments')
      .set('content-type', 'text/plain')
      .auth('test123', 'test123')
      .send('Hello World2')
      .then(async () => {
        const res = await request(app).get('/v1/fragments').auth('test123', 'test123');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
        expect(res.body.fragments.length).toBe(2);
      });
  });

  test('expanded get includes the correct data for each fragment', async () => {
    await request(app)
      .post('/v1/fragments')
      .set('content-type', 'text/plain')
      .auth('test123', 'test123')
      .send('Hello World')
      .then(async () => {
        const res = await request(app).get('/v1/fragments?expand=1').auth('test123', 'test123');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
        expect(res.body.fragments.length).toBe(3);
        expect(res.body.fragments[0].ownerId).toBe(hash('test123'));
        expect(res.body.fragments[0].created).not.toBe(undefined);
        expect(res.body.fragments[0].updated).not.toBe(undefined);
        expect(res.body.fragments[0].type).toBe('text/plain');
        expect(res.body.fragments[0].size).toBe(11);
        expect(res.body.fragments[1].ownerId).toBe(hash('test123'));
        expect(res.body.fragments[1].created).not.toBe(undefined);
        expect(res.body.fragments[1].updated).not.toBe(undefined);
        expect(res.body.fragments[1].type).toBe('text/plain');
        expect(res.body.fragments[1].size).toBe(12);
        expect(res.body.fragments[2].ownerId).toBe(hash('test123'));
        expect(res.body.fragments[2].created).not.toBe(undefined);
        expect(res.body.fragments[2].updated).not.toBe(undefined);
        expect(res.body.fragments[2].type).toBe('text/plain');
        expect(res.body.fragments[2].size).toBe(11);
      });
  });

  test('get only includes an array of fragment IDs', async () => {
    const res = await request(app).get('/v1/fragments').auth('test123', 'test123');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.fragments[2]).toBe('string');
  });

  test('expanded not equal to one results in unexpanded results', async () => {
    const res = await request(app).get('/v1/fragments?expanded=2').auth('test123', 'test123');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.fragments[2]).toBe('string');
  });
});
