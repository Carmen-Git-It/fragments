const request = require('supertest');

const app = require('../../src/app');
const contentType = require('content-type');

describe('PUT /v1/fragments/:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).put('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).put('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('invalid media type results in error and unchanged fragment data', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .set('content-type', 'text/plain')
      .auth('test123', 'test123')
      .send('Hello World');

    const id = res.body.fragment.id;

    res = await request(app)
      .put(`/v1/fragments/${id}`)
      .set('content-type', 'application/json')
      .auth('test123', 'test123')
      .send('Test');

    expect(res.statusCode).toBe(400);

    res = await request(app).get(`/v1/fragments/${id}`).auth('test123', 'test123');
    expect(res.statusCode).toBe(200);
    expect(contentType.parse(res).type).toBe('text/plain');
    expect(res.text).toBe('Hello World');
  });

  test('invalid id results in error', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .set('content-type', 'text/plain')
      .auth('test123', 'test123')
      .send('Hello World');

    res = await request(app)
      .put(`/v1/fragments/abc`)
      .set('content-type', 'text/plain')
      .auth('test123', 'test123')
      .send('Test');

    expect(res.statusCode).toBe(404);
  });

  // Using a valid username/password pair should give a success result with fragment metadata and a location header
  test('authenticated users put a fragment successfully', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .set('content-type', 'text/plain')
      .auth('test123', 'test123')
      .send('Hello World');

    const id = res.body.fragment.id;

    res = await request(app)
      .put(`/v1/fragments/${id}`)
      .set('content-type', 'text/plain')
      .auth('test123', 'test123')
      .send('Test');

    expect(res.statusCode).toBe(200);
    expect(res.body.fragment.id).toBe(id);
    expect(res.body.fragment.updated != res.body.fragment.created).toBe(true);
    expect(res.body.fragment.type.startsWith('text/plain')).toBe(true);
    expect(res.body.fragment.size).toBe('Test'.length);

    res = await request(app).get(`/v1/fragments/${id}`).auth('test123', 'test123');
    expect(res.statusCode).toBe(200);
    expect(contentType.parse(res).type).toBe('text/plain');
    expect(res.text).toBe('Test');
  });
});
