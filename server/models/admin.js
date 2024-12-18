import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {
        firstName: { type: String, default: "", trim: true },
        lastName: { type: String, default: "", trim: true },
        email: { type: String, trim: true, default: "" },
        countryCode: { type: String, trim: true },
        phoneNumber: { type: String, trim: true },
        avtar: {type: String, trim: true},
        location: {type: String, default: ""}, 
        role: {
            type: String,
            enum: ["ADMIN", "USER", ""],
            default: "",
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

    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

const Admin = mongoose.model("Admin", adminSchema)
export {
    Admin
}