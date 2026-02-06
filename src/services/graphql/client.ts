import { 
  ApolloClient, 
  InMemoryCache, 
  createHttpLink
} from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';

const httpLink = createHttpLink({
  uri: 'https://rickandmortyapi.com/graphql',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

// Exportamos tanto el client como el provider para usarlos
export { client, ApolloProvider };