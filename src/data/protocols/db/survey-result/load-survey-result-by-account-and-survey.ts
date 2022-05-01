import { SurveyResultModel } from '~/domain/models/survey-result'

export interface LoadSurveyResultByAccountAndSurveyRepository {
  loadByAccountAndSurvey: (
    accountId: string,
    surveyId: string
  ) => Promise<SurveyResultModel | null>
}
