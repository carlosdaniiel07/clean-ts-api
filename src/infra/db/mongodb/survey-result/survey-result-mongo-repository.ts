import { LoadSurveyResultByAccountAndSurveyRepository } from '~/data/protocols/db/survey-result/load-survey-result-by-account-and-survey'
import { SurveyResultModel } from '~/domain/models/survey-result'
import { MongoHelper } from '~/infra/db/mongodb/helpers/mongo-helper'

export class SurveyResultMongoRepository
implements LoadSurveyResultByAccountAndSurveyRepository {
  async loadResultByAccountAndSurvey (
    accountId: string,
    surveyId: string
  ): Promise<SurveyResultModel | null> {
    const collection = await MongoHelper.getCollection('survey_results')
    const surveyResult = await collection.findOne({
      accountId,
      surveyId
    })

    return surveyResult
      ? MongoHelper.mapToModel<SurveyResultModel>(surveyResult)
      : null
  }
}
