import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import { Category } from '@/types/Category';

type Data =
    | { success: true; message: string }
    | { success: false; error: string };

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    await connectDB();

    if (req.method === 'POST') {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, error: 'Invalid data' });
        }
        
        try {
            await Category.create({ name })
            res.status(200).json({ success: true, message: 'Created new category' });

        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    } else {
        res.status(405).json({ success: false, error: 'Method not allowed' });
    }
}
