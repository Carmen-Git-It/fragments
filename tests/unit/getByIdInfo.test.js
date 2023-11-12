const request = require('supertest');

const app = require('../../src/app');
const hash = require('../../src/hash');
const { Fragment } = require('../../src/model/fragment');

describe('GET /v1/fragments/:id/info', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/1234/info').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/1234/info')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  // Using a valid username/password pair should give a success result with fragment data
  test('authenticated users get fragment metadata', async () => {
    let id;
    await request(app)
      .post('/v1/fragments')
      .set('content-type', 'text/plain')
      .auth('test123', 'test123')
      .send('Hello World')
      .then(() => {
        Fragment.byUser(hash('test123'))
          .then((data) => {
            id = data[0];
          })
          .then(async () => {
            const res = await request(app)
              .get(`/v1/fragments/${id}/info`)
              .auth('test123', 'test123');
            expect(res.statusCode).toBe(200);
            expect(res.body.size).toBe('Hello World'.length);
            expect(res.body.ownerId).toBe(hash('test123'));
            expect(res.body.id).not.toBe(undefined);
          });
      });
  });

  // Providing a fragment ID that doesn't belong to the user or does not
  // exist will result in a 404 resource not found error
  test('invalid Fragment id should result in a 404', async () => {
    await request(app)
      .get('/v1/fragments/1234/info')
      .auth('test123', 'test123')
      .then((res) => {
        expect(res.statusCode).toBe(404);
      });
  });
});
