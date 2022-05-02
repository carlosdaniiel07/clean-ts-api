import { Request, Response } from 'express'
import { Controller } from '~/presentation/protocols'

type ExpressController = (req: Request, res: Response) => void

export const adaptRoute = (controller: Controller): ExpressController => {
  return async (req, res) => {
    const { statusCode, body } = await controller.handle({
      body: req.body,
      params: req.params,
      accountId: (req as any).accountId
    })

    if (isSuccessResponse(statusCode)) {
      return res.status(statusCode).send(body)
    } else {
      return res.status(statusCode).send({
        error: body?.message
      })
    }
  }
}

const isSuccessResponse = (statusCode: number): boolean =>
  statusCode >= 200 && statusCode <= 299
