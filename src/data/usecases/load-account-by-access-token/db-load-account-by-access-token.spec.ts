import { Decrypter } from '~/data/protocols/cryptography/decrypter'
import { LoadAccountByAccessTokenRepository } from '~/data/protocols/db/account/load-account-by-access-token-repository'
import { AccountModel } from '~/domain/models/account'
import { DbLoadAccountByAccessToken } from './db-load-account-by-access-token'

type SutTypes = {
  decrypter: Decrypter
  loadAccountByAccessTokenRepository: LoadAccountByAccessTokenRepository
  sut: DbLoadAccountByAccessToken
}

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string | null> {
      return await Promise.resolve('any_token')
    }
  }

  return new DecrypterStub()
}

const makeLoadAccountByAccessTokenRepository =
  (): LoadAccountByAccessTokenRepository => {
    class LoadAccountByAccessTokenRepositoryStub
    implements LoadAccountByAccessTokenRepository {
      async loadByAccessToken (
        accessToken: string,
        role: string
      ): Promise<AccountModel> {
        return await Promise.resolve(makeFakeAccount())
      }
    }

    return new LoadAccountByAccessTokenRepositoryStub()
  }

const makeSut = (): SutTypes => {
  const decrypter = makeDecrypter()
  const loadAccountByAccessTokenRepository =
    makeLoadAccountByAccessTokenRepository()
  const sut = new DbLoadAccountByAccessToken(
    decrypter,
    loadAccountByAccessTokenRepository
  )

  return {
    decrypter,
    loadAccountByAccessTokenRepository,
    sut
  }
}

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  password: 'any_password'
})

describe('DbLoadAccountByAccessToken usecase', () => {
  test('should call Decrypter with correct value', async () => {
    const { sut, decrypter } = makeSut()
    const spy = jest.spyOn(decrypter, 'decrypt')

    await sut.load('any_token', 'any_role')

    expect(spy).toHaveBeenCalledWith('any_token')
  })

  test('should return null if Decrypter returns null', async () => {
    const { sut, decrypter } = makeSut()

    jest.spyOn(decrypter, 'decrypt').mockReturnValueOnce(Promise.resolve(null))

    const response = await sut.load('any_token', 'any_role')

    expect(response).toBeNull()
  })

  test('should throw if Decrypter throws', async () => {
    const { sut, decrypter } = makeSut()

    jest.spyOn(decrypter, 'decrypt').mockImplementationOnce(() => {
      throw new Error('any_error')
    })

    const promise = sut.load('any_token', 'any_role')

    await expect(promise).rejects.toThrow(new Error('any_error'))
  })

  test('should call LoadAccountByAccessTokenRepository with correct value', async () => {
    const { sut, loadAccountByAccessTokenRepository } = makeSut()
    const spy = jest.spyOn(
      loadAccountByAccessTokenRepository,
      'loadByAccessToken'
    )

    await sut.load('any_token', 'any_role')

    expect(spy).toHaveBeenCalledWith('any_token', 'any_role')
  })

  test('should return null if LoadAccountByAccessTokenRepository returns null', async () => {
    const { sut, loadAccountByAccessTokenRepository } = makeSut()

    jest
      .spyOn(loadAccountByAccessTokenRepository, 'loadByAccessToken')
      .mockReturnValueOnce(Promise.resolve(null))

    const response = await sut.load('any_token', 'any_role')

    expect(response).toBeNull()
  })

  test('should throw if LoadAccountByAccessTokenRepository throws', async () => {
    const { sut, loadAccountByAccessTokenRepository } = makeSut()

    jest
      .spyOn(loadAccountByAccessTokenRepository, 'loadByAccessToken')
      .mockImplementationOnce(() => {
        throw new Error('any_error')
      })

    const promise = sut.load('any_token', 'any_role')

    await expect(promise).rejects.toThrow(new Error('any_error'))
  })

  test('should return an account on success', async () => {
    const { sut } = makeSut()
    const response = await sut.load('any_token', 'any_role')

    expect(response).toEqual(makeFakeAccount())
  })
})
