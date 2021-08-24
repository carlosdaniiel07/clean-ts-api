import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, created, serverError } from '../../helpers/http-helper'
import { AddAccount, Controller, EmailValidator, HttpRequest, HttpResponse } from './signup-protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      const invalidField = requiredFields.find((field) => !httpRequest.body[field])
      const { name, email, password, passwordConfirmation } = httpRequest.body

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

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return created(account)
    } catch (error) {
      return serverError()
    }
  }
}
