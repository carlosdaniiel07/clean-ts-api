import { HashComparer } from '~/data/protocols/cryptography/hash'
import { TokenGenerator } from '~/data/protocols/cryptography/token-generator'
import { DbAuthentication } from '~/data/usecases/authentication/db-authentication'
import { Authentication } from '~/domain/usecases/authentication'
import { BCryptAdapter } from '~/infra/cryptography/bcrypt-adapter'
import { JwtAdapter } from '~/infra/cryptography/jwt-adapter'
import { AccountMongoRepository } from '~/infra/db/mongodb/account/account-mongo-repository'

export const makeDbAuthentication = (): Authentication => {
  const encrypterSalt = 12
  const accountMongoRepository = new AccountMongoRepository()
  const tokenGenerator: TokenGenerator = new JwtAdapter()
  const hashComparer: HashComparer = new BCryptAdapter(encrypterSalt)

  return new DbAuthentication(
    accountMongoRepository,
    accountMongoRepository,
    tokenGenerator,
    hashComparer
  )
}
