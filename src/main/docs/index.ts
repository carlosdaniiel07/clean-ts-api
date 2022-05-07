import { loginPath } from '~/main/docs/paths'
import { loginSchema, loginParamsSchema } from '~/main/docs/schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description:
      'Essa API faz parte do treinamento do professor Rodrigo Manguinho (Mango) na Udemy.',
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
    loginParams: loginParamsSchema
  }
}
