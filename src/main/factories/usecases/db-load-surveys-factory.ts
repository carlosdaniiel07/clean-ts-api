import { LoadSurveysRepository } from '~/data/protocols/db/survey/load-surveys-repository'
import { DbLoadSurveys } from '~/data/usecases/load-surveys/db-load-surveys'
import { LoadSurveys } from '~/domain/usecases/load-surveys'
import { SurveyMongoRepository } from '~/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurveys = (): LoadSurveys => {
  const loadSurveysRepository: LoadSurveysRepository =
    new SurveyMongoRepository()
  return new DbLoadSurveys(loadSurveysRepository)
}
