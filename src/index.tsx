import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './style.scss';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router';
import App from './App';

const client = new ApolloClient({
  uri: 'https://production-api.waremu.com/graphql',
  cache: new InMemoryCache(),
});

const container = document.getElementById('root');
if (container == null) throw new Error('Root element not found');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>,
);
