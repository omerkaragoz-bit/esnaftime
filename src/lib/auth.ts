import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { getDb } from "./db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "esnaftime-super-secret-key-change-in-production-12509788",
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID || "203482802445-390fern1leqcut1ql9d7mrj3iu081ir8.apps.googleusercontent.com",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const sql = getDb();
      const existing = await sql`SELECT id, role FROM users WHERE email = ${user.email!}`;
      if (existing.length === 0) {
        await sql`
          INSERT INTO users (name, email, avatar_url, verified, role)
          VALUES (${user.name!}, ${user.email!}, ${user.image || null}, true, 'student')
        `;
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user?.email) {
        const sql = getDb();
        const rows = await sql`SELECT id, role FROM users WHERE email = ${user.email}`;
        if (rows.length > 0) {
          token.userId = rows[0].id;
          token.role = rows[0].role;
        }
      }
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
});