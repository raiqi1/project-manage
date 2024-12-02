import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "../../../../lib/prisma"; // Sesuaikan path prisma Anda
import jwt from "jsonwebtoken";

// Extend session untuk menambahkan akses token
declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt", // Gunakan JWT untuk session
  },
  callbacks: {
    async signIn({ user, account }) {
      // Mencari pengguna di database berdasarkan email
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
      });

      if (!existingUser) {
        // Jika user belum ada di database, buat user baru
        const newUser = await prisma.user.create({
          data: {
            email: user.email!,
            username: user.name!,
            image: user.image,
            provider: account?.provider!,
            providerAccountId: account?.providerAccountId!,
            password: "defaultPassword", // Provide a default password
          },
        });

        // Gunakan `id` dari user baru
        user.id = newUser.userId.toString();
      } else {
        // Jika sudah ada, gunakan `id` dari database
        user.id = existingUser.userId.toString();
      }

      return true; // Izinkan proses sign in
    },

    async jwt({ token, user }) {
      // Jika user baru login, tambahkan `id` dari database ke token
      if (user) {
        token.id = user.id; // ID dari database
        token.email = user.email;

        // Buat JWT standar untuk digunakan di backend
        const jwtToken = jwt.sign(
          { userId: user.id, email: user.email }, // Payload dari database
          process.env.JWT_SECRET!, // Secret key JWT
          { expiresIn: "1h" } // Masa berlaku token
        );

        token.accessToken = jwtToken; // Simpan JWT ke token
      }
      console.log("token jwt google",token)
      return token;
    },

    async session({ session, token }) {
      // Simpan `userId` dan JWT ke dalam session
      session.user.id = token.id as string;
      session.accessToken = token.accessToken as string; // JWT token
      console.log("session",session)
      return session;
    },
  },
});

export { handler as GET, handler as POST };
