import { SaveSurveyResultParams } from '~/domain/usecases/save-survey-result'

export interface AddSurveyResultRepository {
  add: (data: SaveSurveyResultParams) => Promise<void>
}
