import express from 'express';
import { requireAuth, validateRequest, NotFoundError, OrderStatus, BadRequestError } from '@elalemtickets/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Ticket, TicketDoc } from '../models/ticket';
import { Order } from '../models/order';
import { natsWrapper } from '../nats-wrapper';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';

const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 15 * 60;
router.post(
  '/api/orders',
  requireAuth,
  body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input)) // coupling service to ids from a mongodb only
    .withMessage('TicketId must be provided'),
  async (req, res) => {
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }
    
    if (await ticket.isReserved()) {
      throw new BadRequestError('Ticket is already reserved');
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = Order.build({
      expiresAt: expiration,
      ticket,
      status: OrderStatus.Created,
      userId: req.currentUser!.id
    });

    await order.save();

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      version: order.version,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      }
    });
    
    res.status(201).send(order);
});

export { router as newOrderRouter };