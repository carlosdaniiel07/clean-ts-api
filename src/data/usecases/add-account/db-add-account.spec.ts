import { Encrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

describe('DbAddAccount usecase', () => {
  test('should call Encrypter with correct password', async () => {
    class EncrypterStub implements Encrypter {
      async encrypt (value: string): Promise<string> {
        return await Promise.resolve(`${value}_hashed`)
      }
    }

    const encrypterStub = new EncrypterStub()
    const sut = new DbAddAccount(encrypterStub)
    const data = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.add(data)

    expect(encrypterSpy).toHaveBeenCalledWith('valid_password')
  })
})
