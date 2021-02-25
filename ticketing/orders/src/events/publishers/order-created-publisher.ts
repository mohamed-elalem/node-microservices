import { Publisher, OrderCreatedEvent, Subjects } from "@elalemtickets/common";


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
