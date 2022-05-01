import MockDate from 'mockdate'
import { MongoHelper } from '~/infra/db/mongodb/helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { Collection } from 'mongodb'
import { SaveSurveyResultModel } from '~/domain/usecases/save-survey-result'

const makeFakeSaveSurveyResultModel = (): SaveSurveyResultModel => ({
  accountId: 'any_accountId',
  surveyId: 'any_surveyId',
  answer: 'any_answer',
  date: new Date()
})

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

describe('SurveyResult Mongo repository', () => {
  let collection: Collection

  beforeAll(async () => {
    MockDate.set(new Date())
    await MongoHelper.connect(global.__MONGO_URI__)
  })

  afterAll(async () => {
    MockDate.reset()
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    collection = await MongoHelper.getCollection('survey_results')
    await collection.deleteMany({})
  })

  describe('loadResultByAccountAndSurvey()', () => {
    test('should return a specific survey result by accountId and surveyId', async () => {
      const sut = makeSut()

      await collection.insertOne(makeFakeSaveSurveyResultModel())

      const survey = await sut.loadByAccountAndSurvey(
        'any_accountId',
        'any_surveyId'
      )

      expect(survey).toBeTruthy()
      expect(survey).toEqual({
        id: survey?.id,
        accountId: 'any_accountId',
        surveyId: 'any_surveyId',
        answer: 'any_answer',
        date: new Date()
      })
    })

    test('should return null if specific survey result not exists', async () => {
      const sut = makeSut()
      const survey = await sut.loadByAccountAndSurvey(
        'any_accountId',
        'any_surveyId'
      )

      expect(survey).toBeNull()
    })
  })
})
