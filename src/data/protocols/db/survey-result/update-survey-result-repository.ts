import { SaveSurveyResultModel } from '~/domain/usecases/save-survey-result'

export interface UpdateSurveyResultRepository {
  update: (id: string, data: SaveSurveyResultModel) => Promise<void>
}
