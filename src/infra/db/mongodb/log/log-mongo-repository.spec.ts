import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log-mongo-repository'

interface SutTypes {
  sut: LogMongoRepository
}

const makeSut = (): SutTypes => ({
  sut: new LogMongoRepository()
})

describe('LogErrorMongo Repository', () => {
  let collection: Collection

  beforeAll(async () => await MongoHelper.connect(global.__MONGO_URI__))

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    collection = await MongoHelper.getCollection('errors')
    await collection.deleteMany({})
  })

  test('should create an error log on success', async () => {
    const { sut } = makeSut()

    await sut.logError('any_error_stack')

    const errorsCount = await collection.countDocuments()

    expect(errorsCount).toBe(1)
  })
})
