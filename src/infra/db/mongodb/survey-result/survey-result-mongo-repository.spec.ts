import MockDate from 'mockdate'
import { MongoHelper } from '~/infra/db/mongodb/helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { Collection, ObjectId } from 'mongodb'
import { SaveSurveyResultParams } from '~/domain/usecases/save-survey-result'
import { SurveyModel } from '~/domain/models/survey'
import { AddSurveyParams } from '~/domain/usecases/add-survey'

const makeFakeAddSurveyParams = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [
    {
      answer: 'any_answer'
    },
    {
      answer: 'other_answer'
    }
  ],
  date: new Date()
})

const makeFakeSaveSurveyResultParams = (): SaveSurveyResultParams => ({
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
  let surveyCollection: Collection

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
    surveyCollection = await MongoHelper.getCollection('surveys')

    await collection.deleteMany({})
    await surveyCollection.deleteMany({})
  })

  describe('countByAccountAndSurvey()', () => {
    test('should return a count of results filtering by accountId and surveyId', async () => {
      const sut = makeSut()
      const { accountId, surveyId } = makeFakeSaveSurveyResultParams()

      await createSurveyResult()

      const count = await sut.countByAccountAndSurvey(accountId, surveyId)

      expect(count).toBe(1)
    })

    test('should return zero as count if specific survey result not exists', async () => {
      const sut = makeSut()
      const { accountId, surveyId } = makeFakeSaveSurveyResultParams()
      const count = await sut.countByAccountAndSurvey(accountId, surveyId)

      expect(count).toBe(0)
    })
  })

  describe('add()', () => {
    test('should create a survey result', async () => {
      const sut = makeSut()
      const saveSurveyResultModel = makeFakeSaveSurveyResultParams()
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
      const saveSurveyResultModel = makeFakeSaveSurveyResultParams()
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

  describe('loadBySurvey()', () => {
    test('should return survey result of a specific survey', async () => {
      const sut = makeSut()
      const survey = await createSurvey()
      const surveyId = survey.id.toString()

      await createSurveyResult({
        surveyId,
        accountId: '627813efa1e9cfe4f4ff07f2',
        answer: 'any_answer',
        date: new Date()
      })
      await createSurveyResult({
        surveyId,
        accountId: '627868e967d091c970cfb7e1',
        answer: 'any_answer',
        date: new Date()
      })
      await createSurveyResult({
        surveyId,
        accountId: '627863998cbd60f6bb6d58a9',
        answer: 'other_answer',
        date: new Date()
      })

      const surveyResult = await sut.loadBySurvey(surveyId)

      expect(surveyResult).toBeTruthy()
      expect(surveyResult).toEqual({
        surveyId,
        question: survey.question,
        answers: [
          {
            answer: 'other_answer',
            count: 1,
            image: undefined,
            percent: 33.33
          },
          {
            answer: 'any_answer',
            count: 2,
            image: undefined,
            percent: 66.67
          }
        ],
        date: survey.date
      })
    })
  })

  const createSurvey = async (): Promise<SurveyModel> => {
    const addSurveyParams = makeFakeAddSurveyParams()

    await surveyCollection.insertOne(addSurveyParams)

    return MongoHelper.mapToModel<SurveyModel>(addSurveyParams)
  }

  const createSurveyResult = async (
    saveSurveyResultParams?: SaveSurveyResultParams
  ): Promise<void> => {
    const saveSurveyResultModel =
      saveSurveyResultParams ?? makeFakeSaveSurveyResultParams()
    const { surveyId, accountId } = saveSurveyResultModel

    await collection.insertOne({
      ...saveSurveyResultModel,
      surveyId: new ObjectId(surveyId),
      accountId: new ObjectId(accountId)
    })
  }
})
