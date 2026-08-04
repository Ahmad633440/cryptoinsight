"""
app.py
------
Flask entry point. Thin layer - all logic lives in the imported modules.

Request flow:
  1. price_detector  ->  is this a price question? which coins?
  2. coingecko       ->  fetch live price context (if needed)
  3. rag             ->  fetch MongoDB news context
  4. rag.ask_llm     ->  combine contexts -> LLM -> answer
"""

# pyrefly: ignore [missing-import]
from flask import Flask, request, jsonify
# pyrefly: ignore [missing-import]
from flask_cors import CORS

import config
from coingecko import build_price_context, build_price_context_from_list
from price_detector import is_price_question, extract_gecko_ids
from rag import fetch_rag_context, ask_llm

# App setup
config.print_config_status()

app = Flask(__name__)
CORS(app, origins="*")


# Routes
@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json(silent=True) or {}
    question = data.get("question", "").strip()

    if not question:
        return jsonify({"error": "No question provided"}), 400

    context_parts: list[str] = []

    # 1. Live price data (injected first so LLM prioritises it over stale news)
    if is_price_question(question):
        gecko_ids = extract_gecko_ids(question)
        live_coins = data.get("liveCoins")
        if live_coins:
            price_ctx = build_price_context_from_list(gecko_ids, live_coins)
        else:
            price_ctx = build_price_context(gecko_ids)
        if price_ctx:
            context_parts.append(price_ctx)

    # 2. MongoDB RAG news context
    rag_ctx = fetch_rag_context(question)
    if rag_ctx:
        context_parts.append(rag_ctx)

    combined = (
        "\n\n---\n\n".join(context_parts)
        if context_parts
        else "No additional context available."
    )

    answer = ask_llm(context=combined, question=question)
    return jsonify({"answer": answer})


@app.route("/health", methods=["GET"])
def health():
    """Simple health-check endpoint for Railway uptime monitoring."""
    return jsonify({"status": "ok"})


# Entry point
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False, threaded=True)
