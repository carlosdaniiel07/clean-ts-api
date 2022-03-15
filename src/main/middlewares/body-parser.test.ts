import request from 'supertest'
import app from '../config/app'

describe('Body Parser middleware', () => {
  test('should parse request body as JSON', async () => {
    app.post('/test-body-parser', (req, res) => {
      return res.status(200).send(req.body)
    })

    await request(app)
      .post('/test-body-parser')
      .send({ name: 'Test' })
      .expect({ name: 'Test' })
  })
})
