import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '../errors/invalid-param-error'

export class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    const invalidField = requiredFields.find((field) => !httpRequest.body[field])

    if (invalidField) {
      return badRequest(new MissingParamError(invalidField))
    }

    const isEmailValid = this.emailValidator.isValid(httpRequest.body.email)

    if (!isEmailValid) {
      return badRequest(new InvalidParamError('email'))
    }

    return {
      statusCode: 201,
      body: null
    }
  }
}
