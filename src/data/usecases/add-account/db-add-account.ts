import { AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Encrypter } from './db-add-account.protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (addAccount: AddAccountModel): Promise<AccountModel> {
    return await this.addAccountRepository.add({
      ...addAccount,
      password: await this.encrypter.encrypt(addAccount.password)
    })
  }
}
