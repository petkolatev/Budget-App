import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../lib/mongodb';
import Category from '@/types/Category';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    await connectDB()

    const { categoryName, merchantName } = req.body;

    if (categoryName && merchantName) {

        try {
            const category = await Category.findOne({ name: categoryName });
            const exists = category?.merchants.some(
                (m: any) => m.name === merchantName
            );

            if (!exists) {
                res.status(404).json({ message: "Merchant doesn't exists" })
            }

            await Category.updateOne(
                { name: categoryName },
                { $pull: { merchants: { name: merchantName } } },
                { upsert: true }
            );

            res.status(200).json({ success: true, message: 'Merchant deleted' });
        } catch (error) {
            res.status(500).json({ success: false, error: error });
        }
    } else if (categoryName && !merchantName) {
        try {
            await Category.deleteOne({ name: categoryName })
            res.status(200).json({ success: true, message: 'Category deleted' });
        } catch (error) {
            res.status(500).json({ success: false, error: error });
        }
    }
}
