import { InvalidParamError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols'

export class MinimumArraySizeValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly minSize: number
  ) {}

  validate (data: any): Error | null {
    const value = data[this.fieldName]
    const isArray = Array.isArray(value)

    if (!value || !isArray) {
      return new InvalidParamError(this.fieldName)
    }

    const hasMinSize = value.length >= this.minSize

    return hasMinSize ? null : new InvalidParamError(this.fieldName)
  }
}
