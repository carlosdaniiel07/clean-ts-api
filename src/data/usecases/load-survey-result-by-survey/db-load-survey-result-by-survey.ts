import { LoadSurveyResultBySurveyRepository } from '~/data/protocols/db/survey-result/load-survey-result-by-survey-repository'
import { SurveyResultModel } from '~/domain/models/survey-result'
import { LoadSurveyResultBySurvey } from '~/domain/usecases/load-survey-result-by-survey'

export class DbLoadSurveyResultBySurvey implements LoadSurveyResultBySurvey {
  constructor (
    private readonly loadSurveyResultBySurveyRepository: LoadSurveyResultBySurveyRepository
  ) {}

  async loadBySurvey (surveyId: string): Promise<SurveyResultModel> {
    return await this.loadSurveyResultBySurveyRepository.loadBySurvey(surveyId)
  }
}
