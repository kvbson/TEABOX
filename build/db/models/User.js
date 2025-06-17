import mongoose, { Schema } from 'mongoose';
// User Model
const UserSchema = new Schema({
    steamId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    profileUrl: { type: String, required: true },
    avatar: { type: String },
}, { timestamps: true, _id: false });
export const User = mongoose.model('User', UserSchema);
