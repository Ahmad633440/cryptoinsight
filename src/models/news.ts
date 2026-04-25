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
  coinId: String, // CoinMarketCap coin ID (e.g., "1" for BTC)
}, { timestamps: true });

// Index for efficient queries
NewsSchema.index({ coin: 1, isEnriched: 1, publishedAt: -1 });
NewsSchema.index({ priceUpdatedAt: 1 });

export default mongoose.models.News || mongoose.model("News", NewsSchema);


