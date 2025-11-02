import {
    RunnableSequence,
    RunnablePassthrough,
} from "@langchain/core/runnables";
import { ChatOllama } from "@langchain/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";

import { retrieveDocuments } from "./setupRetriever";
import { standaloneQuestionTemplate, answerTemplate } from "./promptTemplates";

const llm = new ChatOllama({
    model: "llama3.2",
});

function combineDocuments(docs) {
    return docs.map((doc) => doc.pageContent).join("\n\n");
}


const standAloneQuestionChain = RunnableSequence.from([
    standaloneQuestionTemplate,
    llm,
    new StringOutputParser(),
]);


const retrieveDocumentsChain = RunnableSequence.from([
    (data) => {
        console.log(data);
        return data.standAloneQuestion;
    },
    retrieveDocuments,
    combineDocuments,
]);

const answerChain = RunnableSequence.from([
    (data) => {
        console.log(data);
        return data;
    },
    answerTemplate,
    llm,
    new StringOutputParser(),
]);

export const chain = RunnableSequence.from([
    {
        standAloneQuestion: standAloneQuestionChain,
        originalQuestion: new RunnablePassthrough(),
        chatHistory: ({ chatHistory }) => chatHistory,
    },
    {
        context: retrieveDocumentsChain,
        question: ({ originalQuestion }) => originalQuestion.question,
        chatHistory: ({ chatHistory }) => chatHistory,
    },
    answerChain,
]);