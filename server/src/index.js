const { ApolloServer, gql } = require('apollo-server');
const { MongoClient, ObjectID, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const { DB_URI, DB_NAME, JWT_SECRET } = process.env;

const getToken = user => jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30 days' });

const getUserFromToken = async (token, db) => {
    if (!token) {
        return null;
    }
    const tokenData = jwt.verify(token, JWT_SECRET);

    if (!tokenData?.id) {
        return null;
    }
    return await db.collection('Users').findOne({ _id: ObjectID(tokenData.id) });
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
        myTaskLists: async (_, __, { db, user }) => {
            if (!user) {
                throw new Error('Authentication Error. Please sign in');
            }
            return await db.collection('TaskList').find({ userIds: user._id }).toArray();
        },

        getTaskList: async (_, { id }, { db, user }) => {
            if (!user) {
                throw new Error('Authentication Error. Please sign in');
            }

            return await db.collection('TaskList').findOne({ _id: ObjectID(id) });
        },
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
            const user = await db.collection('Users').findOne({ email: input.email });

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

        createTaskList: async (_, { title }, { db, user }) => {
            if (!user) {
                throw new Error('Authentication Error. Please sign in');
            }
            const newTaskList = {
                title,
                createdAt: new Date().toISOString(),
                userIds: [user._id],
            };

            const result = await db.collection('TaskList').insertOne(newTaskList);
            return result.ops[0];
        },

        updateTaskList: async (_, { id, title }, { db, user }) => {
            if (!user) {
                throw new Error('Authentication Error. Please sign in');
            }
            await db.collection('TaskList').updateOne(
                {
                    _id: ObjectID(id),
                },
                {
                    $set: {
                        title,
                    },
                },
            );
            // return result.ops[0];
            return await db.collection('TaskList').findOne({ _id: ObjectID(id) });
        },

        deleteTaskList: async (_, { id }, { db, user }) => {
            if (!user) {
                throw new Error('Authentication Error. Please sign in');
            }

            await db.collection('TaskList').removeOne({
                _id: ObjectID(id),
            });
            return true;
        },

        addUserToTaskList: async (_, { taskListId, userId }, { db, user }) => {
            console.log('{*} ===> addUserToTaskList: ===> taskListId', taskListId);
            if (!user) {
                throw new Error('Authentication Error. Please sign in');
            }

            const taskList = await db
                .collection('TaskList')
                .findOne({ _id: ObjectID(taskListId) });
            if (!taskList) {
                return null;
            }
            if (taskList.userIds.find(dbId => dbId.toString() === userId.toString())) {
                return taskList;
            }
            await db.collection('TaskList').updateOne(
                {
                    _id: ObjectID(taskListId),
                },
                {
                    $push: {
                        userIds: ObjectID(userId),
                    },
                },
            );
            taskList.userIds.push(ObjectID(userId));
            return taskList;
        },
    },
    User: {
        // id: (root) => {
        //     return root._id;
        // },
        id: ({ _id, id }) => _id || id,
    },
    TaskList: {
        id: ({ _id, id }) => _id || id,

        progress: () => 0,

        users: async ({ userIds }, _, { db }) =>
            Promise.all(
                userIds.map(userId => db.collection('Users').findOne({ _id: userId })),
            ),
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
