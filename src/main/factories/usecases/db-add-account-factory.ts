import { Encrypter } from '~/data/protocols/cryptography/encrypter'
import { DbAddAccount } from '~/data/usecases/add-account/db-add-account'
import { AddAccount } from '~/domain/usecases/add-account'
import { BCryptAdapter } from '~/infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '~/infra/db/mongodb/account/account-mongo-repository'

export const makeDbAddAccount = (): AddAccount => {
  const encrypterSalt = 12
  const encrypter: Encrypter = new BCryptAdapter(encrypterSalt)
  const accountMongoRepository = new AccountMongoRepository()

  return new DbAddAccount(
    encrypter,
    accountMongoRepository,
    accountMongoRepository
  )
}
