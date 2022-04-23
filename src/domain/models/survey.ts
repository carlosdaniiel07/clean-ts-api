export interface SurveyModel {
  id: string
  question: string
  answers: Array<{ answer: string, image: string }>
}
