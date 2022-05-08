import { SaveSurveyResultParams } from '~/domain/usecases/save-survey-result'

export interface UpdateSurveyResultRepository {
  update: (data: SaveSurveyResultParams) => Promise<void>
}
