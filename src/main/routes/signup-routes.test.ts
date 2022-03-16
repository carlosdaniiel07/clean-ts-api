import request from 'supertest'
import app from '../config/app'

describe('Signup routes', () => {
  test('should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Carlos',
        email: 'carlos@email.com',
        password: 'password'
      })
      .expect(200, { ok: true })
  })
})
