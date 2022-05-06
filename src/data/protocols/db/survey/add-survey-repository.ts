import { SurveyModel } from '~/domain/models/survey'
import { AddSurveyParams } from '~/domain/usecases/add-survey'

export interface AddSurveyRepository {
  add: (survey: AddSurveyParams) => Promise<SurveyModel>
}
