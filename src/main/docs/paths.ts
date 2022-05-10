import {
  loginPath,
  signupPath,
  surveyResultPath,
  surveysPath
} from '~/main/docs/paths/index'

export default {
  '/login': loginPath,
  '/signup': signupPath,
  '/surveys': surveysPath,
  '/surveys/{surveyId}/results': surveyResultPath
}
