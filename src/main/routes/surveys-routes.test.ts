import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import config from '../config/env'

describe('POST /surveys', () => {
  let surveyCollection: Collection
  let accountCollection: Collection

  beforeAll(async () => await MongoHelper.connect(global.__MONGO_URI__))

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    accountCollection = await MongoHelper.getCollection('accounts')

    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })

  test('should return 401 on add survey without access token', async () => {
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
      .expect(401)
  })

  test('should return 201 on add survey with valid access token', async () => {
    const account = await accountCollection.insertOne({
      name: 'Carlos',
      email: 'carlos@email.com',
      password: 'any_password',
      role: 'ADMIN'
    })
    const accessToken = sign({
      id: account.insertedId.toString(),
      name: 'Carlos',
      email: 'carlos@email.com'
    }, config.JWT_SECRET_KEY)

    await accountCollection.updateOne({
      _id: account.insertedId
    }, {
      $set: {
        accessToken
      }
    })

    await request(app)
      .post('/api/surveys')
      .set('Authorization', `Bearer ${accessToken}`)
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
