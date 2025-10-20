import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: 'http://192.168.2.195:7000/graphql',
});

const authLink = setContext((_, { headers }) => {
    const stored = localStorage.getItem('auth-storage');
    let token: string | null = null;

    if (stored) {
        const parsed = JSON.parse(stored);
        token = parsed?.token ?? null;
    }

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});
