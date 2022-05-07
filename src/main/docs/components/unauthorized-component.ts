export const unauthorizedComponent = {
  description: 'Não autorizado',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
