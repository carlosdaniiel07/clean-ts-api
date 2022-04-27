import { Collection } from 'mongodb'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('Account Mongo Repository', () => {
  let accountsCollection: Collection

  beforeAll(async () => await MongoHelper.connect(global.__MONGO_URI__))

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
  })

  describe('add()', () => {
    test('should create an account and return on success', async () => {
      const sut = makeSut()
      const account = await sut.add({
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      })

      expect(account).toBeTruthy()
      expect(account).toEqual<AccountModel>({
        id: account.id,
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      })
    })
  })

  describe('updateAccessToken()', () => {
    test('should update account access token', async () => {
      const sut = makeSut()
      const account = await createAccount()
      const accessToken = 'any_accessToken'

      await sut.updateAccessToken(account.id, accessToken)

      const collection = await MongoHelper.getCollection('accounts')
      const updatedAccount = await collection.findOne({
        accessToken
      })

      expect(updatedAccount).toBeTruthy()
      expect(updatedAccount).toHaveProperty('accessToken', accessToken)
    })
  })

  describe('getAll()', () => {
    test('should get all accounts', async () => {
      const sut = makeSut()
      const account = await createAccount()
      const response = await sut.getAll()

      expect(response).toBeTruthy()
      expect(response).toEqual([account])
    })
  })

  describe('getByEmail()', () => {
    test('should get an account by email', async () => {
      const sut = makeSut()
      const account = await createAccount()
      const response = await sut.getByEmail(account.email)

      expect(response).toBeTruthy()
      expect(response).toEqual(account)
    })

    test('should return null if account with specified email was not found', async () => {
      const sut = makeSut()
      const response = await sut.getByEmail('any_email')

      expect(response).toBeNull()
    })
  })

  describe('loadByAccessToken()', () => {
    test('should get an account by access token', async () => {
      await accountsCollection.insertOne({
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        accessToken: 'any_token'
      })

      const sut = makeSut()
      const response = await sut.loadByAccessToken('any_token')

      expect(response).toBeTruthy()
    })

    test('should get an account by access token and role', async () => {
      await accountsCollection.insertOne({
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        accessToken: 'any_token',
        role: 'any_role'
      })

      const sut = makeSut()
      const response = await sut.loadByAccessToken('any_token', 'any_role')

      expect(response).toBeTruthy()
    })
  })

  const createAccount = async (): Promise<AccountModel> => {
    const account = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    }

    await accountsCollection.insertOne(account)

    return MongoHelper.mapToModel<AccountModel>(account)
  }
})
