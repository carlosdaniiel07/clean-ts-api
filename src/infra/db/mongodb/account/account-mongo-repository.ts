import { AddAccountRepository } from '~/data/protocols/db/account/add-account-repository'
import { GetAccountByEmailRepository } from '~/data/protocols/db/account/get-account-by-email-repository'
import { GetAccountsRepository } from '~/data/protocols/db/account/get-accounts-repository'
import { LoadAccountByAccessTokenRepository } from '~/data/protocols/db/account/load-account-by-access-token-repository'
import { UpdateAccessTokenRepository } from '~/data/protocols/db/account/update-access-token-repository'
import { AccountModel } from '~/domain/models/account'
import { AddAccountModel } from '~/domain/usecases/add-account'
import { MongoHelper } from '~/infra/db/mongodb/helpers/mongo-helper'

export class AccountMongoRepository
implements
    AddAccountRepository,
    GetAccountsRepository,
    UpdateAccessTokenRepository,
    GetAccountByEmailRepository,
    LoadAccountByAccessTokenRepository {
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

    await collection.updateOne(
      {
        _id: id
      },
      {
        $set: {
          accessToken
        }
      }
    )
  }

  async getByEmail (email: string): Promise<AccountModel | null> {
    const collection = await MongoHelper.getCollection('accounts')
    const account = await collection.findOne({
      email
    })

    return account ? MongoHelper.mapToModel<AccountModel>(account) : null
  }

  async loadByAccessToken (
    accessToken: string,
    role?: string
  ): Promise<AccountModel | null> {
    const collection = await MongoHelper.getCollection('accounts')
    const account = await collection.findOne({
      accessToken,
      $or: [
        {
          role
        },
        {
          role: 'ADMIN'
        }
      ]
    })

    return account ? MongoHelper.mapToModel<AccountModel>(account) : null
  }
}
