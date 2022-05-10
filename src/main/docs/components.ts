import {
  badRequestComponent,
  notFoundComponent,
  serverErrorComponent,
  unauthorizedComponent
} from '~/main/docs/components/index'

export default {
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    }
  },
  badRequest: badRequestComponent,
  unauthorized: unauthorizedComponent,
  notFound: notFoundComponent,
  serverError: serverErrorComponent
}
