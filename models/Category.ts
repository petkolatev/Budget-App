import mongoose, { Types } from "mongoose";

export interface CategoryType {
    _id: Types.ObjectId;
    name: string;
}

export interface MerchantType {
    _id: Types.ObjectId;
    name: string;
    description?: string;
    categoryId?: Types.ObjectId;
}

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
});

const MerchantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
});

export const Category =
    mongoose.models.Category || mongoose.model("Category", CategorySchema);
export const Merchant =
    mongoose.models.Merchant || mongoose.model("Merchant", MerchantSchema);
