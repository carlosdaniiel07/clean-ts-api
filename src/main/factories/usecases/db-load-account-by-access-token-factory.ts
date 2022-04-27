import { Decrypter } from '../../../data/protocols/cryptography/decrypter'
import { LoadAccountByAccessTokenRepository } from '../../../data/protocols/db/account/load-account-by-access-token-repository'
import { DbLoadAccountByAccessToken } from '../../../data/usecases/load-account-by-access-token/db-load-account-by-access-token'
import { LoadAccountByAccessToken } from '../../../domain/usecases/load-account-by-access-token'
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'

export const makeDbLoadAccountByAccessToken = (): LoadAccountByAccessToken => {
  const decrypter: Decrypter = new JwtAdapter()
  const loadAccountByAccessTokenRepository: LoadAccountByAccessTokenRepository = new AccountMongoRepository()

  return new DbLoadAccountByAccessToken(decrypter, loadAccountByAccessTokenRepository)
}
