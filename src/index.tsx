import React from 'react';
import { render } from 'react-dom';
// Apollo
import { ApolloClient } from 'apollo-client';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from '@apollo/react-common';
import { createUploadLink } from 'apollo-upload-client';
import gql from 'graphql-tag';
import { typeDefs, resolvers } from './types';
// Material UI
import makeStyles from '@material-ui/core/styles/makeStyles';
// Components
import { endpoints } from './util';
import { ThemeWrapper } from './components';
import Router from './router';
// Setting ENV
// let production = process.env.NODE_ENV == 'production';
// Initializing Apollo Cache and httpLink based on ENV
const cache = new InMemoryCache();
const httpLink = createUploadLink({
  // uri: production ? endpoints.production : endpoints.dev,
  uri: endpoints.production,
});

// Setting bearer token from localstorage
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('jwtToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : '',
    },
  };
}).concat(httpLink);
// Initializing ApolloClient
const client = new ApolloClient({
  link: authLink,
  cache,
  typeDefs,
  resolvers,
});
// Queries
const GET_USER = gql`
  {
    validate {
      username
      password
      name
      campus
      department
      dob
      email
      level
    }
  }
`;
// Initializing Cache
client.writeData({
  data: {
    loggedIn: null,
    dark: localStorage.getItem('dark') == 'true',
  },
});
client.query({ query: GET_USER }).then(({ data: { validate } }) => {
  client.writeData({
    data: { loggedIn: validate != null, details: validate },
  });
});
// JSS
const useStyles = makeStyles((theme) => ({
  root: {
    overflow: 'hidden',
    padding: theme.spacing(0, 3),
    // width: '100vw',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box',
    background: theme.palette.background.default,
  },
}));
// Component with ApolloProvider (Apollo Root)
class Root extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <ThemeWrapper>
          <Index />
        </ThemeWrapper>
      </ApolloProvider>
    );
  }
}
// Declaring Index (Soft Root)
let Index = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Router />
    </div>
  );
};

render(<Root />, document.getElementById('root'));
