import { LogErrorRepository } from '../../data/protocols/db/log/log-error-repository'
import { ServerError } from '../../presentation/errors'
import { serverError } from '../../presentation/helpers/http-helper'
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../../presentation/protocols'

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller
  private readonly logErrorRepository?: LogErrorRepository

  constructor (controller: Controller, logErrorRepository: LogErrorRepository) {
    this.controller = controller
    this.logErrorRepository = logErrorRepository
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    const isInternalServerError = httpResponse.statusCode === serverError().statusCode

    if (isInternalServerError) {
      const error = httpResponse.body as ServerError
      await this.logErrorRepository?.logError(error?.stack ?? '')
    }

    return httpResponse
  }
}
