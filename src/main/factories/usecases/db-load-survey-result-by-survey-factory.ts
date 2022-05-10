import { LoadSurveyResultBySurveyRepository } from '~/data/protocols/db/survey-result/load-survey-result-by-survey-repository'
import { DbLoadSurveyResultBySurvey } from '~/data/usecases/load-survey-result-by-survey/db-load-survey-result-by-survey'
import { LoadSurveyResultBySurvey } from '~/domain/usecases/load-survey-result-by-survey'
import { SurveyResultMongoRepository } from '~/infra/db/mongodb/survey-result/survey-result-mongo-repository'

export const makeDbLoadSurveyResultBySurvey = (): LoadSurveyResultBySurvey => {
  const loadSurveyResultBySurveyRepository: LoadSurveyResultBySurveyRepository =
    new SurveyResultMongoRepository()
  return new DbLoadSurveyResultBySurvey(loadSurveyResultBySurveyRepository)
}
