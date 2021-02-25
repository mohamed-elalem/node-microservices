import { TicketCreatedEvent } from "@elalemtickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import mongoose, { Mongoose } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from "../../../models/ticket";

describe('TicketCreatedListener', () => {
  let listener: TicketCreatedListener;
  let data: TicketCreatedEvent['data'];
  let msg: Message;

  beforeEach(async () => {
    listener = new TicketCreatedListener(natsWrapper.client);
    data = {
      version: 0,
      id: new mongoose.Types.ObjectId().toHexString(),
      userId: new mongoose.Types.ObjectId().toHexString(),
      title: 'concert',
      price: 20
    };

    // @ts-ignore
    msg = {
      ack: jest.fn()
    };
  });

  it('creates and saves a ticket', async () => {
    await listener.onMessage(data, msg);

    const ticket = await Ticket.findById(data.id);
    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
  });

  it('ack the message', async () => {
    await listener.onMessage(data, msg);
    
    expect(msg.ack).toBeCalled();
  });
});