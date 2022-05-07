import request from 'supertest'
import app from '~/main/config/app'
import { noCache } from './no-cache'

describe('NoCache middleware', () => {
  test('should disable cache', async () => {
    app.get('/test-no-cache', noCache, (req, res) => {
      return res.status(200).send()
    })

    await request(app)
      .get('/test-no-cache')
      .expect('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      .expect('Pragma', 'no-cache')
      .expect('Expires', '0')
      .expect('Surrogate-Control', 'no-store')
  })
})
