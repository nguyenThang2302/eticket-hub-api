import { Process, Processor } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { SEAT_STATUS } from 'src/api/common/constants';
import { EventSeat } from 'src/database/entities/event_seat.entity';
import { In, Repository } from 'typeorm';

@Processor('holding-seats')
export class SeatProcessor {
  constructor(
    @InjectRepository(EventSeat)
    private readonly eventSeatRepository: Repository<EventSeat>,
  ) {}
  @Process('release-seats')
  async handleRelease(
    job: Job<{ seatIds: string[]; eventId: string; userId: string }>,
  ) {
    const { seatIds, eventId } = job.data;
    await this.eventSeatRepository.update(
      {
        id: In(seatIds),
        event_id: eventId,
        status: SEAT_STATUS.SELECTING,
      },
      {
        status: SEAT_STATUS.AVAILABLE,
      },
    );
  }
}
