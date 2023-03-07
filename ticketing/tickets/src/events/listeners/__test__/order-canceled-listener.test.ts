import mongoose from 'mongoose'
import { Ticket } from '../../../models/ticket'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCanceledListener } from '../order-canceled-listener'
import { OrderCanceledEvent } from '@dbtsr/common'
import { Message } from 'node-nats-streaming'

const setup = async () => {
  const listener = new OrderCanceledListener(natsWrapper.client)

  const orderId = new mongoose.Types.ObjectId().toHexString()
  const ticket = Ticket.build({
    title: 'Concert',
    price: 15,
    userId: 'abc123',
  })
  ticket.set({ orderId })
  await ticket.save()

  const data: OrderCanceledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { msg, data, ticket, orderId, listener }
}

it('updates the ticket, publishes the event and acks the message', async () => {
  const { msg, ticket, listener, data, orderId } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket!.orderId).not.toBeDefined()
  expect(msg.ack).toHaveBeenCalled()
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
