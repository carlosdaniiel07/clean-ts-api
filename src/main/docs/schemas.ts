import {
  loginSchema,
  loginParamsSchema,
  errorSchema,
  signupSchema,
  signupParamsSchema,
  surveySchema,
  surveysSchema,
  surveyAnswerSchema,
  surveyParamsSchema,
  surveyAnswerParamsSchema,
  surveyResultParamsSchema,
  surveyResultSchema,
  surveyResultAnswerSchema
} from '~/main/docs/schemas/index'

export default {
  login: loginSchema,
  loginParams: loginParamsSchema,
  signup: signupSchema,
  signupParams: signupParamsSchema,
  error: errorSchema,
  surveys: surveysSchema,
  survey: surveySchema,
  surveyAnswer: surveyAnswerSchema,
  surveyParams: surveyParamsSchema,
  surveyAnswerParams: surveyAnswerParamsSchema,
  surveyResultParams: surveyResultParamsSchema,
  surveyResult: surveyResultSchema,
  surveyResultAnswer: surveyResultAnswerSchema
}
