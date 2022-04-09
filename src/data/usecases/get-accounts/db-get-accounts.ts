import { GetAccounts } from '../../../domain/usecases/get-accounts'
import { GetAccountsRepository } from '../../protocols/db/account/get-accounts-repository'
import { AccountModel } from '../add-account/db-add-account.protocols'

export class DbGetAccounts implements GetAccounts {
  constructor (
    private readonly getAccountsRepository: GetAccountsRepository
  ) {}

  async getAll (): Promise<AccountModel[]> {
    return await this.getAccountsRepository.getAll()
  }
}
