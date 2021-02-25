import { NotAuthorizedError, NotFoundError, requireAuth } from '@elalemtickets/common';
import express from 'express';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders/:orderId', requireAuth, async (req, res) => {
  const order = await Order.findById(req.params.orderId).populate('ticket');

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser?.id) {
    throw new NotAuthorizedError();
  }

  return res.send(order);
});

export { router as showOrderRouter };