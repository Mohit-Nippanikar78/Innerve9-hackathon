import datetime
from langchain.agents import tool
# import connect.send_whatsapp as send_whatsapp
from dotenv import load_dotenv
import os

load_dotenv()

# ======================================== BASIC TOOLS ========================================

@tool
def check_system_time(format: str = "%Y-%m-%d %H:%M:%S"):
    """Returns the current indian date and time in the specified format"""

    # get the current date and time
    current_time = datetime.datetime.now()
    
    # format the time as a string in the format "YYYY-MM-DD HH:MM:SS"
    formatted_time = current_time.strftime(format)
    
    # return the formatted time
    return formatted_time

@tool
def add(a: int, b: int) -> int:
    """Adds two numbers together"""
    return a + b

@tool
def subtract(a: int, b: int) -> int:
    """Subtracts the second number from the first number"""
    return a - b

@tool
def multiply(a: int, b: int) -> int:
    """Multiplies two numbers together"""
    return a * b

@tool
def divide(a: int, b: int) -> float:
    """Divides the first number by the second number"""
    return a / b

@tool
def power(a: int, b: int) -> int:
    """Raises the first number to the power of the second number"""
    return a ** b


# ======================================== USEFUL TOOLS ========================================
from langchain_core.tools import Tool
from langchain_experimental.utilities import PythonREPL
from langchain_community.tools import DuckDuckGoSearchRun

search = DuckDuckGoSearchRun()

python_repl = PythonREPL()
repl_tool = Tool(
    name="python_repl",
    description="A Python shell. Use this to execute python commands. Input should be a valid python command. If you want to see the output of a value, you should print it out with `print(...)`.",
    func=python_repl.run,
)

# ======================================== CONNECTION TOOLS ========================================
# @tool
# def send_whatsapp_message(message: str) -> str:
#     """Sends a message on WhatsApp."""
#     return send_whatsapp.send_whatpsapp_message(os.getenv("MY_NUMBER"), message)


# ======================================== TAX TOOLS ========================================








if __name__ == "__main__":
    # print(get_historical_price("Reliance Industries, 2021-01-01, 30"))
    # print(get_current_price("Reliance Industries"))
    # print(get_company_info("Reliance Industries"))
    # print(evaluate_returns("Reliance Industries, 1Y"))
    # send_whatsapp_message("Hello, this is a test message from the tool.")
    # schedule_task("Test Task, This is a test task, 14:40")
    pass