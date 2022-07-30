import { adaptResolver } from '~/main/adapters/apollo/apollo-server-resolver-adapter'
import { makeLoadSurveyResultController } from '~/main/factories/controllers/survey/load-survey-result/load-survey-result-controller-factory'
import { makeLoadSurveysController } from '~/main/factories/controllers/survey/load-surveys/load-surveys-controller-factory'
import { LoadSurveyResultController } from '~/presentation/controllers/survey/load-survey-result/load-survey-result-controller'
import { LoadSurveysController } from '~/presentation/controllers/survey/load-surveys/load-surveys-controller'

export default {
  Query: {
    loadSurveys: async (_: any, args: LoadSurveysController.Request) =>
      await adaptResolver(makeLoadSurveysController(), args),
    loadSurveyResults: async (
      _: any,
      args: LoadSurveyResultController.Request
    ) => await adaptResolver(makeLoadSurveyResultController(), args)
  }
}
