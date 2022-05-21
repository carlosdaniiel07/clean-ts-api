import { makeLogControllerDecorator } from '~/main/factories/decorators/log-controller-decorator-factory'
import { makeDbLoadSurveyResultBySurvey } from '~/main/factories/usecases/db-load-survey-result-by-survey-factory'
import { LoadSurveyResultController } from '~/presentation/controllers/survey/load-survey-result/load-survey-result-controller'
import { Controller } from '~/presentation/protocols'

export const makeLoadSurveyResultController = (): Controller => {
  const loadSurveyResultController = new LoadSurveyResultController(
    makeDbLoadSurveyResultBySurvey()
  )
  return makeLogControllerDecorator(loadSurveyResultController)
}
