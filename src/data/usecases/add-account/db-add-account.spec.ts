import { GetAccountByEmailRepository } from '~/data/protocols/db/account/get-account-by-email-repository'
import { DbAddAccount } from './db-add-account'
import { AccountModel, AddAccountModel, AddAccountRepository, Encrypter } from './db-add-account-protocols'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})

const makeFakeAddAccountModel = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})

type SutTypes = {
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
  getAccountByEmailRepositoryStub: GetAccountByEmailRepository
  sut: DbAddAccount
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await Promise.resolve(`${value}_hashed`)
    }
  }

  return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }

  return new AddAccountRepositoryStub()
}

const makeGetAccountByEmailRepository = (): GetAccountByEmailRepository => {
  class GetAccountByEmailRepositoryStub implements GetAccountByEmailRepository {
    async getByEmail (email: string): Promise<AccountModel | null> {
      return await Promise.resolve(null)
    }
  }

  return new GetAccountByEmailRepositoryStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const getAccountByEmailRepositoryStub = makeGetAccountByEmailRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub, getAccountByEmailRepositoryStub)

  return {
    encrypterStub,
    addAccountRepositoryStub,
    getAccountByEmailRepositoryStub,
    sut
  }
}

describe('DbAddAccount usecase', () => {
  test('should call Encrypter with correct password', async () => {
    const data = makeFakeAddAccountModel()
    const { sut, encrypterStub } = makeSut()
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.add(data)

    expect(encrypterSpy).toHaveBeenCalledWith('valid_password')
  })

  test('should throw if Encrypter throws', async () => {
    const data = makeFakeAddAccountModel()
    const { sut, encrypterStub } = makeSut()

    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(async () => {
      return await Promise.reject(new Error())
    })

    const promise = sut.add(data)

    await expect(promise).rejects.toThrow()
  })

  test('should call AddAccountRepository with correct values', async () => {
    const data = makeFakeAddAccountModel()
    const { sut, addAccountRepositoryStub } = makeSut()
    const repositorySpy = jest.spyOn(addAccountRepositoryStub, 'add')

    await sut.add(data)

    expect(repositorySpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password_hashed'
    })
  })

  test('should throw if AddAccountRepository throws', async () => {
    const data = makeFakeAddAccountModel()
    const { sut, addAccountRepositoryStub } = makeSut()

    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(async () => {
      return await Promise.reject(new Error())
    })

    const promise = sut.add(data)

    await expect(promise).rejects.toThrow()
  })

  test('should call GetAccountByEmailRepository with correct value', async () => {
    const data = makeFakeAddAccountModel()
    const { sut, getAccountByEmailRepositoryStub } = makeSut()
    const spy = jest.spyOn(getAccountByEmailRepositoryStub, 'getByEmail')

    await sut.add(data)

    expect(spy).toHaveBeenCalledWith(data.email)
  })

  test('should return null if GetAccountByEmailRepository not returns null', async () => {
    const data = makeFakeAddAccountModel()
    const { sut, getAccountByEmailRepositoryStub } = makeSut()

    jest.spyOn(getAccountByEmailRepositoryStub, 'getByEmail').mockReturnValueOnce(Promise.resolve(makeFakeAccount()))

    const response = await sut.add(data)

    expect(response).toBeNull()
  })

  test('should return an account on success', async () => {
    const data = makeFakeAddAccountModel()
    const { sut } = makeSut()
    const account = await sut.add(data)

    expect(account).toEqual(makeFakeAccount())
  })
})
