import MockDate from 'mockdate'
import { MongoHelper } from '~/infra/db/mongodb/helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { Collection, ObjectId } from 'mongodb'
import { SaveSurveyResultParams } from '~/domain/usecases/save-survey-result'
import { SurveyResultModel } from '~/domain/models/survey-result'

const makeFakeSaveSurveyResultModel = (): SaveSurveyResultParams => ({
  accountId: '627813efa1e9cfe4f4ff07f2',
  surveyId: '627813f2e55be6efaaff4a19',
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

  describe('countByAccountAndSurvey()', () => {
    test('should return a count of results filtering by accountId and surveyId', async () => {
      const sut = makeSut()
      const { accountId, surveyId } = makeFakeSaveSurveyResultModel()

      await createSurveyResult()

      const count = await sut.countByAccountAndSurvey(accountId, surveyId)

      expect(count).toBe(1)
    })

    test('should return zero as count if specific survey result not exists', async () => {
      const sut = makeSut()
      const { accountId, surveyId } = makeFakeSaveSurveyResultModel()
      const count = await sut.countByAccountAndSurvey(accountId, surveyId)

      expect(count).toBe(0)
    })
  })

  describe('add()', () => {
    test('should create a survey result', async () => {
      const sut = makeSut()
      const saveSurveyResultModel = makeFakeSaveSurveyResultModel()
      const { accountId, surveyId } = saveSurveyResultModel

      await sut.add(saveSurveyResultModel)

      const surveyResult = await collection.findOne({
        accountId: new ObjectId(accountId),
        surveyId: new ObjectId(surveyId),
        answer: 'any_answer'
      })

      expect(surveyResult).toBeTruthy()
    })
  })

  describe('update()', () => {
    test('should update a survey result', async () => {
      const sut = makeSut()
      const saveSurveyResultModel = makeFakeSaveSurveyResultModel()
      const { surveyId, accountId } = saveSurveyResultModel

      await createSurveyResult()

      await sut.update({
        ...saveSurveyResultModel,
        answer: 'new_answer'
      })

      const surveyResult = await collection.findOne({
        surveyId: new ObjectId(surveyId),
        accountId: new ObjectId(accountId),
        answer: 'new_answer'
      })

      expect(surveyResult).toBeTruthy()
    })
  })

  const createSurveyResult = async (): Promise<SurveyResultModel> => {
    const saveSurveyResultModel = makeFakeSaveSurveyResultModel()
    const { surveyId, accountId } = saveSurveyResultModel

    await collection.insertOne({
      ...saveSurveyResultModel,
      surveyId: new ObjectId(surveyId),
      accountId: new ObjectId(accountId)
    })

    return MongoHelper.mapToModel<SurveyResultModel>(saveSurveyResultModel)
  }
})
