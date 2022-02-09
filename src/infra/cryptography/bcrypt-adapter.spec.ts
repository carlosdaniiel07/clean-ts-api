import { BCryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

const BCRYPT_SALT = 12

jest.mock('bcrypt', () => ({
  async hash (value: string, salt: number): Promise<string> {
    return await Promise.resolve(`${value}_hash`)
  }
}))

const makeSut = (): BCryptAdapter => {
  return new BCryptAdapter(BCRYPT_SALT)
}

describe('BCrypt adapter', () => {
  test('should call bcrypt with correct value', async () => {
    const sut = makeSut()
    const bcryptSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('any_value')

    expect(bcryptSpy).toHaveBeenCalledWith('any_value', BCRYPT_SALT)
  })

  test('should return a hash on success', async () => {
    const sut = makeSut()
    const hash = await sut.encrypt('any_value')

    expect(hash).toBe('any_value_hash')
  })

  test('should throw if bcrypt throws', async () => {
    const sut = makeSut()

    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.encrypt('any_value')

    await expect(promise).rejects.toThrow()
  })
})
