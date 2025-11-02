import { supabaseClient } from "./supabaseClient";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OllamaEmbeddings } from "@langchain/ollama";

const embeddings = new OllamaEmbeddings({ model: "llama3.2" });

const vectorstore = new SupabaseVectorStore(embeddings, {
    client: supabaseClient,
    tableName: "documents",
    queryName: "match_documents",
});

export const retrieveDocuments = vectorstore.asRetriever();
