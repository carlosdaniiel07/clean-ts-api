import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email']
    const invalidField = requiredFields.find((field) => !httpRequest.body[field])

    if (invalidField) {
      return badRequest(new MissingParamError(invalidField))
    }

    return {
      statusCode: 201,
      body: null
    }
  }
}
