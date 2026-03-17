import { Schema, model } from 'mongoose';

export type UserDocument = {
	userId: number;
	username: string;
	name: string;
	avatar: string;
	password?: string;
};

const userSchema = new Schema<UserDocument>(
	{
		userId: { type: Number, required: true, unique: true },
		username: { type: String, required: true, unique: true, lowercase: true, trim: true },
		name: { type: String, required: true, trim: true },
		avatar: { type: String, required: true },
		password: { type: String, default: '' },
	},
	{ timestamps: true }
);

const UserModel = model<UserDocument>('User', userSchema);

export default UserModel;
