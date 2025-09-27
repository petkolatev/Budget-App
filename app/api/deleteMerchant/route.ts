import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Merchant } from "@/models/Category";
import extractErrorCode from "../../utils/extractErrorCode";

export async function DELETE(req: Request) {
  await connectDB();

  const { merchantName } = await req.json();

  if (!merchantName) {
    return NextResponse.json(
      { success: false, error: "Invalid data" },
      { status: 400 },
    );
  }

  try {
    await Merchant.deleteOne({ name: merchantName });
    return NextResponse.json(
      { success: true, message: "Merchant deleted" },
      { status: 200 },
    );
  } catch (error: unknown) {
    const errCode = extractErrorCode(error);
    return NextResponse.json({ success: false, error }, { status: errCode });
  }
}
