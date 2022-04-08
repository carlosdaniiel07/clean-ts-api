import { AccountModel } from '../../domain/models/account'
import { JwtAdapter } from './jwt-adapter'
import jsonwebtoken, { Secret, SignOptions } from 'jsonwebtoken'
import config from '../../main/config/env'

jest.mock('jsonwebtoken', () => ({
  sign (
    payload: string | Buffer | object,
    secretOrPrivateKey: Secret,
    options?: SignOptions
  ): string {
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

    expect(spy).toHaveBeenCalledWith(
      { name, email },
      config.JWT_SECRET_KEY,
      {
        issuer: 'clean-ts-api',
        audience: 'clean-ts-app',
        expiresIn: '6h',
        subject: email
      }
    )
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
