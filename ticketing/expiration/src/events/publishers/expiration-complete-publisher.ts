import { ExpirationCompleteEvent, Publisher, Subjects } from "@elalemtickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

}