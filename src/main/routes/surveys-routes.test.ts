import request from 'supertest'
import app from '~/main/config/app'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import { AddSurveyModel } from '~/domain/usecases/add-survey'
import config from '~/main/config/env'
import { MongoHelper } from '~/infra/db/mongodb/helpers/mongo-helper'

const makeAddSurveyModel = (): AddSurveyModel => ({
  question: 'Qual a sua linguagem de programação preferida?',
  answers: [
    {
      image: 'logo_csharp.png',
      answer: 'C#'
    },
    {
      answer: 'Type Script'
    }
  ],
  date: new Date(2022, 4, 29, 23, 57, 20)
})

const createFakeUserAndGenerateAccessToken = async (
  accountCollection: Collection,
  role?: string
): Promise<string> => {
  const account = await accountCollection.insertOne({
    name: 'Carlos',
    email: 'carlos@email.com',
    password: 'any_password',
    role
  })
  const accessToken = sign(
    {
      id: account.insertedId.toString(),
      name: 'Carlos',
      email: 'carlos@email.com'
    },
    config.JWT_SECRET_KEY
  )

  await accountCollection.updateOne(
    {
      _id: account.insertedId
    },
    {
      $set: {
        accessToken
      }
    }
  )

  return accessToken
}

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
      .send(makeAddSurveyModel())
      .expect(401)
  })

  test('should return 201 on add survey with valid access token', async () => {
    const accessToken = await createFakeUserAndGenerateAccessToken(
      accountCollection,
      'ADMIN'
    )

    await request(app)
      .post('/api/surveys')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(makeAddSurveyModel())
      .expect(201)
  })
})

describe('GET /surveys', () => {
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
    await request(app).get('/api/surveys').send().expect(401)
  })

  test('should return 204 on list surveys with valid access token', async () => {
    const accessToken = await createFakeUserAndGenerateAccessToken(
      accountCollection
    )

    await request(app)
      .get('/api/surveys')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(204)
  })

  test('should return 200 on list surveys with valid access token', async () => {
    const accessToken = await createFakeUserAndGenerateAccessToken(
      accountCollection
    )

    await surveyCollection.insertOne(makeAddSurveyModel())

    const response = await request(app)
      .get('/api/surveys')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toBeTruthy()
  })
})
