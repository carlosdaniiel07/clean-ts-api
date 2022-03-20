import { GetAccountsRepository } from '../../data/protocols/get-accounts-repository'
import { DbGetAccounts } from '../../data/usecases/get-accounts/db-get-accounts'
import { GetAccounts } from '../../domain/usecases/get-accounts'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { AccountsController } from '../../presentation/controllers/accounts/accounts'
import { Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorators/log'

export const makeAccountsController = (): Controller => {
  const getAccountsRepository: GetAccountsRepository = new AccountMongoRepository()
  const getAccounts: GetAccounts = new DbGetAccounts(getAccountsRepository)
  const accountsController = new AccountsController(getAccounts)

  return new LogControllerDecorator(accountsController)
}
