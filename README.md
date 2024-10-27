# Twitter Clone Client

This is the client-side application for the Twitter Clone project.

A feature-rich Twitter clone built with modern web technologies such as Next.js, Prisma, GraphQL, and more. The app allows users to engage in social interactions through posts, likes, comments, follows, and much more. 

## Demo

https://github.com/user-attachments/assets/c0942adb-3c48-4b79-8ac1-b189eb7abec0

## Features

- **User Authentication**: Secure user authentication using NextAuth.js.
- **User Profiles**: Each user has a personal profile page displaying their posts and relevant information.
- **Follow/Unfollow Users**: Users can follow and unfollow each other to stay updated with posts from people they are interested in.
- **Posts**: Users can create, like, and delete posts.
- **Image Uploads**: Users can upload images as part of their posts.
- **Like System**: Engage with other users by liking their posts.
- **Recommended Users**: Explore and discover new users to follow through a recommendation system.
- **Comment System**: Users can comment on the posts.

## Technologies Used

- **Next.js**: The React framework used for building the user interface and handling server-side rendering.
- **Prisma**: A modern database ORM used to interact with the database layer.
- **GraphQL**: Used for flexible, efficient data querying and mutation.
- **React Query**: For caching and synchronizing server-state in React applications.
- **Apollo Client**: Manages GraphQL queries and mutations on the client side.
- **AWS**: Utilized for image uploads and media storage.
- **Codegen**: Provides type safety and schema synching

# Run It Locally

## Prerequisites

### Ensure you have the server-side application set up. Follow the instructions at [twitter-clone-server](https://github.com/KGLikith/twitter-clone-server).

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/KGLikith/twitter-clone-client.git
    ```

2. Navigate to the project directory:

    ```bash
    cd twitter-clone-client
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```bash
AUTH_SECRET=auth_secret
NEXT_PUBLIC_API_URL=http://localhost:8000/graphql
GOOGLE_ID=Google-cloud-client-id
GOOGLE_SECRET=Google-cloud-client-secret
```


### Add Host Name and Domain in [next.config.mjs](https://github.com/KGLikith/twitter-clone-client/blob/main/next.config.mjs) for images(ex: bucker_name.ap-south-1.amazonaws.com)

### 

## Building and Starting the application for production build

```bash
npm run build
npm start
```
