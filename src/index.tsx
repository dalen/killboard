import React from 'react';
import ReactDOM from 'react-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './style.scss';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { relayStylePagination } from '@apollo/client/utilities';

const client = new ApolloClient({
  uri: 'https://production-api.waremu.com/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          guildFeudKills: relayStylePagination(),
          playerFeudKills: relayStylePagination(),
          kills: relayStylePagination(),
          characters: relayStylePagination(),
        },
      },
    },
  }),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
