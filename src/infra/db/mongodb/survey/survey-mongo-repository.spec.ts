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
  ]
})

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('Survey Mongo repository', () => {
  let collection: Collection

  beforeAll(async () => await MongoHelper.connect(global.__MONGO_URI__))

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    collection = await MongoHelper.getCollection('surveys')
    await collection.deleteMany({})
  })

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
      ]
    })
  })
})
