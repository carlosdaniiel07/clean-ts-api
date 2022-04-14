import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeAccountsController } from '../factories/controllers/accounts/accounts-controller-factory'

export default (router: Router): void => {
  router.get('/accounts', adaptRoute(makeAccountsController()))
}
