import { AddSurvey } from '~/domain/usecases/add-survey'
import {
  badRequest,
  created,
  serverError
} from '~/presentation/helpers/http-helper'
import { Controller, HttpResponse, Validation } from '~/presentation/protocols'

export class AddSurveyController
implements Controller<AddSurveyController.Request> {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (request: AddSurveyController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)

      if (error) {
        return badRequest(error)
      }

      const { question, answers } = request

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

export namespace AddSurveyController {
  export type Request = {
    question: string
    answers: Array<{
      answer: string
      image?: string
    }>
  }
}
