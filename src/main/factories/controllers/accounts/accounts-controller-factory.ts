import { LogMongoRepository } from '~/infra/db/mongodb/log/log-mongo-repository'
import { LogControllerDecorator } from '~/main/decorators/log-controller-decorator'
import { AccountsController } from '~/presentation/controllers/accounts/accounts-controller'
import { Controller } from '~/presentation/protocols'
import { makeDbGetAccounts } from '~/main/factories/usecases/db-get-accounts-factory'

export const makeAccountsController = (): Controller => {
  const accountsController = new AccountsController(makeDbGetAccounts())
  const logErrorRepository = new LogMongoRepository()

  return new LogControllerDecorator(accountsController, logErrorRepository)
}
