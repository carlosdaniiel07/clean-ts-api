import { AuthMiddleware } from '~/presentation/middlewares/auth-middleware'
import { Middleware } from '~/presentation/protocols'
import { makeDbLoadAccountByAccessToken } from '~/main/factories/usecases/db-load-account-by-access-token-factory'

export const makeAuthMiddleware = (role?: string): Middleware => {
  return new AuthMiddleware(makeDbLoadAccountByAccessToken(), role)
}
