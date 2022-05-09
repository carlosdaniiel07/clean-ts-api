import MockDate from 'mockdate'
import { SurveyResultModel } from '~/domain/models/survey-result'
import { LoadSurveyResultBySurvey } from '~/domain/usecases/load-survey-result-by-survey'
import { DbLoadSurveyResultBySurvey } from './db-load-survey-result-by-survey'

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

type SutTypes = {
  loadSurveyResultBySurvey: LoadSurveyResultBySurvey
  sut: DbLoadSurveyResultBySurvey
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
  const loadSurveyResultBySurvey = makeLoadSurveyResultBySurvey()
  const sut = new DbLoadSurveyResultBySurvey(loadSurveyResultBySurvey)

  return {
    loadSurveyResultBySurvey,
    sut
  }
}

describe('DbLoadSurveyResultBySurvey usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveyResultBySurveyRepository with correct value', async () => {
    const { sut, loadSurveyResultBySurvey } = makeSut()
    const spy = jest.spyOn(loadSurveyResultBySurvey, 'loadBySurvey')

    await sut.loadBySurvey('any_surveyId')

    expect(spy).toHaveBeenCalledWith('any_surveyId')
  })

  test('should throw if LoadSurveyResultBySurveyRepository throws', async () => {
    const { sut, loadSurveyResultBySurvey } = makeSut()

    jest
      .spyOn(loadSurveyResultBySurvey, 'loadBySurvey')
      .mockImplementationOnce(() => {
        throw new Error('any_error')
      })

    const promise = sut.loadBySurvey('any_surveyId')

    await expect(promise).rejects.toThrow(new Error('any_error'))
  })

  test('should return survey result', async () => {
    const { sut } = makeSut()
    const result = await sut.loadBySurvey('any_surveyId')

    expect(result).toEqual(makeFakeSurveyResultModel())
  })
})
