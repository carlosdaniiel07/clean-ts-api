import { adaptResolver } from '~/main/adapters/apollo/apollo-server-resolver-adapter'
import { makeAddSurveyController } from '~/main/factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeLoadSurveyResultController } from '~/main/factories/controllers/survey/load-survey-result/load-survey-result-controller-factory'
import { makeLoadSurveysController } from '~/main/factories/controllers/survey/load-surveys/load-surveys-controller-factory'
import { AddSurveyController } from '~/presentation/controllers/survey/add-survey/add-survey-controller'
import { LoadSurveyResultController } from '~/presentation/controllers/survey/load-survey-result/load-survey-result-controller'
import { LoadSurveysController } from '~/presentation/controllers/survey/load-surveys/load-surveys-controller'

export default {
  Query: {
    loadSurveys: async (
      _: any,
      args: LoadSurveysController.Request,
      context: any
    ) =>
      await adaptResolver(makeLoadSurveysController(), args, {
        context,
        requireAuth: true
      }),
    loadSurveyResults: async (
      _: any,
      args: LoadSurveyResultController.Request,
      context: any
    ) =>
      await adaptResolver(makeLoadSurveyResultController(), args, {
        context,
        requireAuth: true
      })
  },
  Mutation: {
    addSurvey: async (
      _: any,
      args: { request: AddSurveyController.Request },
      context: any
    ) =>
      await adaptResolver(makeAddSurveyController(), args.request, {
        context,
        requireAuth: true
      })
  }
}
