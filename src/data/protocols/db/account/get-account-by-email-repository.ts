import { AccountModel } from '../../../usecases/add-account/db-add-account-protocols'

export interface GetAccountByEmailRepository {
  getByEmail: (email: string) => Promise<AccountModel | null>
}
