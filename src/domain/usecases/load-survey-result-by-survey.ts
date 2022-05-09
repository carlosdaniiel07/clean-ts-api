import { SurveyResultModel } from '~/domain/models/survey-result'

export interface LoadSurveyResultBySurvey {
  loadBySurvey: (surveyId: string) => Promise<SurveyResultModel>
}
