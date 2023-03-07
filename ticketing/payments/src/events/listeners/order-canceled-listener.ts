import {
  Listener,
  OrderCanceledEvent,
  OrderStatus,
  Subjects,
} from '@dbtsr/common'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/order'
import { queueGroupName } from './queue-group-name'

export class OrderCanceledListener extends Listener<OrderCanceledEvent> {
  subject: Subjects.OrderCanceled = Subjects.OrderCanceled
  queueGroupName = queueGroupName

  async onMessage(data: OrderCanceledEvent['data'], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      _version: data.version - 1,
    })

    if (!order) {
      throw new Error('Order not found')
    }

    order.set({ status: OrderStatus.Canceled })
    await order.save()

    msg.ack()
  }
}
