import { ServerError } from '../errors'
import { HttpResponse } from '../protocols/http'

export const badRequest = (body: any): HttpResponse => ({
  statusCode: 400,
  body
})

export const ok = (body: any): HttpResponse => ({
  statusCode: 200,
  body
})

export const created = (body: any): HttpResponse => ({
  statusCode: 201,
  body
})

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError()
})
