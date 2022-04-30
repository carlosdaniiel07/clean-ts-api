import { Router } from 'express'
import { adaptMiddleware } from '~/main/adapters/express/express-middleware-adapter'
import { adaptRoute } from '~/main/adapters/express/express-route-adapter'
import { makeAddSurveyController } from '~/main/factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeLoadSurveysController } from '~/main/factories/controllers/survey/load-surveys/load-surveys-controller-factory'
import { makeAuthMiddleware } from '~/main/factories/middlewares/auth-middleware-factory'

export default (router: Router): void => {
  const userAuth = adaptMiddleware(makeAuthMiddleware())
  const adminAuth = adaptMiddleware(makeAuthMiddleware('ADMIN'))

  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', userAuth, adaptRoute(makeLoadSurveysController()))
}
