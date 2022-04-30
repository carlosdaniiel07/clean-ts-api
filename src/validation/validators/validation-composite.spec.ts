import { Validation } from '~/presentation/protocols'
import { ValidationComposite } from './validation-composite'

type SutTypes = {
  validations: Validation[]
  sut: ValidationComposite
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (data: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const validations = [makeValidation(), makeValidation()]
  const sut = new ValidationComposite(validations)

  return {
    validations,
    sut
  }
}

describe('Validation composite', () => {
  test('should call all validations with correct value', () => {
    const payload = {
      field: 'any_value'
    }
    const { sut, validations } = makeSut()
    const spies = validations.map((validation) =>
      jest.spyOn(validation, 'validate')
    )

    sut.validate(payload)

    spies.forEach((spy) => {
      expect(spy).toHaveBeenCalledWith(payload)
    })
  })

  test('should return the first error if any validation fails', () => {
    const { sut, validations } = makeSut()

    jest
      .spyOn(validations[1], 'validate')
      .mockReturnValue(new Error('an error'))

    const response = sut.validate({
      field: 'any_value'
    })

    expect(response).toEqual(new Error('an error'))
  })

  test('should return null if no validations fails', () => {
    const { sut } = makeSut()
    const response = sut.validate({
      field: 'any_value'
    })

    expect(response).toBeNull()
  })
})
