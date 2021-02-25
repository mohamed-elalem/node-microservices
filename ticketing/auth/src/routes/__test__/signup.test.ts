import request from 'supertest';
import { app } from '../../app';

describe('signup user', () => {
  it('returns a 201 on successfull signup', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: '123456'
      })
      .expect(201);
  });

  it('returns a 400 on invalid email', async () => {
    return request(app)
    .post('/api/users/signup')
    .send({
      email: 'testtest.com',
      password: '123456'
    })
    .expect(400);
  });
  
  it('returns a 400 on invalid password', async () => {
    return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '1'
    })
    .expect(400);
  });

  it('returns a 400 with missing email and password', async () => {
    return request(app)
    .post('/api/users/signup')
    .send({})
    .expect(400);
  });

  it('disallows duplicate emails', async () => {
    await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '123456'
    })
    .expect(201);

    return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '123456'
    })
    .expect(400);
  });

  it('sets cookie after successful signup', async () => {
    const res = await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: '123456'
      })
      .expect(201);

    expect(res.get('Set-Cookie')).toBeDefined();
  });
});