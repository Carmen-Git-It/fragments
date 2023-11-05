const request = require('supertest');

const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('invalid media type results in error', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('content-type', 'application/invalidtype')
      .auth('test123', 'test123')
      .send('Hello World');
    expect(res.statusCode).toBe(415);
  });

  // Using a valid username/password pair should give a success result with fragment metadata and a location header
  test('authenticated users post a fragment successfully', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('content-type', 'text/plain')
      .auth('test123', 'test123')
      .send('Hello World');
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.get('Location').startsWith('http://')).toBe(true);
    expect(res.body.fragment !== undefined).toBe(true);
    expect(res.body.fragment.size).toBe('Hello World'.length);
  });
});
