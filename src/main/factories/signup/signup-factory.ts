import { HashComparer } from '../../../data/protocols/cryptography/hash'
import { TokenGenerator } from '../../../data/protocols/cryptography/token-generator'
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { AddAccount, Encrypter } from '../../../data/usecases/add-account/db-add-account.protocols'
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { Authentication } from '../../../domain/usecases/authentication'
import { BCryptAdapter } from '../../../infra/cryptography/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignupController = (): Controller => {
  const encrypterSalt = 12
  const encrypter: Encrypter = new BCryptAdapter(encrypterSalt)
  const accountMongoRepository = new AccountMongoRepository()
  const addAccount: AddAccount = new DbAddAccount(encrypter, accountMongoRepository)
  const tokenGenerator: TokenGenerator = new JwtAdapter()
  const hashComparer: HashComparer = new BCryptAdapter(encrypterSalt)
  const authentication: Authentication = new DbAuthentication(accountMongoRepository, accountMongoRepository, tokenGenerator, hashComparer)
  const signUpController = new SignUpController(addAccount, authentication, makeSignUpValidation())
  const logErrorRepository = new LogMongoRepository()

  return new LogControllerDecorator(signUpController, logErrorRepository)
}
