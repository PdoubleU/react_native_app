import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    createHttpLink,
    split,
    gql
  } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { getMainDefinition } from '@apollo/client/utilities';

  const GET_MESSAGES = gql`
    subscription {
      messages {
        mutation
        data {
          _id
          user {
            _id
            name
            avatar
          }
          text
          createdAt
        }
      }
      }
  `;

  const POST_MESSAGE = gql`
    mutation ($user: String!, $text: String!) {
        postMessage(user: $user, text: $text)
    }
  `;

  const httpLink = createHttpLink({
    uri: "http://localhost:4000",
  });

  const wsLink = new WebSocketLink(
    new SubscriptionClient('ws://localhost:4000/',
      {
        options: {
          reconnect: true,
          connectionCallback: (error) => console.log(error)
        },
      }
    )
  );

  let splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === "OperationDefinition" && definition.operation === "subscription";
    },
    wsLink,
    httpLink
  );


  const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache()
  });

  export default ({ children }) => (
      <ApolloProvider client={client}>{children}</ApolloProvider>
  );


  export { GET_MESSAGES, POST_MESSAGE };


