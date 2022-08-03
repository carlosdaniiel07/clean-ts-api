import { ApolloServer } from 'apollo-server-express'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import { AddSurveyParams } from '~/domain/usecases/add-survey'
import config from '~/main/config/env'
import { MongoHelper } from '~/infra/db/mongodb/helpers/mongo-helper'
import { SurveyModel } from '~/domain/models/survey'
import resolvers from '~/main/graphql/resolvers'
import typeDefs from '~/main/graphql/type-defs'

const makeApolloServer = (): ApolloServer => {
  return new ApolloServer({
    resolvers,
    typeDefs,
    context: ({ req }) => ({
      req
    })
  })
}

const buildApolloServerRequestContext = (accessToken: string): any => ({
  req: {
    headers: {
      authorization: `Bearer ${accessToken}`
    }
  }
})

const makeAddSurveyMutation = (): string => {
  return `
    mutation AddSurvey($request: AddSurvey!) {
      addSurvey(request: $request)
    }
  `
}

const makeAddSurveyModel = (): Omit<AddSurveyParams, 'date'> => ({
  question: 'Qual a sua linguagem de programação preferida?',
  answers: [
    {
      image: 'image.png',
      answer: 'any_answer'
    },
    {
      answer: 'any_answer_2'
    }
  ]
})

const createFakeUserAndGenerateAccessToken = async (
  accountCollection: Collection,
  role?: string
): Promise<string> => {
  const account = await accountCollection.insertOne({
    name: 'Carlos',
    email: 'carlos@email.com',
    password: 'any_password',
    role
  })
  const accessToken = sign(
    {
      id: account.insertedId.toString(),
      name: 'Carlos',
      email: 'carlos@email.com'
    },
    config.JWT_SECRET_KEY
  )

  await accountCollection.updateOne(
    {
      _id: account.insertedId
    },
    {
      $set: {
        accessToken
      }
    }
  )

  return accessToken
}

const createFakeSurvey = async (
  surveyCollection: Collection
): Promise<SurveyModel> => {
  const addSurveyModel: AddSurveyParams = {
    ...makeAddSurveyModel(),
    date: new Date()
  }
  await surveyCollection.insertOne(addSurveyModel)

  return MongoHelper.mapToModel<SurveyModel>(addSurveyModel)
}

describe('Add surveys GraphQL', () => {
  let apolloServer: ApolloServer
  let surveyCollection: Collection
  let accountCollection: Collection

  beforeAll(async () => {
    apolloServer = makeApolloServer()
    await MongoHelper.connect(global.__MONGO_URI__)
  })

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    accountCollection = await MongoHelper.getCollection('accounts')

    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })

  test('should return Unauthorized on add survey without valid access token', async () => {
    apolloServer.requestOptions.context =
      buildApolloServerRequestContext('invalid_token')

    const result = await apolloServer.executeOperation({
      query: makeAddSurveyMutation(),
      variables: {
        request: {
          ...makeAddSurveyModel()
        }
      }
    })

    expect(result.errors).toBeTruthy()
    expect(result.errors?.[0].message).toBe('Unauthorized')
  })

  test('should add survey with valid access token', async () => {
    const accessToken = await createFakeUserAndGenerateAccessToken(
      accountCollection
    )

    apolloServer.requestOptions.context =
      buildApolloServerRequestContext(accessToken)

    const result = await apolloServer.executeOperation({
      query: makeAddSurveyMutation(),
      variables: {
        request: {
          ...makeAddSurveyModel()
        }
      }
    })

    expect(result.errors).toBeUndefined()
  })
})

const makeLoadSurveysQuery = (): string => {
  return `
    query LoadSurveys {
      loadSurveys {
        id
        question
        date
        answers {
          answer
          image
        }
      }
    }
  `
}

describe('Get surveys GraphQL', () => {
  let apolloServer: ApolloServer
  let surveyCollection: Collection
  let accountCollection: Collection

  beforeAll(async () => {
    apolloServer = makeApolloServer()
    await MongoHelper.connect(global.__MONGO_URI__)
  })

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    accountCollection = await MongoHelper.getCollection('accounts')

    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })

  test('should return Unauthorized on get surveys without valid access token', async () => {
    apolloServer.requestOptions.context =
      buildApolloServerRequestContext('invalid_token')

    const result = await apolloServer.executeOperation({
      query: makeAddSurveyMutation(),
      variables: {
        request: {
          ...makeAddSurveyModel()
        }
      }
    })

    expect(result.errors).toBeTruthy()
    expect(result.errors?.[0].message).toBe('Unauthorized')
  })

  test('should return an empty survey list', async () => {
    const accessToken = await createFakeUserAndGenerateAccessToken(
      accountCollection
    )

    apolloServer.requestOptions.context =
      buildApolloServerRequestContext(accessToken)

    const result = await apolloServer.executeOperation({
      query: makeLoadSurveysQuery()
    })

    expect(result.errors).toBeUndefined()
    expect(result.data?.loadSurveys).toEqual([])
  })

  test('should return a survey list', async () => {
    const accessToken = await createFakeUserAndGenerateAccessToken(
      accountCollection
    )

    await createFakeSurvey(surveyCollection)

    apolloServer.requestOptions.context =
      buildApolloServerRequestContext(accessToken)

    const result = await apolloServer.executeOperation({
      query: makeLoadSurveysQuery()
    })

    expect(result.errors).toBeUndefined()
    expect(result.data?.loadSurveys).toBeTruthy()
  })
})

const makeLoadSurveyResultsQuery = (): string => {
  return `
    query LoadSurveyResults($surveyId: ID!) {
      loadSurveyResults(surveyId: $surveyId) {
        surveyId
        question
        date
        answers {
          answer
          image
          count
          percent
        }
      }
    }
  `
}

describe('Get survey results GraphQL', () => {
  let apolloServer: ApolloServer
  let surveyCollection: Collection
  let accountCollection: Collection
  let surveyResultsCollection: Collection

  beforeAll(async () => {
    apolloServer = makeApolloServer()
    await MongoHelper.connect(global.__MONGO_URI__)
  })

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    accountCollection = await MongoHelper.getCollection('accounts')
    surveyResultsCollection = await MongoHelper.getCollection('survey_results')

    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
    await surveyResultsCollection.deleteMany({})
  })

  test('should return Unauthorized on get survey result without valid access token', async () => {
    apolloServer.requestOptions.context =
      buildApolloServerRequestContext('invalid_token')

    const result = await apolloServer.executeOperation({
      query: makeLoadSurveyResultsQuery(),
      variables: {
        surveyId: 'any_surveyId'
      }
    })

    expect(result.errors).toBeTruthy()
    expect(result.errors?.[0].message).toBe('Unauthorized')
  })

  test('should return survey result', async () => {
    const accessToken = await createFakeUserAndGenerateAccessToken(
      accountCollection
    )
    const survey = await createFakeSurvey(surveyCollection)

    apolloServer.requestOptions.context =
      buildApolloServerRequestContext(accessToken)

    const result = await apolloServer.executeOperation({
      query: makeLoadSurveyResultsQuery(),
      variables: {
        surveyId: survey.id.toString()
      }
    })

    expect(result.errors).toBeUndefined()
    expect(result.data?.loadSurveyResults).toBeTruthy()
  })
})

const makeAddSurveyResultMutation = (): string => {
  return `
    mutation Mutation($surveyId: ID!, $answer: String!) {
      addSurveyResult(surveyId: $surveyId, answer: $answer) {
        surveyId
        question
        date
        answers {
          answer
          image
          count
          percent
        }
      }
    }
  `
}

describe('Save survey result GraphQL', () => {
  let apolloServer: ApolloServer
  let surveyCollection: Collection
  let accountCollection: Collection
  let surveyResultsCollection: Collection

  beforeAll(async () => {
    apolloServer = makeApolloServer()
    await MongoHelper.connect(global.__MONGO_URI__)
  })

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    accountCollection = await MongoHelper.getCollection('accounts')
    surveyResultsCollection = await MongoHelper.getCollection('survey_results')

    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
    await surveyResultsCollection.deleteMany({})
  })

  test('should return Unauthorized on add survey result without access token', async () => {
    apolloServer.requestOptions.context =
      buildApolloServerRequestContext('invalid_token')

    const result = await apolloServer.executeOperation({
      query: makeAddSurveyResultMutation(),
      variables: {
        surveyId: 'any_surveyId',
        answer: 'any_answer'
      }
    })

    expect(result.errors).toBeTruthy()
    expect(result.errors?.[0].message).toBe('Unauthorized')
  })

  test('should return UserInputError if survey not exists', async () => {
    const accessToken = await createFakeUserAndGenerateAccessToken(
      accountCollection
    )

    apolloServer.requestOptions.context =
      buildApolloServerRequestContext(accessToken)

    const result = await apolloServer.executeOperation({
      query: makeAddSurveyResultMutation(),
      variables: {
        surveyId: '507f1f77bcf86cd799439011',
        answer: 'any_answer'
      }
    })

    expect(result.errors).toBeTruthy()
    expect(result.errors?.[0].message).toBe('Survey not found')
  })

  test('should return UserInputError if request body is invalid', async () => {
    const accessToken = await createFakeUserAndGenerateAccessToken(
      accountCollection
    )

    apolloServer.requestOptions.context =
      buildApolloServerRequestContext(accessToken)

    const result = await apolloServer.executeOperation({
      query: makeAddSurveyResultMutation(),
      variables: {
        surveyId: '507f1f77bcf86cd799439011',
        answer: ''
      }
    })

    expect(result.errors).toBeTruthy()
    expect(result.errors?.[0].message).toBe('Missing param: answer')
  })

  test('should return UserInputError if survey answer is invalid', async () => {
    const accessToken = await createFakeUserAndGenerateAccessToken(
      accountCollection
    )
    const survey = await createFakeSurvey(surveyCollection)

    apolloServer.requestOptions.context =
      buildApolloServerRequestContext(accessToken)

    const result = await apolloServer.executeOperation({
      query: makeAddSurveyResultMutation(),
      variables: {
        surveyId: survey.id.toString(),
        answer: 'invalid_answer'
      }
    })

    expect(result.errors).toBeTruthy()
    expect(result.errors?.[0].message).toBe('Invalid param: answer')
  })

  test('should return survey result on create survey result', async () => {
    const accessToken = await createFakeUserAndGenerateAccessToken(
      accountCollection
    )
    const survey = await createFakeSurvey(surveyCollection)

    apolloServer.requestOptions.context =
      buildApolloServerRequestContext(accessToken)

    const result = await apolloServer.executeOperation({
      query: makeAddSurveyResultMutation(),
      variables: {
        surveyId: survey.id.toString(),
        answer: survey.answers[0]?.answer
      }
    })

    expect(result.errors).toBeUndefined()
    expect(result.data?.addSurveyResult).toBeTruthy()
  })
})
