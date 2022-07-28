import MockDate from 'mockdate'
import { AddSurvey, AddSurveyParams } from '~/domain/usecases/add-survey'
import { MissingParamError } from '~/presentation/errors'
import { badRequest, serverError } from '~/presentation/helpers/http-helper'
import { Validation } from '~/presentation/protocols'
import { AddSurveyController } from './add-survey-controller'

type SutTypes = {
  validation: Validation
  addSurvey: AddSurvey
  sut: AddSurveyController
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (data: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

const makeAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyParams): Promise<void> {
      await Promise.resolve()
    }
  }

  return new AddSurveyStub()
}

const makeSut = (): SutTypes => {
  const validation = makeValidation()
  const addSurvey = makeAddSurvey()
  const sut = new AddSurveyController(validation, addSurvey)

  return {
    validation,
    addSurvey,
    sut
  }
}

const makeFakeRequest = (): AddSurveyController.Request => ({
  question: 'any_question',
  answers: [
    {
      answer: 'any_answer',
      image: 'any_image'
    }
  ]
})

describe('AddSurvey controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

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
      .mockReturnValueOnce(new MissingParamError('any_param'))

    const response = await sut.handle(request)

    expect(response).toEqual(badRequest(new MissingParamError('any_param')))
  })

  test('should return 500 if Validation throws', async () => {
    const { sut, validation } = makeSut()
    const request = makeFakeRequest()

    jest.spyOn(validation, 'validate').mockImplementationOnce(() => {
      throw new Error('any_error')
    })

    const response = await sut.handle(request)

    expect(response).toEqual(serverError(new Error('any_error')))
  })

  test('should call AddSurvey with correct value', async () => {
    const { sut, addSurvey } = makeSut()
    const request = makeFakeRequest()
    const spy = jest.spyOn(addSurvey, 'add')

    await sut.handle(request)

    expect(spy).toHaveBeenCalledWith({
      ...request,
      date: new Date()
    })
  })

  test('should return 500 if AddSurvey throws', async () => {
    const { sut, addSurvey } = makeSut()
    const request = makeFakeRequest()

    jest.spyOn(addSurvey, 'add').mockImplementationOnce(() => {
      throw new Error('any_error')
    })

    const response = await sut.handle(request)

    expect(response).toEqual(serverError(new Error('any_error')))
  })

  test('should return 201 on success', async () => {
    const { sut } = makeSut()
    const request = makeFakeRequest()
    const response = await sut.handle(request)

    expect(response.body).toBeFalsy()
    expect(response.statusCode).toBe(201)
  })
})
