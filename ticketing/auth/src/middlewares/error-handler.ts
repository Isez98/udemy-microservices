import { Request, Response, NextFunction } from 'express'
import { CustomErrors } from '../errors/custom-errors'

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof CustomErrors) {
    return res
      .status(error.statusCode)
      .send({ errors: error.serializeErrors() })
  }

  res.status(400).send({
    errors: [{ message: 'Something went wrong' }],
  })
}
