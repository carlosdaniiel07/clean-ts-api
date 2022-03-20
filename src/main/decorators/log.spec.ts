import { serverError } from '../../presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface SutTypes {
  sut: LogControllerDecorator
  controller: Controller
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (_: HttpRequest): Promise<HttpResponse> {
      return await Promise.resolve(serverError())
    }
  }

  return new ControllerStub()
}

const makeSut = (): SutTypes => {
  const controller = makeController()
  const sut = new LogControllerDecorator(controller)

  return {
    controller,
    sut
  }
}

describe('LogController decorator', () => {
  test('should call controller handle method', async () => {
    const { sut, controller } = makeSut()
    const spy = jest.spyOn(controller, 'handle')
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email'
      }
    }

    await sut.handle(httpRequest)

    expect(spy).toHaveBeenCalledWith(httpRequest)
  })

  test('should returns controller response', async () => {
    const { sut, controller } = makeSut()
    const httpResponse: HttpResponse = {
      statusCode: 200,
      body: {
        name: 'any_name',
        email: 'any_email'
      }
    }

    jest.spyOn(controller, 'handle').mockReturnValue(Promise.resolve(httpResponse))

    const response = await sut.handle({
      body: null
    })

    expect(response).toEqual(httpResponse)
  })

  test('should log error if controller returns 500 status code', async () => {
    const { sut } = makeSut()
    const spy = jest.spyOn(console, 'error')

    const httpResponse = await sut.handle({
      body: null
    })

    expect(spy).toHaveBeenCalledWith(httpResponse)
  })
})
