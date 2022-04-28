export interface AddSurveyModel {
  question: string
  answers: AddSurveyAnswerModel[]
  date: Date
}

export interface AddSurveyAnswerModel {
  answer: string
  image?: string
}

export interface AddSurvey {
  add: (data: AddSurveyModel) => Promise<void>
}
