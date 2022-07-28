import { LoadSurveyResultBySurvey } from '~/domain/usecases/load-survey-result-by-survey'
import { MissingParamError } from '~/presentation/errors'
import { badRequest, ok, serverError } from '~/presentation/helpers/http-helper'
import { Controller, HttpResponse } from '~/presentation/protocols'

export class LoadSurveyResultController implements Controller<LoadSurveyResultController.Request> {
  constructor (
    private readonly loadSurveyResultBySurvey: LoadSurveyResultBySurvey
  ) {}

  async handle (request: LoadSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { surveyId } = request

      if (!surveyId) {
        return badRequest(new MissingParamError('surveyId'))
      }

      const surveyResult = await this.loadSurveyResultBySurvey.loadBySurvey(
        surveyId
      )

      return ok(surveyResult)
    } catch (err) {
      return serverError(err)
    }
  }
}

export namespace LoadSurveyResultController {
  export type Request = {
    surveyId: string
  }
}
