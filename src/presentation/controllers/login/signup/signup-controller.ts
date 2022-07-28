import { Authentication } from '~/domain/usecases/authentication'
import {
  badRequest,
  created,
  serverError
} from '~/presentation/helpers/http-helper'
import {
  AddAccount,
  Controller,
  HttpResponse,
  Validation
} from './signup-controller-protocols'

export class SignUpController implements Controller<SignUpController.Request> {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  async handle (request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)

      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = request

      await this.addAccount.add({
        name,
        email,
        password
      })

      const { accessToken } = await this.authentication.auth({
        email,
        password
      })

      return created({ accessToken, name, email })
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace SignUpController {
  export type Request = {
    name: string
    email: string
    password: string
    passwordConfirmation: string
  }
}
