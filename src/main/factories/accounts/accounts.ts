import { GetAccountsRepository } from '../../../data/protocols/db/account/get-accounts-repository'
import { DbGetAccounts } from '../../../data/usecases/get-accounts/db-get-accounts'
import { GetAccounts } from '../../../domain/usecases/get-accounts'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { AccountsController } from '../../../presentation/controllers/accounts/accounts-controller'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'

export const makeAccountsController = (): Controller => {
  const getAccountsRepository: GetAccountsRepository = new AccountMongoRepository()
  const getAccounts: GetAccounts = new DbGetAccounts(getAccountsRepository)
  const accountsController = new AccountsController(getAccounts)
  const logErrorRepository = new LogMongoRepository()

  return new LogControllerDecorator(accountsController, logErrorRepository)
}
