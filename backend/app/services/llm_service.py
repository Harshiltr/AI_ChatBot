import requests
import json

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL_NAME = "llama3"


def stream_ai_response(messages):
    payload = {
        "model": MODEL_NAME,
        "messages": messages,
        "stream": True,
    }

    with requests.post(OLLAMA_URL, json=payload, stream=True) as response:
        response.raise_for_status()
        for line in response.iter_lines():
            if line:
                data = json.loads(line.decode("utf-8"))
                if "message" in data:
                    yield data["message"]["content"]
