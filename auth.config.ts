import type { DefaultSession, NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import prisma from "./prisma/client";
import { userRole } from "@prisma/client";
import { loginFormSchema } from "./lib/ValidationSchema";

declare module "next-auth" {
  interface Session {
    user: {
      role: userRole;
    } & DefaultSession["user"];
  }
}

export default {
  pages: {
    signIn: "/signin",
  },
  trustHost: true, //! INVESIGATE ABOUT THIS AND MAYBE YOU WILL NEED TO REMOVE THIS LINE
  callbacks: {
    async signIn({ user }) {
      if (user.id) {
        const existingUser = await prisma.user.findUnique({
          where: {
            id: +user.id,
          },
        });

        if (!existingUser?.emailVerified) return false;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const existingUser = await prisma.user.findUnique({
          where: {
            id: +user.id!,
          },
        });

        if (!existingUser) return token;

        token.id = user.id;
        token.role = existingUser.role;

        return token;
      }
      return token;
    },

    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as userRole;

      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        // VALIDATION
        const validation = loginFormSchema.safeParse(credentials);
        if (!validation.success) throw new Error("Invalid Credentials");

        //GET DATA
        const { email, password } = validation.data;

        // USE LOOKUP
        const existingUser = await prisma.user.findUnique({
          where: {
            email,
          },
          include: {
            image: true,
          },
        });
        if (!existingUser) throw new Error("Invalid Credentials");

        const isPasswordMatch = await bcrypt.compare(
          password,
          existingUser.password
        );

        if (!isPasswordMatch) throw new Error("Invalid Credentials");

        return {
          id: existingUser.id.toString(),
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
