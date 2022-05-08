export interface CountSurveyResultByAccountAndSurveyRepository {
  countByAccountAndSurvey: (
    accountId: string,
    surveyId: string
  ) => Promise<number>
}
