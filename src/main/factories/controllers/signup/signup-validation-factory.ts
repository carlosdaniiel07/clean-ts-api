import { CompareFieldsValidation } from '../../../../presentation/helpers/validators/compare-fields-validation'
import { EmailValidation } from '../../../../presentation/helpers/validators/email-validation'
import { RequiredFieldValidation } from '../../../../presentation/helpers/validators/required-field-validation'
import { Validation } from '../../../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../../../presentation/helpers/validators/validation-composite'
import { EmailValidator } from '../../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../../adapters/validators/email-validator-adapter'

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
