import { CustomErrors } from './custom-errors'

export class NotAuthorizedError extends CustomErrors {
  statusCode = 401

  constructor() {
    super('Not authorized')

    Object.setPrototypeOf(this, NotAuthorizedError.prototype)
  }

  serializeErrors() {
    return [{ message: 'Not authorized' }]
  }
}
