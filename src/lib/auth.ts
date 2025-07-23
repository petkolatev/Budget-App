import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key'

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, SECRET_KEY)
    } catch (err) {
        return null
    }
}
