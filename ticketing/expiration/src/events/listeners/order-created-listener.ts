import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@elalemtickets/common";
import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../nats-wrapper";
import { expirationQueue } from "../../queues/expiration-queue";
import { ExpirationCompletePublisher } from "../publishers/expiration-complete-publisher";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(`Waiting ${delay}ms to process the job for ${data.id}`);
    
    await expirationQueue.add({ orderId: data.id }, {
      delay,
    });

    msg.ack();
  }
  
}