import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@elalemtickets/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { natsWrapper } from '../nats-wrapper';
import { stripe } from '../stripe';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  body('token').not().isEmpty(),
  body('orderId').not().isEmpty(),
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }


    if (order.status === OrderStatus.Canceled) {
      throw new BadRequestError('Cannot pay for a cancelled order');
    }

    if (order.status === OrderStatus.Complete) {
      throw new BadRequestError('Cannot pay for a completed order');
    }

    const stripeCharge = await stripe.charges.create({
      amount: order.price * 100,
      currency: 'usd',
      source: token,
    });

    const payment = Payment.build({
      orderId: orderId,
      stripeId: stripeCharge.id,
    });

    await payment.save();

    order.status = OrderStatus.Complete;
    order.save();

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({id: payment.id});
  }
);

export { router as createChargeRouter };