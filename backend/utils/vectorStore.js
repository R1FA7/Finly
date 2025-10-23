import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadEmbeddings = () => {
  const embeddingsPath = path.join(__dirname, "../data/embeddings.json");
  if (!fs.existsSync(embeddingsPath)) {
    throw new Error("embeddings.json not found");
  }
  const fileContent = fs.readFileSync(embeddingsPath, "utf-8");
  return JSON.parse(fileContent);
};

export const similaritySearch = async (query, topK = 4) => {
  const vectorStore = loadEmbeddings();
  const queryNorm = query.toLowerCase();

  const scoredDocs = vectorStore.documents.map((doc, idx) => {
    const contentNorm = doc.content.toLowerCase();
    const titleNorm = doc.title.toLowerCase();

    let score = 0;
    if (titleNorm.includes(queryNorm)) score += 10;

    const words = queryNorm.split(/\s+/);
    words.forEach((word) => {
      if (word.length > 3) {
        if (titleNorm.includes(word)) score += 2;
        if (contentNorm.includes(word)) score += 1;
      }
    });

    return {
      document: doc,
      score,
      index: idx,
    };
  });

  const results = scoredDocs
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter((result) => result.score > 0)
    .map((result) => ({
      pageContent: result.document.content,
      metadata: {
        id: result.document.id,
        title: result.document.title,
        category: result.document.category,
      },
    }));
  
  //no match just send first 4
  if (results.length === 0) {
    return vectorStore.documents.slice(0, topK).map((doc) => ({
      pageContent: doc.content,
      metadata: {
        id: doc.id,
        title: doc.title,
        category: doc.category,
      },
    }));
  }

  return results;
};
