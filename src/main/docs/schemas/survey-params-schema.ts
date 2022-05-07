export const surveyParamsSchema = {
  type: 'object',
  properties: {
    question: {
      type: 'string'
    },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/surveyAnswerParams'
      }
    }
  },
  required: ['question', 'answers']
}
