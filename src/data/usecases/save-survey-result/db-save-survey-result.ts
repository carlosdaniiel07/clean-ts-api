import { AddSurveyResultRepository } from '~/data/protocols/db/survey-result/add-survey-result-repository'
import { LoadSurveyResultByAccountAndSurveyRepository } from '~/data/protocols/db/survey-result/load-survey-result-by-account-and-survey'
import { UpdateSurveyResultRepository } from '~/data/protocols/db/survey-result/update-survey-result-repository'
import {
  SaveSurveyResult,
  SaveSurveyResultParams
} from '~/domain/usecases/save-survey-result'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly loadSurveyResultByAccountAndSurveyRepository: LoadSurveyResultByAccountAndSurveyRepository,
    private readonly addSurveyResultRepository: AddSurveyResultRepository,
    private readonly updateSurveyResultRepository: UpdateSurveyResultRepository
  ) {}

  async save (data: SaveSurveyResultParams): Promise<void> {
    const { accountId, surveyId } = data
    const surveyResult =
      await this.loadSurveyResultByAccountAndSurveyRepository.loadByAccountAndSurvey(
        accountId,
        surveyId
      )
    const alreadyAnswered = !!surveyResult

    alreadyAnswered &&
      (await this.updateSurveyResultRepository.update(
        surveyResult.id,
        data
      ))
    !alreadyAnswered && (await this.addSurveyResultRepository.add(data))
  }
}
