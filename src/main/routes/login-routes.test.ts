import request from 'supertest'
import app from '~/main/config/app'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { MongoHelper } from '~/infra/db/mongodb/helpers/mongo-helper'

let accountCollection: Collection

describe('POST /signup', () => {
  beforeAll(async () => await MongoHelper.connect(global.__MONGO_URI__))

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('should return an 201 on signup', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Carlos',
        email: 'carlos@email.com',
        password: 'password',
        passwordConfirmation: 'password'
      })
      .expect(201)
  })
})

describe('POST /login', () => {
  beforeAll(async () => await MongoHelper.connect(global.__MONGO_URI__))

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('should return 200 and an access token on login', async () => {
    await accountCollection.insertOne({
      name: 'Carlos',
      email: 'carlos@email.com',
      password: await hash('password', 12)
    })

    const { status, body } = await request(app)
      .post('/api/login')
      .send({
        email: 'carlos@email.com',
        password: 'password'
      })

    expect(status).toBe(200)
    expect(body.accessToken).toBeTruthy()
  })

  test('should return 401 on login', async () => {
    await request(app)
      .post('/api/login')
      .send({
        email: 'carlos@email.com',
        password: 'password'
      }).expect(401)
  })
})
