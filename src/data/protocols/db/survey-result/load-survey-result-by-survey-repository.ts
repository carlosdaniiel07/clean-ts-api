import { SurveyResultModel } from '~/domain/models/survey-result'

export interface LoadSurveyResultBySurveyRepository {
  loadBySurvey: (surveyId: string) => Promise<SurveyResultModel>
}
