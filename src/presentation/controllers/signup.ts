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
      const { email, password, passwordConfirmation } = httpRequest.body

      if (invalidField) {
        return badRequest(new MissingParamError(invalidField))
      }

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isEmailValid = this.emailValidator.isValid(email)

      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }

      return created(null)
    } catch (error) {
      return serverError()
    }
  }
}
