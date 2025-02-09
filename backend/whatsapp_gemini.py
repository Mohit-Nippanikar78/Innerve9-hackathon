import os
import google.generativeai as genai
from dotenv import load_dotenv
from prompt_manager.prompt import prompts
import json
import base64

load_dotenv()

GEMINI_API_KEY = os.getenv("Gemini_API_Key")
genai.configure(api_key=GEMINI_API_KEY)

def upload_to_gemini(path, mime_type=None):
    with open(path, 'rb') as f:
        content = f.read()
    encoded = content.decode('utf-8', errors='ignore').encode('ascii', errors='ignore')
    return genai.upload_file(encoded, mime_type=mime_type)

generation_config = {
    "temperature": 0.7,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 2048,
    "candidate_count": 1
}

model = genai.GenerativeModel(
    name="gemini-pro",
    generation_config=generation_config,
    safety_settings={
        "HARASSMENT": "BLOCK_MEDIUM_AND_ABOVE",
        "HATE_SPEECH": "BLOCK_MEDIUM_AND_ABOVE", 
        "SEXUALLY_EXPLICIT": "BLOCK_MEDIUM_AND_ABOVE",
        "DANGEROUS_CONTENT": "BLOCK_MEDIUM_AND_ABOVE"
    }
)

_message_cache = {}

def chat_with_gemini(message, media_file_path=None):
    global _message_cache
    cache_key = f"{message}:{media_file_path}:{len(_message_cache)}"
    
    if cache_key in _message_cache:
        return _message_cache[cache_key]
        
    try:
        if media_file_path:
            files = [upload_to_gemini(f) for f in media_file_path]
            if None in files:
                return "Processing your media..."
            response = model.generate_content(message, files)
        else:
            cleaned_msg = json.loads(json.dumps(message))
            response = model.generate_content(cleaned_msg)
            
        result = response.text if hasattr(response, 'text') else str(response)
        _message_cache[cache_key] = result
        return result
    except:
        return "Still working on it..."

if __name__ == "__main__":
    query = "hi"
    response = chat_with_gemini(query)
    print("Response:", response)
