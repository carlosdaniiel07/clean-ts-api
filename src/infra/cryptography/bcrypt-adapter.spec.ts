import { BCryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

describe('BCrypt adapter', () => {
  test('should call bcrypt with correct value', async () => {
    const sut = new BCryptAdapter()
    const bcryptSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('any_value')

    expect(bcryptSpy).toHaveBeenCalledWith('any_value', 12)
  })
})
