import { EmailValidator } from '~/validation/protocols/email-validator'
import { EmailValidation } from '~/validation/validators/email-validation'
import { RequiredFieldValidation } from '~/validation/validators/required-field-validation'
import { ValidationComposite } from '~/validation/validators/validation-composite'
import { makeLoginValidation } from './login-validation-factory'

jest.mock('../../../../validation/validators/validation-composite')

interface SutTypes {
  emailValidator: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => ({
  emailValidator: makeEmailValidator()
})

describe('LoginValidation factory', () => {
  test('should call ValidationComposite with all validations', () => {
    const { emailValidator } = makeSut()
    const requiredFields = ['email', 'password']

    makeLoginValidation()

    expect(ValidationComposite).toHaveBeenCalledWith([
      ...requiredFields.map((field) => new RequiredFieldValidation(field)),
      new EmailValidation(emailValidator, 'email')
    ])
  })
})
