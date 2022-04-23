import { AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository'
import { SurveyModel } from '../../../../domain/models/survey'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (survey: AddSurveyModel): Promise<SurveyModel> {
    const collection = await MongoHelper.getCollection('surveys')
    await collection.insertOne(survey)

    return MongoHelper.mapToModel<SurveyModel>(survey)
  }
}
