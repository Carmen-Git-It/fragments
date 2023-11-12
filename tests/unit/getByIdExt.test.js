const request = require('supertest');

const app = require('../../src/app');
const contentType = require('content-type');

describe('GET /v1/fragments/:id.ext', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/1234.txt').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/1234.txt')
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

    res = await request(app).get(`/v1/fragments/${id}.txt`).auth('test123', 'test123');

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Hello World');
    expect(contentType.parse(res).type).toBe('text/plain');
  });

  // Providing a fragment ID that doesn't belong to the user or does not
  // exist will result in a 404 resource not found error
  test('invalid Fragment id should result in a 404', async () => {
    await request(app)
      .get('/v1/fragments/1234.txt')
      .auth('test123', 'test123')
      .then((res) => {
        expect(res.statusCode).toBe(404);
      });
  });

  // Will receive a 415 error if filetype extension is invalid or unsupported
  test('invalid filetype will result in error', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .set('content-type', 'text/plain')
      .auth('test123', 'test123')
      .send('Hello World');

    const id = res.body.fragment.id;

    res = await request(app).get(`/v1/fragments/${id}.html`).auth('test123', 'test123');

    expect(res.statusCode).toBe(415);
    expect(contentType.parse(res).type).toBe('application/json');
  });

  // Retrieving the fragment data with a supported filetype
  // will result in valid data with the correct content-header
  test('valid filetype will result in success', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .set('content-type', 'text/html')
      .auth('test123', 'test123')
      .send('<h1>Hello World</h1>');

    const id = res.body.fragment.id;

    res = await request(app).get(`/v1/fragments/${id}.html`).auth('test123', 'test123');

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('<h1>Hello World</h1>');
    expect(contentType.parse(res).type).toBe('text/html');
  });

  test('text/html supports .txt and .html', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .set('content-type', 'text/html')
      .auth('test123', 'test123')
      .send('<h1>Hello World</h1>');

    const id = res.body.fragment.id;

    res = await request(app).get(`/v1/fragments/${id}.html`).auth('test123', 'test123');

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('<h1>Hello World</h1>');
    expect(contentType.parse(res).type).toBe('text/html');

    res = await request(app).get(`/v1/fragments/${id}.txt`).auth('test123', 'test123');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('<h1>Hello World</h1>');
    expect(contentType.parse(res).type).toBe('text/plain');
  });

  test('text/markdown supports .txt, .md, and .html with conversion', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .set('content-type', 'text/markdown')
      .auth('test123', 'test123')
      .send('# Hello World');

    const id = res.body.fragment.id;

    // text/html
    res = await request(app).get(`/v1/fragments/${id}.html`).auth('test123', 'test123');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('<h1>Hello World</h1>\n');
    expect(contentType.parse(res).type).toBe('text/html');

    // text/plain
    res = await request(app).get(`/v1/fragments/${id}.txt`).auth('test123', 'test123');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('# Hello World');
    expect(contentType.parse(res).type).toBe('text/plain');

    // text/markdown
    res = await request(app).get(`/v1/fragments/${id}.md`).auth('test123', 'test123');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('# Hello World');
    expect(contentType.parse(res).type).toBe('text/markdown');
  });

  test('application/json supports .json and .txt', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .set('content-type', 'application/json')
      .auth('test123', 'test123')
      .send({ msg: 'test' });

    const id = res.body.fragment.id;

    // text/html
    res = await request(app).get(`/v1/fragments/${id}.json`).auth('test123', 'test123');
    expect(res.statusCode).toBe(200);
    expect(JSON.stringify(res.body)).toBe(JSON.stringify({ msg: 'test' }));
    expect(contentType.parse(res).type).toBe('application/json');

    // text/plain
    res = await request(app).get(`/v1/fragments/${id}.txt`).auth('test123', 'test123');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('{"msg":"test"}');
    expect(contentType.parse(res).type).toBe('text/plain');
  });
});
