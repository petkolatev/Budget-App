import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import { authorizeUser } from '@/lib/auth/authorizeUser'
import connectDB from '@/lib/mongodb'



export default NextAuth({
    adapter: MongoDBAdapter(connectDB()),
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const { email, password } = credentials || {}

                return await authorizeUser(email!, password!)

            },
        }),
    ],

    session: {
        strategy: 'jwt',
        maxAge: 1 * 12 * 60 * 60
    },
    pages: {
        signIn: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
})
