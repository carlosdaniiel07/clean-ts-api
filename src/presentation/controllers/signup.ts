import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError, InvalidParamError } from '../errors'
import { badRequest, serverError } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'

export class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
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
    } catch (error) {
      return serverError()
    }
  }
}
