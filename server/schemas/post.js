const { GraphQLError } = require("graphql");
const {
  findPosts,
  findPostsById,
  createPosts,
  addComment,
  addLike,
} = require("../models/post");
const redis = require("../config/redis");
const { ObjectId } = require("mongodb");

const postTypeDefs = `#graphql
  type Post { 
    content: String
    tags: [String]
    imgUrl: String
    authorId: ID
    comments: [Comment]
    likes: [Like]
    createdAt: String
    updatedAt: String
    author: User
  }

  type Comment {
    content: String
    username: String
    createdAt: String
    updatedAt: String
  }

  type Like {
    username: String
    createdAt: String
    updatedAt: String
  }

  type Query {
    ShowPost: [Post]
    GetPostById(PostId: ID): Post
  }

  type Mutation {
    AddPost(content: String!, tags:[String],imgUrl: String): AddPostResponse
    LikePost(_id: ID!): UpdateResponse
    CommentPost(_id: ID!, content: String): UpdateResponse
  }

`;

const postResolvers = {
  Query: {
    ShowPost: async (_, __, contextValue) => {
      await contextValue.auth();
      const allPosts = await findPosts();

      return allPosts;
    },

    GetPostById: async (_, args, contextValue) => {
      await contextValue.auth();
      const { PostId } = args;

      if (!PostId) {
        throw new GraphQLError("PostId is required", {
          extensions: {
            code: "NOT_FOUND",
            http: { status: 400 },
          },
        });
      }

      const data = await findPostsById(new ObjectId(PostId)); 

      if (!data) {
        throw new GraphQLError("Post not found", {
          extensions: {
            code: "BAD_REQUEST",
            http: { status: 404 },
          },
        });
      }

      return data;
    },
  },

  // Mutation: {
  //   addPost: async (_, args, contextValue) => {
  //     const { content, tags, imgUrl } = args;
  //     const { id: authorId } = await contextValue.auth();

  //     const newPost = {
  //       content,
  //       tags,
  //       imgUrl,
  //       authorId,
  //       comments: [],
  //       likes: [],
  //       createdAt: new Date().toISOString(),
  //       updatedAt: new Date().toISOString(),
  //     };

  //     const result = await createPosts(newPost);

  //     return {
  //       statusCode: 200,
  //       message: `Post with id ${result.insertedId} created successfully`,
  //       data: newPost,
  //     };
  //   },
  // },

  Mutation: {
    AddPost: async (_, args, context) => {
      const { content, tags, imgUrl } = args;
      const loginInfo = await context.auth();
      const authorId = loginInfo.userId;
      const author = loginInfo.username;

      // console.log(authorId,"dapat ga si kamu dari tadi aku nayriiin ini doang");z

      if (!content) {
        throw new GraphQLError("Content is required", {
          extensions: {
            code: "BAD_REQUEST",
            http: { status: 400 },
          },
        });
      }

      const data = await createPosts({
        content,
        tags,
        imgUrl,
        authorId,
        author,
      });
      // console.log(data,"ini data yang mau di post");

      await redis.del("data:posts");

      return {
        statusCode: 201,
        message: "Success create post",
        data,
      };
    },

    LikePost: async (_, args, context) => {
      const { _id } = args;
      const loginInfo = await context.auth();
      console.log(loginInfo, "<<<<login info");

      const username = loginInfo.username;

      const post = await findPosts({ _id });
      if (!post) {
        throw new GraphQLError("Post not found", {
          extensions: {
            code: "NOT_FOUND",
            http: { status: 404 },
          },
        });
      }

      await addLike(_id, username);
      await redis.del("data:posts");

      return {
        statusCode: 201,
        message: "Successfully added Like to Post",
      };
    },

    CommentPost: async (_, args, context) => {
      const { _id, content } = args;
      const loginInfo = await context.auth();
      const username = loginInfo.username;

      if (!content) {
        throw new GraphQLError("Comment content is required", {
          extensions: {
            code: "BAD_REQUEST",
            http: { status: 400 },
          },
        });
      }

      const post = await findPosts({ _id });
      if (!post) {
        throw new GraphQLError("Post not found", {
          extensions: {
            code: "NOT_FOUND",
            http: { status: 404 },
          },
        });
      }

      await addComment({ _id, content, username });
      await redis.del("data:posts");

      return {
        statusCode: 201,
        message: "Comment sent",
      };
    },
  },
};

module.exports = {
  postTypeDefs,
  postResolvers,
};
