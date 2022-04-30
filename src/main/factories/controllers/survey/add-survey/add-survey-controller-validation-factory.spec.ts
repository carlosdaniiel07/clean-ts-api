import { MinimumArraySizeValidation } from '../../../../../validation/validators/minimum-array-size-validation'
import { RequiredFieldValidation } from '../../../../../validation/validators/required-field-validation'
import { ValidationComposite } from '../../../../../validation/validators/validation-composite'
import { makeAddSurveyValidation } from './add-survey-controller-validation-factory'

jest.mock('../../../../../validation/validators/validation-composite')

describe('AddSurveyValidation factory', () => {
  test('should call ValidationComposite with all validations', () => {
    const requiredFields = ['question', 'answers']

    makeAddSurveyValidation()

    expect(ValidationComposite).toHaveBeenCalledWith([
      ...requiredFields.map(
        (fieldName) => new RequiredFieldValidation(fieldName)
      ),
      new MinimumArraySizeValidation('answers', 1)
    ])
  })
})
