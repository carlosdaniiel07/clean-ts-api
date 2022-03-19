import { MongoHelper as sut } from './mongo-helper'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(global.__MONGO_URI__)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  test('should reconnect if MongoDb connection is down', async () => {
    let collection = await sut.getCollection('accounts')
    expect(collection).toBeTruthy()

    await sut.disconnect()

    collection = await sut.getCollection('accounts')
    expect(collection).toBeTruthy()
  })
})
