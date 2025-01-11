const { gql } = require('apollo-server-express');

const todoSchema = gql`
  enum ETodoStatus {
    PENDING
    COMPLETED
  }

  input CreateTodoInput {
    title: String!
    description: String
  }

  input UpdateTodoInput {
    id: ID!
    title: String
    description: String
    status: ETodoStatus
  }

  type Todo {
    id: ID!
    title: String!
    description: String
    status: ETodoStatus!
    createdBy: User!
    createdAt: String!
    updatedAt: String!
  }

  extend type Mutation {
    createTodo(input: CreateTodoInput!): Todo!
    updateTodo(input: UpdateTodoInput!): Todo!
    deleteTodo(id: ID!): Boolean!
  }

  extend type Query {
    getMyTodos: [Todo!]!
  }
`;

module.exports = todoSchema;
