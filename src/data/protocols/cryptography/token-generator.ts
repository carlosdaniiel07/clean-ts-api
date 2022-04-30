import { AccountModel } from '~/domain/models/account'

export interface TokenGenerator {
  generate: (account: AccountModel) => string
}
