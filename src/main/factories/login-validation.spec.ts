import { EmailValidation } from '../../presentation/helpers/validators/email-validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { EmailValidator } from '../../presentation/protocols'
import { makeLoginValidation } from './login-validation'

jest.mock('../../presentation/helpers/validators/validation-composite')

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
