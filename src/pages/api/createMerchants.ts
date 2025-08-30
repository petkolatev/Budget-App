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
        const { name, merchantName, description } = req.body;

        if (name && merchantName && description) {

            try {
                const category = await Category.findOne({ name });

                const exists = category?.merchants.some(
                    (m: any) => m.name === merchantName
                );

                if (exists) {
                    return res.status(200).json({ success: true, message: 'Merchant already exists in category' });
                }

                const result = await Category.updateOne(
                    { name },
                    { $push: { merchants: { name: merchantName, description } } },
                    { upsert: true }
                );

                const message = result.upsertedId
                    ? 'Created new category'
                    : 'Updated existing category';

                res.status(200).json({ success: true, message });

            } catch (error: any) {
                res.status(500).json({ success: false, error: error.message });
            }
        } else {
            return res.status(400).json({ success: false, error: 'Invalid data' });
        }
    } else {
        res.status(405).json({ success: false, error: 'Method not allowed' });
    }
}
