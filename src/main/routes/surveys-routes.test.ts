import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'

describe('POST /surveys', () => {
  let surveyCollection: Collection

  beforeAll(async () => await MongoHelper.connect(global.__MONGO_URI__))

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  test('should return an 201 on add survey', async () => {
    await request(app)
      .post('/api/surveys')
      .send({
        question: 'Qual a sua linguagem de programação preferida?',
        answers: [
          {
            image: 'logo_csharp.png',
            answer: 'C#'
          },
          {
            answer: 'Type Script'
          }
        ]
      })
      .expect(201)
  })
})
