import { GetAccounts } from '~/domain/usecases/get-accounts'
import { ok, serverError } from '~/presentation/helpers/http-helper'
import { Controller, HttpResponse } from '~/presentation/protocols'

export class AccountsController implements Controller<AccountsController.Request> {
  constructor (private readonly getAccounts: GetAccounts) {}

  async handle (request: AccountsController.Request): Promise<HttpResponse> {
    try {
      const data = await this.getAccounts.getAll()
      return ok(data)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace AccountsController {
  export type Request = {}
}
