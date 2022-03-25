import { GetAccountByEmailRepository } from '../../data/protocols/get-account-by-email-repository'
import { HashComparer } from '../../data/protocols/hash'
import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { TokenGenerator } from '../../data/protocols/token-generator'
import { UpdateAccessTokenRepository } from '../../data/protocols/update-access-token-repository'
import { DbAuthentication } from '../../data/usecases/authentication/db-authentication'
import { Authentication } from '../../domain/usecases/authentication'
import { BCryptAdapter } from '../../infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { JwtAdapter } from '../../infra/tokenization/jwt-adapter'
import { LoginController } from '../../presentation/controllers/login/login'
import { Controller, EmailValidator } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { LogControllerDecorator } from '../decorators/log'

export const makeLoginController = (): Controller => {
  const encrypterSalt = 12

  const accountMongoRepository = new AccountMongoRepository()
  const getAccountByEmailRepository: GetAccountByEmailRepository = accountMongoRepository
  const updateAccessTokenRepository: UpdateAccessTokenRepository = accountMongoRepository
  const tokenGenerator: TokenGenerator = new JwtAdapter()
  const hashComparer: HashComparer = new BCryptAdapter(encrypterSalt)
  const authentication: Authentication = new DbAuthentication(getAccountByEmailRepository, updateAccessTokenRepository, tokenGenerator, hashComparer)
  const emailValidator: EmailValidator = new EmailValidatorAdapter()
  const loginController: Controller = new LoginController(authentication, emailValidator)
  const logErrorRepository: LogErrorRepository = new LogMongoRepository()

  return new LogControllerDecorator(loginController, logErrorRepository)
}
