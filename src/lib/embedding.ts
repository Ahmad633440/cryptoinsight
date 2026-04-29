import axios, { AxiosError } from "axios";

const GEMINI_API_KEY = process.env.GEMINI_EMBEDDINGS_API_KEY;

const MAX_INPUT_CHARS = 6000;
const RETRY_DELAY_MS = 500;

const normalizeText = (text: string): string =>
  text.replace(/\s+/g, " ").trim();

const truncateText = (text: string, maxLength: number): string =>
  text.length > maxLength ? text.slice(0, maxLength) : text;

const callGeminiEmbedding = async (text: string): Promise<number[]> => {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini embedding API key is not configured.");
  }

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`,
    {
      content: {
        parts: [{ text }],
      },
    },
    {
      headers: { "Content-Type": "application/json" },
      timeout: 15000,
    }
  );

  const embedding = response.data?.embedding?.values;
  if (!Array.isArray(embedding) || embedding.length === 0) {
    throw new Error("Invalid embedding response from Gemini API");
  }

  return embedding;
};

export const generateEmbedding = async (text: string): Promise<number[]> => {
  const sanitized = normalizeText(text);
  if (!sanitized) {
    throw new Error("Cannot generate embedding for empty text");
  }

  const trimmedText = truncateText(sanitized, MAX_INPUT_CHARS);

  try {
    return await callGeminiEmbedding(trimmedText);
  } catch (error) {
    const firstError = error instanceof AxiosError ? error.response?.data || error.message : error;
    console.warn("Gemini embedding failed, retrying once:", firstError);
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    return await callGeminiEmbedding(trimmedText);
  }
};

