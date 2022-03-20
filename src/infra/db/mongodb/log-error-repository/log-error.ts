import { LogErrorRepository } from '../../../../data/protocols/log-error-repository'
import { MongoHelper } from '../helpers/mongo-helper'

export class LogErrorMongoRepository implements LogErrorRepository {
  async log (stackTrace: string): Promise<void> {
    const collection = await MongoHelper.getCollection('errors')
    const error: { stackTrace: string, createdAt: Date } = {
      stackTrace,
      createdAt: new Date()
    }

    await collection.insertOne(error)
  }
}
