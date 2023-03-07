import { Publisher, Subjects, TicketUpdatedEvent } from '@dbtsr/common'
import { natsWrapper } from '../../nats-wrapper'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}
