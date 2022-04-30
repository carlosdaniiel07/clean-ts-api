import { SurveyModel } from '~/domain/models/survey'
import { LoadSurveys } from '~/domain/usecases/load-surveys'
import { serverError, noContent, ok } from '~/presentation/helpers/http-helper'
import { HttpRequest } from '~/presentation/protocols'
import { LoadSurveysController } from './load-surveys-controller'

type SutTypes = {
  loadSurveys: LoadSurveys
  sut: LoadSurveysController
}

const makeLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      const surveys: SurveyModel[] = [makeSurveyModel()]
      return await Promise.resolve(surveys)
    }
  }

  return new LoadSurveysStub()
}

const makeSut = (): SutTypes => {
  const loadSurveys = makeLoadSurveys()
  const sut = new LoadSurveysController(loadSurveys)

  return {
    loadSurveys,
    sut
  }
}

const makeFakeHttpRequest = (): HttpRequest => ({
  body: null
})

const makeSurveyModel = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [
    {
      answer: 'any_answer',
      image: 'any_image'
    }
  ],
  date: new Date(2022, 4, 28, 0, 40)
})

describe('LoadSurveys controller', () => {
  test('should call LoadSurveys', async () => {
    const { sut, loadSurveys } = makeSut()
    const spy = jest.spyOn(loadSurveys, 'load')

    await sut.handle(makeFakeHttpRequest())

    expect(spy).toHaveBeenCalled()
  })

  test('should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveys } = makeSut()

    jest.spyOn(loadSurveys, 'load').mockImplementationOnce(() => {
      throw new Error('any_error')
    })

    const response = await sut.handle(makeFakeHttpRequest())

    expect(response).toEqual(serverError(new Error('any_error')))
  })

  test('should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveys } = makeSut()

    jest.spyOn(loadSurveys, 'load').mockReturnValueOnce(Promise.resolve([]))

    const response = await sut.handle(makeFakeHttpRequest())

    expect(response).toEqual(noContent())
  })

  test('should return 200 and survey list', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeFakeHttpRequest())
    const surveys = [makeSurveyModel()]

    expect(response).toEqual(ok(surveys))
  })
})
