import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'

export class SignUpController implements Controller {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
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
