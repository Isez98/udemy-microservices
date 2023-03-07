import { Publisher, OrderCanceledEvent, Subjects } from '@dbtsr/common'

export class OrderCanceledPublisher extends Publisher<OrderCanceledEvent> {
  subject: Subjects.OrderCanceled = Subjects.OrderCanceled
}
