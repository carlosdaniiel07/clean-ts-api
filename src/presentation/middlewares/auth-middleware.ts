import { LoadAccountByAccessToken } from '../../domain/usecases/load-account-by-access-token'
import { AccessDeniedError } from '../errors'
import { serverError, unauthorized } from '../helpers/http-helper'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByAccessToken: LoadAccountByAccessToken,
    private readonly role?: string
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { headers } = httpRequest
      const authorization = (headers?.Authorization ??
        headers?.authorization) as string
      const accessToken = authorization?.substring(7)

      if (!accessToken) {
        return unauthorized(new AccessDeniedError())
      }

      const account = await this.loadAccountByAccessToken.load(accessToken, this.role)

      if (!account) {
        return unauthorized(new AccessDeniedError())
      }

      return {
        statusCode: 200,
        body: {
          accountId: account.id.toString()
        }
      }
    } catch (err) {
      return serverError(err)
    }
  }
}
