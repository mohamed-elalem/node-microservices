import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@elalemtickets/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

describe('create charge route handler', () => {
  it('returns 404 when purchasing order that does not exist', async() => {
    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin())
      .send({
        token: 'dfknfdkndfknfd',
        orderId: new mongoose.Types.ObjectId().toHexString()
      })
      .expect(404);
  });

  it('returns 401 when purchasing order that does not belong to a user', async() => {
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 20,
      status: OrderStatus.Created,
      userId: new mongoose.Types.ObjectId().toHexString(),
      version: 0
    });

    await order.save();

    request(app)
      .post('/api/payments')
      .set('Cookie', global.signin())
      .send({
        token: 'kdfnkfdnfd',
        orderId: order.id,
      }).expect(401);
  });

  it('returns 400 when purchasing a cancelled order', async() => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 20,
      status: OrderStatus.Canceled,
      userId,
      version: 0
    });

    await order.save();

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin(userId))
      .send({
        token: 'fkdnfdkndf',
        orderId: order.id,
      })
      .expect(400);
  });

  it('returns a 201 with valid inputs', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 100);
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      price,
      status: OrderStatus.Created,
      userId: userId,
      version: 0
    });

    await order.save();

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin(userId))
      .send({
        token: 'tok_visa',
        orderId: order.id,
      })
      .expect(201);

    // expect(stripe.charges.create).toHaveBeenCalled();
    // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    // expect(chargeOptions.source).toEqual('tok_visa');
    // expect(chargeOptions.amount).toEqual(20 * 100);
    // expect(chargeOptions.currency).toEqual('usd');

    // So if we run the tests in parallel it doesn't fail
    const stripeCharges = await stripe.charges.list();
    const stripeCharge = stripeCharges.data.find(charge => charge.amount == price * 100);

    expect(stripeCharge).toBeDefined();
    expect(stripeCharge!.currency).toEqual('usd');
    expect(stripeCharge!.amount).toEqual(price * 100);

    const payment = await Payment.findOne({stripeId: stripeCharge?.id, orderId: order.id});

    expect(payment).not.toBeNull();
  });


});