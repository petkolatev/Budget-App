import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import typeErrorMessage from "../../utils/typeErrorMessage";
import extractErrorCode from "../../utils/extractErrorCode";
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
        categoryId: cat._id,
        merchants: catMerchants.map((m) => ({
          name: m.name,
          merchantId: m._id,
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

export async function POST(req: Request) {
  await connectDB();

  const { name, merchantName, description } = await req.json();

  if (!name || !merchantName) {
    return NextResponse.json(
      { success: false, error: "Invalid data" },
      { status: 400 },
    );
  }

  try {
    const category = await Category.findOne({ name });
    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category doesn't exist" },
        { status: 404 },
      );
    }

    const merchant = await Merchant.findOne({ merchantName });
    if (merchant) {
      return NextResponse.json(
        { success: true, message: "Merchant already exists" },
        { status: 200 },
      );
    }

    await Merchant.create({
      name: merchantName,
      description,
      categoryId: category._id,
    });

    return NextResponse.json(
      { success: true, message: "Created new merchant" },
      { status: 200 },
    );
  } catch (error: unknown) {
    const errCode = extractErrorCode(error);
    return NextResponse.json(
      { success: false, error: typeErrorMessage(error) },
      { status: errCode },
    );
  }
}

export async function PUT(req: Request) {
  await connectDB();
  const { categoryId } = await req.json();

  if (!categoryId) {
    return NextResponse.json(
      { success: false, error: "Missing category ID" },
      { status: 400 },
    );
  }

  try {
    const merchants = await Merchant.find({ categoryId });

    if (merchants.length === 0) {
      return NextResponse.json(
        { success: false, error: "No merchants found in this category" },
        { status: 404 },
      );
    }

    await Merchant.deleteMany({ categoryId });
    return NextResponse.json(
      { success: true, message: "All merchants are deleted from category" },
      { status: 200 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: typeErrorMessage(error) },
      { status: 500 },
    );
  }
}
