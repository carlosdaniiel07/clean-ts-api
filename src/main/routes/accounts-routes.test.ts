import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('Accounts routes', () => {
  beforeAll(async () => await MongoHelper.connect(global.__MONGO_URI__))

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    const collection = await MongoHelper.getCollection('accounts')
    await collection.deleteMany({})
  })

  test('should return all accounts on success', async () => {
    await createMockAccount()

    const { body } = await request(app)
      .get('/api/accounts')
      .send()
      .expect(200)

    expect(body).toBeTruthy()
    expect(body).toBeInstanceOf(Array)
  })

  const createMockAccount = async (): Promise<void> => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Carlos',
        email: 'carlos@email.com',
        password: 'password',
        passwordConfirmation: 'password'
      })
  }
})
