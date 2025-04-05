import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { TicketEvent } from '../entities/ticket_event.entity';
import { Event } from '../entities/event.entity';
import { OrganizationTicket } from '../entities/organization_ticket.entity';
import { nanoid } from 'nanoid';

export class TicketEvent1743778167571 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const ticketEventRepository = dataSource.getRepository(TicketEvent);
    const eventRepository = dataSource.getRepository(Event);
    const organizationTicketRepository =
      dataSource.getRepository(OrganizationTicket);

    // Fetch events and organization tickets
    const events = await eventRepository.find();
    const organizationTickets = await organizationTicketRepository.find();
    const eventIds = events.map((event) => event.id);
    const organizationTicketIds = organizationTickets.map(
      (ticket) => ticket.id,
    );

    const ticketEvents = [
      {
        id: nanoid(16),
        event_id: eventIds[0],
        organization_ticket_id: organizationTicketIds[0],
      },
      {
        id: nanoid(16),
        event_id: eventIds[1],
        organization_ticket_id: organizationTicketIds[1],
      },
    ];

    await ticketEventRepository.insert(ticketEvents);
  }
}
