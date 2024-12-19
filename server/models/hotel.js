import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
    hostId: { type: mongoose.Schema.Types.ObjectId, ref: "Host" },
    title: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    images: [{ type: String }],
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    pricePerNight: { type: Number, trim: true, default: 0 },

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

const Hotel = mongoose.model("Hotel", hotelSchema)

export default Hotel;