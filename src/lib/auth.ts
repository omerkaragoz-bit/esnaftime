import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { getDb } from "./db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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