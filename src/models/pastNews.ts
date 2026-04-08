import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema({
  
title: String,
description: String,
coin: String,

date:{
   type: Date,
   default: Date.now, 
},

embedding: {
    type: [Number], //vector
},

priceBefore: Number,
priceAfter: Number,
priceChangePercent: Number,

source: String,

},{timestamps: true});

export default mongoose.models.News || mongoose.model("News", NewsSchema);