import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { GetAccountByEmailRepository } from '../../../../data/protocols/get-account-by-email-repository'
import { GetAccountsRepository } from '../../../../data/protocols/get-accounts-repository'
import { UpdateAccessTokenRepository } from '../../../../data/protocols/update-access-token-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository
implements
    AddAccountRepository,
    GetAccountsRepository,
    UpdateAccessTokenRepository,
    GetAccountByEmailRepository {
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

  async updateAccessToken (id: string, accessToken: string): Promise<void> {
    const collection = await MongoHelper.getCollection('accounts')
    await collection.updateOne({
      id
    }, {
      $set: {
        accessToken
      }
    })
  }

  async getByEmail (email: string): Promise<AccountModel | null> {
    const collection = await MongoHelper.getCollection('accounts')
    const account = await collection.findOne({
      email
    })

    return account ? MongoHelper.mapToModel<AccountModel>(account) : null
  }
}
