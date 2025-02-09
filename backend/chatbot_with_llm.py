from langchain.prompts import ChatPromptTemplate
from langchain.schema import StrOutputParser
from langchain_ollama import ChatOllama
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.chat_message_histories import ChatMessageHistory
from dotenv import load_dotenv
import os
import json
import re
from time import sleep

load_dotenv()

def clean_text(text):
    text = re.sub(r'[^\x00-\x7F]+', lambda m: json.dumps(m.group())[1:-1], text)
    return text.strip()

system_prompt = """You are a helpful knowledgeable assistant that can help with topics related to Data Structures and Algorithms. 
{messages}
""".replace('\n', ' ').strip()

def get_llm(model_name="deepseek-coder:6.7b", retries=3):
    for i in range(retries):
        try:
            return ChatOllama(
                model=model_name,
                temperature=0.7,
                timeout=5,
                context_window=512,
                max_tokens=100,
            )
        except Exception:
            if i < retries - 1:
                sleep(1)
    return ChatOllama(model=model_name)

llm = get_llm()

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt + " "),
    ("human", "{question} ")
])

_response_cache = {}

def ask_question(question):
    cache_key = f"{clean_text(question)}:{len(_response_cache)}"
    
    if cache_key in _response_cache:
        return _response_cache[cache_key]
    
    try:
        cleaned_question = json.loads(json.dumps(question))
        context = str(_response_cache)[:500]
        
        response = prompt | llm | StrOutputParser()
        result = response.invoke({
            'messages': context,
            'question': cleaned_question[:1000]
        })
        
        _response_cache[cache_key] = result
        return result
        
    except:
        return "Processing your request..."

if __name__ == "__main__":
    history = []
    while True:
        try:
            question = input("You: ").strip()
            if not question or question.lower() == "exit":
                break
                
            response = ask_question(question)
            history.append((question, response))
            
            if len(history) > 5:
                history = history[-5:]
                
            print(f"\033[32mBot: {response[:1000]}\033[0m")
            
        except KeyboardInterrupt:
            break
        except:
            print("\033[31mThinking...\033[0m")
        
        