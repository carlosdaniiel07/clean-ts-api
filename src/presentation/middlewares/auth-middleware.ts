import { LoadAccountByAccessToken } from '~/domain/usecases/load-account-by-access-token'
import { AccessDeniedError } from '~/presentation/errors'
import {
  unauthorized,
  ok,
  serverError
} from '~/presentation/helpers/http-helper'
import { Middleware, HttpResponse } from '~/presentation/protocols'

export class AuthMiddleware implements Middleware<AuthMiddleware.Request> {
  constructor (
    private readonly loadAccountByAccessToken: LoadAccountByAccessToken,
    private readonly role?: string
  ) {}

  async handle (request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      const accessToken = request.accessToken?.substring(7)

      if (!accessToken) {
        return unauthorized(new AccessDeniedError())
      }

      const account = await this.loadAccountByAccessToken.load(
        accessToken,
        this.role
      )

      if (!account) {
        return unauthorized(new AccessDeniedError())
      }

      return ok({
        accountId: account.id.toString()
      })
    } catch (err) {
      return serverError(err)
    }
  }
}

export namespace AuthMiddleware {
  export type Request = {
    accessToken: string
  }
}
