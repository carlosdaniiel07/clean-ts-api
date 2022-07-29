import express from 'express'
import setupMiddlewares from './middlewares'
import setupRoutes from './routes'
import setupSwagger from './swagger'
import setupApolloServer from './apollo-server'

const app = express()

setupSwagger(app)
setupMiddlewares(app)
setupRoutes(app)
// eslint-disable-next-line @typescript-eslint/no-floating-promises
setupApolloServer(app)

export default app
