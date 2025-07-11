import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import UserModel from '../../types/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();

    if (req.method === 'GET') {
        const users = await UserModel.find({});
        res.status(200).json(users);
    } else  {
        const user = await UserModel.create({
            username: 'Petko',
            email: 'axf@abv.bg'
        })
        res.status(200).json(user)
    }

}
