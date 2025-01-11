const { gql } = require('apollo-server-express');

const userSchema = gql`
  enum ERole {
    SCHOLAR
    REGULAR
  }

  input CreateUserInput {
    password: String!
    name: String!
    email: String!
    role: ERole!
  }

  input UpdateUserInput {
    id: ID!
    name: String
    email: String
    role: ERole
  }

  input SignInInput {
    email: String!
    password: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: ERole!
    createdAt: String!
    updatedAt: String!
  }

  type TokenPair {
    accessToken: String!
    refreshToken: String!
  }

  type UserWithTokens {
    user: User!
    tokens: TokenPair!
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): UserWithTokens!
    signIn(input: SignInInput!): TokenPair!
    updateUser(input: UpdateUserInput!): User!
  }

  extend type Query {
    getMe: User!
  }
`;

module.exports = userSchema;
