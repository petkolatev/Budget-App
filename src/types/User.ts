import mongoose, { Schema, Document, Model } from 'mongoose';


export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
}


const UserSchema: Schema<IUser> = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: 'users',
  }
);


const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default UserModel;
