const { GraphQLError } = require("graphql");
const { hash, compare } = require("../helpers/bcrypt");

const {
  findAllUser,
  userRegister,
  userLogin,
  findUserById,
  searchUserByUsername,
} = require("../models/user");
const { signToken } = require("../helpers/jwt");

const userTypeDefs = `#graphql
  type User {
    name: String
    username: String
    email: String
    password: String
    followers: [User]
    followings: [User]
  }

  type UserWithoutPassword {
    _id: ID!
    name: String!
    username: String!
    email: String!
  }

  type Query {
    getAllUsers:[User]
    getUserById(id: ID!): User
    searchUser( username: String): [User]
  }

	type Mutation {
    login(email: String!, password: String!):UserLoginResponse
    register(name: String, email: String!, username: String, password: String!): UserResponse
	}
`;

const UserResolvers = {
  Query: {
    getAllUsers: async (_, __, contextValue) => {
      const auth = await contextValue.auth();
      const users = await findAllUser();
      return users;
    },

    getUserById: async (_, args, contextValue) => {
      const { id } = args;
      // const { db } = contextValue;

      const user = await findUserById(id);
      if (!user) {
        throw new GraphQLError("User not found", {
          extensions: {
            http: {
              status: 404,
            },
          },
        });
      }
      // console.log(user, "getuserbyid nihhhh");

      return user;
    },

    searchUser: async (_, args, contextValue) => {
      const { username } = args;

      const users = await searchUserByUsername(username);
      // console.log(users, "<<<< users muu");
      if (!users) {
        throw new GraphQLError("User not found", {
          extensions: {
            http: {
              status: 404,
            },
          },
        });
      }
      return users;
    },
  },

  Mutation: {
    login: async (_, args) => {
      const { email, password } = args;

      const foundUser = await userLogin(email);
      // console.log( foundUser, 'found user di loginnnnn');

      if (!foundUser) {
        throw new GraphQLError("Invalid Username/ Password", {
          extensions: {
            http: {
              status: 401,
            },
          },
        });
      }

      if (!compare(password, foundUser.password)) {
        throw new GraphQLError("Invalid Username/ Password", {
          extensions: {
            http: {
              status: 401,
            },
          },
        });
      }

      const payload = {
        id: foundUser._id,
        email: foundUser.email,
      };

      const token = signToken(payload);

      return {
        statusCode: 200,
        message: "Login successful",
        data: {
          token: token,
        },
      };
    },

    register: async (_, args) => {
      const { name, email, username, password } = args;
      if (password.length < 5) {
        throw new GraphQLError("Password is too short", {
          extensions: {
            http: { status: 401 },
          },
        });
      }

      const newUser = {
        name,
        email,
        username,
        password: hash(password),
      };

      const result = await userRegister(newUser);
      return {
        message: "Register success",
        data: result,
      };
    },
  },
};

module.exports = {
  userTypeDefs,
  UserResolvers,
};
