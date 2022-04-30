import { GetAccountsRepository } from '~/data/protocols/db/account/get-accounts-repository'
import { AccountModel } from '~/domain/models/account'
import { GetAccounts } from '~/domain/usecases/get-accounts'

export class DbGetAccounts implements GetAccounts {
  constructor (private readonly getAccountsRepository: GetAccountsRepository) {}

  async getAll (): Promise<AccountModel[]> {
    return await this.getAccountsRepository.getAll()
  }
}
