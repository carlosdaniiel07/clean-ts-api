import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { AddAccount, AddAccountRepository, Encrypter } from '../../data/usecases/add-account/db-add-account.protocols'
import { BCryptAdapter } from '../../infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { Controller, EmailValidator } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { LogControllerDecorator } from '../decorators/log'

export const makeSignupController = (): Controller => {
  const encrypterSalt = 12
  const encrypter: Encrypter = new BCryptAdapter(encrypterSalt)
  const addAccountRepository: AddAccountRepository = new AccountMongoRepository()
  const addAccount: AddAccount = new DbAddAccount(encrypter, addAccountRepository)
  const emailValidator: EmailValidator = new EmailValidatorAdapter()
  const signUpController = new SignUpController(emailValidator, addAccount)

  return new LogControllerDecorator(signUpController)
}
