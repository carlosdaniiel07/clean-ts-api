export type SurveyModel = {
  id: string
  question: string
  answers: SurveyAnswer[]
  date: Date
}

export type SurveyAnswer = {
  answer: string
  image?: string
}
