import { GetAccountsRepository } from '../../data/protocols/get-accounts-repository'
import { DbGetAccounts } from '../../data/usecases/get-accounts/db-get-accounts'
import { GetAccounts } from '../../domain/usecases/get-accounts'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogErrorMongoRepository } from '../../infra/db/mongodb/log-error-repository/log-error'
import { AccountsController } from '../../presentation/controllers/accounts/accounts'
import { Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorators/log'

export const makeAccountsController = (): Controller => {
  const getAccountsRepository: GetAccountsRepository = new AccountMongoRepository()
  const getAccounts: GetAccounts = new DbGetAccounts(getAccountsRepository)
  const accountsController = new AccountsController(getAccounts)
  const logErrorRepository = new LogErrorMongoRepository()

  return new LogControllerDecorator(accountsController, logErrorRepository)
}
