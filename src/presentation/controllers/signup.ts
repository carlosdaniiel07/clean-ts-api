import { MissingParamError, InvalidParamError } from '../errors'
import { badRequest, created, serverError } from '../helpers/http-helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../protocols'

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

      return created(null)
    } catch (error) {
      return serverError()
    }
  }
}
