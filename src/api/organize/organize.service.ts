/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/database/entities/organization.entity';
import { In, Repository } from 'typeorm';
import { CreateOrganizeDto } from './dto/create-organize.dto';
import {
  EVENT_STATUS,
  REGISTER_ORGANIZATION_STATUS,
} from '../common/constants';
import { Group } from 'src/database/entities/group.entity';
import { Event } from 'src/database/entities/event.entity';
import { UpdateEventRequestDto } from './dto/update-event-organizer.dto';
import { Ticket } from 'src/database/entities/ticket.entity';
import { TicketEvent } from 'src/database/entities/ticket_event.entity';
import { Venue } from 'src/database/entities/venue.entity';
import { Category } from 'src/database/entities/category.entity';
import { MediaService } from '../media/media.service';
import { Order } from 'src/database/entities/order.entity';
import { plainToClass } from 'class-transformer';
import { GetOrderDetailResponseDto } from '../purchase/dto/get-order-detail-response.dto';
import { maskEmail, maskPhoneNumber } from '../utils/helpers';

@Injectable()
export class OrganizeService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizeRepository: Repository<Organization>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(TicketEvent)
    private readonly ticketEventRepository: Repository<TicketEvent>,
    @InjectRepository(Venue)
    private readonly venueRepository: Repository<Venue>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly mediaService: MediaService,
    @InjectRepository(Order)
    private readonly orderRepositoty: Repository<Order>,
  ) {}

  async registerOrganization(
    promoterId: string,
    languageCode: string,
    body: CreateOrganizeDto,
  ): Promise<any> {
    const organization = this.organizeRepository.create({
      lang_code: languageCode,
      name: body.name,
      description: body.description,
      is_active: false,
      status: REGISTER_ORGANIZATION_STATUS.WAITING,
      logo_url: process.env.ORGANNIZATION_LOGO_URL_DEFAULT,
    });
    const data = await this.organizeRepository.save(organization);
    const group = this.groupRepository.create({
      user_id: promoterId,
      organization_id: data.id,
      is_owner: true,
    });
    await this.groupRepository.save(group);
    return {
      id: data.id,
    };
  }

  async getOrganizationById(id: string): Promise<Organization> {
    return await this.organizeRepository.findOne({
      where: { id },
    });
  }

  async getOrganizations(userId: string, languageCode: string): Promise<any> {
    const organizations = await this.organizeRepository
      .createQueryBuilder('organization')
      .innerJoin('organization.groups', 'group')
      .where('group.user_id = :userId', { userId })
      .andWhere('organization.lang_code = :languageCode', { languageCode })
      .andWhere('organization.is_active = :isActive', { isActive: true })
      .select([
        'organization.id',
        'organization.name',
        'organization.description',
        'organization.logo_url',
        'organization.status',
        'organization.lang_code',
        'group.is_owner',
      ])
      .addSelect('group.user_id', 'userId')
      .getRawMany();
    const result = organizations.map((org) => ({
      id: org.organization_id,
      name: org.organization_name,
    }));
    return { items: result };
  }

  async checkUserInOrganize(
    userId: string,
    organizeId: string,
  ): Promise<boolean> {
    const group = await this.groupRepository.findOne({
      where: {
        user_id: userId,
        organization_id: organizeId,
      },
    });
    return !!group;
  }

  async getEvents(organizeId: string, params: any): Promise<any> {
    const totalEvents = await this.eventRepository.countBy({
      organization: { id: organizeId },
    });
    const { page = 1, limit = 10 } = params;
    const events = await this.eventRepository
      .createQueryBuilder('event')
      .innerJoin('event.organization', 'organization')
      .innerJoin('event.venue', 'venue')
      .where('organization.id = :organizeId', { organizeId })
      .andWhere('event.deleted_at IS NULL')
      .andWhere('event.status = :status', {
        status: EVENT_STATUS.ACTIVE,
      })
      .andWhere('event.end_datetime > NOW()')
      .select([
        'event.id',
        'event.name',
        'event.start_datetime',
        'event.status',
        'event.allow_scan_ticket',
        'venue.name',
        'venue.address',
      ])
      .limit(parseInt(limit))
      .offset(parseInt(limit) * (parseInt(page) - 1))
      .getMany();

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

    const result = events.map((event) => ({
      id: event.id,
      name: event.name,
      start_datetime: event.start_datetime,
      status: event.status,
      allow_scan_ticket: event.allow_scan_ticket,
      venue: {
        name: event.venue?.name,
        address: event.venue?.address,
      },
    }));
    return { items: result, paginations };
  }

  async getEventByOrganizer(organizeId: string, eventId: string): Promise<any> {
    const event = await this.eventRepository
      .createQueryBuilder('event')
      .innerJoin('event.organization', 'organization')
      .innerJoinAndSelect('event.category', 'category')
      .innerJoinAndSelect('event.venue', 'venue')
      .innerJoinAndSelect('event.ticketEvents', 'ticket_event')
      .innerJoinAndSelect('ticket_event.ticket', 'ticket')
      .where('event.organization_id = :organizeId', { organizeId })
      .andWhere('event.id = :eventId', { eventId })
      .andWhere('ticket.deleted_at IS NULL')
      .select()
      .getOne();
    if (!event) {
      throw new BadRequestException('EVENT_NOT_FOUND');
    }
    const tickets = event.ticketEvents.map((ticketEvent) => ({
      id: ticketEvent.ticket.id,
      name: ticketEvent.ticket.name,
      price: Number(ticketEvent.ticket.price),
      quantity: ticketEvent.ticket.quantity,
      max_quantity: ticketEvent.ticket.max_quantity,
      min_quantity: ticketEvent.ticket.min_quantity,
    }));
    return {
      id: event.id,
      name: event.name,
      poster_url: event.poster_url,
      type: event.type,
      venue: {
        id: event.venue?.id,
        name: event.venue?.name,
        address: event.venue?.address,
      },
      category: {
        id: event.category?.id,
        name: event.category?.name,
      },
      description: event.description,
      start_datetime: event.start_datetime,
      end_datetime: event.end_datetime,
      tickets,
      privacy: event.privacy,
      banks: {
        name: event.bank,
        account_number: event.account_number,
        account_name: event.account_owner,
      },
      business: {
        type: event.business_type,
        full_name: event.full_name,
        address: event.address_business,
        tax_code: event.tax_code,
      },
    };
  }

  async updateEventByOrganizer(
    organizeId: string,
    eventId: string,
    data: UpdateEventRequestDto,
    file: Express.Multer.File,
  ): Promise<any> {
    const event = await this.eventRepository
      .createQueryBuilder('event')
      .innerJoin('event.organization', 'organization')
      .innerJoinAndSelect('event.ticketEvents', 'ticket_event')
      .innerJoinAndSelect('event.venue', 'venue')
      .innerJoinAndSelect('ticket_event.ticket', 'ticket')
      .where('event.organization_id = :organizeId', { organizeId })
      .andWhere('event.id = :eventId', { eventId })
      .select()
      .getOne();
    if (!event) {
      throw new BadRequestException('EVENT_NOT_FOUND');
    }

    const category = await this.categoryRepository.findOne({
      where: { id: data.category },
    });
    if (!category) {
      throw new BadRequestException('CATEGORY_NOT_FOUND');
    }

    if (file) {
      await this.mediaService.uploadEventImage(file, event.id);
    }

    if (event.ticketEvents.length > 0) {
      const tickets = event.ticketEvents.map((ticketEvent) => ({
        id: ticketEvent.ticket.id,
        name: ticketEvent.ticket.name,
        price: Number(ticketEvent.ticket.price),
        quantity: ticketEvent.ticket.quantity,
        max_quantity: ticketEvent.ticket.max_quantity,
        min_quantity: ticketEvent.ticket.min_quantity,
      }));
      const ticketIds = tickets.map((ticket) => ticket.id);
      await this.ticketEventRepository.delete({
        event_id: eventId,
        ticket_id: In(ticketIds),
      });
      await this.ticketRepository.softDelete({
        id: In(ticketIds),
      });
    }
    data.tickets.forEach(async (ticket) => {
      const createTicket = this.ticketRepository.create({
        name: ticket.name,
        price: ticket.price,
        quantity: ticket.quantity,
        max_quantity: ticket.max_quantity,
        min_quantity: ticket.min_quantity,
      });
      await this.ticketRepository.save(createTicket);
      const createTicketEvent = this.ticketEventRepository.create({
        event: event,
        ticket: createTicket,
      });
      await this.ticketEventRepository.save(createTicketEvent);
    });

    const venueId = event.venue.id;
    const updateVenue = {
      name: data.address.name,
      address: `${data.address.street}, ${data.address.ward}, ${data.address.district}, ${data.address.city}`,
    };
    await this.venueRepository.update(venueId, updateVenue);
    const updatedEvent = {
      name: data.name,
      type: data.type,
      category: { id: data.category },
      description: data.description,
      start_datetime: data.start_datetime,
      end_datetime: data.end_datetime,
      privacy: data.privacy,
      account_owner: data.account_owner,
      account_number: data.account_number,
      bank: data.bank,
      business_type: data.business_type,
      full_name: data.full_name,
      address_business: data.address_business,
      tax_code: data.tax_code,
    };
    await this.eventRepository.update(eventId, updatedEvent);

    return {
      id: eventId,
    };
  }

  async getOrderReports(
    organizeId: string,
    eventId: string,
    params: any,
  ): Promise<any> {
    const totalOrders = await this.orderRepositoty.countBy({
      event_id: eventId,
    });
    const { page = 1, limit = 10 } = params;

    const orders = await this.orderRepositoty
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.event', 'event')
      .leftJoinAndSelect('order.coupon', 'coupon')
      .where('event.organization_id = :organizeId', { organizeId })
      .andWhere('event.id = :eventId', { eventId })
      .select([
        'order.id',
        'order.seat_info',
        'order.status',
        'order.total_price',
        'event.id',
        'coupon.code',
      ])
      .orderBy('order.created_at', 'DESC')
      .limit(parseInt(limit))
      .offset(parseInt(limit) * (parseInt(page) - 1))
      .getMany();

    const totalPages = Math.ceil(totalOrders / parseInt(limit));

    const paginations = {
      total: totalOrders,
      limit: parseInt(limit),
      page: parseInt(page),
      current_page: parseInt(page),
      total_page: totalPages,
      has_next_page: parseInt(page) < totalPages,
      has_previous_page: parseInt(page) > 1,
      next_page: parseInt(page) < totalPages ? parseInt(page) + 1 : null,
    };

    const result = orders.map((order) => ({
      id: order.id,
      ticket: JSON.parse(order.seat_info).map((ticket: any) => ({
        id: ticket.id,
        row: ticket.row,
        label: ticket.label,
      })),
      total_price: order.total_price,
      coupon: order.coupon || null,
    }));
    return { items: result, paginations };
  }

  async getOrderByOrganizer(id: string) {
    const order = await this.orderRepositoty
      .createQueryBuilder('orders')
      .leftJoinAndSelect('orders.paymet_method', 'paymentMethod')
      .leftJoinAndSelect('orders.receive_info', 'receiveInfo')
      .leftJoinAndSelect('orders.event', 'event')
      .leftJoinAndSelect('event.venue', 'venue')
      .leftJoinAndSelect('orders.coupon', 'coupon')
      .leftJoinAndSelect('orders.order_ticket_images', 'ticketImages')
      .where('orders.id = :id', { id })
      .getOne();

    if (!order) {
      throw new BadRequestException('ORDER_NOT_FOUND');
    }

    // Map seat information from ticket images
    const seatInfo = order.order_ticket_images.map((ticket) => ({
      location: ticket.seat_location,
      ticket_name: ticket.ticket_name,
      ticket_price: ticket.price,
      ticket_url: ticket.qr_ticket_url,
      ticket_code: ticket.code,
    }));

    // Transform the order into the response DTO
    const response = plainToClass(GetOrderDetailResponseDto, {
      id: order.id,
      tracking_user: order.user_id, // Assuming tracking order is the same as order ID
      payment_method_name: order.paymet_method?.name || null,
      coupon: order.coupon
        ? {
            code: order.coupon.code,
            percent: order.coupon.percent,
          }
        : null,
      receive_infos: order.receive_info
        ? {
            name: order.receive_info.name,
            email: maskEmail(order.receive_info.email),
            phone_number: maskPhoneNumber(order.receive_info.phone_number),
          }
        : null,
      discount_price: order.discount_price,
      sub_total_price: order.sub_total_price,
      total_price: order.total_price,
      event: order.event
        ? {
            name: order.event.name,
            start_time: order.event.start_datetime,
            venue: order.event.venue
              ? {
                  name: order.event.venue.name,
                  address: order.event.venue.address,
                }
              : null,
          }
        : null,
      seat_info: seatInfo,
      status: order.status,
      created_at: order.created_at,
    });

    return response;
  }

  async getTicketReport(
    organizeId: string,
    eventId: string,
    params: any,
  ): Promise<any> {
    const { page = 1, limit = 10 } = params;

    const [orders, total] = await this.orderRepositoty
      .createQueryBuilder('orders')
      .leftJoinAndSelect('orders.paymet_method', 'paymentMethod')
      .leftJoinAndSelect('orders.receive_info', 'receiveInfo')
      .leftJoinAndSelect('orders.event', 'event')
      .leftJoinAndSelect('event.venue', 'venue')
      .leftJoinAndSelect('orders.coupon', 'coupon')
      .leftJoinAndSelect('orders.order_ticket_images', 'ticketImages')
      .where('orders.event_id = :eventId', { eventId })
      .andWhere('event.organization_id = :organizeId', { organizeId })
      .take(limit) // Limit the number of results
      .skip((page - 1) * limit) // Skip results for pagination
      .getManyAndCount(); // Get both the results and the total count

    if (!orders.length) {
      return {
        items: [],
        paginations: {
          total,
          limit: parseInt(limit, 10),
          page: parseInt(page, 10),
          current_page: parseInt(page, 10),
          total_page: 0,
          has_next_page: false,
          has_previous_page: false,
          next_page: null,
        },
      };
    }

    // Map orders into the response DTO
    const response = orders.map((order) => {
      const seatInfo = order.order_ticket_images.map((ticket) => ({
        location: ticket.seat_location,
        ticket_name: ticket.ticket_name,
        ticket_price: ticket.price,
        ticket_url: ticket.qr_ticket_url,
        ticket_code: ticket.code,
      }));

      return plainToClass(GetOrderDetailResponseDto, {
        id: order.id,
        tracking_user: order.user_id,
        payment_method_name: order.paymet_method?.name || null,
        coupon: order.coupon
          ? {
              code: order.coupon.code,
              percent: order.coupon.percent,
            }
          : null,
        receive_infos: order.receive_info
          ? {
              name: order.receive_info.name,
              email: maskEmail(order.receive_info.email),
              phone_number: maskPhoneNumber(order.receive_info.phone_number),
            }
          : null,
        discount_price: order.discount_price,
        sub_total_price: order.sub_total_price,
        total_price: order.total_price,
        event: order.event
          ? {
              name: order.event.name,
              start_time: order.event.start_datetime,
              venue: order.event.venue
                ? {
                    name: order.event.venue.name,
                    address: order.event.venue.address,
                  }
                : null,
            }
          : null,
        seat_info: seatInfo,
        status: order.status,
        created_at: order.created_at,
      });
    });

    // Calculate pagination details
    const totalPage = Math.ceil(total / limit);
    const currentPage = parseInt(page, 10);
    const hasNextPage = currentPage < totalPage;
    const hasPreviousPage = currentPage > 1;
    const nextPage = hasNextPage ? currentPage + 1 : null;

    return {
      items: response,
      paginations: {
        total,
        limit: parseInt(limit, 10),
        page: currentPage,
        current_page: currentPage,
        total_page: totalPage,
        has_next_page: hasNextPage,
        has_previous_page: hasPreviousPage,
        next_page: nextPage,
      },
    };
  }

  async getGrossSales(
    organizeId: string,
    eventId: string,
    startDate: string,
    endDate: string,
  ): Promise<any> {
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);

    const ticket = await this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.ticketEvents', 'ticket_event')
      .where('ticket_event.event_id = :eventId', { eventId })
      .getMany();
    const ticketsWithCapacity = ticket.map((t) => ({
      ...t,
      capacity: parseInt(t.price as unknown as string, 10) * t.quantity,
    }));
    const totalCapacity = ticketsWithCapacity.reduce(
      (sum, t) => sum + t.capacity,
      0,
    );

    const salesByDay = await this.orderRepositoty
      .createQueryBuilder('orders')
      .select(
        "DATE_FORMAT(CONVERT_TZ(orders.created_at, '+00:00', '+07:00'), '%Y-%m-%d')",
        'date',
      )
      .addSelect('SUM(orders.total_price)', 'total_price')
      .leftJoin('orders.event', 'event')
      .where('event.organization_id = :organizeId', { organizeId })
      .andWhere('event.id = :eventId', { eventId })
      .andWhere('orders.created_at BETWEEN :startDate AND :endDate', {
        startDate: startDateTime,
        endDate: endDateTime,
      })
      .groupBy(
        "DATE_FORMAT(CONVERT_TZ(orders.created_at, '+00:00', '+07:00'), '%Y-%m-%d')",
      )
      .orderBy(
        "DATE_FORMAT(CONVERT_TZ(orders.created_at, '+00:00', '+07:00'), '%Y-%m-%d')",
        'ASC',
      )
      .getRawMany();

    if (!salesByDay.length) {
      return { items: [] };
    }

    const response = salesByDay.map((sale) => ({
      date: sale.date,
      total_price: Math.round(sale.total_price / 1000),
    }));

    return {
      items: response,
      total_capacity: totalCapacity,
    };
  }

  async getSoldTicket(
    organizeId: string,
    eventId: string,
    startDate: string,
    endDate: string,
  ): Promise<any> {
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    endDateTime.setHours(23, 59, 59, 999);
    const salesByDay = await this.orderRepositoty
      .createQueryBuilder('orders')
      .leftJoin('orders.event', 'event')
      .select([
        'orders.id AS order_id',
        'orders.seat_info AS seat_info',
        "DATE_FORMAT(CONVERT_TZ(orders.created_at, '+00:00', @@session.time_zone), '%Y-%m-%d') AS date",
      ])
      .where('event.organization_id = :organizeId', { organizeId })
      .andWhere('event.id = :eventId', { eventId })
      .andWhere('orders.created_at BETWEEN :startDate AND :endDate', {
        startDate: startDateTime,
        endDate: endDateTime,
      })
      .getRawMany();

    const tickets = await this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoin('ticket.ticketEvents', 'ticket_event')
      .where('ticket_event.event_id = :eventId', { eventId })
      .getMany();

    const totalTickets = tickets.reduce((sum, ticket) => {
      return sum + Number(ticket.quantity);
    }, 0);

    if (!salesByDay.length) {
      return { items: [] };
    }

    const result = {};

    salesByDay.forEach((sale) => {
      const date = sale.date;
      const seatInfo = JSON.parse(sale.seat_info);

      seatInfo.forEach((seat) => {
        const ticketId = seat.ticket_id;
        const ticketName = seat.ticket.name;

        if (!result[date]) {
          result[date] = {};
        }
        if (!result[date][ticketId]) {
          result[date][ticketId] = {
            ticket_name: ticketName,
            sold_quantity: 0,
          };
        }

        result[date][ticketId].sold_quantity += 1;
      });
    });

    const formattedResult = Object.entries(result)
      .map(([date, tickets]) => ({
        date,
        tickets: Object.values(tickets),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return { items: formattedResult, total_tickets: totalTickets };
  }

  async getSummaryTickets(organizeId: string, eventId: string): Promise<any> {
    const tickets = await this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.ticketEvents', 'ticket_event')
      .where('ticket_event.event_id = :eventId', { eventId })
      .getMany();

    const orders = await this.orderRepositoty
      .createQueryBuilder('orders')
      .leftJoin('orders.event', 'event')
      .select(['orders.seat_info AS seat_info'])
      .where('event.organization_id = :organizeId', { organizeId })
      .andWhere('event.id = :eventId', { eventId })
      .getRawMany();

    const soldTickets = orders.reduce(
      (acc, order) => {
        const seatInfo = JSON.parse(order.seat_info);
        seatInfo.forEach((seat) => {
          const ticketId = seat.ticket_id;
          if (!acc[ticketId]) {
            acc[ticketId] = 0;
          }
          acc[ticketId] += 1;
        });
        return acc;
      },
      {} as Record<string, number>,
    );

    const result = tickets.map((ticket) => ({
      id: ticket.id,
      name: ticket.name,
      price: Number(ticket.price),
      quantity: ticket.quantity,
      sold: soldTickets[ticket.id] || 0,
    }));

    return { items: result };
  }
}
