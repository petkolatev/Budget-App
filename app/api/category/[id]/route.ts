import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Category, Merchant } from "@/models/Category";
import typeErrorMessage from "../../../utils/typeErrorMessage";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  await connectDB();

  try {
    const merchantsUsingCategory = await Merchant.find({ categoryId: id });

    if (merchantsUsingCategory.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "You can't delete category with merchant",
        },
        { status: 400 },
      );
    }

    await Category.findByIdAndDelete(id);
    return NextResponse.json(
      { success: true, message: "Category deleted" },
      { status: 200 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: typeErrorMessage(error) },
      { status: 500 },
    );
  }
}
