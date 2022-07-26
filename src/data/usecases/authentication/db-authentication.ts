import { HashComparer } from '~/data/protocols/cryptography/hash'
import { TokenGenerator } from '~/data/protocols/cryptography/token-generator'
import { GetAccountByEmailRepository } from '~/data/protocols/db/account/get-account-by-email-repository'
import { UpdateAccessTokenRepository } from '~/data/protocols/db/account/update-access-token-repository'
import { AuthenticationModel } from '~/domain/models/authentication'
import {
  Authentication,
  AuthenticationParams
} from '~/domain/usecases/authentication'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly getAccountByEmailRepository: GetAccountByEmailRepository,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
    private readonly tokenGenerator: TokenGenerator,
    private readonly hashComparer: HashComparer
  ) {}

  async auth (
    authentication: AuthenticationParams
  ): Promise<AuthenticationModel> {
    const { email, password } = authentication
    const account = await this.getAccountByEmailRepository.getByEmail(email)

    if (!account) {
      throw new Error(`Account with email ${email} was not found`)
    }

    const isValidPassword = await this.hashComparer.compare(
      password,
      account.password
    )

    if (!isValidPassword) {
      throw new Error('Invalid password')
    }

    const accessToken = this.tokenGenerator.generate(account)

    await this.updateAccessTokenRepository.updateAccessToken(
      account.id,
      accessToken
    )

    return {
      accessToken,
      name: account.name,
      email: account.email
    }
  }
}
