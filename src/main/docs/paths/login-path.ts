export const loginPath = {
  post: {
    tags: ['Auth'],
    summary:
      'Endpoint para autenticação do usuário',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/loginParams'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Devolve um token de acesso JWT',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/login'
            }
          }
        }
      },
      400: {
        description: 'Bad Request'
      }
    }
  }
}
