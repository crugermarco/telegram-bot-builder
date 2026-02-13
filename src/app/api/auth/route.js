import NextAuth from "next-auth"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import jwt from "jsonwebtoken"

export const authOptions = {
  providers: [
    // Puedes agregar GitHub, Google, etc.
    {
      id: "credentials",
      name: "Credentials",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Aquí iría la lógica de autenticación personalizada
        return null
      }
    }
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }),
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    signUp: "/register",
  },
  callbacks: {
    async session({ session, user }) {
      const signingSecret = process.env.SUPABASE_SERVICE_ROLE_KEY
      
      if (signingSecret) {
        const payload = {
          aud: "authenticated",
          exp: Math.floor(new Date(session.expires).getTime() / 1000),
          sub: user.id,
          email: user.email,
          role: "authenticated",
        }
        
        session.supabaseAccessToken = jwt.sign(payload, signingSecret)
      }
      
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }