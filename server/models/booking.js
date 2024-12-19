import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    hostId: { type: mongoose.Schema.Types.ObjectId, ref: "Host" },
    checkInDate: { type: Date },
    checkOutDate: { type: Date },

    guests: { type: Number, default: 0 },
    totalAmount: { typeNumber, default: 0 },
    paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Failed'], default: 'Pending' },
    bookingStatus: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

const Booking = mongoose.model("Booking", bookingSchema)

export default Booking