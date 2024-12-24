import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
    hostId: { type: mongoose.Schema.Types.ObjectId, ref: "Host" },
    title: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    propertyType: {
        type: String,
        enum: ["Beach", "Hotel", "Villa", "Appartment"]
    },
    images: [{ type: String }],
    location: {
        address: {
            line1: { type: String },
            line2: { type: String },
            city: { type: String },
            state: { type: String },
            country: { type: String },
            zipCode: { type: String },
        },
        mapCoordinates: {
            type: { type: String, default: "Point" },
            coordinates: [Number], // [longitude, latitude]
        },
    },
    amenities: {
        kitchen: { type: Boolean, default: false },
        wifi: { type: Boolean, default: false },
        parking: { type: Boolean, default: false },
        accessibility: { type: Boolean, default: false },

    },
    pricing: {
        pricePerNight: { type: Number, default: 0 },
        weeklyDiscount: { type: Number, default: 0}
    },

    status: {
        type: String,
        enum: ["Available", "Unavailable"],
        default: "Available"
    },
    bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking"
    }]


}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

const Property = mongoose.model("Property", propertySchema)

export default Property;