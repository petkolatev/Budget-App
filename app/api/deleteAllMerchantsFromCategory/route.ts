import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Merchant, Category } from "@/models/Category";

export async function DELETE(req: Request) {
  await connectDB();

  const { categoryName } = await req.json();

  if (!categoryName) {
    return NextResponse.json(
      { success: false, error: "Invalid data" },
      { status: 400 },
    );
  }

  const category = await Category.findOne({ name: categoryName });

  if (!category) {
    return NextResponse.json(
      { success: false, error: "Category doesn't exist" },
      { status: 400 },
    );
  }

  try {
    await Merchant.deleteMany({ categoryId: category._id });
    return NextResponse.json(
      { success: true, message: "Merchants are deleted" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
