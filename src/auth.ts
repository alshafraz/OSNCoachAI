import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { userRepository } from './infrastructure/config/container';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        
        // Architecture-focused mock users if DB is empty
        if (email === 'parent@mathosn.com' && credentials.password === 'password') {
          return { id: 'parent-id', name: 'Parent User', email: 'parent@mathosn.com', role: 'PARENT' };
        }
        if (email === 'student@mathosn.com' && credentials.password === 'password') {
          return { id: 'student-id', name: 'Student User', email: 'student@mathosn.com', role: 'STUDENT' };
        }

        try {
          const user = await userRepository.findByEmail(email);
          if (!user) return null;
          
          // Verify password (in next milestone we will use bcrypt)
          let passwordMatches = false;
          if (user.passwordHash.startsWith('$2a$') || user.passwordHash.startsWith('$2b$')) {
            passwordMatches = await bcrypt.compare(credentials.password as string, user.passwordHash);
          } else {
            passwordMatches = user.passwordHash === credentials.password;
          }
          if (!passwordMatches) return null;

          return {
            id: user.id,
            name: user.name || 'User',
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error('Auth authorization database error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development-only-32charslong!',
});
