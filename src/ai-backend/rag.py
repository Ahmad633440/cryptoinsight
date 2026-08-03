"""
rag.py
------
Wires up the LangChain components: embeddings, vector store, LLM, and retriever.
Exposes:
  - retriever       : MongoDBAtlasVectorSearch retriever
  - fetch_rag_context(question) -> str
  - ask_llm(context, question)  -> str
"""

from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_mongodb import MongoDBAtlasVectorSearch
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from pymongo import MongoClient

import config

# Clients
_mongo_client = MongoClient(config.MONGODB_URL)
_collection   = _mongo_client[config.DB_NAME][config.COLLECTION_NAME]

# Embeddings & vector store
_embeddings = GoogleGenerativeAIEmbeddings(
    model=config.EMBEDDING_MODEL,
    google_api_key=config.GEMINI_KEY,
)

_vector_store = MongoDBAtlasVectorSearch(
    collection=_collection,
    embedding=_embeddings,
    index_name=config.VECTOR_INDEX,
    text_key=config.TEXT_KEY,
)

retriever = _vector_store.as_retriever(search_kwargs={"k": config.RAG_TOP_K})

# LLM
llm = ChatGroq(
    api_key=config.GROQ_KEY,
    model=config.LLM_MODEL,
)

# Prompt
_SYSTEM_PROMPT = """You are a neutral crypto educator for beginners.
Your goal is to explain cryptocurrency concepts clearly and simply.
You must NEVER give financial advice.
If the user asks a question that is NOT related to cryptocurrency, blockchain, or web3,
you MUST politely refuse and steer the conversation back to crypto topics.

When answering price-related questions, rely ONLY on the live market data
provided in the context block labelled [LIVE MARKET DATA]. Never use prices
that appear in the news context, as those may be outdated.

{context}"""

_prompt = ChatPromptTemplate.from_messages([
    ("system", _SYSTEM_PROMPT),
    ("human", "{question}"),
])

_output_parser = StrOutputParser()


def _format_docs(docs) -> str:
    return "\n\n".join(doc.page_content for doc in docs)


def fetch_rag_context(question: str) -> str:
    """Run vector search and return formatted news context. Returns '' on error."""
    try:
        docs = retriever.invoke(question)
        text = _format_docs(docs)
        if text.strip():
            return "[NEWS CONTEXT - may contain older price information]\n" + text
    except Exception as exc:
        print(f"[RAG] Error: {exc}")
    return ""


def ask_llm(context: str, question: str) -> str:
    """Run the question through the prompt + LLM pipeline and return the answer."""
    chain = _prompt | llm | _output_parser
    return chain.invoke({"context": context, "question": question})
