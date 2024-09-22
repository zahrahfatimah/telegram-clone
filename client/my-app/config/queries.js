import { gql } from "@apollo/client";

export const DO_LOGIN = gql`
  mutation Mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      data {
        token
      }
    }
  }
`;

export const DO_REGISTER = gql`
  mutation Mutation(
    $name: String
    $email: String!
    $username: String
    $password: String!
  ) {
    register(
      name: $name
      email: $email
      username: $username
      password: $password
    ) {
      data {
        name
        username
        email
      }
    }
  }
`;

export const ADD_POST = gql`
  mutation Mutation($content: String!, $tags: [String], $imgUrl: String) {
    AddPost(content: $content, tags: $tags, imgUrl: $imgUrl) {
      data {
        content
        tags
        imgUrl
        authorId
        createdAt
        updatedAt
        likes {
          username
          createdAt
          updatedAt
        }
        comments {
          content
          username
          createdAt
          updatedAt
        }
        author {
          username
        }
      }
    }
  }
`;

export const GET_POST = gql`
  query Query {
    ShowPost {
      content
      tags
      imgUrl
      authorId
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      author {
        name
        username
        email
      }
    }
  }
`;

export const GET_POST_BY_ID = gql`
  query Query($postId: ID) {
    ShowPost {
      content
      tags
      imgUrl
      authorId
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      author {
        name
        username
        email
      }
    }
    GetPostById(PostId: $postId) {
      data {
        content
        tags
        imgUrl
        authorId
        comments {
          content
          username
          createdAt
          updatedAt
        }
        likes {
          username
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        author {
          name
          username
          email
        }
      }
    }
  }
`;

export const GET_USER_BY_USERNAME = gql`
  query Query($username: String) {
    searchUser(username: $username) {
      name
      email
      username
    }
  }
`;

export const GET_ALL_USERS = gql`
  query Query {
    getAllUsers {
      name
      username
      email
      password
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query Query($getUserByIdId: ID!) {
    getUserById(id: $getUserByIdId) {
      data {
        name
        username
        email
      }
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation Mutation($id: ID!, $content: String) {
    CommentPost(_id: $id, content: $content) {
      message
    }
  }
`;
