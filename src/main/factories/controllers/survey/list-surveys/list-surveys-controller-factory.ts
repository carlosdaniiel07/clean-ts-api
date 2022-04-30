import { LoadSurveysController } from '../../../../../presentation/controllers/survey/load-surveys/load-surveys-controller'
import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { makeDbLoadSurveys } from '../../../usecases/db-load-surveys-factory'

export const makeListSurveysController = (): Controller => {
  const listSurveysController = new LoadSurveysController(makeDbLoadSurveys())
  return makeLogControllerDecorator(listSurveysController)
}
