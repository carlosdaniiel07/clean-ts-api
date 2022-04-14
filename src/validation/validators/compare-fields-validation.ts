import { InvalidParamError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols/validation'

export class CompareFieldsValidation implements Validation {
  constructor (private readonly fieldName: string, private readonly compareFieldName: string) {}

  validate (data: any): Error | null {
    const isEquals = data[this.fieldName] === data[this.compareFieldName]
    return isEquals ? null : new InvalidParamError(this.fieldName)
  }
}
