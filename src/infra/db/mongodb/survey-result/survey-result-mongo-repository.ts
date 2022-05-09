import { ObjectId } from 'mongodb'
import { AddSurveyResultRepository } from '~/data/protocols/db/survey-result/add-survey-result-repository'
import { CountSurveyResultByAccountAndSurveyRepository } from '~/data/protocols/db/survey-result/count-survey-result-by-account-and-survey'
import { LoadSurveyResultBySurveyRepository } from '~/data/protocols/db/survey-result/load-survey-result-by-survey-repository'
import { UpdateSurveyResultRepository } from '~/data/protocols/db/survey-result/update-survey-result-repository'
import { SurveyAnswerModel, SurveyModel } from '~/domain/models/survey'
import { SurveyResultModel } from '~/domain/models/survey-result'
import { SaveSurveyResultParams } from '~/domain/usecases/save-survey-result'
import { MongoHelper } from '~/infra/db/mongodb/helpers/mongo-helper'

export class SurveyResultMongoRepository
implements
    CountSurveyResultByAccountAndSurveyRepository,
    AddSurveyResultRepository,
    UpdateSurveyResultRepository,
    LoadSurveyResultBySurveyRepository {
  async countByAccountAndSurvey (
    accountId: string,
    surveyId: string
  ): Promise<number> {
    const collection = await MongoHelper.getCollection('survey_results')
    return await collection.countDocuments({
      accountId: new ObjectId(accountId),
      surveyId: new ObjectId(surveyId)
    })
  }

  async add (data: SaveSurveyResultParams): Promise<void> {
    const { surveyId, accountId } = data
    const collection = await MongoHelper.getCollection('survey_results')
    await collection.insertOne({
      ...data,
      surveyId: new ObjectId(surveyId),
      accountId: new ObjectId(accountId)
    })
  }

  async update (data: SaveSurveyResultParams): Promise<void> {
    const { surveyId, accountId } = data
    const collection = await MongoHelper.getCollection('survey_results')
    await collection.updateOne(
      {
        surveyId: new ObjectId(surveyId),
        accountId: new ObjectId(accountId)
      },
      {
        $set: {
          ...data,
          surveyId: new ObjectId(surveyId),
          accountId: new ObjectId(accountId)
        }
      }
    )
  }

  async loadBySurvey (surveyId: string): Promise<SurveyResultModel | null> {
    const survey = MongoHelper.mapToModel<SurveyModel>(
      await (
        await MongoHelper.getCollection('surveys')
      ).findOne({
        _id: new ObjectId(surveyId)
      })
    )
    const collection = await MongoHelper.getCollection('survey_results')
    const surveyResults = await collection
      .aggregate([
        {
          $match: {
            surveyId: new ObjectId(surveyId)
          }
        },
        {
          $group: {
            _id: '$answer',
            count: {
              $sum: 1
            }
          }
        }
      ])
      .toArray()
    const totalResults = surveyResults
      ?.map(({ count }) => count as number)
      .reduce((total, current) => total + current, 0)

    return {
      surveyId,
      question: survey.question,
      date: survey.date,
      answers: surveyResults?.map((item) => {
        const { _id: answer, count } = item
        const { image } = survey.answers.find(
          (surveyAnswer) => surveyAnswer.answer === answer
        ) as SurveyAnswerModel

        return {
          answer,
          count,
          image,
          percent: (count / totalResults) * 100
        }
      })
    }
  }
}
