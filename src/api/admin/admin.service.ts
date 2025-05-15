import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from 'src/database/entities/event.entity';
import { Brackets, Repository } from 'typeorm';
import { EVENT_STATUS } from '../common/constants';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async getAllEvents(params: any) {
    const { page = 1, limit = 10, status, type, q } = params;
    const currentPage = parseInt(page.toString(), 10);
    const pageSize = parseInt(limit.toString(), 10);

    const queryBuilder = this.eventRepository
      .createQueryBuilder('event')
      .innerJoinAndSelect('event.organization', 'organization')
      .innerJoinAndSelect('event.category', 'category')
      .innerJoinAndSelect('event.ticketEvents', 'ticketEvent')
      .innerJoinAndSelect('ticketEvent.ticket', 'ticket')
      .innerJoinAndSelect('event.venue', 'venue');

    if (q) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('event.name LIKE :q', { q: `%${q}%` })
            .orWhere('event.description LIKE :q', { q: `%${q}%` })
            .orWhere('category.name LIKE :q', { q: `%${q}%` })
            .orWhere('ticket.name LIKE :q', { q: `%${q}%` })
            .orWhere('venue.name LIKE :q', { q: `%${q}%` });
        }),
      );
    }

    if (status) {
      queryBuilder.andWhere('event.status = :status', { status });
    }

    if (type) {
      if (type === 'upcoming') {
        queryBuilder.andWhere('event.start_datetime > NOW()');
      }

      if (type === 'past') {
        queryBuilder.andWhere('event.start_datetime < NOW()');
      }

      if (type === 'pending') {
        queryBuilder.andWhere('event.status = :status', {
          status: EVENT_STATUS.IN_REVIEW,
        });
      }
    }

    const totalEvents = await queryBuilder.getCount();
    const offset = (currentPage - 1) * pageSize;

    const events = await queryBuilder.skip(offset).take(pageSize).getMany();

    const totalPages = Math.ceil(totalEvents / parseInt(limit));

    const paginations = {
      total: totalEvents,
      limit: parseInt(limit),
      page: parseInt(page),
      current_page: parseInt(page),
      total_page: totalPages,
      has_next_page: parseInt(page) < totalPages,
      has_previous_page: parseInt(page) > 1,
      next_page: parseInt(page) < totalPages ? parseInt(page) + 1 : null,
    };

    const items = events.map((event) => ({
      id: event.id,
      name: event.name,
      start_time: event.start_datetime,
      end_time: event.end_datetime,
      poster_url: event.poster_url,
      venue: {
        name: event.venue.name,
        address: event.venue.address,
      },
    }));

    return { items: items, paginations };
  }
}
