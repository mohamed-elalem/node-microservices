import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';


describe('tickets', () => {
  it('has a route handler that listens to /api/tickets for post requests', async () => {
    const response = await request(app)
      .post('/api/tickets');

    expect(response.status).not.toEqual(404);
  });

  it('can only be accessed if the user signed in', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
    
    expect(response.status).not.toEqual(401);
  });

  it('returns a status other than 401 if the user is signed in', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin());

    expect(response.status).not.toEqual(401);
  });

  it('it returns an error if invalid title is provided', async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title: '',
        price: 10
      }).expect(400);

    return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 10
    }).expect(400);
  });

  it('it returns an error if invalid price is provided', async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title: 'title',
        price: -10
      }).expect(400);

    return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'title'
    }).expect(400);

  });

  it('creates a tickket for valid input', async () => {

    const ticketsCount = await Ticket.estimatedDocumentCount();
    
    expect(ticketsCount).toEqual(0);

    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title: 'title',
        price: 20
      })
      .expect(201);

    expect(await Ticket.estimatedDocumentCount()).toEqual(ticketsCount + 1);

    const ticket = await Ticket.findOne({});

    expect(ticket.title).toEqual('title');
    expect(ticket.price).toEqual(20);
  });

  it('publishes an event', async () => {
    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'title',
      price: 20
    })
    .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});