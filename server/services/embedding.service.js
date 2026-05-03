import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Splits text into overlapping chunks of a given length.
 * @param {string} text - The raw text from the PDF.
 * @param {number} chunkSize - Approximate max length of each chunk.
 * @param {number} overlap - Number of characters to overlap between chunks.
 * @returns {string[]} Array of text chunks.
 */
function chunkText(text, chunkSize = 1000, overlap = 200) {
  if (!text) return [];
  const words = text.split(/\s+/);
  const chunks = [];
  let currentChunk = [];
  let currentLength = 0;

  for (const word of words) {
    if (currentLength + word.length > chunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.join(" "));
      
      // Backtrack for overlap
      let overlapLength = 0;
      const overlapWords = [];
      for (let i = currentChunk.length - 1; i >= 0; i--) {
        const w = currentChunk[i];
        if (overlapLength + w.length > overlap) break;
        overlapWords.unshift(w);
        overlapLength += w.length + 1; // +1 for space
      }
      currentChunk = [...overlapWords];
      currentLength = overlapLength;
    }
    currentChunk.push(word);
    currentLength += word.length + 1;
  }
  
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(" "));
  }

  return chunks;
}

/**
 * Generates an embedding for a specific text chunk.
 * @param {string} text 
 * @returns {Promise<number[]>}
 */
export async function generateEmbedding(text) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error("Failed to generate embedding");
  }
}

/**
 * Process raw PDF text, chunk it, and generate embeddings for all chunks.
 * @param {string} rawText 
 * @returns {Promise<Array<{text: string, embedding: number[]}>>}
 */
export async function processDocumentText(rawText) {
  const chunks = chunkText(rawText);
  const results = [];

  for (const chunk of chunks) {
    // Generate embeddings one by one (or Promise.all with rate limiting if needed)
    const embedding = await generateEmbedding(chunk);
    results.push({ text: chunk, embedding });
  }

  return results;
}
