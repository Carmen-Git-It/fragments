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
            expect(res.text).toBe('Hello World');
          });
      });
  });

  // Providing a fragment ID that doesn't belong to the user or does not
  // exist will result in a 404 resource not found error
  test('invalid Fragment id should result in a 404', async () => {
    await request(app)
      .get('/v1/fragments/1234')
      .auth('test123', 'test123')
      .then((res) => {
        expect(res.statusCode).toBe(404);
      });
  });

  // Will receive a 415 error if filetype extension is invalid or unsupported
  test('invalid filetype will result in error', async () => {
    let id;
    await Fragment.byUser(hash('test123'))
      .then((data) => {
        id = data[0];
      })
      .then(async () => {
        const res = await request(app).get(`/v1/fragments/${id}.mov`).auth('test123', 'test123');
        expect(res.statusCode).toBe(415);
      });
  });

  // Retrieving the fragment data with a supported filetype
  // will result in valid data with the correct content-header
  test('valid filetype will result in success', async () => {
    let id;
    await Fragment.byUser(hash('test123'))
      .then((data) => {
        id = data[0];
        console.log('FRAGMENT ID FOR TXT IN TEST: ' + id);
      })
      .then(async () => {
        const res = await request(app).get(`/v1/fragments/${id}.txt`).auth('test123', 'test123');
        expect(res.statusCode).toBe(200);
        expect(res.get('content-type')).toBe('text/plain; charset=utf-8');
      });
  });
});
