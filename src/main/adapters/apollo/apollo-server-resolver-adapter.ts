import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
  UserInputError
} from 'apollo-server-express'
import { makeAuthMiddleware } from '~/main/factories/middlewares/auth-middleware-factory'
import { AuthMiddleware } from '~/presentation/middlewares/auth-middleware'
import { Controller, Middleware } from '~/presentation/protocols'

const authMiddleware: Middleware<AuthMiddleware.Request> = makeAuthMiddleware()

type ResolverOptions = {
  context?: any
  requireAuth?: boolean
}

export const adaptResolver = async (
  controller: Controller,
  args: any,
  options?: ResolverOptions
): Promise<any> => {
  const accountId = await getAccountId(options)
  const { statusCode, body } = await controller.handle({
    ...args,
    accountId
  })

  switch (statusCode) {
    case 200:
    case 201:
    case 204:
      return body
    case 400:
      throw new UserInputError(body.message)
    case 401:
      throw new AuthenticationError(body.message)
    case 403:
      throw new ForbiddenError(body.message)
    default:
      throw new ApolloError(body.message)
  }
}

const getAccountId = async (
  options?: ResolverOptions
): Promise<string | undefined> => {
  if (!options?.requireAuth) {
    return undefined
  }

  const { req } = options.context
  const accessToken = req.headers.authorization
  const { statusCode, body } = await authMiddleware.handle({
    accessToken
  })
  const isAuthenticated = statusCode === 200

  if (!isAuthenticated) {
    throw new AuthenticationError('Unauthenticated')
  }

  return body.accountId
}
