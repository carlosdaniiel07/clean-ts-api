import { AccountModel } from '~/domain/models/account'

export interface LoadAccountByAccessTokenRepository {
  loadByAccessToken: (
    accessToken: string,
    role?: string
  ) => Promise<AccountModel | null>
}
