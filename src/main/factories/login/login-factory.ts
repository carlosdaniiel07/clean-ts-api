import { HashComparer } from '../../../data/protocols/cryptography/hash'
import { LogErrorRepository } from '../../../data/protocols/db/log/log-error-repository'
import { TokenGenerator } from '../../../data/protocols/cryptography/token-generator'
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { Authentication } from '../../../domain/usecases/authentication'
import { BCryptAdapter } from '../../../infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  const encrypterSalt = 12

  const accountMongoRepository = new AccountMongoRepository()
  const tokenGenerator: TokenGenerator = new JwtAdapter()
  const hashComparer: HashComparer = new BCryptAdapter(encrypterSalt)
  const authentication: Authentication = new DbAuthentication(accountMongoRepository, accountMongoRepository, tokenGenerator, hashComparer)
  const loginController: Controller = new LoginController(authentication, makeLoginValidation())
  const logErrorRepository: LogErrorRepository = new LogMongoRepository()

  return new LogControllerDecorator(loginController, logErrorRepository)
}
