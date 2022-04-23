export interface AddSurveyModel {
  question: string
  answers: AddSurveyAnswerModel[]
}

export interface AddSurveyAnswerModel {
  answer: string
  image: string
}

export interface AddSurvey {
  add: (data: AddSurveyModel) => Promise<void>
}
