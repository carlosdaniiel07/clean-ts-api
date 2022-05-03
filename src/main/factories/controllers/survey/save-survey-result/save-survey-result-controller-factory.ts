import { makeLogControllerDecorator } from '~/main/factories/decorators/log-controller-decorator-factory'
import { makeDbLoadSurveyById } from '~/main/factories/usecases/db-load-survey-by-id-factory'
import { makeDbSaveSurveyResult } from '~/main/factories/usecases/db-save-survey-result-factory'
import { SaveSurveyResultController } from '~/presentation/controllers/survey/save-survey-result/save-survey-result-controller'
import { Controller } from '~/presentation/protocols'
import { makeSaveSurveyResultValidation } from './save-survey-result-controller-validation-factory'

export const makeSaveSurveyResultController = (): Controller => {
  const saveSurveyResultController = new SaveSurveyResultController(
    makeSaveSurveyResultValidation(),
    makeDbLoadSurveyById(),
    makeDbSaveSurveyResult()
  )

  return makeLogControllerDecorator(saveSurveyResultController)
}
