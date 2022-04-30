import { HashComparer } from '~/data/protocols/cryptography/hash'
import { TokenGenerator } from '~/data/protocols/cryptography/token-generator'
import { GetAccountByEmailRepository } from '~/data/protocols/db/account/get-account-by-email-repository'
import { UpdateAccessTokenRepository } from '~/data/protocols/db/account/update-access-token-repository'
import { AccountModel } from '~/domain/models/account'
import { AuthenticationModel } from '~/domain/usecases/authentication'
import { DbAuthentication } from './db-authentication'

const makeAuthenticationModel = (): AuthenticationModel => ({
  email: 'any_email',
  password: 'any_password_plain_text'
})

const makeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  password: 'any_password'
})

interface SutTypes {
  sut: DbAuthentication
  getAccountByEmailRepository: GetAccountByEmailRepository
  updateAccessTokenRepository: UpdateAccessTokenRepository
  tokenGenerator: TokenGenerator
  hashComparer: HashComparer
}

const makeGetAccountByEmailRepository = (): GetAccountByEmailRepository => {
  class GetAccountByEmailRepositoryStub implements GetAccountByEmailRepository {
    async getByEmail (email: string): Promise<AccountModel | null> {
      return await Promise.resolve(makeAccount())
    }
  }

  return new GetAccountByEmailRepositoryStub()
}

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, accessToken: string): Promise<void> {
      await Promise.resolve()
    }
  }

  return new UpdateAccessTokenRepositoryStub()
}

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    generate (account: AccountModel): string {
      return 'any_token'
    }
  }

  return new TokenGeneratorStub()
}

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (plainText: string, hash: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }

  return new HashComparerStub()
}

const makeSut = (): SutTypes => {
  const getAccountByEmailRepository = makeGetAccountByEmailRepository()
  const updateAccessTokenRepository = makeUpdateAccessTokenRepository()
  const tokenGenerator = makeTokenGenerator()
  const hashComparer = makeHashComparer()
  const sut = new DbAuthentication(
    getAccountByEmailRepository,
    updateAccessTokenRepository,
    tokenGenerator,
    hashComparer
  )

  return {
    sut,
    getAccountByEmailRepository,
    updateAccessTokenRepository,
    tokenGenerator,
    hashComparer
  }
}

describe('DbAuthentication usecase', () => {
  test('should call getAccountByEmailRepository with correct value', async () => {
    const authentication = makeAuthenticationModel()
    const { sut, getAccountByEmailRepository } = makeSut()
    const spy = jest.spyOn(getAccountByEmailRepository, 'getByEmail')

    await sut.auth(authentication)

    expect(spy).toHaveBeenCalledWith(authentication.email)
  })

  test('should call hashComparer with correct values', async () => {
    const authentication = makeAuthenticationModel()
    const account = makeAccount()
    const { sut, hashComparer } = makeSut()
    const spy = jest.spyOn(hashComparer, 'compare')

    await sut.auth(authentication)

    expect(spy).toHaveBeenCalledWith(authentication.password, account.password)
  })

  test('should call tokenGenerator with correct value', async () => {
    const authentication = makeAuthenticationModel()
    const account = makeAccount()
    const { sut, tokenGenerator } = makeSut()
    const spy = jest.spyOn(tokenGenerator, 'generate')

    await sut.auth(authentication)

    expect(spy).toHaveBeenCalledWith(account)
  })

  test('should call updateAccessTokenRepository with correct values', async () => {
    const authentication = makeAuthenticationModel()
    const account = makeAccount()
    const { sut, updateAccessTokenRepository } = makeSut()
    const spy = jest.spyOn(updateAccessTokenRepository, 'updateAccessToken')

    await sut.auth(authentication)

    expect(spy).toHaveBeenCalledWith(account.id, 'any_token')
  })

  test('should throw error if account was not found', async () => {
    const authentication = makeAuthenticationModel()
    const { sut, getAccountByEmailRepository } = makeSut()

    jest
      .spyOn(getAccountByEmailRepository, 'getByEmail')
      .mockReturnValue(Promise.resolve(null))

    const promise = sut.auth(authentication)

    await expect(promise).rejects.toThrow(
      `Account with email ${authentication.email} was not found`
    )
  })

  test('should throw error if password not matches', async () => {
    const authentication = makeAuthenticationModel()
    const { sut, hashComparer } = makeSut()

    jest.spyOn(hashComparer, 'compare').mockReturnValue(Promise.resolve(false))

    const promise = sut.auth(authentication)

    await expect(promise).rejects.toThrow('Invalid password')
  })

  test('should generate access token if success', async () => {
    const authentication = makeAuthenticationModel()
    const { sut } = makeSut()
    const accessToken = await sut.auth(authentication)

    expect(accessToken).toBeTruthy()
    expect(accessToken).toBe('any_token')
  })
})
