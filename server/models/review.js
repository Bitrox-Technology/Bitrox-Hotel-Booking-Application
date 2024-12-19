import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel"},
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { 
            type: Number, 
            required: true, 
            min: 1, 
            max: 5 
        },
        comment: { 
            type: String, 
            trim: true, 
            default: "" 
        },
        createdAt: { 
            type: Date, 
            default: Date.now 
        },
        updatedAt: { 
            type: Date 
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);


const Review = mongoose.model("Review", reviewSchema);
export default Review;