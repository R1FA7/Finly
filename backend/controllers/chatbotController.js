import Groq from "groq-sdk";
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { similaritySearch } from "../utils/vectorStore.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const getChatbotResponse = asyncHandler(async (req,res) => {
  // STEP 1: Retrieve relevant documents (using keyword matching)
  const {userMessage} = req.body
  if(!userMessage || !userMessage.trim()==="") throw new ApiError(400, 'Message is required')
  const topK = 4;
  const relevantDocs = await similaritySearch(userMessage, topK);

  relevantDocs.forEach((doc, idx) => {
    console.log(`  [${idx + 1}] ${doc.metadata.title}`);
  });

  // STEP 2: Build context
  const context = relevantDocs
    .map((doc, idx) => {
      return `[Document ${idx + 1}: ${doc.metadata.title}]\n${doc.pageContent}`;
    })
    .join("\n\n---\n\n");
  console.log("Context",context)
  // STEP 3: Create prompt
  const systemPrompt = `You are Finly Assistant, a helpful AI assistant for Finly - a personal finance tracking application.

  Answer user questions based ONLY on the provided context documents.

  RULES:
  1. Use ONLY information from the context below
  2. If the context doesn't contain the answer, say "I don't have that information in my knowledge base. Please contact support for help."
  3. Be conversational, friendly, and concise
  4. Don't make up information not in the context
  5. Keep answers short (2-3 sentences max) and simple

  CONTEXT DOCUMENTS:
  ${context}

  Answer the user's question based on the context above.`;

  // STEP 4: Call Groq
  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.5,
    max_tokens: 300,
  });

  const response =
    completion.choices[0]?.message?.content ||
    "Sorry, I couldn't generate a response.";

  console.log(`Response: ${response.substring(0, 50)}...\n`);
  const data = {
    response,
    sources: relevantDocs.map((doc) => ({
      title: doc.metadata.title,
      category: doc.metadata.category,
    })),
  }
  return res.status(200).json(new ApiResponse(200, data, 'Chatbot response fetched successfully'))
})