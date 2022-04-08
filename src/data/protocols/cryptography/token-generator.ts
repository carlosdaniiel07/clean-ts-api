import { AccountModel } from '../../usecases/add-account/db-add-account.protocols'

export interface TokenGenerator {
  generate: (account: AccountModel) => string
}
