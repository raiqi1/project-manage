import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

declare module "next-auth" {
  interface Session {
    accessToken? : string
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      const cekUser = await prisma.user.findUnique({
        where: { email: user.email || "" },
      });
      if (!cekUser) {
        const userBaru = await prisma.user.create({
          data: {
            email: user.email || "",
            username: user.name || "",
            image: user.image,
            password: "defaultPassword",
          },
        });
        user.id = userBaru.userId.toString();
      } else {
        user.id = cekUser.userId.toString();
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        const jwtTokenStandard = jwt.sign(
          {
            userId: user.id,
            email: user.email,
          },
          process.env.JWT_SECRET || "",
          {
            expiresIn: "1h",
          },
        );
        token.accessToken = jwtTokenStandard;
      }
      return token;
    },
    async session({ session, token }) {
      // simpan userId dan Jwt token untuk session yg akan dipaggil useSession atau getSession
      session.user.id = token.id as string;
      session.accessToken = token.accessToken as string;

      return session;
    },
  },
});

export { handler as GET, handler as POST };
