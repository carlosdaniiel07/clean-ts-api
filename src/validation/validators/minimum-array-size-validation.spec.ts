import { InvalidParamError } from '~/presentation/errors'
import { MinimumArraySizeValidation } from './minimum-array-size-validation'

const makeSut = (): MinimumArraySizeValidation => {
  return new MinimumArraySizeValidation('fields', 2)
}

describe('MinimumArraySize validation', () => {
  test('should return InvalidParamError if the field is not set', () => {
    const sut = makeSut()
    const response = sut.validate({
      otherFields: []
    })

    expect(response).toEqual(new InvalidParamError('fields'))
  })

  test('should return InvalidParamError if the field is not an array', () => {
    const sut = makeSut()
    const response = sut.validate({
      fields: 'fields'
    })

    expect(response).toEqual(new InvalidParamError('fields'))
  })

  test('should return InvalidParamError if the field has no required minimum length', () => {
    const sut = makeSut()
    const response = sut.validate({
      fields: ['first_field']
    })

    expect(response).toEqual(new InvalidParamError('fields'))
  })

  test('should return null if the field has required minimum length', () => {
    const sut = makeSut()
    const response = sut.validate({
      fields: ['first_field', 'second_field']
    })

    expect(response).toBeNull()
  })
})
