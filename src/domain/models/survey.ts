export interface SurveyModel {
  id: string
  question: string
  answers: SurveyAnswer[]
  date: Date
}

export interface SurveyAnswer {
  answer: string
  image?: string
}
