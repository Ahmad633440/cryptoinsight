import { SimilarNewsResult } from "@/data/types";
import News from "@/models/news";



/**
 * Finds similar news articles based on vector similarity
 * Uses MongoDB Atlas Vector Search with cosine similarity
 * 
 * @param newsId - The MongoDB ID of the news article to find similar articles for
 * @returns Array of similar news articles (max 5) sorted by similarity score
 * @throws Error if database operation fails
 */
export const findSimilarNews = async (
  newsId: string
): Promise<SimilarNewsResult[]> => {
  // Validate newsId format (MongoDB ObjectId)
  if (!newsId || typeof newsId !== "string" || newsId.trim() === "") {
    throw new Error("Invalid news ID provided");
  }

  // Convert string ID to MongoDB ObjectId
  let objectId: any;
  try {
    objectId = new (await import("mongoose")).Types.ObjectId(newsId);
  } catch {
    throw new Error("Invalid MongoDB ID format");
  }

  // Fetch the source news article
  const sourceNews = await News.findById(objectId);

  if (!sourceNews) {
    throw new Error("News article not found");
  }

  // Edge case: if news has no embedding or empty embedding
  if (
    !sourceNews.embedding ||
    !Array.isArray(sourceNews.embedding) ||
    sourceNews.embedding.length === 0
  ) {
    return [];
  }

  // Build filter based on coin field
  // If coin exists → filter by same coin (market-specific)
  //           If no coin → no filter (market-wide news)
  const filterCondition = sourceNews.coin
    ? { coin: sourceNews.coin }
    : {};

  try {
    // MongoDB Atlas Vector Search aggregation pipeline
    const results = await News.aggregate([
      {
        // Vector search stage - finds closest vectors in embedding space
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: sourceNews.embedding,
          numCandidates: 100, // Evaluate top 100 candidates for performance
          limit: 5, // Return max 5 results
          filter: filterCondition, // Apply coin filter only if coin exists
        },
      },
      {
        // Exclude the source news itself from results
        $match: {
          _id: { $ne: objectId },
        },
      },
      {
        // Project only necessary fields for response
        $project: {
          title: 1,
          content: 1,
          coin: 1,
          source: 1,
          publishedAt: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ]);

    return results as SimilarNewsResult[];

    
  } catch (error) {
    console.error("Vector search failed:", error);
    throw new Error(
      `Vector search operation failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};