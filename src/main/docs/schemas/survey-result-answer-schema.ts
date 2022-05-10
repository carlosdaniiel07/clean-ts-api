export const surveyResultAnswerSchema = {
  type: 'object',
  properties: {
    image: {
      type: 'string'
    },
    answer: {
      type: 'string'
    },
    count: {
      type: 'integer',
      format: 'int32'
    },
    percent: {
      type: 'number',
      format: 'double'
    }
  }
}
