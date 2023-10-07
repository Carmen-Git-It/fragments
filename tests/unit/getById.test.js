const request = require('supertest');

const app = require('../../src/app');
const hash = require('../../src/hash');
const { Fragment } = require('../../src/model/fragment');

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
  test('authenticated users get a fragments array', async () => {
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
            const res = await request(app).get(`/v1/fragments/${id}`).auth('test123', 'test123');
            expect(res.statusCode).toBe(200);
            expect(res.text).not.toBe(undefined);
            console.log(res.text);
            console.log(res.body);
            expect(res.text).toBe('Hello World');
          });
      });
  });

  test('invalid Fragment id should result in a 404', () => {
    request(app)
      .get('/v1/fragments/1234')
      .auth('test123', 'test123')
      .then((res) => {
        expect(res.statusCode).toBe(404);
      });
  });

  // TODO: Add more tests for filetype
});
