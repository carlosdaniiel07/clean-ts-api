import MockDate from 'mockdate'
import { AddSurveyResultRepository } from '~/data/protocols/db/survey-result/add-survey-result-repository'
import { CountSurveyResultByAccountAndSurveyRepository } from '~/data/protocols/db/survey-result/count-survey-result-by-account-and-survey'
import { UpdateSurveyResultRepository } from '~/data/protocols/db/survey-result/update-survey-result-repository'
import { SaveSurveyResultParams } from '~/domain/usecases/save-survey-result'
import { DbSaveSurveyResult } from './db-save-survey-result'

type SutTypes = {
  countSurveyResultByAccountAndSurveyRepository: CountSurveyResultByAccountAndSurveyRepository
  addSurveyResultRepository: AddSurveyResultRepository
  updateSurveyResultRepository: UpdateSurveyResultRepository
  sut: DbSaveSurveyResult
}

const makeCountSurveyResultByAccountAndSurveyRepository =
  (): CountSurveyResultByAccountAndSurveyRepository => {
    class CountSurveyResultByAccountAndSurveyRepositoryStub
    implements CountSurveyResultByAccountAndSurveyRepository {
      async countByAccountAndSurvey (
        accountId: string,
        surveyId: string
      ): Promise<number> {
        return await Promise.resolve(0)
      }
    }

    return new CountSurveyResultByAccountAndSurveyRepositoryStub()
  }

const makeAddSurveyResultRepository = (): AddSurveyResultRepository => {
  class AddSurveyResultRepositoryStub implements AddSurveyResultRepository {
    async add (data: SaveSurveyResultParams): Promise<void> {
      return await Promise.resolve()
    }
  }

  return new AddSurveyResultRepositoryStub()
}

const makeUpdateSurveyResultRepository = (): UpdateSurveyResultRepository => {
  class UpdateSurveyResultRepositoryStub
  implements UpdateSurveyResultRepository {
    async update (data: SaveSurveyResultParams): Promise<void> {
      return await Promise.resolve()
    }
  }

  return new UpdateSurveyResultRepositoryStub()
}

const makeSut = (): SutTypes => {
  const countSurveyResultByAccountAndSurveyRepository =
    makeCountSurveyResultByAccountAndSurveyRepository()
  const addSurveyResultRepository = makeAddSurveyResultRepository()
  const updateSurveyResultRepository = makeUpdateSurveyResultRepository()
  const sut = new DbSaveSurveyResult(
    countSurveyResultByAccountAndSurveyRepository,
    addSurveyResultRepository,
    updateSurveyResultRepository
  )

  return {
    countSurveyResultByAccountAndSurveyRepository,
    addSurveyResultRepository,
    updateSurveyResultRepository,
    sut
  }
}

const makeFakeSaveSurveyResultModel = (): SaveSurveyResultParams => ({
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

  test('should call CountSurveyResultByAccountAndSurveyRepository with correct value', async () => {
    const { sut, countSurveyResultByAccountAndSurveyRepository } = makeSut()
    const spy = jest.spyOn(
      countSurveyResultByAccountAndSurveyRepository,
      'countByAccountAndSurvey'
    )
    const saveSurveyResultModel = makeFakeSaveSurveyResultModel()

    await sut.save(saveSurveyResultModel)

    expect(spy).toHaveBeenCalledWith(
      saveSurveyResultModel.accountId,
      saveSurveyResultModel.surveyId
    )
  })

  test('should call AddSurveyResultRepository with correct value when CountSurveyResultByAccountAndSurveyRepository returns zero', async () => {
    const { sut, addSurveyResultRepository } = makeSut()
    const spy = jest.spyOn(addSurveyResultRepository, 'add')
    const saveSurveyResultModel = makeFakeSaveSurveyResultModel()

    await sut.save(saveSurveyResultModel)

    expect(spy).toHaveBeenCalledWith(saveSurveyResultModel)
  })

  test('should call UpdateSurveyResultRepository with correct value when CountSurveyResultByAccountAndSurveyRepository not returns zero', async () => {
    const {
      sut,
      countSurveyResultByAccountAndSurveyRepository,
      updateSurveyResultRepository
    } = makeSut()
    const spy = jest.spyOn(updateSurveyResultRepository, 'update')
    const saveSurveyResultModel: SaveSurveyResultParams = {
      ...makeFakeSaveSurveyResultModel(),
      answer: 'new_answer'
    }

    jest
      .spyOn(
        countSurveyResultByAccountAndSurveyRepository,
        'countByAccountAndSurvey'
      )
      .mockReturnValueOnce(Promise.resolve(1))

    await sut.save(saveSurveyResultModel)

    expect(spy).toHaveBeenCalledWith(saveSurveyResultModel)
  })

  test('should throw if CountSurveyResultByAccountAndSurveyRepository throws', async () => {
    const { sut, countSurveyResultByAccountAndSurveyRepository } = makeSut()

    jest
      .spyOn(
        countSurveyResultByAccountAndSurveyRepository,
        'countByAccountAndSurvey'
      )
      .mockImplementationOnce(() => {
        throw new Error('any_error')
      })

    const promise = sut.save(makeFakeSaveSurveyResultModel())

    await expect(promise).rejects.toThrow(new Error('any_error'))
  })

  test('should throw if AddSurveyResultRepository throws', async () => {
    const { sut, addSurveyResultRepository } = makeSut()

    jest.spyOn(addSurveyResultRepository, 'add').mockImplementationOnce(() => {
      throw new Error('any_error')
    })

    const promise = sut.save(makeFakeSaveSurveyResultModel())

    await expect(promise).rejects.toThrow(new Error('any_error'))
  })

  test('should throw if UpdateSurveyResultRepository throws', async () => {
    const {
      sut,
      countSurveyResultByAccountAndSurveyRepository,
      updateSurveyResultRepository
    } = makeSut()

    jest
      .spyOn(
        countSurveyResultByAccountAndSurveyRepository,
        'countByAccountAndSurvey'
      )
      .mockReturnValueOnce(Promise.resolve(1))
    jest
      .spyOn(updateSurveyResultRepository, 'update')
      .mockImplementationOnce(() => {
        throw new Error('any_error')
      })

    const promise = sut.save(makeFakeSaveSurveyResultModel())

    await expect(promise).rejects.toThrow(new Error('any_error'))
  })
})
