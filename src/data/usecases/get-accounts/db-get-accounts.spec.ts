import { GetAccountsRepository } from '~/data/protocols/db/account/get-accounts-repository'
import { AccountModel } from '~/domain/models/account'
import { DbGetAccounts } from './db-get-accounts'

interface SutTypes {
  sut: DbGetAccounts
  getAccountsRepository: GetAccountsRepository
}

const makeGetAccountsRepository = (): GetAccountsRepository => {
  class GetAccountsRepositoryStub implements GetAccountsRepository {
    async getAll (): Promise<AccountModel[]> {
      return await Promise.resolve([
        {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email',
          password: 'any_password'
        },
        {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email',
          password: 'any_password'
        }
      ])
    }
  }

  return new GetAccountsRepositoryStub()
}

const makeSut = (): SutTypes => {
  const getAccountsRepository = makeGetAccountsRepository()
  const sut = new DbGetAccounts(getAccountsRepository)

  return {
    sut,
    getAccountsRepository
  }
}

describe('DbGetAccounts usecase', () => {
  test('should return all accounts', async () => {
    const { sut } = makeSut()
    const accounts = await sut.getAll()

    expect(accounts).toBeTruthy()
    expect(accounts).toEqual([
      {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      },
      {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
    ])
  })

  test('should call GetAccountsRepository', async () => {
    const { sut, getAccountsRepository } = makeSut()
    const spy = jest.spyOn(getAccountsRepository, 'getAll')

    await sut.getAll()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('should throw if GetAccountsRepository throws', async () => {
    const { sut, getAccountsRepository } = makeSut()

    jest
      .spyOn(getAccountsRepository, 'getAll')
      .mockImplementationOnce(async () => {
        return await Promise.reject(new Error())
      })

    const promise = sut.getAll()

    await expect(promise).rejects.toThrow()
  })
})
