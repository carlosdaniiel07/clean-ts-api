import { EmailValidatorAdapter } from '~/infra/validators/email-validator-adapter'
import { Validation } from '~/presentation/protocols'
import { EmailValidator } from '~/validation/protocols/email-validator'
import { EmailValidation } from '~/validation/validators/email-validation'
import { RequiredFieldValidation } from '~/validation/validators/required-field-validation'
import { ValidationComposite } from '~/validation/validators/validation-composite'

export const makeLoginValidation = (): Validation => {
  const emailValidator: EmailValidator = new EmailValidatorAdapter()
  const requiredFields = ['email', 'password']

  return new ValidationComposite([
    ...requiredFields.map((field) => new RequiredFieldValidation(field)),
    new EmailValidation(emailValidator, 'email')
  ])
}
