import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: T['subject'];
  abstract queueGroupName: string;
  ackWait = 5 * 1000;
  abstract onMessage: (data: T['data'], msg: Message) => void;

  constructor(public client: Stan) {
  }

  get subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    const subscription = this.client.subscribe(this.subject, this.queueGroupName, this.subscriptionOptions);

    subscription.on('message', (msg: Message) => {
      console.log(`
        Message received #${msg.getSequence()}: ${this.subject} / ${this.queueGroupName}
      `);

      const parsedMessage = this.parseMessage(msg);

      this.onMessage(parsedMessage, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();

    return typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString('utf-8'));
  }
}