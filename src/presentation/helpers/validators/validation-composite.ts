import { Validation } from '../../protocols/validation'

export class ValidationComposite implements Validation {
  constructor (private readonly validations: Validation[]) {}

  validate (data: any): Error | null {
    const results = this.validations.map((validation) => validation.validate(data))
    const error = results.find((result) => result)

    return error ?? null
  }
}
