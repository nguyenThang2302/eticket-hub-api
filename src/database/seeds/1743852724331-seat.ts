import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Seat } from '../entities/seat.entity';
import { seedMaster } from '../data';

export class Seat1743852724331 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const seatRepository = dataSource.getRepository(Seat);

    const seats = seedMaster.seats.seats.map((seat) => ({
      id: seat.id,
      row: seat.row,
      label: seat.label,
      type: seat.type,
      status: seat.status,
    }));

    await seatRepository.insert(seats);
  }
}
