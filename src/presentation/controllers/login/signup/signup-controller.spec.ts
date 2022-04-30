import {
  AddAccount,
  AccountModel,
  AddAccountModel,
  HttpRequest,
  Validation
} from './signup-controller-protocols'
import { SignUpController } from './signup-controller'
import {
  Authentication,
  AuthenticationModel
} from '~/domain/usecases/authentication'
import { MissingParamError, ServerError } from '~/presentation/errors'
import {
  serverError,
  badRequest,
  created
} from '~/presentation/helpers/http-helper'

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: 'b9c47765-3f48-4106-9af9-53de231e3674',
  name: 'any_name',
  email: 'any_email@email.com',
  password: 'any_password'
})

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }

  return new AddAccountStub()
}

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

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  authenticationStub: Authentication
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const authenticationStub = makeAuthentication()
  const validationStub = makeValidation()
  const sut = new SignUpController(
    addAccountStub,
    authenticationStub,
    validationStub
  )

  return {
    sut,
    authenticationStub,
    addAccountStub,
    validationStub
  }
}

describe('SignUp controller', () => {
  test('should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const spy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeHttpRequest()

    await sut.handle(httpRequest)

    expect(spy).toBeCalledWith(httpRequest.body)
  })

  test('should return 500 if Validation throws', async () => {
    const { sut, validationStub } = makeSut()
    const httpRequest = makeFakeHttpRequest()

    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    const httpRequest = makeFakeHttpRequest()

    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValue(new MissingParamError('any_error'))

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_error')))
  })

  test('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const isValidEmailSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = makeFakeHttpRequest()

    await sut.handle(httpRequest)

    expect(isValidEmailSpy).toBeCalledWith({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    })
  })

  test('should call Authentication with correct value', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = makeFakeHttpRequest()
    const { body } = httpRequest
    const { email, password } = body

    await sut.handle(httpRequest)

    expect(authSpy).toHaveBeenCalledWith({
      email,
      password
    })
  })

  test('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    const error = new Error('unexpected error')

    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw error
    })

    const response = await sut.handle(httpRequest)

    expect(response).toEqual(serverError(error))
  })

  test('should return 500 if AddAccount throws exception', async () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await Promise.reject(new Error())
    })

    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('should return 201 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(created({ accessToken: 'any_access_token' }))
  })
})
