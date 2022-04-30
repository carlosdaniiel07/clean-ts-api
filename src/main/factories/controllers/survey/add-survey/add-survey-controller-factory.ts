import { makeLogControllerDecorator } from '~/main/factories/decorators/log-controller-decorator-factory'
import { makeDbAddSurvey } from '~/main/factories/usecases/db-add-survey-factory'
import { AddSurveyController } from '~/presentation/controllers/survey/add-survey/add-survey-controller'
import { Controller } from '~/presentation/protocols'
import { makeAddSurveyValidation } from './add-survey-controller-validation-factory'

export const makeAddSurveyController = (): Controller => {
  const addSurveyController = new AddSurveyController(
    makeAddSurveyValidation(),
    makeDbAddSurvey()
  )

  return makeLogControllerDecorator(addSurveyController)
}
