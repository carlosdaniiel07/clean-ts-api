import { AccountModel } from '../../../../domain/models/account'

export interface GetAccountsRepository {
  getAll: () => Promise<AccountModel[]>
}
