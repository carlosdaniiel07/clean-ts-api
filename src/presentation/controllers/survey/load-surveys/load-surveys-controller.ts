import { LoadSurveys } from '../../../../domain/usecases/load-surveys'
import { serverError } from '../../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../../protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const data = await this.loadSurveys.load()
      return {
        statusCode: 200,
        body: data
      }
    } catch (err) {
      return serverError(err)
    }
  }
}
