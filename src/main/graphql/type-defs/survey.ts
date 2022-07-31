import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    loadSurveys: [Survey!]!
    loadSurveyResults (surveyId: ID!): SurveyResult!
  }

  extend type Mutation {
    addSurvey (request: AddSurvey!): String
    addSurveyResult (surveyId: ID!, answer: String!): SurveyResult!
  }

  type Survey {
    id: ID!
    question: String!
    answers: [SurveyAnswer!]!
    date: String!
  }

  type SurveyAnswer {
    answer: String!
    image: String
  }

  type SurveyResult {
    surveyId: ID!
    question: String!
    answers: [SurveyResultAnswer!]!
    date: String!
  }

  type SurveyResultAnswer {
    image: String
    answer: String!
    count: Int!
    percent: Float!
  }

  input AddSurvey {
    question: String!
    answers: [AddSurveyAnswer!]!
  }

  input AddSurveyAnswer {
    answer: String!
    image: String
  }
`
