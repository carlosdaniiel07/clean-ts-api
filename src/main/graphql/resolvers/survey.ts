import { adaptResolver } from '~/main/adapters/apollo/apollo-server-resolver-adapter'
import { makeLoadSurveyResultController } from '~/main/factories/controllers/survey/load-survey-result/load-survey-result-controller-factory'
import { makeLoadSurveysController } from '~/main/factories/controllers/survey/load-surveys/load-surveys-controller-factory'
import { LoadSurveyResultController } from '~/presentation/controllers/survey/load-survey-result/load-survey-result-controller'
import { LoadSurveysController } from '~/presentation/controllers/survey/load-surveys/load-surveys-controller'

export default {
  Query: {
    loadSurveys: async (
      _: any,
      args: LoadSurveysController.Request,
      context: any
    ) => await adaptResolver(makeLoadSurveysController(), args, context, true),
    loadSurveyResults: async (
      _: any,
      args: LoadSurveyResultController.Request,
      context: any
    ) =>
      await adaptResolver(
        makeLoadSurveyResultController(),
        args,
        context,
        true
      )
  }
}
