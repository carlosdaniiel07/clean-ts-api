import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('Account Mongo Repository', () => {
  beforeAll(async () => await MongoHelper.connect(global.__MONGO_URI__))

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => await MongoHelper.getCollection('accounts').deleteMany({}))

  test('should create an account and return on success', async () => {
    const account = await createAccount()

    expect(account).toBeTruthy()
    expect(account).toEqual<AccountModel>({
      id: account.id,
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    })
  })

  test('should get all accounts', async () => {
    const sut = makeSut()
    const account = await createAccount()
    const response = await sut.getAll()

    expect(response).toBeTruthy()
    expect(response).toEqual([
      account
    ])
  })

  const createAccount = async (): Promise<AccountModel> => {
    const sut = makeSut()
    return await sut.add({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    })
  }
})
