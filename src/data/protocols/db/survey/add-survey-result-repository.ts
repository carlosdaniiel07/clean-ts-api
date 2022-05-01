import { SaveSurveyResultModel } from '~/domain/usecases/save-survey-result'

export interface AddSurveyResultRepository {
  addResult: (data: SaveSurveyResultModel) => Promise<void>
}
