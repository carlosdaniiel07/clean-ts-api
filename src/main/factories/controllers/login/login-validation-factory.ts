import { EmailValidation } from '../../../../validation/validators/email-validation'
import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation'
import { Validation } from '../../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../../validation/validators/validation-composite'
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter'
import { EmailValidator } from '../../../../validation/protocols/email-validator'

export const makeLoginValidation = (): Validation => {
  const emailValidator: EmailValidator = new EmailValidatorAdapter()
  const requiredFields = ['email', 'password']

  return new ValidationComposite([
    ...requiredFields.map((field) => new RequiredFieldValidation(field)),
    new EmailValidation(emailValidator, 'email')
  ])
}
