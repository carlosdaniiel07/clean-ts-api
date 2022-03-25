import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { GetAccountByEmailRepository } from '../../protocols/get-account-by-email-repository'
import { HashComparer } from '../../protocols/hash'
import { TokenGenerator } from '../../protocols/token-generator'
import { UpdateAccessTokenRepository } from '../../protocols/update-access-token-repository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly getAccountByEmailRepository: GetAccountByEmailRepository,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
    private readonly tokenGenerator: TokenGenerator,
    private readonly hashComparer: HashComparer
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string> {
    const { email, password } = authentication
    const account = await this.getAccountByEmailRepository.getByEmail(email)

    if (!account) {
      throw new Error(`Account with email ${email} was not found`)
    }

    const isValidPassword = await this.hashComparer.compare(password, account.password)

    if (!isValidPassword) {
      throw new Error('Invalid password')
    }

    const accessToken = this.tokenGenerator.generate(account)

    // TODO: Entender o que seria esse update
    await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)

    return accessToken
  }
}
