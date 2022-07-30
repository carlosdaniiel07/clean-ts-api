import { adaptResolver } from '~/main/adapters/apollo/apollo-server-resolver-adapter'
import { makeLoginController } from '~/main/factories/controllers/login/login-controller-factory'
import { makeSignupController } from '~/main/factories/controllers/signup/signup-controller-factory'
import { LoginController } from '~/presentation/controllers/login/login/login-controller'
import { SignUpController } from '~/presentation/controllers/login/signup/signup-controller'

export default {
  Query: {
    login: async (_: any, args: LoginController.Request) =>
      await adaptResolver(makeLoginController(), args)
  },
  Mutation: {
    signUp: async (_: any, args: SignUpController.Request) =>
      await adaptResolver(makeSignupController(), args)
  }
}
