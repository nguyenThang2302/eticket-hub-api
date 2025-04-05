import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { OrganizationTicket } from '../entities/organization_ticket.entity';
import { Organization } from '../entities/organization.entity';
import { Ticket } from '../entities/ticket.entity';
import { nanoid } from 'nanoid';

export class OrganizationTicket1743777135850 implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const organizationTicketRepository =
      dataSource.getRepository(OrganizationTicket);
    const organizationRepository = dataSource.getRepository(Organization);
    const ticketRepository = dataSource.getRepository(Ticket);

    const organizations = await organizationRepository.find();
    const tickets = await ticketRepository.find();
    const ticketIds = tickets.map((ticket) => ticket.id);
    const organizationIds = organizations.map(
      (organization) => organization.id,
    );

    await organizationTicketRepository.insert({
      id: nanoid(16),
      organization_id: organizationIds[12],
      ticket_id: ticketIds[0],
    });
    await organizationTicketRepository.insert({
      id: nanoid(16),
      organization_id: organizationIds[12],
      ticket_id: ticketIds[1],
    });
    await organizationTicketRepository.insert({
      id: nanoid(16),
      organization_id: organizationIds[14],
      ticket_id: ticketIds[0],
    });
    await organizationTicketRepository.insert({
      id: nanoid(16),
      organization_id: organizationIds[14],
      ticket_id: ticketIds[1],
    });
  }
}
