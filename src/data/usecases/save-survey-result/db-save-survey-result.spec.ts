import MockDate from 'mockdate'
import { AddSurveyResultRepository } from '~/data/protocols/db/survey/add-survey-result-repository'
import { LoadSurveyResultByAccountAndSurveyRepository } from '~/data/protocols/db/survey/load-survey-result-by-account-and-survey'
import { UpdateSurveyResultRepository } from '~/data/protocols/db/survey/update-survey-result-repository'
import { SurveyResultModel } from '~/domain/models/survey-result'
import { SaveSurveyResultModel } from '~/domain/usecases/save-survey-result'
import { DbSaveSurveyResult } from './db-save-survey-result'

type SutTypes = {
  loadSurveyResultByAccountAndSurveyRepository: LoadSurveyResultByAccountAndSurveyRepository
  addSurveyResultRepository: AddSurveyResultRepository
  updateSurveyResultRepository: UpdateSurveyResultRepository
  sut: DbSaveSurveyResult
}

const makeLoadSurveyResultByAccountAndSurveyRepository =
  (): LoadSurveyResultByAccountAndSurveyRepository => {
    class LoadSurveyResultByAccountAndSurveyRepositoryStub
    implements LoadSurveyResultByAccountAndSurveyRepository {
      async loadResultByAccountAndSurvey (
        id: string
      ): Promise<SurveyResultModel | null> {
        return await Promise.resolve(null)
      }
    }

    return new LoadSurveyResultByAccountAndSurveyRepositoryStub()
  }

const makeAddSurveyResultRepository = (): AddSurveyResultRepository => {
  class AddSurveyResultRepositoryStub implements AddSurveyResultRepository {
    async addResult (data: SaveSurveyResultModel): Promise<void> {
      return await Promise.resolve()
    }
  }

  return new AddSurveyResultRepositoryStub()
}

const makeUpdateSurveyResultRepository = (): UpdateSurveyResultRepository => {
  class UpdateSurveyResultRepositoryStub
  implements UpdateSurveyResultRepository {
    async updateResult (id: string, data: SaveSurveyResultModel): Promise<void> {
      return await Promise.resolve()
    }
  }

  return new UpdateSurveyResultRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadSurveyResultByAccountAndSurvey =
    makeLoadSurveyResultByAccountAndSurveyRepository()
  const addSurveyResultRepository = makeAddSurveyResultRepository()
  const updateSurveyResultRepository = makeUpdateSurveyResultRepository()
  const sut = new DbSaveSurveyResult(
    loadSurveyResultByAccountAndSurvey,
    addSurveyResultRepository,
    updateSurveyResultRepository
  )

  return {
    loadSurveyResultByAccountAndSurveyRepository: loadSurveyResultByAccountAndSurvey,
    addSurveyResultRepository,
    updateSurveyResultRepository,
    sut
  }
}

const makeFakeSaveSurveyResultModel = (): SaveSurveyResultModel => ({
  accountId: 'any_accountId',
  surveyId: 'any_surveyId',
  answer: 'any_answer',
  date: new Date()
})

const makeFakeSurveyResultModel = (): SurveyResultModel => ({
  id: 'any_id',
  accountId: 'any_accountId',
  surveyId: 'any_surveyId',
  answer: 'any_answer',
  date: new Date()
})

describe('DbSaveSurveyResult usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveyResultByIdRepository with correct value', async () => {
    const { sut, loadSurveyResultByAccountAndSurveyRepository: loadSurveyResultByAccountAndSurvey } = makeSut()
    const spy = jest.spyOn(
      loadSurveyResultByAccountAndSurvey,
      'loadResultByAccountAndSurvey'
    )
    const saveSurveyResultModel = makeFakeSaveSurveyResultModel()

    await sut.save(saveSurveyResultModel)

    expect(spy).toHaveBeenCalledWith(
      saveSurveyResultModel.accountId,
      saveSurveyResultModel.surveyId
    )
  })

  test('should call AddSurveyResultRepository with correct value when LoadSurveyResultByIdRepository returns null', async () => {
    const { sut, addSurveyResultRepository } = makeSut()
    const spy = jest.spyOn(addSurveyResultRepository, 'addResult')
    const saveSurveyResultModel = makeFakeSaveSurveyResultModel()

    await sut.save(saveSurveyResultModel)

    expect(spy).toHaveBeenCalledWith(saveSurveyResultModel)
  })

  test('should call UpdateSurveyResultRepository with correct value when LoadSurveyResultByIdRepository not returns null', async () => {
    const {
      sut,
      loadSurveyResultByAccountAndSurveyRepository: loadSurveyResultByAccountAndSurvey,
      updateSurveyResultRepository
    } = makeSut()
    const spy = jest.spyOn(updateSurveyResultRepository, 'updateResult')
    const saveSurveyResultModel: SaveSurveyResultModel = {
      ...makeFakeSaveSurveyResultModel(),
      answer: 'new_answer'
    }

    jest
      .spyOn(loadSurveyResultByAccountAndSurvey, 'loadResultByAccountAndSurvey')
      .mockReturnValueOnce(Promise.resolve(makeFakeSurveyResultModel()))

    await sut.save(saveSurveyResultModel)

    expect(spy).toHaveBeenCalledWith('any_id', saveSurveyResultModel)
  })

  test('should throw if LoadSurveyResultByAccountAndSurvey throws', async () => {
    const { sut, loadSurveyResultByAccountAndSurveyRepository: loadSurveyResultByAccountAndSurvey } = makeSut()

    jest
      .spyOn(loadSurveyResultByAccountAndSurvey, 'loadResultByAccountAndSurvey')
      .mockImplementationOnce(() => {
        throw new Error('any_error')
      })

    const promise = sut.save(makeFakeSaveSurveyResultModel())

    await expect(promise).rejects.toThrow(new Error('any_error'))
  })

  test('should throw if AddSurveyResultRepository throws', async () => {
    const { sut, addSurveyResultRepository } = makeSut()

    jest
      .spyOn(addSurveyResultRepository, 'addResult')
      .mockImplementationOnce(() => {
        throw new Error('any_error')
      })

    const promise = sut.save(makeFakeSaveSurveyResultModel())

    await expect(promise).rejects.toThrow(new Error('any_error'))
  })

  test('should throw if UpdateSurveyResultRepository throws', async () => {
    const {
      sut,
      loadSurveyResultByAccountAndSurveyRepository: loadSurveyResultByAccountAndSurvey,
      updateSurveyResultRepository
    } = makeSut()

    jest
      .spyOn(loadSurveyResultByAccountAndSurvey, 'loadResultByAccountAndSurvey')
      .mockReturnValueOnce(Promise.resolve(makeFakeSurveyResultModel()))
    jest
      .spyOn(updateSurveyResultRepository, 'updateResult')
      .mockImplementationOnce(() => {
        throw new Error('any_error')
      })

    const promise = sut.save(makeFakeSaveSurveyResultModel())

    await expect(promise).rejects.toThrow(new Error('any_error'))
  })
})
