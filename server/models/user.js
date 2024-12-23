import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, default: "", trim: true },
        lastName: { type: String, default: "", trim: true },
        email: { type: String, trim: true, default: "", unique: true,  lowercase: true  },
        countryCode: { type: String, trim: true },
        phone: { type: String, trim: true },
        location: { type: String, default: "" },
        role: {
            type: String,
            enum: ["ADMIN", "USER", ""],
            default: "USER",
        },
        password: {
            type: String,
            select: false,
        },

        isProfileComplete: { type: Boolean, default: false },
        isEmailVerify: { type: Boolean, default: false },
        isPhoneVerify: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        ProfileCompleteAt: { type: Date, default: null },
        refreshToken: { type: String, select: false}

    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

const User = mongoose.model("User", userSchema)
export default User;