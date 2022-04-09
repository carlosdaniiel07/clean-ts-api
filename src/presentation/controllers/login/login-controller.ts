import { Authentication } from '../../../domain/usecases/authentication'
import { badRequest, ok, unauthorized } from '../../helpers/http-helper'
import { Validation } from '../../helpers/validators/validation'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

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
      const accessToken = await this.authentication.auth({
        email,
        password
      })

      return ok({
        accessToken
      })
    } catch (err) {
      return unauthorized()
    }
  }
}
