import { SaveSurveyResultModel } from '~/domain/usecases/save-survey-result'

export interface AddSurveyResultRepository {
  add: (data: SaveSurveyResultModel) => Promise<void>
}
