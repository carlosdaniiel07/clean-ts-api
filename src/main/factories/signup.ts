import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { AddAccount, AddAccountRepository, Encrypter } from '../../data/usecases/add-account/db-add-account.protocols'
import { BCryptAdapter } from '../../infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidator } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'

export const makeSignupController = (): SignUpController => {
  const encrypterSalt = 12
  const encrypter: Encrypter = new BCryptAdapter(encrypterSalt)
  const addAccountRepository: AddAccountRepository = new AccountMongoRepository()
  const addAccount: AddAccount = new DbAddAccount(encrypter, addAccountRepository)
  const emailValidator: EmailValidator = new EmailValidatorAdapter()

  return new SignUpController(emailValidator, addAccount)
}
