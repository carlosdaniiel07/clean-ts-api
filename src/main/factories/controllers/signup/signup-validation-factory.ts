import { EmailValidatorAdapter } from '~/infra/validators/email-validator-adapter'
import { Validation } from '~/presentation/protocols'
import { EmailValidator } from '~/validation/protocols/email-validator'
import { CompareFieldsValidation } from '~/validation/validators/compare-fields-validation'
import { EmailValidation } from '~/validation/validators/email-validation'
import { RequiredFieldValidation } from '~/validation/validators/required-field-validation'
import { ValidationComposite } from '~/validation/validators/validation-composite'

export const makeSignUpValidation = (): Validation => {
  const emailValidator: EmailValidator = new EmailValidatorAdapter()
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  return new ValidationComposite([
    ...requiredFields.map(
      (fieldName) => new RequiredFieldValidation(fieldName)
    ),
    new CompareFieldsValidation('passwordConfirmation', 'password'),
    new EmailValidation(emailValidator, 'email')
  ])
}
