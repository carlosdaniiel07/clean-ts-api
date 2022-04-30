import { AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository'
import { LoadSurveysRepository } from '../../../../data/protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '../../../../domain/models/survey'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async add (survey: AddSurveyModel): Promise<SurveyModel> {
    const collection = await MongoHelper.getCollection('surveys')
    await collection.insertOne(survey)

    return MongoHelper.mapToModel<SurveyModel>(survey)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const collection = await MongoHelper.getCollection('surveys')
    const data = await collection.find().toArray()

    return MongoHelper.mapToModels<SurveyModel>(data)
  }
}
