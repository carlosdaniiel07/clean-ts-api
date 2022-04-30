import { EmailValidation } from './email-validation'
import { InvalidParamError } from '~/presentation/errors'
import { EmailValidator } from '~/validation/protocols/email-validator'

type SutTypes = {
  emailValidator: EmailValidator
  sut: EmailValidation
}

const makeFakeData = (): { email: string } => ({
  email: 'any_email@email.com'
})

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidator = makeEmailValidator()
  const sut = new EmailValidation(emailValidator, 'email')

  return {
    emailValidator,
    sut
  }
}

describe('Email validation', () => {
  test('should call EmailValidator with correct value', () => {
    const { sut, emailValidator } = makeSut()
    const fakeData = makeFakeData()
    const spy = jest.spyOn(emailValidator, 'isValid')

    sut.validate(fakeData)

    expect(spy).toHaveBeenCalledWith(fakeData.email)
  })

  test('should throw if EmailValidator throws', () => {
    const { sut, emailValidator } = makeSut()

    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    expect(sut.validate).toThrow()
  })

  test('should return null if EmailValidator returns true', () => {
    const { sut } = makeSut()
    const response = sut.validate(makeFakeData())

    expect(response).toBeNull()
  })

  test('should return InvalidParamError if EmailValidator returns false', () => {
    const { sut, emailValidator } = makeSut()

    jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)

    const response = sut.validate(makeFakeData())

    expect(response).toEqual(new InvalidParamError('email'))
  })
})
