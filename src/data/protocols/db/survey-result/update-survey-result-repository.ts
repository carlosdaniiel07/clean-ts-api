import { SaveSurveyResultParams } from '~/domain/usecases/save-survey-result'

export interface UpdateSurveyResultRepository {
  update: (id: string, data: SaveSurveyResultParams) => Promise<void>
}
