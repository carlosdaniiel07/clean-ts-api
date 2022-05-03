import { Validation } from '~/presentation/protocols'
import { RequiredFieldValidation } from '~/validation/validators/required-field-validation'
import { ValidationComposite } from '~/validation/validators/validation-composite'

export const makeSaveSurveyResultValidation = (): Validation => {
  const requiredFields = ['answer']
  return new ValidationComposite(
    requiredFields.map((fieldName) => new RequiredFieldValidation(fieldName))
  )
}
