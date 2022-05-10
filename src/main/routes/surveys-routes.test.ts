import request from 'supertest'
import app from '~/main/config/app'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import { AddSurveyParams } from '~/domain/usecases/add-survey'
import config from '~/main/config/env'
import { MongoHelper } from '~/infra/db/mongodb/helpers/mongo-helper'
import { SurveyModel } from '~/domain/models/survey'

const makeAddSurveyModel = (): AddSurveyParams => ({
  question: 'Qual a sua linguagem de programação preferida?',
  answers: [
    {
      image: 'image.png',
      answer: 'any_answer'
    },
    {
      answer: 'any_answer_2'
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

const createFakeSurvey = async (
  surveyCollection: Collection
): Promise<SurveyModel> => {
  const addSurveyModel = makeAddSurveyModel()
  await surveyCollection.insertOne(addSurveyModel)

  return MongoHelper.mapToModel<SurveyModel>(addSurveyModel)
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

  test('should return 204 on list surveys', async () => {
    const accessToken = await createFakeUserAndGenerateAccessToken(
      accountCollection
    )

    await request(app)
      .get('/api/surveys')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(204)
  })

  test('should return 200 on list surveys', async () => {
    const accessToken = await createFakeUserAndGenerateAccessToken(
      accountCollection
    )

    await createFakeSurvey(surveyCollection)

    const response = await request(app)
      .get('/api/surveys')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toBeTruthy()
  })
})

describe('POST /surveys/:surveyId/results', () => {
  let surveyCollection: Collection
  let accountCollection: Collection
  let surveyResultsCollection: Collection

  beforeAll(async () => await MongoHelper.connect(global.__MONGO_URI__))

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    accountCollection = await MongoHelper.getCollection('accounts')
    surveyResultsCollection = await MongoHelper.getCollection('survey_results')

    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
    await surveyResultsCollection.deleteMany({})
  })

  test('should return 401 on add survey result without access token', async () => {
    await request(app).post('/api/surveys/any_id/results').send().expect(401)
  })

  test('should return 404 if survey not exists', async () => {
    const accessToken = await createFakeUserAndGenerateAccessToken(
      accountCollection
    )
    const invalidId = '507f1f77bcf86cd799439011'

    await request(app)
      .post(`/api/surveys/${invalidId}/results`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        answer: 'any_answer'
      })
      .expect(404)
  })

  test('should return 400 if request body is invalid', async () => {
    const accessToken = await createFakeUserAndGenerateAccessToken(
      accountCollection
    )
    await request(app)
      .post('/api/surveys/any_id/results')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(400)
  })

  test('should return 400 if survey answer is invalid', async () => {
    const accessToken = await createFakeUserAndGenerateAccessToken(
      accountCollection
    )
    const survey = await createFakeSurvey(surveyCollection)

    await request(app)
      .post(`/api/surveys/${survey.id}/results`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        answer: 'invalid_answer'
      })
      .expect(400)
  })

  test('should return 200 on save survey result', async () => {
    const accessToken = await createFakeUserAndGenerateAccessToken(accountCollection)
    const survey = await createFakeSurvey(surveyCollection)

    await request(app)
      .post(`/api/surveys/${survey.id}/results`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        answer: 'any_answer'
      })
      .expect(200)
  })
})
