import { Authentication } from '~/domain/usecases/authentication'
import { badRequest, ok, unauthorized } from '~/presentation/helpers/http-helper'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from '~/presentation/protocols'

export class LoginController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest
      const error = this.validation.validate(body)

      if (error) {
        return badRequest(error)
      }

      const { email, password } = body
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
