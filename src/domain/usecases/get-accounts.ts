import { AccountModel } from '~/domain/models/account'

export interface GetAccounts {
  getAll: () => Promise<AccountModel[]>
}
