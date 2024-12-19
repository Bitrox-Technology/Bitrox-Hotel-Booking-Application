import mongoose from "mongoose";

const subAdminSchema = new mongoose.Schema(
    {
        firstName: { type: String, trim: true, default: "" },
        lastName: { type: String, trim: true, default: "" },
        email: { type: String, trim: true, unique: true, lowercase: true, default: "" },
        countryCode: { type: String, trim: true, default: "" },
        phoneNumber: { type: String, trim: true, default: "" },
        avatar: { type: String, trim: true, default: "" },
        role: {
            type: String,
            enum: ["SUBADMIN"],
            default: "SUBADMIN",
        },
        password: { type: String, select: false },
        permissions: { type: [String], default: [] },
        isEmailVerified: { type: Boolean, default: false },
        isPhoneVerified: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const SubAdmin = mongoose.model("SubAdmin", subAdminSchema);
export default SubAdmin;