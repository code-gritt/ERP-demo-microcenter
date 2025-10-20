import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';

export const client = new ApolloClient({
    link: new HttpLink({
        uri: 'http://192.168.2.195:7000/graphql',
    }),
    cache: new InMemoryCache(),
});
