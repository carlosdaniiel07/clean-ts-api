import { Decrypter } from '~/data/protocols/cryptography/decrypter'
import { LoadAccountByAccessTokenRepository } from '~/data/protocols/db/account/load-account-by-access-token-repository'
import { AccountModel } from '~/domain/models/account'
import { LoadAccountByAccessToken } from '~/domain/usecases/load-account-by-access-token'

export class DbLoadAccountByAccessToken implements LoadAccountByAccessToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByAccessTokenRepository: LoadAccountByAccessTokenRepository
  ) {}

  async load (
    accessToken: string,
    role?: string | undefined
  ): Promise<AccountModel | null> {
    try {
      const decryptedAccessToken = await this.decrypter.decrypt(accessToken)

      if (!decryptedAccessToken) {
        return null
      }
    } catch (err) {
      return null
    }

    return await this.loadAccountByAccessTokenRepository.loadByAccessToken(
      accessToken,
      role as string
    )
  }
}
