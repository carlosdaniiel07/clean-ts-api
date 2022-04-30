import { LoadSurveysRepository } from '~/data/protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '~/domain/models/survey'
import { DbLoadSurveys } from './db-load-surveys'

type SutTypes = {
  loadSurveysRepository: LoadSurveysRepository
  sut: DbLoadSurveys
}

const makeLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      const surveys: SurveyModel[] = [makeSurveyModel()]
      return await Promise.resolve(surveys)
    }
  }

  return new LoadSurveysRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadSurveysRepository = makeLoadSurveysRepository()
  const sut = new DbLoadSurveys(loadSurveysRepository)

  return {
    loadSurveysRepository,
    sut
  }
}

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

describe('DbLoadSurveys usecase', () => {
  test('should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepository } = makeSut()
    const spy = jest.spyOn(loadSurveysRepository, 'loadAll')

    await sut.load()

    expect(spy).toHaveBeenCalled()
  })

  test('should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepository } = makeSut()

    jest.spyOn(loadSurveysRepository, 'loadAll').mockImplementationOnce(() => {
      throw new Error('any_error')
    })

    const promise = sut.load()

    await expect(promise).rejects.toThrow(new Error('any_error'))
  })

  test('should return a survey list', async () => {
    const { sut } = makeSut()
    const response = await sut.load()

    expect(response).toEqual([makeSurveyModel()])
  })
})
