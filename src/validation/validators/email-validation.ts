import { InvalidParamError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols/validation'
import { EmailValidator } from '../protocols/email-validator'

export class EmailValidation implements Validation {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly fieldName: string
  ) {}

  validate (data: any): Error | null {
    const isValid = this.emailValidator.isValid(data[this.fieldName])
    return isValid ? null : new InvalidParamError(this.fieldName)
  }
}
