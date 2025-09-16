import bcrypt from 'bcrypt'
import connectDB from "@/lib/mongodb";
import User from "@/types/User";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end()
    }
    const { name, email, password, rePassword } = req.body
    if (password !== rePassword) {
        return res.status(400).json({ error: 'Password mismatch' })
    }

    await connectDB()
    const user = await User.findOne({ email })
    if (user) {
        return res.status(409).json({ error: 'User already exists' })
    }

    try {
        const salt = 10
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = await User.create({ email, name, password: hashedPassword })
        res.status(201).json({ user: newUser })
    } catch (error) {
        res.status(500).json({ error: error })
    }
}