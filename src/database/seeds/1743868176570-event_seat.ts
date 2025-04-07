import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { EventSeat } from '../entities/event_seat.entity';
import { seedMaster } from '../data';
import { nanoid } from 'nanoid';
import { Event } from '../entities/event.entity';

export class EventSeat1743868176570 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const eventSeatRepository = dataSource.getRepository(EventSeat);
    const eventRepository = dataSource.getRepository(Event);

    const events = await eventRepository.find();

    for (const event of events) {
      const eventSeats = {
        id: nanoid(16),
        name: seedMaster.event_seats.name,
        event_id: event['id'],
        seat_map_data: seedMaster.event_seats.seat_map_data,
      };

      await eventSeatRepository.insert(eventSeats);
    }
  }
}
