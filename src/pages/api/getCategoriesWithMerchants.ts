import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import { Category, CategoryType, Merchant, MerchantType } from "@/types/Category";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        await connectDB();

        const categories = await Category.find().lean<CategoryType[]>();
        const merchants = await Merchant.find().lean<MerchantType[]>();
        const formatted = categories.map((cat) => {
            const catMerchants = merchants.filter((m) => {
                if (!m.categoryId) return false;
                return m.categoryId.equals(cat._id);
            });
            return {
                name: cat.name,
                merchants: catMerchants.map((m) => ({
                    name: m.name,
                    description: m.description || "",
                })),
            };
        });

        res.status(200).json({ categories: formatted });
    } catch (err) {
        console.error("API error:", err);
        res.status(500).json({ error: "Failed to fetch categories" });
    }
}
