import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { MissingParamError } from '../../errors'
import { badRequest, ok, unauthorized } from '../../helpers/http-helper'
import { Validation } from '../../helpers/validators/validation'
import { HttpRequest } from '../../protocols'
import { LoginController } from './login'

interface SutTypes {
  sut: LoginController
  authentication: Authentication
  validation: Validation
}

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'any_email',
    password: 'any_password'
  }
})

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      return await Promise.resolve('any_access_token')
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
    const httpRequest = makeFakeHttpRequest()
    const spy = jest.spyOn(validation, 'validate')

    await sut.handle(httpRequest)

    expect(spy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 400 if Validation returns an error', async () => {
    const { sut, validation } = makeSut()
    const httpRequest = makeFakeHttpRequest()

    jest.spyOn(validation, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('should call Authentication with correct value', async () => {
    const { sut, authentication } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    const spy = jest.spyOn(authentication, 'auth')

    await sut.handle(httpRequest)

    expect(spy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 401 if Authentication throws', async () => {
    const { sut, authentication } = makeSut()
    const httpRequest = makeFakeHttpRequest()

    jest.spyOn(authentication, 'auth').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(unauthorized())
  })

  test('should return access token if success', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok({
      accessToken: 'any_access_token'
    }))
  })
})
