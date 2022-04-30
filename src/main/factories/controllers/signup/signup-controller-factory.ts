import { SignUpController } from '~/presentation/controllers/login/signup/signup-controller'
import { Controller } from '~/presentation/protocols'
import { makeLogControllerDecorator } from '~/main/factories/decorators/log-controller-decorator-factory'
import { makeDbAddAccount } from '~/main/factories/usecases/db-add-account-factory'
import { makeDbAuthentication } from '~/main/factories/usecases/db-authentication-factory'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignupController = (): Controller => {
  const signUpController = new SignUpController(
    makeDbAddAccount(),
    makeDbAuthentication(),
    makeSignUpValidation()
  )
  return makeLogControllerDecorator(signUpController)
}
