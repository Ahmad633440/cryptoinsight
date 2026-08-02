import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: String,
  coin: String, 
  coins: [
    {
      symbol: String, 
      coinId: String, // Standard coin identifier
      confidence: {
        type: String,
        enum: ["high", "medium", "low"],
        default: "medium",
      },
      score: Number, 
    },
  ],
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
    type: [Number],
    default: undefined,
  },
  isEmbedded: {
    type: Boolean,
    default: false,
  },

  // Enrichment snapshot
  priceBefore: Number,
  priceChangePercent: Number,
  impactDurationHours: Number,

  // Enrichment tracking
  isEnriched: {
    type: Boolean,
    default: false,
  },
  enrichedAt: Date,
  
  // Coin detection tracking
  coinsDetectedAt: Date, // When coins were auto-detected
  coinsDetected: {
    type: Boolean,
    default: false, // Tracks if coins array has been populated
  },
}, { timestamps: true });

// Index for efficient queries
NewsSchema.index({ coin: 1, isEnriched: 1, publishedAt: -1 });
NewsSchema.index({ coinsDetected: 1, coinsDetectedAt: 1 }); // For background worker

export default mongoose.models.News || mongoose.model("News", NewsSchema);


