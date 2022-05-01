import { AddSurvey } from '~/domain/usecases/add-survey'
import { badRequest, created, serverError } from '~/presentation/helpers/http-helper'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from '~/presentation/protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest
      const error = this.validation.validate(body)

      if (error) {
        return badRequest(error)
      }

      const { question, answers } = body

      await this.addSurvey.add({
        question,
        answers,
        date: new Date()
      })

      return created()
    } catch (err) {
      return serverError(err)
    }
  }
}
