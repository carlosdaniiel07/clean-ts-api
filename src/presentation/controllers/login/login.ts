import { Authentication } from '../../../domain/usecases/authentication'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly emailValidator: EmailValidator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest
      const requiredFields = ['email', 'password']
      const invalidField = requiredFields.find((field) => !body[field])
      const hasInvalidField = !!invalidField

      if (hasInvalidField) {
        return badRequest(new MissingParamError(invalidField as string))
      }

      const { email, password } = body
      const isValidEmail = this.emailValidator.isValid(email)

      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'))
      }

      const accessToken = await this.authentication.auth({
        email,
        password
      })

      return ok({
        accessToken
      })
    } catch (err) {
      return serverError(err)
    }
  }
}
