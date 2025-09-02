import mongoose, { Schema, Document, model, models } from 'mongoose';

interface IMerchant {
    name?: string;
    description?: string;
}

export interface ICategory extends Document {
    name: string;
    merchants: IMerchant[];
}

const MerchantSchema = new Schema<IMerchant>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
    },
    { _id: false }
);

const CategorySchema = new Schema<ICategory>({
    name: { type: String, required: true, unique: true },
    merchants: { type: [MerchantSchema], default: [] },
});

CategorySchema.index(
    { 'merchants.name': 1 },
    {
        unique: true,
        partialFilterExpression: { 'merchants.name': { $exists: true, $ne: null } }
    }
)

export default models.Category || model<ICategory>('Category', CategorySchema);
