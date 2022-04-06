import { LogErrorRepository } from '../../data/protocols/db/log-error-repository'
import { ServerError } from '../../presentation/errors'
import { ok, serverError } from '../../presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email'
  }
})

const makeFakeError = (): HttpResponse => {
  const error = new Error()
  error.stack = 'fake_stack_trace'

  return serverError(error)
}

interface SutTypes {
  sut: LogControllerDecorator
  controller: Controller
  logErrorRepository: LogErrorRepository
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (_: HttpRequest): Promise<HttpResponse> {
      return await Promise.resolve(serverError())
    }
  }

  return new ControllerStub()
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stackTrace: string): Promise<void> {
      await Promise.resolve()
    }
  }

  return new LogErrorRepositoryStub()
}

const makeSut = (): SutTypes => {
  const controller = makeController()
  const logErrorRepository = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controller, logErrorRepository)

  return {
    controller,
    sut,
    logErrorRepository
  }
}

describe('LogController decorator', () => {
  test('should call controller handle method', async () => {
    const { sut, controller } = makeSut()
    const spy = jest.spyOn(controller, 'handle')
    const httpRequest: HttpRequest = makeFakeHttpRequest()

    await sut.handle(httpRequest)

    expect(spy).toHaveBeenCalledWith(httpRequest)
  })

  test('should returns controller response', async () => {
    const { sut, controller } = makeSut()
    const httpResponse: HttpResponse = ok(makeFakeHttpRequest())

    jest.spyOn(controller, 'handle').mockReturnValue(Promise.resolve(httpResponse))

    const response = await sut.handle({
      body: null
    })

    expect(response).toEqual(httpResponse)
  })

  test('should call LogErrorRepository with correct value if controller returns server error', async () => {
    const { sut, controller, logErrorRepository } = makeSut()
    const error = makeFakeError()
    const spy = jest.spyOn(logErrorRepository, 'logError')

    jest.spyOn(controller, 'handle').mockImplementation(async () => await Promise.resolve(error))

    await sut.handle({
      body: null
    })

    expect(spy).toHaveBeenCalledWith((error.body as ServerError).stack)
  })
})
