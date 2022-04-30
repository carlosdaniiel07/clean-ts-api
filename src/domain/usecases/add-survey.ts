export type AddSurveyModel = {
  question: string
  answers: AddSurveyAnswerModel[]
  date: Date
}

export type AddSurveyAnswerModel = {
  answer: string
  image?: string
}

export interface AddSurvey {
  add: (data: AddSurveyModel) => Promise<void>
}
