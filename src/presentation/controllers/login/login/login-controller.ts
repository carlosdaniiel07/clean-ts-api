import { Authentication } from '~/domain/usecases/authentication'
import {
  badRequest,
  ok,
  unauthorized
} from '~/presentation/helpers/http-helper'
import { Controller, HttpResponse, Validation } from '~/presentation/protocols'

export class LoginController implements Controller<LoginController.Request> {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  async handle (request: LoginController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)

      if (error) {
        return badRequest(error)
      }

      const { email, password } = request
      const { accessToken, name } = await this.authentication.auth({
        email,
        password
      })

      return ok({
        accessToken,
        name,
        email
      })
    } catch (err) {
      return unauthorized()
    }
  }
}

export namespace LoginController {
  export type Request = {
    email: string
    password: string
  }
}
