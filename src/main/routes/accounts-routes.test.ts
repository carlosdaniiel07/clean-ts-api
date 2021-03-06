import request from 'supertest'
import { MongoHelper } from '~/infra/db/mongodb/helpers/mongo-helper'
import app from '~/main/config/app'

describe('GET /accounts', () => {
  beforeAll(async () => await MongoHelper.connect(global.__MONGO_URI__))

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    const collection = await MongoHelper.getCollection('accounts')
    await collection.deleteMany({})
  })

  test('should return all accounts on success', async () => {
    await createMockAccount()

    const { body } = await request(app).get('/api/accounts').send().expect(200)

    expect(body).toBeTruthy()
    expect(body).toBeInstanceOf(Array)
  })

  const createMockAccount = async (): Promise<void> => {
    await request(app).post('/api/signup').send({
      name: 'Carlos',
      email: 'carlos@email.com',
      password: 'password',
      passwordConfirmation: 'password'
    })
  }
})
