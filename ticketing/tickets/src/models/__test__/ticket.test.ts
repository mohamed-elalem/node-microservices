
import { Ticket } from "../ticket";

describe('Ticket Model', () => {
  it('implements optimistic concurrency', async () => {
    const ticket = Ticket.build({
      title: 'concert',
      price: 5,
      userId: '123',
    });

    await ticket.save();

    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    firstInstance.set({ price: 10 });
    secondInstance.set({ price: 15 });

    await firstInstance.save();

    
    try {
      await secondInstance.save();
      fail('should have thrown version error exception');
    } catch (ex) {}
  });

  it('increments the version number for multiple saves', async () => {
    const ticket = Ticket.build({
      title: 'concert',
      price: 20,
      userId: '123',
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
  });
});