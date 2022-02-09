import { BCryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  async hash (value: string, salt: number): Promise<string> {
    return await Promise.resolve(`${value}_hash`)
  }
}))

interface SutTypes {
  bcryptSalt: number
  sut: BCryptAdapter
}

const makeSut = (): SutTypes => {
  const salt = 12

  return {
    bcryptSalt: salt,
    sut: new BCryptAdapter(salt)
  }
}

describe('BCrypt adapter', () => {
  test('should call bcrypt with correct value', async () => {
    const { sut, bcryptSalt } = makeSut()
    const bcryptSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('any_value')

    expect(bcryptSpy).toHaveBeenCalledWith('any_value', bcryptSalt)
  })

  test('should return a hash on success', async () => {
    const { sut } = makeSut()
    const hash = await sut.encrypt('any_value')

    expect(hash).toBe('any_value_hash')
  })
})
