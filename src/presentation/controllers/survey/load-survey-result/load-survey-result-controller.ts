import { LoadSurveyResultBySurvey } from '~/domain/usecases/load-survey-result-by-survey'
import { MissingParamError } from '~/presentation/errors'
import { badRequest, ok, serverError } from '~/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '~/presentation/protocols'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyResultBySurvey: LoadSurveyResultBySurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { params } = httpRequest
      const surveyId = params?.surveyId as string

      if (!surveyId) {
        return badRequest(new MissingParamError('surveyId'))
      }

      const surveyResult = await this.loadSurveyResultBySurvey.loadBySurvey(surveyId)

      return ok(surveyResult)
    } catch (err) {
      return serverError(err)
    }
  }
}
