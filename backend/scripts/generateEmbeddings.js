import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf"
import "dotenv/config"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { finlyFaqInfo } from "../data/finlyFaqInfo.js"

const generateEmbeddings = async () => {
  try {
    console.log("Total", finlyFaqInfo.length)

    const faqEmbeddings = new HuggingFaceInferenceEmbeddings({
      apiKey: process.env.HUGGINGFACE_API_KEY || "hf_demo",
      model: "sentence-transformers/all-MiniLM-L6-v2"
    })

    const faqDocs = finlyFaqInfo.map((doc)=>doc.content)

    const vectors = await faqEmbeddings.embedDocuments(faqDocs)

    console.log("Embedding dim",vectors[0].length)

    const embeddingData = {
      documents: finlyFaqInfo,
      embeddings: vectors,
      metaData: {
        model: "sentence-transformers/all-MiniLM-L6-v2",
        dimension: vectors[0].length,
        totalDocuments: finlyFaqInfo.length,
        generatedAt: new Date().toISOString()
      }
    }
    //current dir
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)

    const outputPath = path.join(__dirname, "../data/embeddings.json")
    //save to JSON
    fs.writeFileSync(outputPath, JSON.stringify(embeddingData, null, 2))

    console.log(`\n Embeddings saved to: ${outputPath}`);

  } catch (error) {
    console.error("Error generating embeddings",error)
    process.exit(1)
  }
}

generateEmbeddings()