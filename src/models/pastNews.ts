import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema({
  
title: String,
description: String,
coin: String,
category: String,

date:{
   type: Date,
},

embedding: {
    type: [Number], //vector
},

priceBefore: Number,
priceAfter: Number,
priceChangePercent: Number,
impactDurationHours: Number, // 24h, 48h, etc

source: String,

},{timestamps: true});

export default mongoose.models.News || mongoose.model("News", NewsSchema);


