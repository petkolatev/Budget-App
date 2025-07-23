import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import User from '../../../types/User'
import connectDB from '@/lib/mongodb'

await connectDB();

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const { email, password } = credentials || {}

                const user = await User.findOne({ email })
                if (!user) return null

                const isValid = await bcrypt.compare(password!, user.password)
                if (!isValid) return null
            
                return { id: user._id!.toString(), name: user.name, email: user.email }

            },
        }),
    ],

    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
})
