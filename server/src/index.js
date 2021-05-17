const { ApolloServer, gql } = require('apollo-server');
const { MongoClient, ObjectID } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const { DB_URI, DB_NAME, JWT_SECRET } = process.env;

const getToken = user =>
    jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30 days' });

const getUserFromToken = async (token, db) => {
    if (!token) {
        return null;
    }
    const tokenData = jwt.verify(token, JWT_SECRET);

    if (!tokenData?.id) {
        return null;
    }
    return await db
        .collection('Users')
        .findOne({ _id: ObjectID(tokenData.id) });
};

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
            const result = await db.collection('Users').insert(newUser);
            const user = result.ops[0];
            return {
                user,
                token: getToken(user),
            };
        },
        signIn: async (_, { input }, { db }) => {
            const user = await db
                .collection('Users')
                .findOne({ email: input.email });

            //check if password is correct
            const isPasswordCorrect =
                user && bcrypt.compareSync(input.password, user.password);

            if (!user || !isPasswordCorrect) {
                throw new Error('Invalid credentials');
            }
            return {
                user,
                token: getToken(user),
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

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({ req }) => {
            const token = req.headers.authorization;
            const user = await getUserFromToken(token, db);
            return {
                db,
                user,
            };
        },
    });

    server.listen().then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`);
    });
};
start();
