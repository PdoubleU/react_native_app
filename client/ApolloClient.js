import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql
  } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";

  const GET_MESSAGES = gql`
    subscription {
        messages {
        _id
        text
        user {
                _id
                name
                avatar
            }
        }
    }
  `;

  const POST_MESSAGE = gql`
    mutation ($user: String!, $text: String!) {
        postMessage(user: $user, text: $text)
    }
  `;

  const wsLink = new WebSocketLink(
    {
      uri: 'ws://localhost:4000/',
      options: {
        reconnect: true
      },
    }
  )

  const client = new ApolloClient({
    wsLink,
    uri: 'http://localhost:4000/',
    cache: new InMemoryCache()
  });

  export default ({ children }) => (
      <ApolloProvider client={client}>{children}</ApolloProvider>
  );


  export { GET_MESSAGES, POST_MESSAGE };


