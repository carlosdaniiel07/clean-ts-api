import { LogErrorRepository } from '~/data/protocols/db/log/log-error-repository'
import { LogMongoRepository } from '~/infra/db/mongodb/log/log-mongo-repository'
import { LogControllerDecorator } from '~/main/decorators/log-controller-decorator'
import { Controller } from '~/presentation/protocols'

export const makeLogControllerDecorator = (
  controller: Controller
): Controller => {
  const logErrorRepository: LogErrorRepository = new LogMongoRepository()
  return new LogControllerDecorator(controller, logErrorRepository)
}
