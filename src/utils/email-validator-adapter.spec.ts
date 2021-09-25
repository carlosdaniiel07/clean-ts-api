import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (email: string): boolean {
    return true
  }
}))

describe('EmailValidator Adapter', () => {
  test('should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const isValid = sut.isValid('invalid_email@email.com')

    expect(isValid).toBeFalsy()
  })

  test('should return true if validator returns true', () => {
    const sut = new EmailValidatorAdapter()

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(true)

    const isValid = sut.isValid('valid_email@email.com')

    expect(isValid).toBeTruthy()
  })
})
