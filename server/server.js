const { GraphQLServer, PubSub } = require('graphql-yoga');

let messages = [];

const typeDefs = `
    type User {
        _id: String!
        name: String!
        avatar: String!
    }
    type Message {
        _id: ID!
        user: User!
        text: String!
        createdAt: String!
    }

    type Query {
        messages: [Message!]
    }

    type Mutation {
        postMessage(user: String!, text: String!): ID!
    }

    type Subscription {
        messages: MessagesSubscription
    }

    type MessagesSubscription {
        mutation: String
        data: [Message]
    }
`;

const pubsub = new PubSub();

const resolvers = {
    Query: {
        messages: () => messages,
    },
    Mutation: {
        postMessage: ( parent, { user, text }) => {
            const _id = messages.length;
            messages.push({
                _id,
                user: {
                    _id: user,
                    name: user,
                    avatar: 'https://placeimg.com/140/140/any'
                },
                text,
                createdAt: "2022-02-25T17_12_54_252Z",
            });
            pubsub.publish("messages", {
                messages: {
                    mutation: "New message",
                    data: messages
                }
            })
            return _id;
        }
    },
    Subscription: {
        messages: {
            subscribe: (parent, args, { pubsub }) => {
                return pubsub.asyncIterator('messages');
            }
        }
    }
}

const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } });
server.start(({port}) => console.log(`Server on http://localhost:${port}/`));
