import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('Account Mongo Repository', () => {
  beforeAll(async () => await MongoHelper.connect(global.__MONGO_URI__))

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    const collection = await MongoHelper.getCollection('accounts')
    await collection.deleteMany({})
  })

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

  test('should update account access token', async () => {
    const sut = makeSut()
    const account = await createAccount()
    const accessToken = 'any_accessToken'

    // TODO: Entender melhor porque não realizou map corretamente
    // eslint-disable-next-line @typescript-eslint/dot-notation
    await sut.updateAccessToken(account['_id'], accessToken)

    const collection = await MongoHelper.getCollection('accounts')
    const [updatedAccount] = await collection.find().toArray()

    expect(updatedAccount).toBeTruthy()
    expect(updatedAccount).toHaveProperty('accessToken', accessToken)
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

  const createAccount = async (): Promise<AccountModel> => {
    const sut = makeSut()
    return await sut.add({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    })
  }
})
