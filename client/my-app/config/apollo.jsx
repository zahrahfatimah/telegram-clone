import { ApolloClient, createHttpLink, InMemoryCache} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

import * as SecureStore from 'expo-secure-store'

const httpLink = createHttpLink({
  uri: "https://vq6srql2-4000.asse.devtunnels.ms/",
});

const authLink = setContext(async (_, { headers }) => {
  const token = await SecureStore.getItemAsync("token");
  console.log("Your token here >>:", token);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;