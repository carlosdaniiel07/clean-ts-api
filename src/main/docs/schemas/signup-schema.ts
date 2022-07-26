export const signupSchema = {
  type: 'object',
  properties: {
    accessToken: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    email: {
      type: 'string'
    }
  }
}
