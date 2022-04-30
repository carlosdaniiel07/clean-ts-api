import { AccountModel } from '~/domain/models/account'

export interface GetAccountByEmailRepository {
  getByEmail: (email: string) => Promise<AccountModel | null>
}
