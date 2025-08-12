import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface ICategory {
  _id: string
  name: string
  merchants: string[]
}

export interface ICategory extends Document {
  name: string
  merchants: string[]
}


const CategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  merchants: [{ type: String }],
});

export default models.Category || model<ICategory>('Category', CategorySchema);
