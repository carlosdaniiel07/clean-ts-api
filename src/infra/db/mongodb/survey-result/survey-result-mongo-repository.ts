import { AddSurveyResultRepository } from '~/data/protocols/db/survey-result/add-survey-result-repository'
import { LoadSurveyResultByAccountAndSurveyRepository } from '~/data/protocols/db/survey-result/load-survey-result-by-account-and-survey'
import { UpdateSurveyResultRepository } from '~/data/protocols/db/survey-result/update-survey-result-repository'
import { SurveyResultModel } from '~/domain/models/survey-result'
import { SaveSurveyResultParams } from '~/domain/usecases/save-survey-result'
import { MongoHelper } from '~/infra/db/mongodb/helpers/mongo-helper'

export class SurveyResultMongoRepository
implements
    LoadSurveyResultByAccountAndSurveyRepository,
    AddSurveyResultRepository,
    UpdateSurveyResultRepository {
  async loadByAccountAndSurvey (
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

  async add (data: SaveSurveyResultParams): Promise<void> {
    const collection = await MongoHelper.getCollection('survey_results')
    await collection.insertOne(data)
  }

  async update (id: string, data: SaveSurveyResultParams): Promise<void> {
    const collection = await MongoHelper.getCollection('survey_results')
    await collection.updateOne(
      {
        _id: id
      },
      {
        $set: data
      }
    )
  }
}
