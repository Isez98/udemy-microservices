import { OrderStatus } from '@dbtsr/common'
import mongoose from 'mongoose'
import { Order } from '../../../models/order'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCanceledListener } from '../order-canceled-listener'
import { OrderCanceledEvent } from '@dbtsr/common'
import { Message } from 'node-nats-streaming'

const setup = async () => {
  const listener = new OrderCanceledListener(natsWrapper.client)

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: 'assdf',
    version: 0,
  })
  await order.save()

  const data: OrderCanceledEvent['data'] = {
    id: order.id,
    version: order.id + 1,
    ticket: {
      id: 'asdfgg',
    },
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { data, msg, listener, order }
}

it('updates the status of the order', async () => {
  const { listener, data, msg, order } = await setup()

  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Canceled)
})

it('acks the message', async () => {
  const { listener, data, msg, order } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
