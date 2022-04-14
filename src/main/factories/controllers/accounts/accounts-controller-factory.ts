import { LogMongoRepository } from '../../../../infra/db/mongodb/log/log-mongo-repository'
import { AccountsController } from '../../../../presentation/controllers/accounts/accounts-controller'
import { Controller } from '../../../../presentation/protocols'
import { LogControllerDecorator } from '../../../decorators/log-controller-decorator'
import { makeDbGetAccounts } from '../../usecases/db-get-accounts-factory'

export const makeAccountsController = (): Controller => {
  const accountsController = new AccountsController(makeDbGetAccounts())
  const logErrorRepository = new LogMongoRepository()

  return new LogControllerDecorator(accountsController, logErrorRepository)
}
