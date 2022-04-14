import { MissingParamError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols/validation'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {}

  validate (data: any): Error | null {
    const value = data[this.fieldName]

    if (!value) {
      return new MissingParamError(this.fieldName)
    }

    return null
  }
}
