import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: String,
  coin: String, // DEPRECATED: Legacy single coin field, kept for backward compatibility
  coins: [
    {
      symbol: String, // e.g., "BTC", "ETH"
      coinId: String, // CoinMarketCap ID (e.g., "1" for BTC)
      confidence: {
        type: String,
        enum: ["high", "medium", "low"],
        default: "medium",
      },
      score: Number, // Detection score (0-10)
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

  // Market data snapshot (stored at enrichment time)
  priceBefore: Number,
  marketCapBefore: Number,
  volume24hBefore: Number,
  priceAfter: Number,
  priceChangePercent: Number,
  impactDurationHours: Number,

  // Enrichment tracking
  isEnriched: {
    type: Boolean,
    default: false,
  },
  enrichedAt: Date,
  priceUpdatedAt: Date,
  coinId: String, // DEPRECATED: Legacy field, kept for backward compatibility
  
  // Coin detection tracking
  coinsDetectedAt: Date, // When coins were auto-detected
  coinsDetected: {
    type: Boolean,
    default: false, // Tracks if coins array has been populated
  },
}, { timestamps: true });

// Index for efficient queries
NewsSchema.index({ coin: 1, isEnriched: 1, publishedAt: -1 });
NewsSchema.index({ priceUpdatedAt: 1 });
NewsSchema.index({ coinsDetected: 1, coinsDetectedAt: 1 }); // For background worker

export default mongoose.models.News || mongoose.model("News", NewsSchema);


