import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Host"
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property"
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    },
    status: {
        type: String,
        enum: ["Pending", "Approval", "Rejected"],
        default: "Pending"
    },
    rejectionReason: { type: String}

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})


const Verification = mongoose.model("Verification", verificationSchema)

export default Verification;