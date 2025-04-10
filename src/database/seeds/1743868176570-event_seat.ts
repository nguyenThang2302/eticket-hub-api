import { DataSource, In } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { EventSeat } from '../entities/event_seat.entity';
import { nanoid } from 'nanoid';
import { Event } from '../entities/event.entity';
import { Seat } from '../entities/seat.entity';
import { Ticket } from '../entities/ticket.entity';
import { SEAT_STATUS } from 'src/api/common/constants';

function getRandomSeatStatus(): SEAT_STATUS {
  const statuses = Object.values(SEAT_STATUS);
  return statuses[Math.floor(Math.random() * statuses.length)];
}

export class EventSeat1743868176570 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const eventSeatRepository = dataSource.getRepository(EventSeat);
    const eventRepository = dataSource.getRepository(Event);
    const seatsRepository = dataSource.getRepository(Seat);
    const ticketRepository = dataSource.getRepository(Ticket);

    const events = await eventRepository.find();
    const VIPSeats = await seatsRepository.find({
      where: {
        row: In(['A', 'B', 'C', 'D', 'E']),
      },
    });
    const RegularSeats = await seatsRepository.find({
      where: {
        row: In(['G', 'H', 'I', 'J']),
      },
    });
    const VIPClassTicket = await ticketRepository.find({
      where: { name: 'VIP Class (No children under 8 years old)' },
    });
    const RegularClassTicket = await ticketRepository.find({
      where: { name: 'Regular Class (No children under 8 years old)' },
    });

    for (const event of events) {
      for (const seat of VIPSeats) {
        const eventSeat = {
          id: nanoid(16),
          event_id: event.id,
          ticket_id: VIPClassTicket[0].id,
          row: seat.row,
          label: seat.label,
          type: seat.type,
          status: getRandomSeatStatus(),
          created_at: new Date(),
          updated_at: new Date(),
        };
        await eventSeatRepository.save(eventSeat);
      }

      for (const seat of RegularSeats) {
        const eventSeat = {
          id: nanoid(16),
          event_id: event.id,
          ticket_id: RegularClassTicket[0].id,
          row: seat.row,
          label: seat.label,
          type: seat.type,
          status: getRandomSeatStatus(),
          created_at: new Date(),
          updated_at: new Date(),
        };
        await eventSeatRepository.save(eventSeat);
      }
    }
  }
}
