import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../lib/mongodb';
import { Merchant, Category  } from '@/types/Category';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    await connectDB()

    const { categoryName } = req.body;

    if (!categoryName) {
        return res.status(400).json({ success: false, error: 'Invalid data' });
    }

    const category = await Category.findOne({ name: categoryName })
    
    if(!category) return res.status(400).json({ success: false, error: 'Category doesn\'t exists' });

    try {
        await Merchant.deleteMany({ categoryId: category._id })
        res.status(200).json({ success: true, message: 'Merchants are deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error });
    }

}
