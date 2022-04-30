import { LogErrorRepository } from '~/data/protocols/db/log/log-error-repository'
import { MongoHelper } from '~/infra/db/mongodb/helpers/mongo-helper'

export class LogMongoRepository implements LogErrorRepository {
  async logError (stackTrace: string): Promise<void> {
    const collection = await MongoHelper.getCollection('errors')
    await collection.insertOne({
      stackTrace,
      date: new Date()
    })
  }
}
