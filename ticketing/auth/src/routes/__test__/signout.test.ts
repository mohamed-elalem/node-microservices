import supertest from 'supertest';
import request from 'supertest';
import { app } from '../../app';

describe('signout user', () => {
  it ('clears the cookie after signing out', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: '123456',
      })
      .expect(201);

    const res = await request(app)
      .post('/api/users/signout')
      .expect(200);

    expect(res.get('Set-Cookie')).toBeDefined();
  });
})
