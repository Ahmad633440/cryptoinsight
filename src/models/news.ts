import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema({
  
title: {
    type: String,
    required: true,
},
content: String,
coin: String,
category: String,
source: String,

sentiment: String,

publishedAt: Date,
url: {
    type: String, 
    required: true,
    unique: true,
},

embedding: {
    type: [Number], //vector
    default: undefined,
},
isEmbedded: {
    type: Boolean,
    default: false,
},


priceBefore: Number,
priceAfter: Number,
priceChangePercent: Number,
impactDurationHours: Number, // 24h, 48h, etc


},{timestamps: true});

export default mongoose.models.News || mongoose.model("News", NewsSchema);


