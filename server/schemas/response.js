const responseTypeDefs = `#graphql
  interface Response {
    statusCode: String
    message: String
    error: String
  }

  type UserLoginData {
    token: String
  }

  type UserLoginResponse {
    statusCode: String
    message: String
    error: String
    data: UserLoginData
  }

  type UserResponse implements Response {
    statusCode: String
    message: String
    error: String
    data: User
    
  }

  type UserWithoutPasswordResp implements Response {
    statusCode: String
    message: String
    error: String
    data: UserWithoutPassword
  }

  
  type PostResponse implements Response {
    statusCode: String
    message: String
    error: String
    data: Post
  }

  
  type AddPostResponse {
    statusCode: Int
    message: String
    data: Post
  }

  type ShowPostResponse {
    statusCode: Int
    message: String
    data: [Post]
  }

  type UpdateResponse {
    statusCode: Int
    message: String
  }

  type PostByIdResponse {
    statusCode: Int
    data: Post
  }

  type FollowResponse {
    statusCode: Int
    message: String
  }
  
`;

module.exports = {
  responseTypeDefs
}