import { SaveSurveyResultModel } from '~/domain/usecases/save-survey-result'

export interface UpdateSurveyResultRepository {
  updateResult: (id: string, data: SaveSurveyResultModel) => Promise<void>
}
