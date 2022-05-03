import MockDate from 'mockdate'
import { MongoHelper } from '~/infra/db/mongodb/helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { Collection } from 'mongodb'
import { AddSurveyModel } from '~/domain/usecases/add-survey'
import { SurveyModel } from '~/domain/models/survey'

const makeFakeAddSurveyModel = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [
    {
      answer: 'any_answer',
      image: 'any_image'
    },
    {
      answer: 'other_answer'
    }
  ],
  date: new Date()
})

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('Survey Mongo repository', () => {
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
    collection = await MongoHelper.getCollection('surveys')
    await collection.deleteMany({})
  })

  describe('add()', () => {
    test('should create a survey and returns on success', async () => {
      const sut = makeSut()
      const addSurveyModel = makeFakeAddSurveyModel()
      const survey = await sut.add(addSurveyModel)

      expect(survey).toBeTruthy()
      expect(survey).toEqual({
        id: survey.id,
        question: 'any_question',
        answers: [
          {
            answer: 'any_answer',
            image: 'any_image'
          },
          {
            answer: 'other_answer'
          }
        ],
        date: new Date()
      })
    })
  })

  describe('loadAll()', () => {
    test('should return a survey list', async () => {
      const sut = makeSut()
      const survey = await createSurvey()
      const surveys = await sut.loadAll()

      expect(surveys).toEqual([
        {
          id: survey.id,
          question: 'any_question',
          answers: [
            {
              answer: 'any_answer',
              image: 'any_image'
            },
            {
              answer: 'other_answer'
            }
          ],
          date: new Date()
        }
      ])
    })

    test('should return a empty list', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll()

      expect(surveys).toEqual([])
    })
  })

  describe('loadById()', () => {
    test('should return a survey by id', async () => {
      const sut = makeSut()
      const createdSurvey = await createSurvey()
      const survey = await sut.loadById(createdSurvey.id)

      expect(survey).toBeTruthy()
    })

    test('should return null when survey not exists', async () => {
      const sut = makeSut()
      const invalidId = '507f1f77bcf86cd799439011'
      const survey = await sut.loadById(invalidId)

      expect(survey).toBeNull()
    })
  })

  const createSurvey = async (): Promise<SurveyModel> => {
    const addSurveyModel = makeFakeAddSurveyModel()
    await collection.insertOne(addSurveyModel)

    return MongoHelper.mapToModel<SurveyModel>(addSurveyModel)
  }
})
