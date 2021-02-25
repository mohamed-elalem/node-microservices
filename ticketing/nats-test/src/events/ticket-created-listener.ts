import nats, { Subscription } from 'node-nats-streaming';
import { Listener } from "./base-listener";
import { Subjects } from './subjects';
import { TicketCreatedEvent } from './ticket-created-event';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = 'payments-service';
  onMessage: (data: TicketCreatedEvent['data'], msg: nats.Message) => void = (data, msg) => {
    console.log('Event data!', data);

    msg.ack();
  };
  
}