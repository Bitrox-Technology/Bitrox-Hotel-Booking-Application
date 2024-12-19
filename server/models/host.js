import mongoose from "mongoose";

const hostSchema = new mongoose.Schema({
    firstName: { type: String, default: "", trim: true },
    lastName: { type: String, default: "", trim: true },
    email: { type: String, trim: true, default: "", unique: true },
    countryCode: { type: String, trim: true, default: "" },
    phoneNumber: { type: String, trim: true, default: "" },
    avtar: { type: String, trim: true },
    password: { type: String, select: false },
    properties: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Property',
        },
    ],
    earning: { type: Number, default: 0 },
    booking: [
        {
            bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
            status: { type: String, enum: ["Pending", "Confirmed", "Cancelled"], default: "Pending" }
        }
    ],

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})


const Host = mongoose.model("Host", hostSchema)

export default Host;