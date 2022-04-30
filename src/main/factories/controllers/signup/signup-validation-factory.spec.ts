import { EmailValidator } from '~/validation/protocols/email-validator'
import { CompareFieldsValidation } from '~/validation/validators/compare-fields-validation'
import { EmailValidation } from '~/validation/validators/email-validation'
import { RequiredFieldValidation } from '~/validation/validators/required-field-validation'
import { ValidationComposite } from '~/validation/validators/validation-composite'
import { makeSignUpValidation } from './signup-validation-factory'

jest.mock('../../../../validation/validators/validation-composite')

type SutTypes = {
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
