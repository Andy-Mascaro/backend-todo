const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const ClientService = require('../lib/services/ClientService');
const Todo = require('../lib/models/Todo');

const signAndLogin = async (clientProps = {}) => {
  const password = clientProps.password ?? fakeClient.password;
  const agent = request.agent(app);
  const client = await ClientService.create({ ...fakeClient, ...clientProps });
  const { email } = client;
  await agent.post('/api/v1/clients/sessions').send({ email, password });
  return [agent, client];
};

const fakeClient = {
  firstName: 'Bob',
  lastName: 'Bigboy',
  email: 'test@example.com',
  password: '123456',
};
const fakeClient2 = {
  firstName: 'Tod',
  lastName: 'Toadstool',
  email: 'test2@example.com',
  password: '123456',
};

describe('todos', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('Get /api/v1/todos creates a new todo item for current client', async () => {
    const [agent] = await signAndLogin();
    const newTodo = { description: 'Paint fence' };
    const resp = await agent.post('/api/v1/todos/').send(newTodo);
    expect(resp.body).toEqual({
      id: expect.any(String),
      description: newTodo.description,
      client_id: expect.any(String),
      completed: false,
    });
  });

  it('Should return all current clients todos', async () => {
    const [agent, client] = await signAndLogin();
    const client2 = await ClientService.create(fakeClient2);
    const clientTodo = await Todo.insert({
      description: 'Workout',
      client_id: client.id,
      completed: false,
    });
    await Todo.insert({
      description: 'Do laundry',
      client_id: client2.id,
      competed: false,
    });
    const resp = await agent.get('/api/v1/todos');
    expect(resp.body).toEqual(clientTodo);
  });

  it('UPDATE /api/v1/todos/:id should update an todo', async () => {
    const [agent, client] = await signAndLogin();
    const todo = await Todo.insert({
      description: 'Workout',
      client_id: client.id,
      completed: false,
    });
    const resp = await agent
      .put(`/api/v1/todos/${todo.id}`)
      .send({ completed: true });
    expect(resp.status).toBe(200);
    expect(resp.body).toEqual({ ...todo, completed: true });
  });

  it('DELETE /api/v1/todos/:id should delete todos from valid client', async () => {
    const [agent, client] = await signAndLogin();
    const todo = await Todo.insert({
      description: 'Workout',
      client_id: client.id,
    });
    const resp = await agent.delete(`/api/v1/todos/${todo.id}`);
    expect(resp.status).toBe(200);
    const remove = await Todo.getById(todo.id);
    expect(remove).toBeNull();
  });

  it('Test to be denied in the .get if not logged in', async () => {
    const data = await request(app).get('/api/v1/todos');
    expect(data.status).toEqual(401);
  });

  afterAll(() => {
    pool.end();
  });
});
