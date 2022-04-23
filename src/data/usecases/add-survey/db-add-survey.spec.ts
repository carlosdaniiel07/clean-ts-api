import { SurveyModel } from '../../../domain/models/survey'
import { AddSurveyModel } from '../../../domain/usecases/add-survey'
import { AddSurveyRepository } from '../../protocols/db/survey/add-survey-repository'
import { DbAddSurvey } from './db-add-survey'

interface SutTypes {
  addSurveyRepository: AddSurveyRepository
  sut: DbAddSurvey
}

const makeAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (survey: AddSurveyModel): Promise<SurveyModel> {
      return await Promise.resolve({
        id: 'any_id',
        ...survey
      })
    }
  }

  return new AddSurveyRepositoryStub()
}

const makeSut = (): SutTypes => {
  const addSurveyRepository = makeAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepository)

  return {
    addSurveyRepository,
    sut
  }
}

const makeFakeAddSurveyModel = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [
    {
      answer: 'any_answer',
      image: 'any_image'
    }
  ]
})

describe('DbAddSurvey usecase', () => {
  it('should call AddSurveyRepository with correct value', async () => {
    const { sut, addSurveyRepository } = makeSut()
    const addSurveyModel = makeFakeAddSurveyModel()
    const spy = jest.spyOn(addSurveyRepository, 'add')

    await sut.add(addSurveyModel)

    expect(spy).toHaveBeenCalledWith(addSurveyModel)
  })

  it('should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepository } = makeSut()
    const addSurveyModel = makeFakeAddSurveyModel()

    jest.spyOn(addSurveyRepository, 'add').mockImplementationOnce(() => {
      throw new Error('any_error')
    })

    const promise = sut.add(addSurveyModel)

    await expect(promise).rejects.toThrow(new Error('any_error'))
  })
})