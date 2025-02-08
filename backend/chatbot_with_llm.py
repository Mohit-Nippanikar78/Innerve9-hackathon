from langchain.prompts import ChatPromptTemplate
from langchain.schema import StrOutputParser
from langchain_ollama import ChatOllama
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.chat_message_histories import ChatMessageHistory
from dotenv import load_dotenv

load_dotenv()


system_prompt = """You are a helpful knowledgeable assistant that can help with topics related to Data Structures and Algorithms. Do not respond to any other topics. Be precise and concise in your responses and make sure to provide accurate information.  Strictly dont answer anything else, tell I don't know, if you dont know the answer.Don't provide me code until I ask for it.


{messages}
"""
system_prompt = 'You are a helpful assistant.\n\n{messages}'


demo_ephemeral_chat_history = ChatMessageHistory()


# Initialize the model
# LLama
# llm = ChatOllama(model="llama3.2", temperature=0.5)
llm = ChatOllama(model="deepseek-r1:8b", temperature=0.5)

# Gemini
# llm = ChatGoogleGenerativeAI(
#     model="gemini-1.5-flash",
#     temperature=0.5,
#     max_tokens=None,
#     timeout=None,
#     max_retries=2,
# )

# Define the prompt template
prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            system_prompt
            ,
        ),
        ("human", "{question}"),
    ]
)

# Create the runnable chain
runnable = prompt | llm | StrOutputParser()

# Output:
# Stream the response for the given question
# for chunk in runnable.stream({"question": "How is machine learning different than deep learning?"}):
#     print(chunk, end="", flush=True)

# Output:
def ask_question(question):
    ans = runnable.invoke({'messages': demo_ephemeral_chat_history.messages, "question": question})
    demo_ephemeral_chat_history.add_user_message(question)
    demo_ephemeral_chat_history.add_ai_message(ans.split('</think>')[1])
    return ans


if __name__ == "__main__":
    while True:
        qs = input("You: ")
        if qs.lower() == "exit":
            break
        chatbot_response = ask_question(qs)
        # Using simple ANSI escape codes for colors
        # \033[32m is green, \033[0m resets the color
        print(f"Chatbot: \033[32m{chatbot_response.split('</think>')[0]+'</think>'}\033[0m \n \033[33m{chatbot_response.split('</think>')[1]}\033[0m")
        # yellow color for the prompt
        
        