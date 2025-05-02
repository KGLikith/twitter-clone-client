import type { DefaultSession, NextAuthConfig } from "next-auth";
import { encode as defaultEncode } from "next-auth/jwt";
import { createServerApolloClient } from "./clients/serverAppoloClient";
import {
  verifyUserCredentialQuery,
  verifyUserGoogleTokenQuery,
} from "./graphql/query/user";

declare module "next-auth" {
  interface Session {
    backendToken?: string;
    user?: {
      id: string;
      email: string;
      profileImageUrl?: string;
      name?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    token: string;
    profileImageUrl?: string;
    name?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendToken?: string;
    user?: {
      id: string;
      email: string;
      name?: string;
      profileImageUrl?: string;
    };
  }
}

export const authConfig = {
  secret: process.env.NEXT_AUTH_SECRET,

  pages: {
    signIn: "/auth/sign-in",
    signOut: "/",
    error: "/",
    newUser: "/auth/sign-up",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const client = createServerApolloClient();

        const { data } = await client.query({
          query: verifyUserGoogleTokenQuery,
          variables: {
            token: account.id_token as string,
          },
        });

        if(!data.verifyGoogleToken){
          return false;
        }

        if (data.verifyGoogleToken) {
          const {email, id, token, name, profileImageUrl } = data.verifyGoogleToken;

          user.email = email;
          user.token = token;
          user.id = id
          user.name = name;
          user.profileImageUrl = profileImageUrl as string;
          return true;
        }
        await client.resetStore();
        return false;
      }
      return true;
    },
    redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      else if (url.startsWith("/")) return new URL(url, baseUrl).toString();
      return baseUrl;
    },
    async jwt({ token, user }) {
      if (user?.token) {
        token.backendToken = user.token;
        token.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          profileImageUrl: user.profileImageUrl,
        };
      }
      return token;
    },
    authorized({ auth }) {
      return !!auth?.user;
    },
    async session({ session, token }) {
      if (token?.backendToken) {
        session.backendToken = token.backendToken;
      }
      if (token.user) {
        session.user = {
          ...session.user,
          ...token.user,
        };
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },

  providers: [],
} satisfies NextAuthConfig;
