import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import { Category, Merchant } from '@/types/Category';


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

        if (name && merchantName) {

            try {
                const category = await Category.findOne({ name });
                if (!category) return res.status(404).json({ success: false, error: "Category doesn't exists" })

                const merchant = await Merchant.findOne({ merchantName })
                if (merchant) return res.status(200).json({ success: true, message: 'Merchant already exists' });

                await Merchant.create({
                    name: merchantName,
                    description,
                    categoryId: category._id
                });
                res.status(200).json({ success: true, message: 'Created new merchant' })

            } catch (error: unknown) {
                let errorMessage = 'Server error'

                if (error instanceof Error) {
                    errorMessage = error.message
                }
                res.status(500).json({ success: false, error: errorMessage });
            }
        } else {
            return res.status(400).json({ success: false, error: 'Invalid data' });
        }
    } else {
        res.status(405).json({ success: false, error: 'Method not allowed' });
    }
}
