import { AddSurveyResultRepository } from '~/data/protocols/db/survey-result/add-survey-result-repository'
import { CountSurveyResultByAccountAndSurveyRepository } from '~/data/protocols/db/survey-result/count-survey-result-by-account-and-survey'
import { UpdateSurveyResultRepository } from '~/data/protocols/db/survey-result/update-survey-result-repository'
import { SaveSurveyResultParams } from '~/domain/usecases/save-survey-result'
import { MongoHelper } from '~/infra/db/mongodb/helpers/mongo-helper'

export class SurveyResultMongoRepository
implements
    CountSurveyResultByAccountAndSurveyRepository,
    AddSurveyResultRepository,
    UpdateSurveyResultRepository {
  async countByAccountAndSurvey (
    accountId: string,
    surveyId: string
  ): Promise<number> {
    const collection = await MongoHelper.getCollection('survey_results')
    return await collection.countDocuments({
      accountId,
      surveyId
    })
  }

  async add (data: SaveSurveyResultParams): Promise<void> {
    const collection = await MongoHelper.getCollection('survey_results')
    await collection.insertOne(data)
  }

  async update (data: SaveSurveyResultParams): Promise<void> {
    const { surveyId, accountId } = data
    const collection = await MongoHelper.getCollection('survey_results')
    await collection.updateOne(
      {
        surveyId,
        accountId
      },
      {
        $set: data
      }
    )
  }
}
