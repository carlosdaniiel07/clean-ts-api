import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { GetAccountsRepository } from '../../../../data/protocols/get-accounts-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, GetAccountsRepository {
  async add (account: AddAccountModel): Promise<AccountModel> {
    const collection = await MongoHelper.getCollection('accounts')
    await collection.insertOne(account)

    return MongoHelper.mapToModel<AccountModel>(account)
  }

  async getAll (): Promise<AccountModel[]> {
    const collection = await MongoHelper.getCollection('accounts')
    const accounts = await collection.find().toArray()

    return MongoHelper.mapToModels<AccountModel>(accounts)
  }
}
