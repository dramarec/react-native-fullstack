const { ApolloServer, gql } = require("apollo-server");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

const { DB_URI, DB_NAME } = process.env;

const typeDefs = gql`
    type Query {
        myTaskLists: [TaskList!]!
        getTaskList(id: ID!): TaskList
    }

    type Mutation {
        signUp(input: SignUpInput!): AuthUser!
        signIn(input: SignInInput!): AuthUser!
        createTaskList(title: String!): TaskList!
        updateTaskList(id: ID!, title: String!): TaskList!
        deleteTaskList(id: ID!): Boolean!
        addUserToTaskList(taskListId: ID!, userId: ID!): TaskList
        createToDo(content: String!, taskListId: ID!): ToDo!
        updateToDo(id: ID!, content: String, isCompleted: Boolean): ToDo!
        deleteToDo(id: ID!): Boolean!
    }
    input SignUpInput {
        email: String!
        password: String!
        name: String!
        avatar: String
    }
    input SignInInput {
        email: String!
        password: String!
    }

    type AuthUser {
        user: User!
        token: String!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        avatar: String!
    }

    type TaskList {
        id: ID!
        createdAt: String!
        title: String!
        progress: Float!

        users: [User!]!
        todos: [ToDo!]!
    }

    type ToDo {
        id: ID!
        content: String!
        isCompleted: Boolean!
        taskList: TaskList!
    }
`;

const resolvers = {
    Query: {
        myTaskLists: () => [],
    },
    Mutation: {
        signUp: async (_, data, { db }) => {
            const hashedPassword = bcrypt.hashSync(data.input.password);
            const newUser = {
                ...data.input,
                password: hashedPassword,
            };

            // save to database
            const result = await db.collection("Users").insert(newUser);
            console.log("{*} ===> signUp: ===> result", result);

            const user = result.ops[0];
            return {
                user,
                token: "token",
                // token: getToken(user),
            };
        },
        signIn: async (_, { input }, { db }) => {
            const user = await db
                .collection("Users")
                .findOne({ email: input.email });
            if (!user) {
                throw new Error("Invalid credentials !email");
            }

            //check if password is correct
            const isPasswordCorrect = bcrypt.compareSync(
                input.password,
                user.password
            );
            if (!isPasswordCorrect) {
                throw new Error("Invalid credentials !password");
            }
            return {
                user,
                token: "TOKEN",
            };
        },
    },
    User: {
        // id: (root) => {
        //     return root._id;
        // },
        id: ({ _id, id }) => _id || id,
    },
};

//! ============== connect to server ==============

const start = async () => {
    const client = new MongoClient(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    await client.connect();
    const db = client.db(DB_NAME);

    //db connect to ApolloServer
    const context = {
        db,
    };

    // The ApolloServer constructor requires two parameters: your schema
    // definition and your set of resolvers.
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context,
    });

    // The `listen` method launches a web server.
    server.listen().then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`);
    });
};

start();
