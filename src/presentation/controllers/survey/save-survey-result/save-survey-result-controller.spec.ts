import MockDate from 'mockdate'
import { SurveyModel } from '~/domain/models/survey'
import { LoadSurveyById } from '~/domain/usecases/load-survey-by-id'
import {
  SaveSurveyResult,
  SaveSurveyResultModel
} from '~/domain/usecases/save-survey-result'
import {
  InvalidParamError,
  MissingParamError,
  NotFoundError
} from '~/presentation/errors'
import {
  badRequest,
  noContent,
  notFound,
  serverError
} from '~/presentation/helpers/http-helper'
import { HttpRequest, Validation } from '~/presentation/protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'

type SutTypes = {
  validation: Validation
  loadSurveyById: LoadSurveyById
  saveSurveyResult: SaveSurveyResult
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
    async save (data: SaveSurveyResultModel): Promise<void> {
      await Promise.resolve()
    }
  }

  return new SaveSurveyResultStub()
}

const makeSut = (): SutTypes => {
  const validation = makeValidation()
  const loadSurveyById = makeLoadSurveyById()
  const saveSurveyResult = makeSaveSurveyResult()
  const sut = new SaveSurveyResultController(
    validation,
    loadSurveyById,
    saveSurveyResult
  )

  return {
    validation,
    loadSurveyById,
    saveSurveyResult,
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

  test('should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(noContent())
  })
})
