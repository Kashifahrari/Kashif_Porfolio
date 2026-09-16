"""
==============================================================================
KASHIF AI TERMINAL - FLASK BACKEND SERVER
==============================================================================
A lightweight, beginner-friendly Flask backend that connects the portfolio's
interactive CLI terminal to Groq's ultra-fast LLM (llama-3.3-70b-versatile).

Features:
- Real-time token streaming (Server-Sent Events)
- Secure API key handling via .env
- Exhaustive resume grounding & guardrails from prompt.py
- Built-in Job Description (JD) match analyzer
==============================================================================
"""

import os
import sys
from flask import Flask, request, Response, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from groq import Groq
from prompt import RESUME_SYSTEM_PROMPT

# 1. Ensure utf-8 encoding for stdout on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Load environment variables from .env file
load_dotenv()

# 2. Initialize Flask application
app = Flask(__name__)

# 3. Enable CORS so your portfolio frontend (e.g. Live Server or localhost) can call this API
CORS(app)

# 4. Initialize the Groq client with the API key from .env
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
client = None

if GROQ_API_KEY and GROQ_API_KEY != "your_groq_api_key_here":
    client = Groq(api_key=GROQ_API_KEY)
else:
    print("\n[WARNING] GROQ_API_KEY is not set or using default placeholder in .env!")
    print("Get a free API key at https://console.groq.com/keys and paste it in .env\n")


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify backend status."""
    has_key = bool(client)
    return jsonify({
        "status": "online",
        "service": "Kashif CLI AI Agent",
        "groq_configured": has_key,
        "model": "openai/gpt-oss-120b"
    })


@app.route('/api/chat', methods=['POST'])
def chat():
    """
    Main chat endpoint with real-time streaming.
    Receives user query / JD from terminal and streams back LLM response tokens.
    """
    global client

    # Re-check key in case user updated .env without full restart
    if not client:
        key = os.environ.get("GROQ_API_KEY")
        if key and key != "your_groq_api_key_here":
            client = Groq(api_key=key)

    if not client:
        return jsonify({
            "error": "Groq API key not configured. Please add your GROQ_API_KEY in the .env file."
        }), 500

    # Parse request JSON from frontend terminal
    data = request.get_json(silent=True) or {}
    user_message = data.get("message", "").strip()

    if not user_message:
        return jsonify({"error": "Message cannot be empty."}), 400

    # Generator function for streaming response tokens chunk-by-chunk
    def generate_stream():
        models_to_try = ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.8-27b"]
        
        for model_name in models_to_try:
            try:
                stream = client.chat.completions.create(
                    model=model_name,
                    messages=[
                        {"role": "system", "content": RESUME_SYSTEM_PROMPT},
                        {"role": "user", "content": user_message}
                    ],
                    temperature=0.3,
                    max_tokens=1024,
                    stream=True
                )
                
                # Stream each token chunk as it arrives
                for chunk in stream:
                    delta = chunk.choices[0].delta.content
                    if delta:
                        yield delta
                
                # If streaming completed successfully, exit function
                return
                
            except Exception as err:
                # If this model failed on stream consumption, try next candidate
                continue
        
        yield "\n[AI Error]: Unable to complete request with available Groq models."

    # Return streamed text/plain response
    return Response(generate_stream(), mimetype='text/plain')


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    print(f"[*] Kashif AI Terminal Server running on http://localhost:{port}")
    print("Press CTRL+C to stop.")
    app.run(host='0.0.0.0', port=port, debug=False)
