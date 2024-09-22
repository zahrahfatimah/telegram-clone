const { getDB } = require("../config/config");
const { GraphQLError } = require("graphql");
const { ObjectId } = require("mongodb");
const redis = require('../config/redis')

const findPosts = async () => {
  const db = await getDB();

  const postsCache = await redis.get('posts')
  if(postsCache){
    return JSON.parse(postsCache)
  }

  const aggregate = [
    {
      $lookup: {
        from: "users",
        localField: "authorId",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $project: { "author.password": 0 },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $unwind: {
        path: "$author",
      },
    },
  ];

  const posts = await db.collection("posts").aggregate(aggregate).toArray();

  if (!posts) {
    throw new GraphQLError("Post not found", {
      extensions: {
        http: { status: 404 },
      },
    });
  }
  redis.set('posts', JSON.stringify(posts))
  return posts
};

const findPostsById = async (_id) => {
  const db = await getDB();

  const post = await db.collection("posts").findOne({ _id: new ObjectId(_id) });
  if (!post) {
    throw new GraphQLError("Post not found", {
      extensions: {
        http: { status: 404 },
      },
    });
  }

  return post;
};


const createPosts = async ({ content, tags, imgUrl, authorId }) => {
  const db = getDB();

  // const collection = await db.collection("posts");

  const { insertedId } = await db.collection("posts").insertOne({
    content,
    tags,
    imgUrl,
    authorId: new ObjectId(authorId),
    comments: [],
    likes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const newPost = await db
    .collection("posts")
    .findOne({ _id: new ObjectId(insertedId) });
  console.log(newPost);
  return {
    _id: newPost._id,
    content: newPost.content,
    tags: newPost.tags,
    imgUrl: newPost.imgUrl,
    authorId: newPost.authorId,
    comments: newPost.comments,
    likes: newPost.likes,
    createdAt: newPost.createdAt.toISOString(),
    updatedAt: newPost.updatedAt.toISOString(),
  };
};

const addLike = async (_id, username) => {
  const db = getDB();

  await db.collection("posts").updateOne(
    { _id: new ObjectId(_id) },
    {
      $push: {
        likes: {
          username,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    }
  );
};

const addComment = async ({ _id, content, username }) => {
  const db = getDB();

  // const collection = await db.collection("posts");
  await db.collection("posts").updateOne(
    { _id: new ObjectId(_id) },
    {
      $push: {
        comments: {
          username,
          content,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    }
  );
};

module.exports = {
  findPosts,
  findPostsById,
  createPosts,
  addLike,
  addComment,
};
