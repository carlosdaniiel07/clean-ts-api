import { CompareFieldsValidation } from '../../../../validation/validators/compare-fields-validation'
import { EmailValidation } from '../../../../validation/validators/email-validation'
import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation'
import { Validation } from '../../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../../validation/validators/validation-composite'
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter'
import { EmailValidator } from '../../../../validation/protocols/email-validator'

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
