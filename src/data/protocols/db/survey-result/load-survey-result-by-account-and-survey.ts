import { SurveyResultModel } from '~/domain/models/survey-result'

export interface LoadSurveyResultByAccountAndSurveyRepository {
  loadResultByAccountAndSurvey: (
    accountId: string,
    surveyId: string
  ) => Promise<SurveyResultModel | null>
}
