import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderTicketImage } from 'src/database/entities/order_ticket_image.entity';
import { Ticket } from 'src/database/entities/ticket.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(OrderTicketImage)
    private readonly orderTicketImageRepository: Repository<OrderTicketImage>,
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

  async verifyQRTicket(code: string, eventId: string) {
    const ticket = await this.orderTicketImageRepository
      .createQueryBuilder('ticket')
      .innerJoinAndSelect('ticket.order', 'order')
      .where('ticket.code = :code', { code })
      .andWhere('order.event_id = :eventId', { eventId })
      .getOne();

    if (!ticket) {
      throw new BadRequestException('TICKET_NOT_FOUND');
    }

    if (ticket.is_scanned) {
      throw new BadRequestException('TICKET_ALREADY_SCANNED');
    }

    ticket.is_scanned = true;
    await this.orderTicketImageRepository.save(ticket);

    return {
      code: ticket.code,
      ticket_name: ticket.ticket_name,
      seat_location: ticket.seat_location,
      qr_ticket_url: ticket.qr_ticket_url,
      price: ticket.price,
    };
  }
}
