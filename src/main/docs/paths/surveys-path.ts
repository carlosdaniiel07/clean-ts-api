export const surveysPath = {
  get: {
    tags: ['Enquete'],
    summary: 'Listagem de enquetes',
    description:
      'Retorna todas as enquetes registradas',
    security: [
      {
        bearerAuth: []
      }
    ],
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveys'
            }
          }
        }
      },
      401: {
        $ref: '#/components/unauthorized'
      },
      404: {
        $ref: '#/components/notFound'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
