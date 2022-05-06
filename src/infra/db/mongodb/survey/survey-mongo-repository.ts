import { ObjectId } from 'mongodb'
import { AddSurveyRepository } from '~/data/protocols/db/survey/add-survey-repository'
import { LoadSurveyByIdRepository } from '~/data/protocols/db/survey/load-survey-by-id-repository'
import { LoadSurveysRepository } from '~/data/protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '~/domain/models/survey'
import { AddSurveyParams } from '~/domain/usecases/add-survey'
import { MongoHelper } from '~/infra/db/mongodb/helpers/mongo-helper'

export class SurveyMongoRepository
implements
    AddSurveyRepository,
    LoadSurveysRepository,
    LoadSurveyByIdRepository {
  async add (survey: AddSurveyParams): Promise<SurveyModel> {
    const collection = await MongoHelper.getCollection('surveys')
    await collection.insertOne(survey)

    return MongoHelper.mapToModel<SurveyModel>(survey)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const collection = await MongoHelper.getCollection('surveys')
    const data = await collection.find().toArray()

    return MongoHelper.mapToModels<SurveyModel>(data)
  }

  async loadById (id: string): Promise<SurveyModel | null> {
    const collection = await MongoHelper.getCollection('surveys')
    const survey = await collection.findOne({
      _id: new ObjectId(id)
    })

    return survey ? MongoHelper.mapToModel<SurveyModel>(survey) : null
  }
}
