import { RequiredFieldValidation } from '~/validation/validators/required-field-validation'
import { ValidationComposite } from '~/validation/validators/validation-composite'
import { makeSaveSurveyResultValidation } from './save-survey-result-controller-validation-factory'

jest.mock('~/validation/validators/validation-composite')

describe('SaveSurveyResultValidation factory', () => {
  test('should call ValidationComposite with all validations', () => {
    const requiredFields = ['answer']

    makeSaveSurveyResultValidation()

    expect(ValidationComposite).toHaveBeenCalledWith(
      requiredFields.map((fieldName) => new RequiredFieldValidation(fieldName))
    )
  })
})
