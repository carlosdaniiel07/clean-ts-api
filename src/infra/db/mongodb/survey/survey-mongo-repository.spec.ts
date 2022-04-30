import MockDate from 'mockdate'
import { MongoHelper } from '../helpers/mongo-helper'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { Collection } from 'mongodb'

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
      const addSurveyModel = makeFakeAddSurveyModel()
      const surveyId = await collection.insertOne(addSurveyModel)
      const surveys = await sut.loadAll()

      expect(surveys).toEqual([
        {
          id: surveyId.insertedId,
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
})
