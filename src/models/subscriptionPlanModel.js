import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const SubscriptionPlan = new mongoose.Schema({
    
    subscriptionPlanId: {
        type: String,
        default: uuidv4,
        unique: true,
      },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        trim: true,
    },
    peak1: {
        type: String,
        trim: true,
        required: true,
        max: 32
    },
    peak2: {
        type: String,
        trim: true,
        required: true,
        max: 32
    },
    peak3: {
        type: String,
        trim: true,
        required: true,
        max: 32
    },
})

export default mongoose.model("Spiciy_Subscription_Plan", SubscriptionPlan);
