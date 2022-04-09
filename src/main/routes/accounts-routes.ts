import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeAccountsController } from '../factories/accounts/accounts'

export default (router: Router): void => {
  router.get('/accounts', adaptRoute(makeAccountsController()))
}
