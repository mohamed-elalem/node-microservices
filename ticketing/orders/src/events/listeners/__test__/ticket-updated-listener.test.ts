import { TicketUpdatedEvent } from "@elalemtickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket, TicketDoc } from "../../../models/ticket";

describe('TicketUpdatedListener', () => {
  let listener: TicketUpdatedListener;
  let data: TicketUpdatedEvent['data'];
  let msg: Message;
  let ticket: TicketDoc;
  beforeEach(async () => {
    listener = new TicketUpdatedListener(natsWrapper.client);

    ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 20,
      title: 'concert'
    });

    await ticket.save();

    data = {
      version: ticket.version + 1,
      id: ticket.id,
      userId: new mongoose.Types.ObjectId().toHexString(),
      title: 'new concert',
      price: 999
    };

    // @ts-ignore
    msg = {
      ack: jest.fn()
    };
  });

  it('finds, updates, and saves a ticket', async () => {
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);

  });

  it('acks the message', async () => {
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });

  it('does not call ack if the event has a skipped version number', async () => {
    data.version = 10;

    try {
      await listener.onMessage(data, msg);
      fail('should throw Version Error exception');
    } catch (ex) {}

    expect(msg.ack).not.toHaveBeenCalled();
  });
});