import { Validation } from '~/presentation/protocols'
import { MinimumArraySizeValidation } from '~/validation/validators/minimum-array-size-validation'
import { RequiredFieldValidation } from '~/validation/validators/required-field-validation'
import { ValidationComposite } from '~/validation/validators/validation-composite'

export const makeAddSurveyValidation = (): Validation => {
  const requiredFields = ['question', 'answers']
  return new ValidationComposite([
    ...requiredFields.map(
      (fieldName) => new RequiredFieldValidation(fieldName)
    ),
    new MinimumArraySizeValidation('answers', 1)
  ])
}
