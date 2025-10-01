import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Category } from "@/models/Category";
import typeErrorMessage from "../../utils/typeErrorMessage";

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();
  const { name } = body;

  if (!name) {
    return NextResponse.json(
      { success: false, error: "Invalid data" },
      { status: 400 },
    );
  }

  try {
    await Category.create({ name });
    return NextResponse.json(
      { success: true, message: "Created new category" },
      { status: 200 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: typeErrorMessage(error) },
      { status: 500 },
    );
  }
}
