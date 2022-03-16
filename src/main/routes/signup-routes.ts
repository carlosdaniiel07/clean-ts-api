import { Router } from 'express'

export default (router: Router): void => {
  router.post('/signup', (_, res) => {
    return res.status(200).send({ ok: true })
  })
}
