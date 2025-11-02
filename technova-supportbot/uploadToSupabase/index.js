import { readFile } from "fs/promises";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OllamaEmbeddings } from "@langchain/ollama";
import "dotenv/config";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;

try {
    const text = await readFile(`${process.cwd()}/policydocument.txt`, "utf-8");

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 50,
        separators: ["\n\n", "\n", " ", ""],
    });

    const splittedText = await splitter.createDocuments([text]);

    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_API_KEY);

    await SupabaseVectorStore.fromDocuments(splittedText, new OllamaEmbeddings({ model: "llama3.2", baseUrl: "http://localhost:11434" }),
        {
            client: supabaseClient,
            tableName: "documents",
            queryName: "match_documents",
        });
} catch (error) {
    console.error("Error splitting text:", error);
}