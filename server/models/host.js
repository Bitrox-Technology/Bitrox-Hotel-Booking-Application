import mongoose from "mongoose";

const hostSchema = new mongoose.Schema({
    firstName: { type: String, default: "", trim: true },
    lastName: { type: String, default: "", trim: true },
    email: { type: String, trim: true, default: "", unique: true },
    countryCode: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    avatar: { type: String, trim: true },
    role: {
        type: String,
        enum: ["HOST"],
        default: "HOST",
    },
    password: { type: String, select: false },
    address: {
        line1: { type: String, trim: true },
        line2: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        country: { type: String, trim: true },
        zipCode: { type: String, trim: true },
    },
    bankDetails: {
        bankName: { type: String },
        accountHolderName: { type: String },
        branchName: { type: String },
        bankCode: { type: String }
    },
    documents: [
        {
            name: { type: String },
            frontImage: { type: String },
            backImage: { type: String },
            expiryDate: { type: Date }
        }
    ],
    accountStatus: {
        type: String,
        enum: ["Pending", "Verified", "Rejected"],
        default: "Pending"
    },
    isProfileComplete: { type: Boolean, default: false },
    isEmailVerify: { type: Boolean, default: false },
    isPhoneVerify: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    refreshToken: { type: String, select:false }

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})


const Host = mongoose.model("Host", hostSchema)

export default Host;