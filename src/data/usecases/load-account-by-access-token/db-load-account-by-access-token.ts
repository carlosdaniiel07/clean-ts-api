import { LoadAccountByAccessToken } from '../../../domain/usecases/load-account-by-access-token'
import { Decrypter } from '../../protocols/cryptography/decrypter'
import { LoadAccountByAccessTokenRepository } from '../../protocols/db/account/load-account-by-access-token-repository'
import { AccountModel } from '../add-account/db-add-account.protocols'

export class DbLoadAccountByAccessToken implements LoadAccountByAccessToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByAccessTokenRepository: LoadAccountByAccessTokenRepository
  ) {}

  async load (
    accessToken: string,
    role?: string | undefined
  ): Promise<AccountModel | null> {
    const decryptedAccessToken = await this.decrypter.decrypt(accessToken)

    if (!decryptedAccessToken) {
      return null
    }

    return await this.loadAccountByAccessTokenRepository.loadByAccessToken(
      accessToken,
      role as string
    )
  }
}
