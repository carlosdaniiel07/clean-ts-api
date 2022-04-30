import { Request, Response, NextFunction } from 'express'
import { HttpRequest, Middleware } from '~/presentation/protocols'

type ExpressMiddleware = (req: Request, res: Response, next: NextFunction) => void

export const adaptMiddleware = (middleware: Middleware): ExpressMiddleware => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      headers: req.headers
    }
    const httpResponse = await middleware.handle(httpRequest)
    const isSuccess = httpResponse.statusCode === 200

    if (!isSuccess) {
      return res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }

    Object.assign(req, httpResponse.body)

    next()
  }
}
