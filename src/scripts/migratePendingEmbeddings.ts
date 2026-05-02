import "dotenv/config";
import { connectDB } from "@/lib/db";
import { embedPendingNews } from "@/services/embeddingServices";

const runMigration = async () => {
  let exitCode = 0;

  try {
    await connectDB();
    console.log("Connected to MongoDB for embedding migration.");

    let totalProcessed = 0;
    let batchResult = 0;

    do {
      batchResult = await embedPendingNews(100);
      totalProcessed += batchResult;
      console.log(`Processed ${batchResult} pending news embeddings in this batch.`);
    } while (batchResult > 0);

    console.log(`Embedding migration complete. Total documents processed: ${totalProcessed}`);
  } catch (error) {
    console.error("Embedding migration failed:", error);
    exitCode = 1;
  } finally {
    process.exit(exitCode);
  }
};

runMigration();
