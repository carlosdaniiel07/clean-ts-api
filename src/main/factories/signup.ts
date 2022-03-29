import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { AddAccount, AddAccountRepository, Encrypter } from '../../data/usecases/add-account/db-add-account.protocols'
import { BCryptAdapter } from '../../infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorators/log'
import { makeSignUpValidation } from './signup-validation'

export const makeSignupController = (): Controller => {
  const encrypterSalt = 12
  const encrypter: Encrypter = new BCryptAdapter(encrypterSalt)
  const addAccountRepository: AddAccountRepository = new AccountMongoRepository()
  const addAccount: AddAccount = new DbAddAccount(encrypter, addAccountRepository)
  const signUpController = new SignUpController(addAccount, makeSignUpValidation())
  const logErrorRepository = new LogMongoRepository()

  return new LogControllerDecorator(signUpController, logErrorRepository)
}
