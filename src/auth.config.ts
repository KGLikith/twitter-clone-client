import type { DefaultSession, NextAuthConfig } from "next-auth";
import { encode as defaultEncode } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    backendToken?: string;
    user?: {
      id: string;
      email: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendToken?: string;
    user?:{
      id: string;
      email: string;
    }
  }
}

export const authConfig = {
  pages: {
    signIn: "/auth/sign-in",
    signOut: "/",
    error: "/",
    newUser: "/auth/sign-up",
  },
  callbacks: {
    signIn({ user, account, profile, email, credentials }) {
      if (user) {
        return true;
      }
      return false;
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
        }
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
      if(token.user){
        session.user = {
          ...session.user,
          ...token.user
        }
      }
      return session;
    },
  },

  providers: [],
} satisfies NextAuthConfig;
