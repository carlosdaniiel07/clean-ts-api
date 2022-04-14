import { InvalidParamError } from '../../presentation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}

describe('CompareFields validation', () => {
  test('should return InvalidParamError if fields value not matches', () => {
    const sut = makeSut()
    const response = sut.validate({
      field: 'any_value',
      fieldToCompare: 'any_value_to_compare'
    })

    expect(response).toEqual(new InvalidParamError('field'))
  })

  test('should return null if fields value matches', () => {
    const sut = makeSut()
    const response = sut.validate({
      field: 'any_value',
      fieldToCompare: 'any_value'
    })

    expect(response).toBeNull()
  })
})
