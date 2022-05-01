import { HttpResponse } from '~/presentation/protocols'
import { ServerError } from '~/presentation/errors'

export const badRequest = (body: any): HttpResponse => ({
  statusCode: 400,
  body
})

export const ok = (body: any): HttpResponse => ({
  statusCode: 200,
  body
})

export const created = (body?: any): HttpResponse => ({
  statusCode: 201,
  body
})

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: null
})

export const serverError = (error?: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error?.stack)
})

export const unauthorized = (error?: Error): HttpResponse => ({
  statusCode: 401,
  body: error ?? new Error('Unauthorized')
})
