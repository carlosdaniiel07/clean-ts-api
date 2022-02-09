import { BCryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

describe('BCrypt adapter', () => {
  test('should call bcrypt with correct value', async () => {
    const salt = 12
    const sut = new BCryptAdapter(salt)
    const bcryptSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('any_value')

    expect(bcryptSpy).toHaveBeenCalledWith('any_value', salt)
  })
})
