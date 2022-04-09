import { GetAccountByEmailRepository } from '../../../data/protocols/db/account/get-account-by-email-repository'
import { HashComparer } from '../../../data/protocols/cryptography/hash'
import { LogErrorRepository } from '../../../data/protocols/db/log/log-error-repository'
import { TokenGenerator } from '../../../data/protocols/cryptography/token-generator'
import { UpdateAccessTokenRepository } from '../../../data/protocols/db/account/update-access-token-repository'
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { Authentication } from '../../../domain/usecases/authentication'
import { BCryptAdapter } from '../../../infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mong-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  const encrypterSalt = 12

  const accountMongoRepository = new AccountMongoRepository()
  const getAccountByEmailRepository: GetAccountByEmailRepository = accountMongoRepository
  const updateAccessTokenRepository: UpdateAccessTokenRepository = accountMongoRepository
  const tokenGenerator: TokenGenerator = new JwtAdapter()
  const hashComparer: HashComparer = new BCryptAdapter(encrypterSalt)
  const authentication: Authentication = new DbAuthentication(getAccountByEmailRepository, updateAccessTokenRepository, tokenGenerator, hashComparer)
  const loginController: Controller = new LoginController(authentication, makeLoginValidation())
  const logErrorRepository: LogErrorRepository = new LogMongoRepository()

  return new LogControllerDecorator(loginController, logErrorRepository)
}
