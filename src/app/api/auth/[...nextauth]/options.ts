import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import connectdb from "@/lib/connectdb";
import UserModel from "@/models/user.model";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any): Promise<any> {
        try {
          await connectdb()
          const user = await UserModel.findOne({ email: credentials.email })
          if (!user) {
            throw new Error("User not found")
          }
          if (!user.isVerified) {
            throw new Error("User not verified")
          }
          const passwordMatch = await bcrypt.compare(credentials.password, user.password)
          if (!passwordMatch) {
            throw new Error("Incorrect Password")
          }
          return user
        } catch (error: any) {
          throw new Error(error)
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString()
        token.username = user.username
        token.email = user.email
        token.isVerified = user.isVerified
        token.isAcceptingMessages = user.isAcceptingMessages
      }
      return token
    },
    async session({ session, token }) {
      if(token){
        session.user._id = token._id
        session.user.username = token.username
        session.user.email = token.email
        session.user.isVerified = token.isVerified
        session.user.isAcceptingMessages = token.isAcceptingMessages
      }
      return session
    },
  },
  pages: {
    signIn: '/signin',
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
}

