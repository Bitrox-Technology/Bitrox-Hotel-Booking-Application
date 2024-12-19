import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {
        firstName: { type: String, default: "", trim: true },
        lastName: { type: String, default: "", trim: true },
        email: { type: String, trim: true, default: "", unique: true ,  lowercase: true  },
        countryCode: { type: String, trim: true, default: ""},
        phoneNumber: { type: String, trim: true, default: "" },
        avtar: {type: String, trim: true},
        location: {type: String, default: ""}, 
        role: {
            type: String,
            enum: ["ADMIN", "USER", ""],
            default: "ADMIN",
        },
        password: {
            type: String,
            select: false,
        },
        permissions:{
            type: String, default: ['manage_users', 'manage_hosts', 'manage_properties']
        },
        isEmailVerify: { type: Boolean, default: false },
        isPhoneVerify: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        refreshToken: { type: String }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

const Admin = mongoose.model("Admin", adminSchema)
export default Admin;