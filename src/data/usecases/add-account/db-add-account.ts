import { GetAccountByEmailRepository } from '~/data/protocols/db/account/get-account-by-email-repository'
import {
  AccountModel,
  AddAccount,
  AddAccountParams,
  AddAccountRepository,
  Encrypter
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly getAccountByEmailRepository: GetAccountByEmailRepository
  ) {}

  async add (addAccount: AddAccountParams): Promise<AccountModel | null> {
    const isEmailInUse = !!(await this.getAccountByEmailRepository.getByEmail(
      addAccount.email
    ))

    if (isEmailInUse) {
      return null
    }

    return await this.addAccountRepository.add({
      ...addAccount,
      password: await this.encrypter.encrypt(addAccount.password)
    })
  }
}
