import { Router } from 'express'
import { adaptMiddleware } from '~/main/adapters/express/express-middleware-adapter'
import { adaptRoute } from '~/main/adapters/express/express-route-adapter'
import { makeAddSurveyController } from '~/main/factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeLoadSurveysController } from '~/main/factories/controllers/survey/load-surveys/load-surveys-controller-factory'
import { makeAuthMiddleware } from '~/main/factories/middlewares/auth-middleware-factory'
import { makeSaveSurveyResultController } from '~/main/factories/controllers/survey/save-survey-result/save-survey-result-controller-factory'
import { makeLoadSurveyResultController } from '~/main/factories/controllers/survey/load-survey-result/load-survey-result-controller-factory'

export default (router: Router): void => {
  const userAuth = adaptMiddleware(makeAuthMiddleware())
  const adminAuth = adaptMiddleware(makeAuthMiddleware('ADMIN'))

  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', userAuth, adaptRoute(makeLoadSurveysController()))
  router.get(
    '/surveys/:surveyId/results',
    userAuth,
    adaptRoute(makeLoadSurveyResultController())
  )
  router.post(
    '/surveys/:surveyId/results',
    userAuth,
    adaptRoute(makeSaveSurveyResultController())
  )
}
