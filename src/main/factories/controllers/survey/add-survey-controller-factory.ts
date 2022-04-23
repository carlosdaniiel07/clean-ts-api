import { AddSurveyController } from '../../../../presentation/controllers/survey/add-survey/add-survey-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { makeDbAddSurvey } from '../../usecases/db-add-survey-factory'
import { makeAddSurveyValidation } from './add-survey-controller-validation-factory'

export const makeAddSurveyController = (): Controller => {
  const addSurveyController = new AddSurveyController(
    makeAddSurveyValidation(),
    makeDbAddSurvey()
  )

  return makeLogControllerDecorator(addSurveyController)
}
