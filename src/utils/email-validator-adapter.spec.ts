import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (email: string): boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter', () => {
  test('should return false if validator returns false', () => {
    const sut = makeSut()

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const isValid = sut.isValid('invalid_email@email.com')

    expect(isValid).toBeFalsy()
  })

  test('should return true if validator returns true', () => {
    const sut = makeSut()

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(true)

    const isValid = sut.isValid('valid_email@email.com')

    expect(isValid).toBeTruthy()
  })

  test('should call validator with correct email', () => {
    const sut = makeSut()
    const spy = jest.spyOn(validator, 'isEmail')

    sut.isValid('any_email@email.com')

    expect(spy).toHaveBeenCalledWith('any_email@email.com')
  })
})
