import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
  UserInputError
} from 'apollo-server-express'
import { Controller } from '~/presentation/protocols'

export const adaptResolver = async (
  controller: Controller,
  args: any
): Promise<any> => {
  const { statusCode, body } = await controller.handle(args)

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
