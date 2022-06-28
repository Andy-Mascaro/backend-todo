const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const fakeClient = {
  email: 'fake@fake.com',
  password: '111111',
};

describe('clients', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('should create new client,', async () => {
    const resp = await (
      await request(app).post('/api/v1/clients')
    ).setEncoding(fakeClient);
    const { email } = fakeClient;

    expect(resp.body).toEqual({
      id: expect.any(String),
      email,
    });
  });

  afterAll(() => {
    pool.end();
  });
});
