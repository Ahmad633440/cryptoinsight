from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_mongodb import MongoDBAtlasVectorSearch
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from pymongo import MongoClient
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

MONGODB_URL = os.getenv("MONGODB_URI")
GEMINI_KEY = os.getenv("GEMINI_KEY")
GROQ_KEY = os.getenv("GROQ_KEY")

mongo_client = MongoClient(MONGODB_URL)
collection = mongo_client["cryptodb"]["historical_events"]

embeddings = GoogleGenerativeAIEmbeddings(
    model="gemini-embedding-001",
    google_api_key=GEMINI_KEY
)

vector_store = MongoDBAtlasVectorSearch(
    collection=collection,
    embedding=embeddings,
    index_name="vector_index"
)

llm = ChatGroq(
    api_key=GROQ_KEY,
    model="llama-3.3-70b-versatile"
)

system_prompt = """You are a neutral crypto educator for beginners. 
Your goal is to explain cryptocurrency concepts clearly and simply.
You must NEVER give financial advice.
If the user asks a question that is NOT related to cryptocurrency, blockchain, or web3, you MUST politely refuse to answer and steer the conversation back to crypto topics. Do not attempt to answer non-crypto questions (like politics, history, general knowledge).

Use the following context to inform your answer if relevant:
{context}"""

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{question}")
])

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

retriever = vector_store.as_retriever()

chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

@app.route('/ask', methods=['POST'])
def ask():
    data = request.get_json()
    user_question = data['question']
    answer = chain.invoke(user_question)
    return jsonify({"answer": answer})

if __name__ == '__main__':
    app.run(debug=False, threaded=True)
