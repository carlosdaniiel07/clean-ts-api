import { DbSaveSurveyResult } from '~/data/usecases/save-survey-result/db-save-survey-result'
import { SaveSurveyResult } from '~/domain/usecases/save-survey-result'
import { SurveyResultMongoRepository } from '~/infra/db/mongodb/survey-result/survey-result-mongo-repository'

export const makeDbSaveSurveyResult = (): SaveSurveyResult => {
  const surveyResultRepository = new SurveyResultMongoRepository()
  return new DbSaveSurveyResult(
    surveyResultRepository,
    surveyResultRepository,
    surveyResultRepository
  )
}
