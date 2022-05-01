import MockDate from 'mockdate'
import { LoadSurveyByIdRepository } from '~/data/protocols/db/survey/load-survey-by-id-repository'
import { SurveyModel } from '~/domain/models/survey'
import { DbLoadSurveyById } from './db-load-survey-by-id'

type SutTypes = {
  loadSurveyByIdRepository: LoadSurveyByIdRepository
  sut: DbLoadSurveyById
}

const makeLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel | null> {
      return await Promise.resolve({
        id: 'any_id',
        question: 'any_question',
        answers: [
          {
            answer: 'any_answer'
          }
        ],
        date: new Date()
      })
    }
  }

  return new LoadSurveyByIdRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepository = makeLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepository)

  return {
    loadSurveyByIdRepository,
    sut
  }
}

describe('DbLoadSurveyById usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveyByIdRepository with correct value', async () => {
    const { sut, loadSurveyByIdRepository } = makeSut()
    const spy = jest.spyOn(loadSurveyByIdRepository, 'loadById')

    await sut.loadById('any_id')

    expect(spy).toHaveBeenCalledWith('any_id')
  })

  test('should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepository } = makeSut()

    jest
      .spyOn(loadSurveyByIdRepository, 'loadById')
      .mockImplementationOnce(() => {
        throw new Error('any_error')
      })

    const promise = sut.loadById('any_id')

    await expect(promise).rejects.toThrow(new Error('any_error'))
  })

  test('should return null if LoadSurveyByIdRepository returnsn null', async () => {
    const { sut, loadSurveyByIdRepository } = makeSut()

    jest
      .spyOn(loadSurveyByIdRepository, 'loadById')
      .mockReturnValueOnce(Promise.resolve(null))

    const response = await sut.loadById('any_id')

    expect(response).toBeNull()
  })

  test('should return a survey on success', async () => {
    const { sut } = makeSut()
    const response = await sut.loadById('any_id')

    expect(response).toEqual({
      id: 'any_id',
      question: 'any_question',
      answers: [
        {
          answer: 'any_answer'
        }
      ],
      date: new Date()
    })
  })
})
