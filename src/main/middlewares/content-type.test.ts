import request from 'supertest'
import app from '../config/app'

describe('Content Type middleware', () => {
  it('should return JSON as default content-type', async () => {
    app.get('/test-content-type', (req, res) => {
      return res.status(200).send()
    })

    await request(app)
      .get('/test-content-type')
      .expect('content-type', 'application/json')
  })
})
