import { LoadSurveys } from '~/domain/usecases/load-surveys'
import { noContent, ok, serverError } from '~/presentation/helpers/http-helper'
import { Controller, HttpResponse } from '~/presentation/protocols'

export class LoadSurveysController implements Controller<LoadSurveysController.Request> {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (request: LoadSurveysController.Request): Promise<HttpResponse> {
    try {
      const data = await this.loadSurveys.load()
      return data.length ? ok(data) : noContent()
    } catch (err) {
      return serverError(err)
    }
  }
}

export namespace LoadSurveysController {
  export type Request = {}
}
