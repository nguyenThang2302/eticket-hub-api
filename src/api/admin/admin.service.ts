import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from 'src/database/entities/event.entity';
import { Brackets, Repository } from 'typeorm';
import { EVENT_STATUS } from '../common/constants';
import { Organization } from 'src/database/entities/organization.entity';
import { Order } from 'src/database/entities/order.entity';
import { plainToClass } from 'class-transformer';
import { GetOrderDetailResponseDto } from '../purchase/dto/get-order-detail-response.dto';
import { maskEmail, maskPhoneNumber } from '../utils/helpers';
import { Category } from 'src/database/entities/category.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(Order)
    private readonly orderRepositoty: Repository<Order>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
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
        queryBuilder.andWhere('event.status = :status', {
          status: EVENT_STATUS.ACTIVE,
        });
      }

      if (type === 'past') {
        queryBuilder.andWhere('event.start_datetime < NOW()');
      }

      if (type === 'pending') {
        queryBuilder.andWhere('event.status = :status', {
          status: EVENT_STATUS.IN_REVIEW,
        });
      }

      if (type === EVENT_STATUS.REJECTED) {
        queryBuilder.andWhere('event.status = :status', {
          status: EVENT_STATUS.REJECTED,
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
      status: event.status,
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

  async approveEvent(id: string) {
    const event = await this.eventRepository.findOne({
      where: { id },
    });

    if (!event) {
      throw new Error('EVENT_NOT_FOUND');
    }

    event.status = EVENT_STATUS.APPROVED;
    await this.eventRepository.save(event);

    return {
      id: event.id,
    };
  }

  async rejectEvent(id: string) {
    const event = await this.eventRepository.findOne({
      where: { id },
    });

    if (!event) {
      throw new Error('EVENT_NOT_FOUND');
    }

    event.status = EVENT_STATUS.REJECTED;
    await this.eventRepository.save(event);

    return {
      id: event.id,
    };
  }

  async getAllOrganizers(params: any) {
    const { page = 1, limit = 10, q } = params;
    const currentPage = parseInt(page.toString(), 10);
    const pageSize = parseInt(limit.toString(), 10);

    const queryBuilder = this.organizationRepository
      .createQueryBuilder('organization')
      .select([
        'organization.id',
        'organization.name',
        'organization.description',
        'organization.logo_url',
        'organization.is_active',
        'organization.status',
        'organization.created_at',
      ])
      .where('organization.lang_code = :langCode', { langCode: 'en' });

    if (q) {
      queryBuilder.andWhere('organization.name LIKE :q', { q: `%${q}%` });
    }

    const totalOrganizers = await queryBuilder.getCount();
    const offset = (currentPage - 1) * pageSize;

    const organizers = await queryBuilder.skip(offset).take(pageSize).getMany();

    const totalPages = Math.ceil(totalOrganizers / parseInt(limit));

    const paginations = {
      total: totalOrganizers,
      limit: parseInt(limit),
      page: parseInt(page),
      current_page: parseInt(page),
      total_page: totalPages,
      has_next_page: parseInt(page) < totalPages,
      has_previous_page: parseInt(page) > 1,
      next_page: parseInt(page) < totalPages ? parseInt(page) + 1 : null,
    };

    return { items: organizers, paginations };
  }

  async getAllOrders(params: any) {
    const totalOrders = await this.orderRepositoty.count();
    const { page = 1, limit = 10 } = params;

    const orders = await this.orderRepositoty
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.event', 'event')
      .leftJoinAndSelect('order.coupon', 'coupon')
      .where('order.status IS NOT NULL')
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
      ticket: order.seat_info
        ? JSON.parse(order.seat_info).map((ticket: any) => ({
            id: ticket.id,
            row: ticket.row,
            label: ticket.label,
          }))
        : {},
      total_price: order.total_price || 0,
      coupon: order.coupon || null,
    }));
    return { items: result, paginations };
  }

  async getOrderById(id: string) {
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

  async getAllTickets(params: any) {
    const { page = 1, limit = 10 } = params;

    const [orders, total] = await this.orderRepositoty
      .createQueryBuilder('orders')
      .leftJoinAndSelect('orders.paymet_method', 'paymentMethod')
      .leftJoinAndSelect('orders.receive_info', 'receiveInfo')
      .leftJoinAndSelect('orders.event', 'event')
      .leftJoinAndSelect('event.venue', 'venue')
      .leftJoinAndSelect('orders.coupon', 'coupon')
      .leftJoinAndSelect('orders.order_ticket_images', 'ticketImages')
      .where('orders.status IS NOT NULL')
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

  async getAnalyticsEventCategories(params: any) {
    const { year } = params;
    const totalEvents = await this.eventRepository.count({
      where: [
        {
          status: EVENT_STATUS.APPROVED,
        },
        {
          status: EVENT_STATUS.ACTIVE,
        },
      ],
    });
    const categoriesWithEventCount = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.events', 'event')
      .select([
        'category.id AS categoryId',
        'category.name AS categoryName',
        'COUNT(event.id) AS eventCount',
      ])
      .where('YEAR(event.created_at) = :year', { year })
      .andWhere('event.status IN (:...statuses)', {
        statuses: [EVENT_STATUS.APPROVED, EVENT_STATUS.ACTIVE],
      })
      .groupBy('category.id')
      .getRawMany();
    const items = categoriesWithEventCount.map((item) => ({
      id: item.categoryId,
      name: item.categoryName,
      event_count: parseInt(item.eventCount, 10),
    }));
    return { items, total_events: totalEvents };
  }
}
