const { gql } = require('apollo-server-express');
const userSchema = require('./user.js');
const todoSchema = require('./todo.js');

const baseSchema = gql`
  type Query
  type Mutation
`;

module.exports = [baseSchema, userSchema, todoSchema];
