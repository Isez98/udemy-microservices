import { CustomErrors } from './custom-errors'

export class NotFoundError extends CustomErrors {
  statusCode = 404

  constructor() {
    super('Route not found')

    Object.setPrototypeOf(this, NotFoundError.prototype)
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [{ message: 'Not found' }]
  }
}
