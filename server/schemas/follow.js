const {
  createFollow,
  findFollowersByUserId,
  findFollowingsByUserId,
  removeFollow,
} = require("../models/follow");
const { GraphQLError } = require("graphql");

const followTypeDefs = `#graphql
  type Follow {
    _id: ID!
    followerId: ID!
    followingId: ID!
    createdAt: String
    updatedAt: String
  }

  type Query {
    getFollowers: [Follow]
    getFollowings: [Follow]
  }

  type Mutation {
    follow(followerId: ID!): FollowResponse
    unfollow(followerId: ID!): FollowResponse
  }
`;

const followResolvers = {
  Query: {
    getFollowers: async (_, __, contextValue) => {
      const { userId } = await contextValue.auth();

      if (!userId) {
        throw new GraphQLError("User not authenticated", {
          extensions: {
            code: "UNAUTHORIZED",
            http: { status: 401 },
          },
        });
      }

      return await findFollowersByUserId(userId);
    },
    getFollowings: async (_, __, contextValue) => {
      const loginInfo = await contextValue.auth();
      const userId = loginInfo.userId;

      if (!userId) {
        throw new GraphQLError("User not authenticated", {
          extensions: {
            code: "UNAUTHORIZED",
            http: { status: 401 },
          },
        });
      }

      return await findFollowingsByUserId(userId);
    },
  },

  Mutation: {
    follow: async (_, args, contextValue) => {
      const loginInfo = await contextValue.auth();
      const followerId = loginInfo.id;
      const { followingId } = args;

      if (!followerId) {
        throw new GraphQLError("User not authenticated", {
          extensions: {
            code: "UNAUTHORIZED",
            http: { status: 401 },
          },
        });
      }

      await createFollow({ followerId, followingId });

      return {
        statusCode: 201,
        message: "Successfully followed user",
      };
    },

    unfollow: async (_, args, contextValue) => {
      const loginInfo = await contextValue.auth();
      const followerId = loginInfo.id;
      const { followingId } = args;

      if (!followerId) {
        throw new GraphQLError("User not authenticated", {
          extensions: {
            code: "UNAUTHORIZED",
            http: { status: 401 },
          },
        });
      }

      await removeFollow({ followerId, followingId });

      return {
        statusCode: 200,
        message: "Successfully unfollowed user",
      };
    },
  },
};

module.exports = { followTypeDefs, followResolvers };
