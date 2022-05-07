import { loginPath } from '~/main/docs/paths'
import {
  loginSchema,
  loginParamsSchema,
  errorSchema
} from '~/main/docs/schemas'
import {
  badRequestComponent,
  notFoundComponent,
  serverErrorComponent,
  unauthorizedComponent
} from '~/main/docs/components'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description:
      'Essa API faz parte do treinamento do professor Rodrigo Manguinho (Mango) na Udemy (https://www.udemy.com/course/tdd-com-mango).',
    contact: {
      name: 'Carlos Almeida',
      url: 'https://github.com/carlosdaniiel07/clean-ts-api',
      email: 'carlosd.almeida@outlook.com'
    },
    license: {
      name: 'Apache 2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
    },
    version: '1.0.0'
  },
  servers: [
    {
      url: '/api'
    }
  ],
  tags: [
    {
      name: 'Auth'
    }
  ],
  paths: {
    '/login': loginPath
  },
  schemas: {
    login: loginSchema,
    loginParams: loginParamsSchema,
    error: errorSchema
  },
  components: {
    badRequest: badRequestComponent,
    unauthorized: unauthorizedComponent,
    notFound: notFoundComponent,
    serverError: serverErrorComponent
  }
}
