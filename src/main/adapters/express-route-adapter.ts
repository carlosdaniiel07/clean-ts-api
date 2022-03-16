import { Request, Response } from 'express'
import { Controller } from '../../presentation/protocols'

type ExpressController = (req: Request, res: Response) => void

export const adaptRoute = (controller: Controller): ExpressController => {
  return async (req, res) => {
    const { statusCode, body } = await controller.handle({
      body: req.body
    })
    return res.status(statusCode).send(body)
  }
}
