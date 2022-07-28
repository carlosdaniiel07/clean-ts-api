import { AuthenticationModel } from '~/domain/models/authentication'
import {
  Authentication,
  AuthenticationParams
} from '~/domain/usecases/authentication'
import { MissingParamError } from '~/presentation/errors'
import {
  badRequest,
  ok,
  unauthorized
} from '~/presentation/helpers/http-helper'
import { Validation } from '~/presentation/protocols'
import { LoginController } from './login-controller'

type SutTypes = {
  sut: LoginController
  authentication: Authentication
  validation: Validation
}

const makeFakeRequest = (): LoginController.Request => ({
  email: 'any_email',
  password: 'any_password'
})

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (
      authentication: AuthenticationParams
    ): Promise<AuthenticationModel> {
      return await Promise.resolve({
        accessToken: 'any_access_token',
        name: 'any_name',
        email: 'any_email'
      })
    }
  }

  return new AuthenticationStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (data: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const authentication = makeAuthentication()
  const validation = makeValidation()
  const sut = new LoginController(authentication, validation)

  return {
    sut,
    authentication,
    validation
  }
}

describe('Login controller', () => {
  test('should call Validation with correct value', async () => {
    const { sut, validation } = makeSut()
    const request = makeFakeRequest()
    const spy = jest.spyOn(validation, 'validate')

    await sut.handle(request)

    expect(spy).toHaveBeenCalledWith(request)
  })

  test('should return 400 if Validation returns an error', async () => {
    const { sut, validation } = makeSut()
    const request = makeFakeRequest()

    jest
      .spyOn(validation, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'))

    const httpResponse = await sut.handle(request)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('should call Authentication with correct value', async () => {
    const { sut, authentication } = makeSut()
    const request = makeFakeRequest()
    const spy = jest.spyOn(authentication, 'auth')

    await sut.handle(request)

    expect(spy).toHaveBeenCalledWith(request)
  })

  test('should return 401 if Authentication throws', async () => {
    const { sut, authentication } = makeSut()
    const request = makeFakeRequest()

    jest.spyOn(authentication, 'auth').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(request)

    expect(httpResponse).toEqual(unauthorized())
  })

  test('should return access token if success', async () => {
    const { sut } = makeSut()
    const request = makeFakeRequest()
    const httpResponse = await sut.handle(request)

    expect(httpResponse).toEqual(
      ok({
        accessToken: 'any_access_token',
        name: 'any_name',
        email: 'any_email'
      })
    )
  })
})
