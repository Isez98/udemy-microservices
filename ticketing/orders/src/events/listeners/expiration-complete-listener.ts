import {
  ExpirationComplete,
  Listener,
  OrderStatus,
  Subjects,
} from '@dbtsr/common'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/order'
import { OrderCanceledPublisher } from '../publishers/order-canceled-publisher'
import { queueGroupName } from './queue-group-name'

export class ExpirationCompleteListener extends Listener<ExpirationComplete> {
  queueGroupName = queueGroupName
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete

  async onMessage(data: ExpirationComplete['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket')

    if (!order) {
      throw new Error('Order not found')
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack()
    }

    order.set({
      status: OrderStatus.Canceled,
    })
    await order.save()

    await new OrderCanceledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    })

    msg.ack()
  }
}
