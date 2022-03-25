import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { EmailValidator, HttpRequest } from '../../protocols'
import { LoginController } from './login'

interface SutTypes {
  sut: LoginController
  authentication: Authentication
  emailValidator: EmailValidator
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

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const authentication = makeAuthentication()
  const emailValidator = makeEmailValidator()
  const sut = new LoginController(authentication, emailValidator)

  return {
    sut,
    authentication,
    emailValidator
  }
}

describe('Login controller', () => {
  test('should return 400 if email is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('should return 400 if password is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('should return 400 if provided email is not valid', async () => {
    const { sut, emailValidator } = makeSut()
    const httpRequest = makeFakeHttpRequest()

    jest.spyOn(emailValidator, 'isValid').mockReturnValue(false)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('should call emailValidator with correct value', async () => {
    const { sut, emailValidator } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    const spy = jest.spyOn(emailValidator, 'isValid')

    await sut.handle(httpRequest)

    expect(spy).toHaveBeenCalledWith(httpRequest.body.email)
  })

  test('should call authentication with correct value', async () => {
    const { sut, authentication } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    const spy = jest.spyOn(authentication, 'auth')

    await sut.handle(httpRequest)

    expect(spy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 500 if authentication throws', async () => {
    const { sut, authentication } = makeSut()
    const httpRequest = makeFakeHttpRequest()

    jest.spyOn(authentication, 'auth').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError())
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
