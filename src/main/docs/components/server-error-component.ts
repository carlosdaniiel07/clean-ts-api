export const serverErrorComponent = {
  description: 'Erro interno no servidor',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
