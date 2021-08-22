import { HttpResponse } from '../protocols/http'

export const badRequest = (body: any): HttpResponse => ({
  statusCode: 400,
  body
})
