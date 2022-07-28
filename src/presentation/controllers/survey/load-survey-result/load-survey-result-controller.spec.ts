import MockDate from 'mockdate'
import { SurveyResultModel } from '~/domain/models/survey-result'
import { LoadSurveyResultBySurvey } from '~/domain/usecases/load-survey-result-by-survey'
import { MissingParamError } from '~/presentation/errors'
import { badRequest, ok, serverError } from '~/presentation/helpers/http-helper'
import { LoadSurveyResultController } from './load-survey-result-controller'

type SutTypes = {
  loadSurveyResultBySurvey: LoadSurveyResultBySurvey
  sut: LoadSurveyResultController
}

const mockLoadSurveyResultBySurvey = (): LoadSurveyResultBySurvey => {
  class LoadSurveyResultBySurveyStub implements LoadSurveyResultBySurvey {
    async loadBySurvey (surveyId: string): Promise<SurveyResultModel> {
      return await Promise.resolve(makeFakeSurveyResultModel())
    }
  }

  return new LoadSurveyResultBySurveyStub()
}

const makeSut = (): SutTypes => {
  const loadSurveyResultBySurvey = mockLoadSurveyResultBySurvey()
  const sut = new LoadSurveyResultController(loadSurveyResultBySurvey)

  return {
    loadSurveyResultBySurvey,
    sut
  }
}

const makeFakeRequest = (): LoadSurveyResultController.Request => ({
  surveyId: 'any_surveyId'
})

const makeFakeSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_surveyId',
  question: 'any_question',
  date: new Date(),
  answers: [
    {
      answer: 'any_answer',
      count: 2,
      percent: 66.67,
      image: 'any_image'
    },
    {
      answer: 'other_answer',
      count: 1,
      percent: 33.33
    }
  ]
})

describe('LoadSurveyResult controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveyResultBySurvey with correct value', async () => {
    const { sut, loadSurveyResultBySurvey } = makeSut()
    const spy = jest.spyOn(loadSurveyResultBySurvey, 'loadBySurvey')
    const request = makeFakeRequest()

    await sut.handle(request)

    expect(spy).toHaveBeenCalledWith(request.surveyId)
  })

  test('should returns 400 if surveyId was not provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({} as any)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('surveyId')))
  })

  test('should returns 500 if LoadSurveyResultBySurvey throws', async () => {
    const { sut, loadSurveyResultBySurvey } = makeSut()

    jest
      .spyOn(loadSurveyResultBySurvey, 'loadBySurvey')
      .mockImplementationOnce(() => {
        throw new Error('any_error')
      })

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(new Error('any_error')))
  })

  test('should return 200 and survey result data', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok(makeFakeSurveyResultModel()))
  })
})
