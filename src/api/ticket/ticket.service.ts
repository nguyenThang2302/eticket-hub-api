import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from 'src/database/entities/event.entity';
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
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
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

  async verifyQRTicket(code: string) {
    const ticket = await this.orderTicketImageRepository
      .createQueryBuilder('ticket')
      .innerJoinAndSelect('ticket.order', 'order')
      .where('ticket.code = :code', { code })
      .getOne();

    if (!ticket) {
      throw new BadRequestException('TICKET_NOT_FOUND');
    }
    if (ticket.is_scanned) {
      throw new BadRequestException('TICKET_ALREADY_SCANNED');
    }

    const orderID = ticket.order_id;

    const event = await this.eventRepository
      .createQueryBuilder('event')
      .innerJoinAndSelect('event.orders', 'order')
      .where('order.id = :id', { id: orderID })
      .getOne();

    if (!event.allow_scan_ticket) {
      throw new BadRequestException('TICKET_NOT_ALLOW_SCAN');
    }

    ticket.is_scanned = true;
    await this.orderTicketImageRepository.save(ticket);

    return {
      code: ticket.code,
      ticket_name: ticket.ticket_name,
      seat_location: ticket.seat_location,
      qr_ticket_url: ticket.qr_ticket_url,
      price: ticket.price,
      event: {
        name: event.name,
        start_datetime: event.start_datetime,
      },
    };
  }

  async getTickets(organizeId: string, eventId: string) {
    const tickets = await this.ticketRepository
      .createQueryBuilder('ticket')
      .innerJoinAndSelect('ticket.ticketEvents', 'ticketEvent')
      .innerJoinAndSelect('ticketEvent.event', 'event')
      .where('event.organization_id = :organizeId', { organizeId })
      .andWhere('event.id = :eventId', { eventId })
      .getMany();

    const items = tickets.map((ticket) => ({
      id: ticket.id,
      name: ticket.name,
      price: ticket.price,
      quantity: ticket.quantity,
    }));

    return { items: items };
  }
}
