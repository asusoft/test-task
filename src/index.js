const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const app = express();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // Attach the request object to the context
      return { req };
    },
  });
  
  server.start().then(() => {
    server.applyMiddleware({ app, path: '/graphql' });
    app.listen(4000, () => {
      console.log('Server running at http://localhost:4000/graphql');
    });
  });