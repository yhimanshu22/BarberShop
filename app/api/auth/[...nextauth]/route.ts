import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        accessToken: { label: "Access Token", type: "text" },
      },
      async authorize(credentials) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
          })

          const data = await response.json()

          if (response.ok && data) {
            return {
              id: data.user_id.toString(),
              name: data.full_name,
              email: data.email,
              role: data.role,
              accessToken: data.access_token
            }
          }
          return null
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.accessToken = user.accessToken
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string
        session.user.accessToken = token.accessToken as string
      }
      return session
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 