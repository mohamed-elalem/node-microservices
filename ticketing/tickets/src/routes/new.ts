import express from 'express';
import { currentUser, requireAuth, validateRequest } from '@elalemtickets/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { natsWrapper } from '../nats-wrapper';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';

const router = express.Router();

router.post('/api/tickets',
  requireAuth,
  body('title').not().isEmpty().withMessage('Title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  validateRequest,
  async (req, res) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({title, price, userId: req.currentUser!.id});

    await ticket.save();
    
    const publisher = new TicketCreatedPublisher(natsWrapper.client);

    publisher.publish({
      id: ticket._id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version
    });

    res.status(201).send(ticket);
});

export { router as createTicketRouter }