import { AddSurveyRepository } from '~/data/protocols/db/survey/add-survey-repository'
import { DbAddSurvey } from '~/data/usecases/add-survey/db-add-survey'
import { AddSurvey } from '~/domain/usecases/add-survey'
import { SurveyMongoRepository } from '~/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbAddSurvey = (): AddSurvey => {
  const addSurveyRepository: AddSurveyRepository = new SurveyMongoRepository()
  return new DbAddSurvey(addSurveyRepository)
}
