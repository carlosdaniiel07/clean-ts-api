import { ApolloServer } from 'apollo-server-express'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { MongoHelper } from '~/infra/db/mongodb/helpers/mongo-helper'
import resolvers from '~/main/graphql/resolvers'
import typeDefs from '~/main/graphql/type-defs'

const makeApolloServer = (): ApolloServer => {
  return new ApolloServer({
    resolvers,
    typeDefs
  })
}

const makeSignUpMutation = (): string => {
  return `
    mutation SignUp($name: String!, $email: String!, $password: String!, $passwordConfirmation: String!) {
      signUp(name: $name, email: $email, password: $password, passwordConfirmation: $passwordConfirmation) {
        accessToken
      }
    }
  `
}

const makeLoginQuery = (): string => {
  return `
    query Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        accessToken
      }
    }
  `
}

let accountCollection: Collection
let apolloServer: ApolloServer

describe('Signup GraphQL', () => {
  beforeAll(async () => {
    apolloServer = makeApolloServer()
    await MongoHelper.connect(global.__MONGO_URI__)
  })

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('should create an account and return an access token on signup', async () => {
    const result = await apolloServer.executeOperation({
      query: makeSignUpMutation(),
      variables: {
        name: 'Carlos',
        email: 'carlos@email.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    })

    expect(result.errors).toBeUndefined()
    expect(result.data?.signUp.accessToken).toBeTruthy()
  })
})

describe('Login GraphQL', () => {
  beforeAll(async () => {
    apolloServer = makeApolloServer()
    await MongoHelper.connect(global.__MONGO_URI__)
  })

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('should return an access token on login', async () => {
    const email = 'carlos@email.com'
    const password = 'password'

    await accountCollection.insertOne({
      name: 'Carlos',
      email,
      password: await hash(password, 12)
    })

    const result = await apolloServer.executeOperation({
      query: makeLoginQuery(),
      variables: {
        email,
        password
      }
    })

    expect(result.errors).toBeUndefined()
    expect(result.data?.login.accessToken).toBeTruthy()
  })

  test('should return Unauthorized on login', async () => {
    const result = await apolloServer.executeOperation({
      query: makeLoginQuery(),
      variables: {
        email: 'carlos@email.com',
        password: 'password'
      }
    })

    expect(result.errors).toBeTruthy()
    expect(result.errors?.[0].message).toBe('Unauthorized')
  })
})
