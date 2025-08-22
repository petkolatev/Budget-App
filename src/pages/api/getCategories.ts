import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Category, { ICategory } from '../../types/Category';

type Data =
    | { success: true; categories: ICategory[] }
    | { success: false; error: string };

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    await connectDB();

    if (req.method === 'GET') {
        try {
            const categories = await Category.find({});
            res.status(200).json({ success: true, categories });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    } else {
        res.status(405).json({ success: false, error: 'Method is not allowed' });
    }
}
