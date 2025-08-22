import mongoose, { Schema, Document, model, models } from 'mongoose';

interface IMerchant {
  name: string;
  description: string;
}

export interface ICategory extends Document {
  name: string;
  merchants: IMerchant[];
}

const MerchantSchema = new Schema<IMerchant>(
  {
    name: { type: String, required: true,unique:true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  merchants: { type: [MerchantSchema] },
});

export default models.Category || model<ICategory>('Category', CategorySchema);
