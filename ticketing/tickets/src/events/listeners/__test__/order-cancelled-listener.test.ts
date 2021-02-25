import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent } from "@elalemtickets/common";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: 'knfknf',
  });

  ticket.orderId = new mongoose.Types.ObjectId().toHexString();

  await ticket.save();

  const data: OrderCancelledEvent['data'] = {
    id: ticket.orderId,
    ticket: {
      id: ticket.id
    },
    version: ticket.version
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return {
    msg,
    ticket,
    listener,
    data
  };
};

describe('OrderCancelledListener', () => {
  it('updates the ticket and publishes an event and acks the message', async () => {
    const { listener, data, ticket, msg } = await setup();
  
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});