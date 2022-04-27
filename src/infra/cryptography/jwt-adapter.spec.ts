import { AccountModel } from '../../domain/models/account'
import { JwtAdapter } from './jwt-adapter'
import jsonwebtoken, {
  Jwt,
  JwtPayload,
  Secret,
  SignOptions,
  VerifyOptions
} from 'jsonwebtoken'
import config from '../../main/config/env'

jest.mock('jsonwebtoken', () => ({
  sign (
    payload: string | Buffer | object,
    secretOrPrivateKey: Secret,
    options?: SignOptions
  ): string {
    return 'jwt_token'
  },
  verify (
    token: string,
    secretOrPublicKey: Secret,
    options?: VerifyOptions
  ): Jwt | JwtPayload | string {
    return 'jwt_token'
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter()
}

const makeAccountModel = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  password: 'any_password'
})

describe('Jwt Adapter', () => {
  describe('sign()', () => {
    test('should generate an JWT access token by account', () => {
      const sut = makeSut()
      const token = sut.generate(makeAccountModel())

      expect(token).toBe('jwt_token')
    })

    test('should call jsonwebtoken with correct values', () => {
      const sut = makeSut()
      const { name, email } = makeAccountModel()
      const spy = jest.spyOn(jsonwebtoken, 'sign')

      sut.generate(makeAccountModel())

      expect(spy).toHaveBeenCalledWith({ name, email }, config.JWT_SECRET_KEY, {
        issuer: 'clean-ts-api',
        audience: 'clean-ts-app',
        expiresIn: '6h',
        subject: email
      })
    })

    test('should throw if jsonwebtoken trows', () => {
      const sut = makeSut()

      jest.spyOn(jsonwebtoken, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })

      const action = (): string => sut.generate(makeAccountModel())

      expect(action).toThrow()
    })
  })

  describe('verify()', () => {
    test('should call verify with correct value', async () => {
      const sut = makeSut()
      const spy = jest.spyOn(jsonwebtoken, 'verify')

      await sut.decrypt('any_token')

      expect(spy).toHaveBeenCalledWith('any_token', config.JWT_SECRET_KEY)
    })

    test('should return a value on verify success', async () => {
      const sut = makeSut()
      const value = await sut.decrypt('any_token')

      expect(value).toBe('jwt_token')
    })

    test('should throw if jsonwebtoken trows', async () => {
      const sut = makeSut()

      jest.spyOn(jsonwebtoken, 'verify').mockImplementationOnce(() => {
        throw new Error()
      })

      const promise = sut.decrypt('any_token')

      await expect(promise).rejects.toThrow()
    })
  })
})
