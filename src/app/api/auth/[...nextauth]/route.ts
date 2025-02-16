/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleAuthProvider from 'next-auth/providers/google';

const allowedEmails = ['sofyanegil@gmail.com'];

const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 1 * 1 * 60 * 60, // 1 hour
  },
  jwt: {
    maxAge: 1 * 1 * 60 * 60, // 1 hour
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleAuthProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Only allow users with specified emails
      if (user.email && allowedEmails.includes(user.email)) {
        return true;
      }
      return false;
    },
    async jwt({ token, account, user }: any) {
      if (account?.provider === 'google') {
        token.email = user.email;
        token.fullname = user.name;
        token.role = 'user';
      }
      return token;
    },
    async session({ session, token }: any) {
      session.email = token.email;
      session.fullname = token.fullname;
      session.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
