import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../lib/mongodb";
import { Category, Merchant, MerchantType } from "@/types/Category";
import extractErrorCode from "@/utils/extractErrorCode";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  await connectDB();

  const { categoryName } = req.body;

  if (!categoryName) {
    return res.status(400).json({ success: false, error: "Invalid data" });
  }
  const category = await Category.findOne({ name: categoryName });
  const merchants = await Merchant.find().lean<MerchantType[]>();
  const catMerchants = merchants.filter((m) => {
    if (!m.categoryId) return false;
    return m.categoryId.equals(category?._id);
  });

  if (catMerchants.length > 0) {
    return res
      .status(405)
      .json({ error: "You can't delete category with merchants" });
  }

  try {
    await Category.deleteOne({ name: categoryName });
    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error: unknown) {
    const errCode = extractErrorCode(error);
    res.status(errCode).json({ success: false, error: error });
  }
}
