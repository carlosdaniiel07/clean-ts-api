import request from 'supertest'
import app from '~/main/config/app'

describe('Content Type middleware', () => {
  it('should return JSON as default content-type', async () => {
    app.get('/test-content-type', (req, res) => {
      return res.status(200).send()
    })

    await request(app)
      .get('/test-content-type')
      .expect('content-type', 'application/json')
  })

  it('should return XML as content-type when forced', async () => {
    app.get('/test-content-type-xml', (req, res) => {
      res.type('xml')
      return res.send()
    })

    await request(app)
      .get('/test-content-type-xml')
      .expect('content-type', 'application/xml')
  })
})
