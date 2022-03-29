import { InvalidParamError } from '../../errors'
import { EmailValidator } from '../../protocols'
import { Validation } from './validation'

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
