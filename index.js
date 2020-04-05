'use strict';

require('dotenv').config();

const express = require('express');
const graphqlHTTP = require('express-graphql');
const MyGraphQLSchema = require('./schema/schema');
const db = require('./utils/db')
const passport = require('./utils/pass.js')
const loginController = require('./controllers/authController');

const app = express();

const auth = (req, res, next) => {
  req.user = true;
  next();
};



// dummy function to check authentication (irl: e.g. passport-jwt)
const checkAuth = (req, res) => {
  console.log('user', req.user);
  if (!req.user)
    throw new Error('Not authenticated');

    //passport.authenticate('jwt', {session: false})
};

app.use(auth);

app.post('/login', loginController.login)


app.use(
  '/graphql', (req, res) => {
    graphqlHTTP({
      schema: MyGraphQLSchema,
      graphiql: true,
      context: {req, res, checkAuth},
    })(req, res);
  });


app.listen(3000);

