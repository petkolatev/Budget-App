import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Category from '../../types/Category';

type Data =
    | { success: true; message: string }
    | { success: false; error: string };

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    await connectDB();

    if (req.method === 'POST') {
        const { name, merchants } = req.body;

        if (!name || !Array.isArray(merchants)) {
            return res.status(400).json({ success: false, error: 'Invalid data' });
        }

        try {
            const result = await Category.updateOne(
                { name },
                { $addToSet: { merchants: { $each: merchants } } },
                { upsert: true }
            );

            const message = result.upsertedId
                ? 'Created new category'
                : 'Updated the exists category';

            res.status(200).json({ success: true, message });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    } else {
        res.status(405).json({ success: false, error: 'Method is not allowed' });
    }
}
