import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Category, Merchant } from "@/models/Category";
import typeErrorMessage from "../../utils/typeErrorMessage";
import extractErrorCode from "../../utils/extractErrorCode";

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
