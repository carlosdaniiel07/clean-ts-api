import { EmailValidation } from '../../presentation/helpers/validators/email-validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { Validation } from '../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { EmailValidator } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'

export const makeLoginValidation = (): Validation => {
  const emailValidator: EmailValidator = new EmailValidatorAdapter()
  const requiredFields = ['email', 'password']

  return new ValidationComposite([
    ...requiredFields.map((field) => new RequiredFieldValidation(field)),
    new EmailValidation(emailValidator, 'email')
  ])
}
