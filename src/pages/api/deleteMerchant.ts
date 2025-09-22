import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../lib/mongodb";
import { Merchant } from "@/types/Category";
import extractErrorCode from "@/utils/extractErrorCode";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  await connectDB();

  const { merchantName } = req.body;

  if (!merchantName) {
    return res.status(400).json({ success: false, error: "Invalid data" });
  }

  try {
    await Merchant.deleteOne({ name: merchantName });
    res.status(200).json({ success: true, message: "Merchant deleted" });
  } catch (error: unknown) {
    const errCode = extractErrorCode(error);
    res.status(errCode).json({ success: false, error: error });
  }
}
