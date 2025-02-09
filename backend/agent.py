import os
import google.generativeai as genai
from google.ai.generativelanguage_v1beta.types import content
from dotenv import load_dotenv
from prompt_manager.prompt import prompts

load_dotenv()

genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# Create the model
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 40,
  "max_output_tokens": 8192,
  "response_mime_type": "text/plain",
}
def calculate_gross_salary(basic: float, da: float = 0, hra: float = 0, 
                         lta: float = 0, bonus: float = 0, other_allowances: float = 0) -> float:
    """Calculate the gross salary based on individual salary components."""
    return basic + da + hra + lta + bonus + other_allowances

def calculate_80C_deductions(ppf: float = 0, elss: float = 0, nsc: float = 0, 
                           epf: float = 0, home_loan_principal: float = 0) -> float:
    """Calculate total deductions under section 80C."""
    sum_80C = ppf + elss + nsc + epf + home_loan_principal
    return min(sum_80C, 150000)

def calculate_hra_exemption(basic: float, da: float = 0, hra: float = 0, 
                          rent_paid: float = 0, is_metro: bool = True) -> float:
    """Calculate HRA exemption."""
    basic_da = basic + da
    hra_limit = basic_da * (0.5 if is_metro else 0.4)
    rent_minus_10_percent = max(rent_paid - (basic_da * 0.1), 0)
    return min(hra, hra_limit, rent_minus_10_percent)

def calculate_total_deductions(basic: float, da: float = 0, hra: float = 0, rent_paid: float = 0,
                             ppf: float = 0, elss: float = 0, nsc: float = 0, epf: float = 0,
                             home_loan_principal: float = 0, medical_premiums: float = 0,
                             edu_loan_interest: float = 0, nps: float = 0, savings_interest: float = 0,
                             home_loan_interest: float = 0, is_metro: bool = True) -> float:
    """Calculate total deductions."""
    std_deduction = 50000
    hra_exemption = calculate_hra_exemption(basic, da, hra, rent_paid, is_metro)
    deductions_80c = calculate_80C_deductions(ppf, elss, nsc, epf, home_loan_principal)
    
    return (deductions_80c + std_deduction + medical_premiums + edu_loan_interest +
            nps + savings_interest + home_loan_interest + hra_exemption)

def calculate_taxable_salary_old_regime(gross_salary: float, total_deductions: float) -> float:
    """Calculate taxable salary."""
    return gross_salary - total_deductions

def calculate_tax_old_regime(taxable_salary: float, age: int) -> float:
    """Calculate income tax (old regime)."""
    if taxable_salary <= 500000:
        return 0
    
    tax = 0
    if age < 60:
        slabs = [250000, 500000, 1000000]
    elif age < 80:
        slabs = [300000, 500000, 1000000]
    else:
        slabs = [500000, 1000000]
        
    rates = [0.05, 0.2, 0.3]
    
    for i, slab in enumerate(slabs):
        if taxable_salary > slab:
            taxable_amount = min(taxable_salary - slab, slab if i == 0 else slab - slabs[i - 1])
            tax += taxable_amount * rates[i]
            taxable_salary -= taxable_amount
    return tax

def calculate_tax_new_regime(gross_salary: float) -> float:
    """Calculate tax (new regime)."""
    taxable_salary = gross_salary - 75000
    if taxable_salary <= 300000:
        return 0
    
    slabs = [400000, 800000, 1200000, 1600000, 2000000, 2400000]
    rates = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3]
    tax = 0
    remaining_salary = taxable_salary
    
    for i in range(len(slabs)-1):
        lower = slabs[i]
        upper = slabs[i+2]
        if remaining_salary > lower:
            taxable_amount = min(remaining_salary, upper - lower)
            tax += taxable_amount * rates[i]
    
    return tax

def calculate_education_cess(tax: float) -> float:
    """Calculate education cess."""
    return tax * 0.04

model = genai.GenerativeModel(
  model_name="gemini-2.0-flash",
  system_instruction=prompts['system_message'],
  generation_config=generation_config,
)
# print(model._tools.to_proto())

chat_session = model.start_chat(
  history=[
  ], enable_automatic_function_calling=True
)


# -----------------------------------------------------
# response = chat_session.send_message('My basic salary is 13 lakhs rupees and I have last year invested in pls mutual funds around 50,000 that said no any other investments please give me my tax')
# print(response.text)

# for content in chat_session.history:
#     part = content.parts[0]
#     print(content.role, "->", type(part).to_dict(part))
#     print('-'*80)


def process_query(query: str) -> str:
    response = chat_session.send_message(query)
    print('-------------------------- BACKGROUND WORK --------------------------')
    for content in chat_session.history:
        part = content.parts[0]
        print(content.role, "->", type(part).to_dict(part))
        print('-'*80)
    print('-------------------------- BACKGROUND WORK --------------------------')
    print(response.text)
    return response.text

if __name__ == "__main__":
    while True:
        query = input("@User : ")
        resp = process_query(query)
        

response = chat_session.send_message("what is the weather in New York?")

# Print out each of the function calls requested from this single call.
# Note that the function calls are not executed. You need to manually execute the function calls.
# For more see: https://github.com/google-gemini/cookbook/blob/main/quickstarts/Function_calling.ipynb
# Print each function call made by the model
for part in response.parts:
    # Check if this part contains a function call
    if function_call := part.function_call:
        # Format the arguments as a string
        args = ", ".join(f"{k}={v}" for k, v in function_call.args.items())
        # Print the function name and its arguments
        print(f"{function_call.name}({args})")