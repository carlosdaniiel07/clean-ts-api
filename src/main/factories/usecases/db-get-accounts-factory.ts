import { GetAccountsRepository } from '../../../data/protocols/db/account/get-accounts-repository'
import { DbGetAccounts } from '../../../data/usecases/get-accounts/db-get-accounts'
import { GetAccounts } from '../../../domain/usecases/get-accounts'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'

export const makeDbGetAccounts = (): GetAccounts => {
  const getAccountsRepository: GetAccountsRepository =
    new AccountMongoRepository()
  return new DbGetAccounts(getAccountsRepository)
}
