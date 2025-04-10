import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { TicketEvent } from '../entities/ticket_event.entity';
import { Event } from '../entities/event.entity';
import { nanoid } from 'nanoid';
import { Ticket } from '../entities/ticket.entity';
import * as fs from 'fs';
import * as path from 'path';
import { seedMaster } from '../data';

export class TicketEvent1743778167571 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const ticketEventRepository = dataSource.getRepository(TicketEvent);
    const eventRepository = dataSource.getRepository(Event);
    const ticketRepository = dataSource.getRepository(Ticket);

    // Fetch events and organization tickets
    const events = await eventRepository.find();
    const tickets = await ticketRepository.find();
    const eventIds = events.map((event) => event.id);
    const ticketIds = tickets.map((ticket) => ticket.id);

    const ticketEvents = [
      {
        id: nanoid(16),
        event_id: eventIds[0],
        ticket_id: ticketIds[0],
      },
      {
        id: nanoid(16),
        event_id: eventIds[0],
        ticket_id: ticketIds[1],
      },
      {
        id: nanoid(16),
        event_id: eventIds[1],
        ticket_id: ticketIds[0],
      },
      {
        id: nanoid(16),
        event_id: eventIds[1],
        ticket_id: ticketIds[1],
      },
    ];

    await ticketEventRepository.insert(ticketEvents);
    const ticketsWithEvents = await ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.ticketEvents', 'ticketEvent')
      .where('ticketEvent.event_id = :eventId', { eventId: eventIds[0] })
      .orderBy('ticket.price', 'DESC')
      .getMany();
    const ticketWithEventIds = ticketsWithEvents.map((ticket) => ticket.id);

    if (ticketWithEventIds.length > 0) {
      const filePath = path.resolve(__dirname, '../data/event_seat.json');

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const jsonData = JSON.parse(fileContent);
      const seatMapData = JSON.parse(seedMaster.event_seats.seat_map_data);
      const filteredSeatMapData = seatMapData.filter(
        (seat) =>
          seat.row === 'A' ||
          seat.row === 'B' ||
          seat.row === 'C' ||
          seat.row === 'D' ||
          seat.row === 'E',
      );
      filteredSeatMapData.forEach((seat) => {
        seat.ticket_id = ticketWithEventIds[0];
      });
      const remainingSeatMapData = seatMapData.filter(
        (seat) =>
          seat.row !== 'A' &&
          seat.row !== 'B' &&
          seat.row !== 'C' &&
          seat.row !== 'D' &&
          seat.row !== 'E',
      );
      remainingSeatMapData.forEach((seat) => {
        seat.ticket_id = ticketWithEventIds[1];
      });
      const updatedSeatMapData = [
        ...filteredSeatMapData,
        ...remainingSeatMapData,
      ];
      jsonData.seat_map_data = JSON.stringify(updatedSeatMapData);

      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf-8');
    }
  }
}
