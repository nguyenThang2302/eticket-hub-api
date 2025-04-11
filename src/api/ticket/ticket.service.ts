import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from 'src/database/entities/ticket.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  async calculateTicketPrice(tickets: any) {
    const listPrice = [];
    for (const ticket of tickets) {
      const ticketPrices = await this.ticketRepository
        .createQueryBuilder('ticket')
        .where('ticket.id = :id', { id: ticket.id })
        .getOne();
      if (!ticketPrices) {
        throw new Error('TICKET_NOT_FOUND');
      }
      listPrice.push(parseInt(ticketPrices.price as unknown as string));
    }

    const totalPrice = listPrice.reduce((acc, price) => {
      return acc + price;
    }, 0);

    return totalPrice;
  }
}
