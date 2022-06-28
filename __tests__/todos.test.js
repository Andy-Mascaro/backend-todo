const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const signAndLogin = async (clientProps = {}) => {
  const password = clientProps.password ?? fakeClient.password;
  const agent = request.agent(app);
  const client = await ClientService.create({ ...fakeClient, ...clientProps });
  const { email } = client;
  await agent.post('/api/v1/clients/sessions').send({ email, password });
  return [agent, client];
};

describe('todos', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('Get /api/v1/todos creates a new todo item for current client', async () => {
    const [agent, client] = await signAndLogin();
    const newTodo = { description: 'Paint fence' };
    const resp = await agent.post('/api/v1/todos').send(newTodo);
    expect(resp.body).toEqual({
      id: expect.any(String),
      description: newTodo.description,
      client_id: client.id,
      completed: false,
    });
  });
  afterAll(() => {
    pool.end();
  });
});
