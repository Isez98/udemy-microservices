import { NotAuthorizedError, NotFoundError, requireAuth } from '@dbtsr/common'
import express, { Request, Response } from 'express'
import { OrderCanceledPublisher } from '../events/publishers/order-canceled-publisher'
import { Order, OrderStatus } from '../models/order'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params

    const order = await Order.findById(orderId).populate('ticket')

    if (!order) {
      throw new NotFoundError()
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }
    order.status = OrderStatus.Canceled
    await order.save()

    // publish an event saying this order was canceled
    new OrderCanceledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    })

    res.status(204).send(order)
  }
)

export { router as deleteOrderRouter }
