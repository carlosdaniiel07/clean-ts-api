import { badRequest, created, serverError } from '../../helpers/http-helper'
import { Validation } from '../../helpers/validators/validation'
import {
  AddAccount,
  Controller,
  HttpRequest,
  HttpResponse
} from './signup-protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = httpRequest.body
      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return created(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
