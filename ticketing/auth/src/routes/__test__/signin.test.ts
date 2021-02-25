import request from 'supertest';

import { app } from '../../app';

describe('signin user', () => {
  it('fails when an email that does not exist is supplied', async () => {
    return  request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
        password: '123456'
      })
      .expect(400);
  });

  it('fails when an incorrect password is supplied', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: "test@test.com",
        password: "123456",
      })
      .expect(201);

      await request(app)
        .post('/api/users/signin')
        .send({
          email: "test@test.com",
          password: "1234567"
        })
        .expect(400);
  });

  it('fails when an incorrect password is supplied', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: "test@test.com",
        password: "123456",
      })
      .expect(201);

      const res = await request(app)
        .post('/api/users/signin')
        .send({
          email: "test@test.com",
          password: "123456"
        })
        .expect(200);

      expect(res.get('Set-Cookie')).toBeDefined();
  });
});