import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

describe('show route', () => {

  it('returns 404 if the ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .post(`/api/tickets/${id}`)
      .expect(404);
  });

  it('returns a ticket if the ticket is found', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title: 'title',
        price: 20,
      })
      .expect(201);

    const { id } = response.body;

    const ticketResponse = await request(app)
      .get(`/api/tickets/${id}`)
      .expect(200);

    expect(ticketResponse.body.title).toEqual('title');
    expect(ticketResponse.body.price).toEqual(20);
  })
})