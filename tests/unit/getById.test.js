const request = require('supertest');

const app = require('../../src/app');
const contentType = require('content-type');

describe('GET /v1/fragments/:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/1234').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/1234')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  // Using a valid username/password pair should give a success result with fragment data
  test('authenticated users get fragment data', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .set('content-type', 'text/plain')
      .auth('test123', 'test123')
      .send('Hello World');

    const id = res.body.fragment.id;

    res = await request(app).get(`/v1/fragments/${id}`).auth('test123', 'test123');
    expect(res.statusCode).toBe(200);
    expect(contentType.parse(res).type).toBe('text/plain');
    expect(res.text).toBe('Hello World');
  });

  test('content type is correct', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .set('content-type', 'application/json')
      .auth('test123', 'test123')
      .send({ msg: 'test' });

    const id = res.body.fragment.id;

    res = await request(app).get(`/v1/fragments/${id}`).auth('test123', 'test123');
    expect(res.statusCode).toBe(200);
    expect(contentType.parse(res).type).toBe('application/json');
    expect(JSON.stringify(res.body)).toBe(JSON.stringify({ msg: 'test' }));
  });

  // Providing a fragment ID that doesn't belong to the user or does not
  // exist will result in a 404 resource not found error
  test('invalid Fragment id should result in a 404', async () => {
    const res = await request(app).get('/v1/fragments/1234').auth('test123', 'test123');

    expect(res.statusCode).toBe(404);
  });
});
