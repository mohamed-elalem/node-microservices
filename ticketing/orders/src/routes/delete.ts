import { NotAuthorizedError, NotFoundError, requireAuth } from '@elalemtickets/common';
import express from 'express';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { Order, OrderStatus } from '../models/order';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId).populate('ticket');

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser?.id) {
    throw new NotAuthorizedError();
  }

  order.status = OrderStatus.Canceled;

  await order.save();

  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    ticket: {
      id: order.ticket.id
    }
  });

  res.status(204).send(order);
});

export { router as deleteOrderRouter };