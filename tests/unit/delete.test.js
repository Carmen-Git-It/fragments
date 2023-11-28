// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('DELETE /v1/fragments/:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).delete('/v1/fragments/1091010').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .delete('/v1/fragments/123456')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('non-existent fragments should result in 404', async () => {
    await request(app).delete('/v1/fragments/123456').auth('test123', 'test123').expect(404);
  });

  test('existing fragments should be deleted successfully', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .set('content-type', 'text/plain')
      .auth('test123', 'test123')
      .send('Hello World!');

    const id = res.body.fragment.id;

    res = await request(app).delete(`/v1/fragments/${id}`).auth('test123', 'test123').expect(200);

    res = await request(app).get(`/v1/fragments/${id}`).auth('test123', 'test123').expect(404);
  });
});
