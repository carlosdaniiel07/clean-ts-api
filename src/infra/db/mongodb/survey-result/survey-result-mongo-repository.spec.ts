import MockDate from 'mockdate'
import { MongoHelper } from '~/infra/db/mongodb/helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { Collection } from 'mongodb'
import { SaveSurveyResultParams } from '~/domain/usecases/save-survey-result'
import { SurveyResultModel } from '~/domain/models/survey-result'

const makeFakeSaveSurveyResultModel = (): SaveSurveyResultParams => ({
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

  describe('loadByAccountAndSurvey()', () => {
    test('should return a specific survey result by accountId and surveyId', async () => {
      const sut = makeSut()

      await createSurveyResult()

      const surveyResult = await sut.loadByAccountAndSurvey(
        'any_accountId',
        'any_surveyId'
      )

      expect(surveyResult).toBeTruthy()
      expect(surveyResult).toEqual({
        id: surveyResult?.id,
        accountId: 'any_accountId',
        surveyId: 'any_surveyId',
        answer: 'any_answer',
        date: new Date()
      })
    })

    test('should return null if specific survey result not exists', async () => {
      const sut = makeSut()
      const surveyResult = await sut.loadByAccountAndSurvey(
        'any_accountId',
        'any_surveyId'
      )

      expect(surveyResult).toBeNull()
    })
  })

  describe('add()', () => {
    test('should create a survey result', async () => {
      const sut = makeSut()
      const saveSurveyResultModel = makeFakeSaveSurveyResultModel()

      await sut.add(saveSurveyResultModel)

      const surveyResult = await collection.findOne({
        accountId: 'any_accountId',
        surveyId: 'any_surveyId',
        answer: 'any_answer'
      })

      expect(surveyResult).toBeTruthy()
    })
  })

  describe('update()', () => {
    test('should update a survey result by id', async () => {
      const sut = makeSut()
      const createdSurveyResult = await createSurveyResult()

      await sut.update(createdSurveyResult.id, {
        ...makeFakeSaveSurveyResultModel(),
        answer: 'new_answer'
      })

      const surveyResult = await collection.findOne({
        _id: createdSurveyResult.id,
        accountId: 'any_accountId',
        surveyId: 'any_surveyId',
        answer: 'new_answer'
      })

      expect(surveyResult).toBeTruthy()
    })
  })

  const createSurveyResult = async (): Promise<SurveyResultModel> => {
    const saveSurveyResultModel = makeFakeSaveSurveyResultModel()
    await collection.insertOne(saveSurveyResultModel)

    return MongoHelper.mapToModel<SurveyResultModel>(saveSurveyResultModel)
  }
})
