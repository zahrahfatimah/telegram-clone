const { GraphQLError } = require("graphql");
const { getDB } = require("../config/config");
const { ObjectId } = require("mongodb");

// bagian user
const getUserByEmail = async (email) => {
  const db = await getDB();
  const user = await db.collection("users").findOne({ email });
  return user;
};

const findAllUser = async () => {
  const db = await getDB();

  const agg = [
    {
      $lookup: {
        from: "follow",
        localField: "_id",
        foreignField: "followingId",
        as: "followings",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "followings.followerId",
        foreignField: "_id",
        as: "followings",
      },
    },
    {
      $project: {
        password: 0,
        "followings.password": 0,
      },
    },
    {
      $lookup: {
        from: "follow",
        localField: "_id",
        foreignField: "followerId",
        as: "followers",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "followers.followingId",
        foreignField: "_id",
        as: "followers",
      },
    },
    {
      $project: {
        "followers.password": 0,
      },
    },
  ];
  const users = await db.collection("users").aggregate(agg).toArray();

  return users;
};
const userRegister = async (newUser) => {
  const db = await getDB();

  const { name, username, email, password } = newUser;

  if (!email) {
    throw new GraphQLError("Email is required", {
      extensions: {
        http: { status: 401 },
      },
    });
  }

  if (!password) {
    throw new GraphQLError("Password is required", {
      extensions: {
        http: { status: 401 },
      },
    });
  }

  const userName = await db.collection("users").findOne({ username });
  if (userName) {
    throw new GraphQLError("Username already taken", {
      extensions: {
        http: { status: 403 },
      },
    });
  }

  const userEmail = await db.collection("users").findOne({ email });
  if (userEmail) {
    throw new GraphQLError("Email already taken", {
      extensions: {
        http: { status: 403 },
      },
    });
  }

  if (email) {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!regex.test(email))
      throw new GraphQLError("Invalid email format", {
        extensions: {
          http: {
            status: 403,
          },
        },
      });
  }

  await db.collection("users").insertOne(newUser);

  const result = await db
    .collection("users")
    .findOne({ username }, { projection: 0 });

  return result;
};

const userLogin = async (email) => {
  const db = await getDB();
  const foundUser = await db.collection("users").findOne({ email });
  // console.log(foundUser, "<<<<< found userc di index.js");
  return foundUser;
};

const searchUserByUsername = async (username) => {
  const db = await getDB();

  const agg = [
    {
      $match: {
        username: {
          $regex: username,
          $options: "i",
        },
      },
    },
    {
      $lookup: {
        from: "follow",
        localField: "_id",
        foreignField: "followingId",
        as: "followings",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "followings.followerId",
        foreignField: "_id",
        as: "followings",
      },
    },
    {
      $project: {
        password: 0,
        "followings.password": 0,
      },
    },
    {
      $lookup: {
        from: "follow",
        localField: "_id",
        foreignField: "followerId",
        as: "followers",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "followers.followingId",
        foreignField: "_id",
        as: "followers",
      },
    },
    {
      $project: {
        "followers.password": 0,
      },
    },
  ];

  const users = await db.collection("users").aggregate(agg).toArray();

  // console.log(users, "<<<< users muu");
  return users;
};

const findUserById = async (userId) => {
  const db = await getDB();

  const agg = [
    {
      $match: {
        _id: new ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "follow",
        localField: "_id",
        foreignField: "followingId",
        as: "followings",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "followings.followerId",
        foreignField: "_id",
        as: "followings",
      },
    },
    {
      $project: {
        password: 0,
        "followings.password": 0,
      },
    },
    {
      $lookup: {
        from: "follow",
        localField: "_id",
        foreignField: "followerId",
        as: "followers",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "followers.followingId",
        foreignField: "_id",
        as: "followers",
      },
    },
    {
      $project: {
        "followers.password": 0,
      },
    },
  ];

  const foundUser = await db.collection("users").aggregate(agg).toArray();
  return foundUser[0];
};

// bagian post

// bagian follow


module.exports = {
  findAllUser,
  getUserByEmail,
  userRegister,
  userLogin,
  searchUserByUsername,
  findUserById,
};
