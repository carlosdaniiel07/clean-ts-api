import { GetAccounts } from '~/domain/usecases/get-accounts'
import { ok, serverError } from '~/presentation/helpers/http-helper'
import { Controller, HttpResponse } from '~/presentation/protocols'

export class AccountsController implements Controller {
  constructor (private readonly getAccounts: GetAccounts) {}

  async handle (): Promise<HttpResponse> {
    try {
      const data = await this.getAccounts.getAll()
      return ok(data)
    } catch (error) {
      return serverError(error)
    }
  }
}
