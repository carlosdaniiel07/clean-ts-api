import { ApolloServer } from 'apollo-server-express'
import { Express } from 'express'

import typeDefs from '~/main/graphql/type-defs'
import resolvers from '~/main/graphql/resolvers'

export default async (app: Express): Promise<void> => {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
    context: ({ req }) => ({
      req
    })
  })

  await server.start()
  server.applyMiddleware({ app })
}
