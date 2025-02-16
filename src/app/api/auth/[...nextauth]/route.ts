/* eslint-disable @typescript-eslint/no-explicit-any */
import { storeDataUser } from '@/services/firebase';
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleAuthProvider from 'next-auth/providers/google';

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
    async jwt({ token, account, user }: any) {
      if (account?.provider === 'google') {
        const userData: any = await storeDataUser(user);
        token.email = userData.email;
        token.name = userData.name;
        token.role = userData.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
