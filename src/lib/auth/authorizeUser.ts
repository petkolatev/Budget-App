import { compare } from 'bcrypt'
import User from '../../types/User'

export async function authorizeUser(email: string, password: string) {

    const user = await User.findOne({ email })
    if (!user) return null

    const isValid = await compare(password, user.password)
    return isValid ? { id: user._id!.toString(), name: user.name, email: user.email } : null
}