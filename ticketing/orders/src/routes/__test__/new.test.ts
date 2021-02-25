import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

describe('new route', () => {
  it('returns an error if ticket does not exist', async () => {
    const ticketId = mongoose.Types.ObjectId();

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ ticketId })
      .expect(404);
  });

  it('returns an error if ticket is already reserved', async () => {
    const ticket = Ticket.build({
      price: 20,
      title: 'concert'
    });

    await ticket.save();

    const order = Order.build({
      ticket,
      userId: 'knfkndkdnfkn',
      status: OrderStatus.Created,
      expiresAt: new Date(),
    });

    await order.save();

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ ticketId: ticket.id })
      .expect(400);
  });

  it('reserves an error', async () => {
    const ticket = Ticket.build({
      price: 20,
      title: 'concert'
    });

    await ticket.save();

    await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
  
  });

  it('emits created event', async () => {
    const ticket = Ticket.build({
      price: 20,
      title: 'concert'
    });

    await ticket.save();

    await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
    
    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});