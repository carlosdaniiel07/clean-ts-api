import { LoadSurveyById } from '~/domain/usecases/load-survey-by-id'
import { LoadSurveyResultBySurvey } from '~/domain/usecases/load-survey-result-by-survey'
import { SaveSurveyResult } from '~/domain/usecases/save-survey-result'
import { InvalidParamError, NotFoundError } from '~/presentation/errors'
import {
  badRequest,
  notFound,
  ok,
  serverError
} from '~/presentation/helpers/http-helper'
import { Controller, HttpResponse, Validation } from '~/presentation/protocols'

export class SaveSurveyResultController
implements Controller<SaveSurveyResultController.Request> {
  constructor (
    private readonly validation: Validation,
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult,
    private readonly loadSurveyResultBySurvey: LoadSurveyResultBySurvey
  ) {}

  async handle (
    request: SaveSurveyResultController.Request
  ): Promise<HttpResponse> {
    try {
      const { surveyId, accountId, answer } = request
      const error = this.validation.validate(request)

      if (error) {
        return badRequest(error)
      }

      const survey = await this.loadSurveyById.loadById(surveyId)

      if (!survey) {
        return notFound(new NotFoundError('Survey not found'))
      }

      const isValidAnswer = survey.answers
        .map(({ answer }) => answer)
        .includes(answer)

      if (!isValidAnswer) {
        return badRequest(new InvalidParamError('answer'))
      }

      await this.saveSurveyResult.save({
        accountId,
        surveyId,
        answer,
        date: new Date()
      })

      const surveyResult = await this.loadSurveyResultBySurvey.loadBySurvey(
        surveyId
      )

      return ok(surveyResult)
    } catch (err) {
      return serverError(err)
    }
  }
}

export namespace SaveSurveyResultController {
  export type Request = {
    surveyId: string
    accountId: string
    answer: string
  }
}
