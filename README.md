# Twitter Clone Client

This is the client-side application for the Twitter Clone project.

https://github.com/user-attachments/assets/650b719f-afdc-4a2f-9e35-9c6e4d73f607

## Prerequisites

- Ensure you have the server-side application set up. Follow the instructions at [twitter-clone-server](https://github.com/KGLikith/twitter-clone-server).

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

## Building and Starting the application

```bash
npm run codegen
```

```bash
npm run build
npm start
```
