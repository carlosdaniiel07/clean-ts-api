import { AddSurveyResultRepository } from '~/data/protocols/db/survey-result/add-survey-result-repository'
import { LoadSurveyResultByAccountAndSurveyRepository } from '~/data/protocols/db/survey-result/load-survey-result-by-account-and-survey'
import { UpdateSurveyResultRepository } from '~/data/protocols/db/survey-result/update-survey-result-repository'
import {
  SaveSurveyResult,
  SaveSurveyResultModel
} from '~/domain/usecases/save-survey-result'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly loadSurveyResultByAccountAndSurveyRepository: LoadSurveyResultByAccountAndSurveyRepository,
    private readonly addSurveyResultRepository: AddSurveyResultRepository,
    private readonly updateSurveyResultRepository: UpdateSurveyResultRepository
  ) {}

  async save (data: SaveSurveyResultModel): Promise<void> {
    const { accountId, surveyId } = data
    const surveyResult =
      await this.loadSurveyResultByAccountAndSurveyRepository.loadResultByAccountAndSurvey(
        accountId,
        surveyId
      )
    const alreadyAnswered = !!surveyResult

    alreadyAnswered &&
      (await this.updateSurveyResultRepository.updateResult(
        surveyResult.id,
        data
      ))
    !alreadyAnswered && (await this.addSurveyResultRepository.addResult(data))
  }
}
