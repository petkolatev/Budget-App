import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import {
  Category,
  CategoryType,
  Merchant,
  MerchantType,
} from "@/models/Category";

export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find().lean<CategoryType[]>();
    const merchants = await Merchant.find().lean<MerchantType[]>();

    const merchantMap = new Map<string, MerchantType[]>();
    for (const merchant of merchants) {
      const key = merchant.categoryId?.toString();
      if (!key) continue;
      if (!merchantMap.has(key)) merchantMap.set(key, []);
      merchantMap.get(key)!.push(merchant);
    }

    const formatted = categories.map((cat) => {
      const catMerchants = merchantMap.get(cat._id.toString()) || [];
      return {
        name: cat.name,
        merchants: catMerchants.map((m) => ({
          name: m.name,
          description: m.description || "",
        })),
      };
    });

    return NextResponse.json({ categories: formatted }, { status: 200 });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}
