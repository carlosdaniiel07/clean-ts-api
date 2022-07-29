import { adaptResolver } from '~/main/adapters/apollo/apollo-server-resolver-adapter'
import { makeLoginController } from '~/main/factories/controllers/login/login-controller-factory'
import { LoginController } from '~/presentation/controllers/login/login/login-controller'

export default {
  Query: {
    login: async (_: any, args: LoginController.Request) =>
      await adaptResolver(makeLoginController(), args)
  }
}
