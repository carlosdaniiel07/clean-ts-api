import MockDate from 'mockdate'
import { SurveyModel } from '~/domain/models/survey'
import { SurveyResultModel } from '~/domain/models/survey-result'
import { LoadSurveyById } from '~/domain/usecases/load-survey-by-id'
import { LoadSurveyResultBySurvey } from '~/domain/usecases/load-survey-result-by-survey'
import {
  SaveSurveyResult,
  SaveSurveyResultParams
} from '~/domain/usecases/save-survey-result'
import {
  InvalidParamError,
  MissingParamError,
  NotFoundError
} from '~/presentation/errors'
import {
  badRequest,
  notFound,
  serverError,
  ok
} from '~/presentation/helpers/http-helper'
import { HttpRequest, Validation } from '~/presentation/protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'

type SutTypes = {
  validation: Validation
  loadSurveyById: LoadSurveyById
  saveSurveyResult: SaveSurveyResult
  loadSurveyResultBySurvey: LoadSurveyResultBySurvey
  sut: SaveSurveyResultController
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (data: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel | null> {
      return await Promise.resolve({
        id: 'any_id',
        question: 'any_question',
        answers: [
          {
            answer: 'any_answer',
            image: 'any_image'
          },
          {
            answer: 'other_answer'
          }
        ],
        date: new Date()
      })
    }
  }

  return new LoadSurveyByIdStub()
}

const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultParams): Promise<void> {
      await Promise.resolve()
    }
  }

  return new SaveSurveyResultStub()
}

const makeLoadSurveyResultBySurvey = (): LoadSurveyResultBySurvey => {
  class LoadSurveyResultBySurveyStub implements LoadSurveyResultBySurvey {
    async loadBySurvey (surveyId: string): Promise<SurveyResultModel> {
      return await Promise.resolve(makeFakeSurveyResultModel())
    }
  }

  return new LoadSurveyResultBySurveyStub()
}

const makeSut = (): SutTypes => {
  const validation = makeValidation()
  const loadSurveyById = makeLoadSurveyById()
  const saveSurveyResult = makeSaveSurveyResult()
  const loadSurveyResultBySurvey = makeLoadSurveyResultBySurvey()
  const sut = new SaveSurveyResultController(
    validation,
    loadSurveyById,
    saveSurveyResult,
    loadSurveyResultBySurvey
  )

  return {
    validation,
    loadSurveyById,
    saveSurveyResult,
    loadSurveyResultBySurvey,
    sut
  }
}

const makeFakeHttpRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_surveyId'
  },
  body: {
    answer: 'any_answer'
  },
  accountId: 'any_accountId'
})

const makeFakeSurveyResultModel = (): SurveyResultModel => ({
  question: 'any_question',
  surveyId: 'any_surveyId',
  date: new Date(),
  answers: [
    {
      answer: 'any_answer',
      percent: 100,
      count: 1
    }
  ]
})

describe('SaveSurveyResult controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call Validation with correct value', async () => {
    const { sut, validation } = makeSut()
    const spy = jest.spyOn(validation, 'validate')
    const httpRequest = makeFakeHttpRequest()

    await sut.handle(httpRequest)

    expect(spy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 400 if Validation fails', async () => {
    const { sut, validation } = makeSut()
    const httpRequest = makeFakeHttpRequest()

    jest
      .spyOn(validation, 'validate')
      .mockReturnValue(new MissingParamError('answer'))

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('answer')))
  })

  test('should return 500 if Validation throws', async () => {
    const { sut, validation } = makeSut()
    const httpRequest = makeFakeHttpRequest()

    jest.spyOn(validation, 'validate').mockImplementationOnce(() => {
      throw new Error('any_error')
    })

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new Error('any_error')))
  })

  test('should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurveyById } = makeSut()
    const spy = jest.spyOn(loadSurveyById, 'loadById')
    const httpRequest = makeFakeHttpRequest()

    await sut.handle(httpRequest)

    expect(spy).toHaveBeenCalledWith(httpRequest.params?.surveyId)
  })

  test('should return 404 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyById } = makeSut()

    jest
      .spyOn(loadSurveyById, 'loadById')
      .mockReturnValueOnce(Promise.resolve(null))

    const httpResponse = await sut.handle({
      ...makeFakeHttpRequest(),
      params: undefined
    })

    expect(httpResponse).toEqual(
      notFound(new NotFoundError('Survey not found'))
    )
  })

  test('should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyById } = makeSut()

    jest.spyOn(loadSurveyById, 'loadById').mockImplementationOnce(() => {
      throw new Error('any_error')
    })

    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(serverError(new Error('any_error')))
  })

  test('should call SaveSurveyResult with correct value', async () => {
    const { sut, saveSurveyResult } = makeSut()
    const spy = jest.spyOn(saveSurveyResult, 'save')
    const httpRequest = makeFakeHttpRequest()

    await sut.handle(httpRequest)

    expect(spy).toHaveBeenCalledWith({
      accountId: httpRequest.accountId,
      surveyId: httpRequest.params?.surveyId,
      answer: httpRequest.body.answer,
      date: new Date()
    })
  })

  test('should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResult } = makeSut()

    jest.spyOn(saveSurveyResult, 'save').mockImplementationOnce(() => {
      throw new Error('any_error')
    })

    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(serverError(new Error('any_error')))
  })

  test('should return 400 if answer is not a valid survey answer', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      ...makeFakeHttpRequest(),
      body: {
        answer: 'invalid_answer'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('answer')))
  })

  test('should call LoadSurveyResultBySurvey with correct value', async () => {
    const { sut, loadSurveyResultBySurvey } = makeSut()
    const spy = jest.spyOn(loadSurveyResultBySurvey, 'loadBySurvey')
    const httpRequest = makeFakeHttpRequest()

    await sut.handle(httpRequest)

    expect(spy).toHaveBeenCalledWith(httpRequest.params?.surveyId)
  })

  test('should return 500 if LoadSurveyResultBySurvey throws', async () => {
    const { sut, loadSurveyResultBySurvey } = makeSut()

    jest
      .spyOn(loadSurveyResultBySurvey, 'loadBySurvey')
      .mockImplementationOnce(() => {
        throw new Error('any_error')
      })

    const response = await sut.handle(makeFakeHttpRequest())

    expect(response).toEqual(serverError(new Error('any_error')))
  })

  test('should return 200 and survey result on success', async () => {
    const { sut } = makeSut()
    const surveyResult = makeFakeSurveyResultModel()
    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(ok(surveyResult))
  })
})
