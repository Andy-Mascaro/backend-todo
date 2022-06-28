const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const ClientService = require('../lib/services/ClientService');

const fakeClient = {
  email: 'fake@fake.com',
  password: '111111',
};

const signAndLogin = async (clientProps = {}) => {
  const password = clientProps.password ?? fakeClient.password;
  const agent = request.agent(app);
  const client = await ClientService.create({ ...fakeClient, ...clientProps });
  const { email } = client;
  await agent.post('/api/v1/client/sessions').send({ email, password });
  return [agent, client];
};

describe('clients', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('should create new client', async () => {
    const resp = await request(app).post('/api/v1/clients').send(fakeClient);
    const { email } = fakeClient;

    expect(resp.body).toEqual({
      id: expect.any(String),
      email,
    });
  });

  it('should return current client', async () => {
    const [agent, client] = await signAndLogin();
    const person = await agent.get('/api/v1/clients/person');
    expect(person.body).toEqual({
      ...client,
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
  });

  afterAll(() => {
    pool.end();
  });
});
