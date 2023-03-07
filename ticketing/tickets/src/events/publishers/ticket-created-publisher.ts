import { Publisher, Subjects, TicketCreatedEvent } from '@dbtsr/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated
}
