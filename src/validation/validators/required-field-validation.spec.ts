import { MissingParamError } from '~/presentation/errors'
import { RequiredFieldValidation } from './required-field-validation'

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field')
}

describe('RequiredField validation', () => {
  test('should return MissingParamError if a required field is not set', () => {
    const sut = makeSut()
    const response = sut.validate({
      otherField: 'any_value'
    })

    expect(response).toEqual(new MissingParamError('field'))
  })

  test('should return null if a required field is set', () => {
    const sut = makeSut()
    const response = sut.validate({
      field: 'any_value'
    })

    expect(response).toBeNull()
  })
})
