import { AccountModel } from '../models/account'

export interface GetAccounts {
  getAll: () => Promise<AccountModel[]>
}
