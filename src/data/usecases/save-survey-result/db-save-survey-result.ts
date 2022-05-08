import { AddSurveyResultRepository } from '~/data/protocols/db/survey-result/add-survey-result-repository'
import { CountSurveyResultByAccountAndSurveyRepository } from '~/data/protocols/db/survey-result/count-survey-result-by-account-and-survey'
import { UpdateSurveyResultRepository } from '~/data/protocols/db/survey-result/update-survey-result-repository'
import {
  SaveSurveyResult,
  SaveSurveyResultParams
} from '~/domain/usecases/save-survey-result'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly countSurveyResultByAccountAndSurveyRepository: CountSurveyResultByAccountAndSurveyRepository,
    private readonly addSurveyResultRepository: AddSurveyResultRepository,
    private readonly updateSurveyResultRepository: UpdateSurveyResultRepository
  ) {}

  async save (data: SaveSurveyResultParams): Promise<void> {
    const { accountId, surveyId } = data
    const resultsCount =
      await this.countSurveyResultByAccountAndSurveyRepository.countByAccountAndSurvey(
        accountId,
        surveyId
      )
    const alreadyAnswered = resultsCount > 0

    alreadyAnswered && (await this.updateSurveyResultRepository.update(data))
    !alreadyAnswered && (await this.addSurveyResultRepository.add(data))
  }
}
