import { Publisher, OrderCreatedEvent, Subjects } from '@dbtsr/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
}
