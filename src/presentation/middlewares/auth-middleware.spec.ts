import { HttpRequest } from '../protocols'
import { AuthMiddleware } from './auth-middleware'
import { ok, serverError, unauthorized } from '../helpers/http-helper'
import { AccessDeniedError } from '../errors'
import { LoadAccountByAccessToken } from '../../domain/usecases/load-account-by-access-token'
import { AccountModel } from '../../domain/models/account'

interface SutTypes {
  loadAccountByAccessToken: LoadAccountByAccessToken
  sut: AuthMiddleware
}

const makeLoadAccountByAccessToken = (): LoadAccountByAccessToken => {
  class LoadAccountByAccessTokenStub implements LoadAccountByAccessToken {
    async load (accessToken: string, role?: string): Promise<AccountModel | null> {
      return await Promise.resolve({
        id: 'any_id',
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      })
    }
  }

  return new LoadAccountByAccessTokenStub()
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByAccessToken = makeLoadAccountByAccessToken()
  const sut = new AuthMiddleware(loadAccountByAccessToken, role)

  return {
    loadAccountByAccessToken,
    sut
  }
}

const makeFakeHttpRequest = (): HttpRequest => ({
  headers: {
    Authorization: 'Bearer any_token'
  }
})

describe('Auth middleware', () => {
  test('should return 401 if no authorization token was found in request headers', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      headers: {}
    }
    const response = await sut.handle(httpRequest)

    expect(response).toEqual(unauthorized(new AccessDeniedError()))
  })

  test('should call LoadAccountByAccessToken with correct accessToken', async () => {
    const role = 'any_role'
    const { sut, loadAccountByAccessToken } = makeSut(role)
    const httpRequest = makeFakeHttpRequest()
    const spy = jest.spyOn(loadAccountByAccessToken, 'load')

    await sut.handle(httpRequest)

    expect(spy).toHaveBeenCalledWith('any_token', role)
  })

  test('should return 401 if LoadAccountByAccessToken returns null', async () => {
    const { sut, loadAccountByAccessToken } = makeSut()
    const httpRequest = makeFakeHttpRequest()

    jest.spyOn(loadAccountByAccessToken, 'load').mockReturnValueOnce(Promise.resolve(null))

    const response = await sut.handle(httpRequest)

    expect(response).toEqual(unauthorized(new AccessDeniedError()))
  })

  test('should return 500 if LoadAccountByAccessToken throws', async () => {
    const { sut, loadAccountByAccessToken } = makeSut()
    const httpRequest = makeFakeHttpRequest()

    jest.spyOn(loadAccountByAccessToken, 'load').mockImplementationOnce(() => {
      throw new Error('any_error')
    })

    const response = await sut.handle(httpRequest)

    expect(response).toEqual(serverError(new Error('any_error')))
  })

  test('should return 200 if LoadAccountByAccessToken returns an account', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    const response = await sut.handle(httpRequest)

    expect(response).toEqual(ok({
      accountId: 'any_id'
    }))
  })
})
