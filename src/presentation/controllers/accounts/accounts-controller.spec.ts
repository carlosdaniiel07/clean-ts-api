import { AccountModel } from '~/domain/models/account'
import { GetAccounts } from '~/domain/usecases/get-accounts'
import { ServerError } from '~/presentation/errors'
import { AccountsController } from './accounts-controller'

interface SutTypes {
  sut: AccountsController
  getAccounts: GetAccounts
}

const makeGetAccounts = (): GetAccounts => {
  class GetAccountsStub implements GetAccounts {
    async getAll (): Promise<AccountModel[]> {
      return await Promise.resolve([
        {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email',
          password: 'any_password'
        }
      ])
    }
  }

  return new GetAccountsStub()
}

const makeSut = (): SutTypes => {
  const getAccounts = makeGetAccounts()
  const sut = new AccountsController(getAccounts)

  return {
    getAccounts,
    sut
  }
}

describe('Accounts controller', () => {
  test('should get all accounts and return 200', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle()

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual([
      {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
    ])
  })

  test('should call GetAccounts', async () => {
    const { sut, getAccounts } = makeSut()
    const spy = jest.spyOn(getAccounts, 'getAll')

    await sut.handle()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('should return 500 if GetAccounts throws exception', async () => {
    const { sut, getAccounts } = makeSut()

    jest.spyOn(getAccounts, 'getAll').mockImplementationOnce(async () => {
      return await Promise.reject(new Error())
    })

    const httpResponse = await sut.handle()

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
