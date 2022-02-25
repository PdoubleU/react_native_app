const { GraphQLServer } = require('graphql-yoga');

let messages = [];

const typeDefs = `
    type Message {
        id: ID!
        user: String!
        content: String!
    }

    type Query {
        messages: [Message!]
    }

    type Mutation {
        postMessage(user: String!, content: String!): ID!
    }
`;

const resorvels = {
    Query: {
        messages: () => messages,
    },
    Mutation: {
        postMessage: ( parent, { user, content }) => {
            const id = messages.length;
            messages.push({
                id,
                user,
                content
            });
            return id;
        }
    }
}

const server = new GraphQLServer();
server.start(({port}) => console.log(`Server on http://localhost:${port}/`));
