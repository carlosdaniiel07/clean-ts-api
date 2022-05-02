import { LoadSurveyById } from '~/domain/usecases/load-survey-by-id'
import { SaveSurveyResult } from '~/domain/usecases/save-survey-result'
import { InvalidParamError, NotFoundError } from '~/presentation/errors'
import {
  badRequest,
  noContent,
  notFound,
  serverError
} from '~/presentation/helpers/http-helper'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from '~/presentation/protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { params, body, accountId } = httpRequest
      const surveyId = params?.surveyId as string
      const error = this.validation.validate(body)

      if (error) {
        return badRequest(error)
      }

      const survey = await this.loadSurveyById.loadById(surveyId)

      if (!survey) {
        return notFound(new NotFoundError('Survey not found'))
      }

      const { answer } = body
      const isValidAnswer = survey.answers
        .map(({ answer }) => answer)
        .includes(answer)

      if (!isValidAnswer) {
        return badRequest(new InvalidParamError('answer'))
      }

      await this.saveSurveyResult.save({
        accountId: accountId as string,
        surveyId,
        answer,
        date: new Date()
      })

      return noContent()
    } catch (err) {
      return serverError(err)
    }
  }
}
