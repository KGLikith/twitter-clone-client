import NextAuth, { DefaultSession, type User } from "next-auth";
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config";
import { createServerApolloClient } from "./clients/serverAppoloClient";
import { verifyUserCredentialQuery } from "./graphql/query/user";
import { UserLoginSchema } from "./schema/auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  trustHost: true,
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const isValid = UserLoginSchema.safeParse(credentials);
          if (!isValid.success) {
            return null;
          }
          console.log("Credentials:", isValid.data);
          const { email, password } = isValid.data
          const client =  createServerApolloClient();
          const {data} =await client.query({
            query:verifyUserCredentialQuery,
            variables:{
              email,
              password,
            } 
          })

          console.log("Data from verifyUserCredentialQuery:", data);
          const user = data.verifyUserCredential;
          if (user) {
            return {
                id: user.id,
                email: user.email,
                token: user.token,
                profileImageUrl: user.profileImageUrl,
                name: user.name,
            } as User
          }
          return null;
        } catch (err) {
          console.error("Authorization failed:", err);
          return null;
        }
      },
    }),
  ],
});
