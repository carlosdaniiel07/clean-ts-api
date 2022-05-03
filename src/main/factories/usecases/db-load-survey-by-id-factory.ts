import { LoadSurveyByIdRepository } from '~/data/protocols/db/survey/load-survey-by-id-repository'
import { DbLoadSurveyById } from '~/data/usecases/load-survey-by-id/db-load-survey-by-id'
import { LoadSurveyById } from '~/domain/usecases/load-survey-by-id'
import { SurveyMongoRepository } from '~/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurveyById = (): LoadSurveyById => {
  const loadSurveyByIdRepository: LoadSurveyByIdRepository =
    new SurveyMongoRepository()
  return new DbLoadSurveyById(loadSurveyByIdRepository)
}
