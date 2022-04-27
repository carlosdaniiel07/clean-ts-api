import { AccountModel } from '../../../usecases/add-account/db-add-account.protocols'

export interface LoadAccountByAccessTokenRepository {
  loadByAccessToken: (accessToken: string, role?: string) => Promise<AccountModel | null>
}
