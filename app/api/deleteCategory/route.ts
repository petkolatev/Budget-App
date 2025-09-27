import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Category, Merchant } from "@/models/Category";
import extractErrorCode from "../../utils/extractErrorCode";
import typeErrorMessage from "@/app/utils/typeErrorMessage";

export async function DELETE(req: Request) {
  await connectDB();

  const { categoryName } = await req.json();

  if (!categoryName || typeof categoryName !== "string") {
    return NextResponse.json(
      { success: false, error: "Invalid data" },
      { status: 400 },
    );
  }

  const category = await Category.findOne({ name: categoryName });
  if (!category) {
    return NextResponse.json(
      { success: false, error: "Category not found" },
      { status: 404 },
    );
  }

  const catMerchants = await Merchant.find({ categoryId: category._id }).lean();
  if (catMerchants.length > 0) {
    return NextResponse.json(
      { success: false, error: "Can't delete category with merchants" },
      { status: 409 },
    );
  }

  try {
    await Category.deleteOne({ _id: category._id });
    return NextResponse.json(
      { success: true, message: "Category deleted" },
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
