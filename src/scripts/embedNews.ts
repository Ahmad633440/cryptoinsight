import "dotenv/config";
import { connectDB } from "@/lib/db";
import { embedPendingNews } from "@/services/embeddingServices";

const run = async () => {
  await connectDB();

  console.log("Starting embedding job...");
  await embedPendingNews(100);

  console.log("Embedding job complete");
  process.exit(0);
};

run();