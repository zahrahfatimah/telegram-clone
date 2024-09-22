require("dotenv").config();
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { userTypeDefs, UserResolvers } = require("./schemas/user");
const { postTypeDefs, postResolvers } = require("./schemas/post");
const { responseTypeDefs } = require("./schemas/response");
const { connect, getDB } = require("./config/config");
const { authentication } = require("./utils/auth");
const { followTypeDefs, followResolvers } = require("./schemas/follow");

const server = new ApolloServer({
  typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs, responseTypeDefs],
  resolvers: [UserResolvers, postResolvers, followResolvers],
  introspection: true,
});

(async () => {
  try {
    await connect();
    const db = getDB();

    const { url } = await startStandaloneServer(server, {
      listen: process.env.PORT, 
      context: async ({ req, res }) => {
        return {
          dummyFunction: () => {
            console.log("We can read headers here", req.headers);
            throw new GraphQLError("This is an error", {
              extensions: {
                code: "INTERNAL_SERVER_ERROR",
              },
            });
          },
          auth: async () => await authentication(req),
          db,
        };
      },
    });

    console.log(`🚀 Server ready at ${url}`);
  } catch (error) {
    console.error("Failed to start server:", error);
  }
})();
