import { GetAccountsRepository } from '../../data/protocols/db/get-accounts-repository'
import { DbGetAccounts } from '../../data/usecases/get-accounts/db-get-accounts'
import { GetAccounts } from '../../domain/usecases/get-accounts'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { AccountsController } from '../../presentation/controllers/accounts/accounts'
import { Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorators/log'

export const makeAccountsController = (): Controller => {
  const getAccountsRepository: GetAccountsRepository = new AccountMongoRepository()
  const getAccounts: GetAccounts = new DbGetAccounts(getAccountsRepository)
  const accountsController = new AccountsController(getAccounts)
  const logErrorRepository = new LogMongoRepository()

  return new LogControllerDecorator(accountsController, logErrorRepository)
}
