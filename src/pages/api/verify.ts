import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyToken } from '../../lib/auth'
import { JwtPayload } from 'jsonwebtoken'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { token } = req.body
  const decodedToken = verifyToken(token)

  if (decodedToken) {
    return res.status(200).json({ valid: true, email: (decodedToken as JwtPayload).email, name: (decodedToken as JwtPayload).name })
  } else {
    return res.status(401).json({ valid: false })
  }
}
