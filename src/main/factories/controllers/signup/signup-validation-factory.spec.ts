import { CompareFieldsValidation } from '../../../../presentation/helpers/validators/compare-fields-validation'
import { EmailValidation } from '../../../../presentation/helpers/validators/email-validation'
import { RequiredFieldValidation } from '../../../../presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '../../../../presentation/helpers/validators/validation-composite'
import { EmailValidator } from '../../../../presentation/protocols'
import { makeSignUpValidation } from './signup-validation-factory'

jest.mock('../../../../presentation/helpers/validators/validation-composite')

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

describe('SignUpValidation factory', () => {
  test('should call ValidationComposite with all validations', () => {
    const { emailValidator } = makeSut()
    const requiredFields = [
      'name',
      'email',
      'password',
      'passwordConfirmation'
    ]

    makeSignUpValidation()

    expect(ValidationComposite).toHaveBeenCalledWith([
      ...requiredFields.map(
        (fieldName) => new RequiredFieldValidation(fieldName)
      ),
      new CompareFieldsValidation('passwordConfirmation', 'password'),
      new EmailValidation(emailValidator, 'email')
    ])
  })
})
