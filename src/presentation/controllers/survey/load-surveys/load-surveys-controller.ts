import { LoadSurveys } from '../../../../domain/usecases/load-surveys'
import { noContent, ok, serverError } from '../../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../../protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const data = await this.loadSurveys.load()
      return data.length ? ok(data) : noContent()
    } catch (err) {
      return serverError(err)
    }
  }
}
