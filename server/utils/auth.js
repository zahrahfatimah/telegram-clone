const { GraphQLError } = require("graphql");
const { verifyToken } = require("../helpers/jwt");
const { getUserByEmail } = require("../models/user");

const authentication = async (req) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new GraphQLError("unauthorized dsini kahhhh", {
      extensions: {
        http: "401",
        code: "UNAUTHENTICATED",
      },
    });
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    throw new GraphQLError("unauthorized", {
      extensions: {
        http: "401",
        code: "UNAUTHENTICATED",
      },
    });
  }

  const payload = verifyToken(token);
  console.log(payload);

  const user = await getUserByEmail(payload.email);

  if (!user) {
    throw new GraphQLError("You are not authenticated", {
      extensions: {
        http: "401",
        code: "UNAUTHENTICATED",
      },
    });
  }

  return {
    id: user._id,
    // userId: user._id.toString(),
    name: user.name,
    username: user.username
  };
};

module.exports = { authentication };
