import { BCryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

const BCRYPT_SALT = 12

jest.mock('bcrypt', () => ({
  async hash (value: string, salt: number): Promise<string> {
    return await Promise.resolve(`${value}_hash`)
  },
  async compare (plainText: string, hash: string): Promise<boolean> {
    return true
  }
}))

const makeSut = (): BCryptAdapter => {
  return new BCryptAdapter(BCRYPT_SALT)
}

describe('BCrypt adapter', () => {
  describe('hash()', () => {
    test('should call bcrypt hash with correct value', async () => {
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

    test('should throw if bcrypt hash throws', async () => {
      const sut = makeSut()

      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
        throw new Error()
      })

      const promise = sut.encrypt('any_value')

      await expect(promise).rejects.toThrow()
    })
  })

  describe('compare()', () => {
    test('should call bcrypt compare with correct values', async () => {
      const sut = makeSut()
      const spy = jest.spyOn(bcrypt, 'compare')

      await sut.compare('any_password', 'any_password_hash')

      expect(spy).toHaveBeenCalledWith('any_password', 'any_password_hash')
    })

    test('should return true on compare if passwords matches', async () => {
      const sut = makeSut()
      const response = sut.compare('any_password', 'any_password_hash')

      expect(response).toBeTruthy()
    })

    test('should return false on compare if passwords is different', async () => {
      const sut = makeSut()

      jest
        .spyOn(bcrypt, 'compare')
        .mockReturnValue(Promise.resolve(false) as any)

      const response = await sut.compare('any_password', 'any_password_hash')

      expect(response).toBeFalsy()
    })

    test('should throw if bcrypt compare throws', async () => {
      const sut = makeSut()

      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
        throw new Error()
      })

      const promise = sut.compare('any_password', 'any_password_hash')

      await expect(promise).rejects.toThrow()
    })
  })
})
