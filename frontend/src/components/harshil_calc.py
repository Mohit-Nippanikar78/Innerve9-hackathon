salary_inputs = {
    "basic": 500000,
    "hra": 200000,
    "lta": 50000,
    "da": 100000,
    "bonus": 150000,
    "otherAllowances": 50000
}

deduction_inputs = {
    "ppf": 50000,
    "elss": 25000,
    "nsc": 10000,
    "epf": 30000,
    "homeLoanPrinciple80C": 40000,
    "medicalPremiums": 20000,
    "educationLoanInterest": 15000,
    "nps": 50000,
    "savingsAccountInterest": 10000,
    "homeLoanInterest24B": 200000,
    "metroPolitanCity": True,
    "rentPaid": 150000
}

def calculate_gross_salary(salary_inputs):
    """
    Calculate the gross salary based on various salary components.
    Args:
        salary_inputs (dict): A dictionary containing the salary components. 
                              Keys can include 'basic', 'da', 'hra', 'lta', 'bonus', and 'otherAllowances'.
                              Each key should map to a numeric value representing the amount for that component.
    Returns:
        float: The total gross salary calculated by summing up all the provided salary components.
    """
    
    return (salary_inputs.get('basic', 0) +
            salary_inputs.get('da', 0) +
            salary_inputs.get('hra', 0) +
            salary_inputs.get('lta', 0) +
            salary_inputs.get('bonus', 0) +
            salary_inputs.get('otherAllowances', 0))

def calculate_80C_deductions(deduction_inputs):
    """
    Calculate the total deductions under section 80C of the Income Tax Act.
    This function sums up the eligible deductions provided in the input dictionary
    and returns the minimum of the sum or the maximum allowable deduction under section 80C, 
    which is 150,000 INR.
    Parameters:
    deduction_inputs (dict): A dictionary containing the following keys with their respective deduction amounts:
        - 'ppf': Public Provident Fund
        - 'elss': Equity Linked Savings Scheme
        - 'nsc': National Savings Certificate
        - 'epf': Employees' Provident Fund
        - 'homeLoanPrinciple80C': Principal repayment of home loan
    Returns:
    int: The total eligible deduction under section 80C, capped at 150,000 INR.
    """
    
    sum_80C = (deduction_inputs.get('ppf', 0) +
               deduction_inputs.get('elss', 0) +
               deduction_inputs.get('nsc', 0) +
               deduction_inputs.get('epf', 0) +
               deduction_inputs.get('homeLoanPrinciple80C', 0))
    return min(sum_80C, 150000)

def calculate_hra_exemption(salary_inputs, deduction_inputs):
    """
    Calculate the House Rent Allowance (HRA) exemption based on salary and deduction inputs.
    Parameters:
    salary_inputs (dict): A dictionary containing salary components with keys:
        - 'basic' (float): Basic salary amount.
        - 'da' (float): Dearness allowance amount.
        - 'hra' (float): House Rent Allowance amount.
    deduction_inputs (dict): A dictionary containing deduction components with keys:
        - 'rentPaid' (float): Total rent paid.
        - 'metroPolitanCity' (bool): Whether the city is a metropolitan city (default is True).
    Returns:
    float: The calculated HRA exemption amount.
    """
    
    basic_da = salary_inputs.get('basic', 0) + salary_inputs.get('da', 0)
    hra = salary_inputs.get('hra', 0)
    rent_paid = deduction_inputs.get('rentPaid', 0)
    is_metro = deduction_inputs.get('metroPolitanCity', True)

    hra_limit = basic_da * (0.5 if is_metro else 0.4)
    rent_minus_10_percent = max(rent_paid - (basic_da * 0.1), 0)

    return min(hra, hra_limit, rent_minus_10_percent)

def calculate_total_deductions(salary_inputs, deduction_inputs):
    """
    Calculate the total deductions based on salary and deduction inputs.
    Args:
        salary_inputs (dict): A dictionary containing salary-related inputs.
        deduction_inputs (dict): A dictionary containing deduction-related inputs.
    Returns:
        float: The total amount of deductions.
    Deduction Components:
        - Standard deduction: 50,000
        - HRA exemption: Calculated using the calculate_hra_exemption function
        - Section 80C deductions: Calculated using the calculate_80C_deductions function
        - Medical premiums: Retrieved from deduction_inputs with key 'medicalPremiums'
        - Education loan interest: Retrieved from deduction_inputs with key 'educationLoanInterest'
        - NPS (National Pension System): Retrieved from deduction_inputs with key 'nps'
        - Savings account interest: Retrieved from deduction_inputs with key 'savingsAccountInterest'
        - Home loan interest (Section 24B): Retrieved from deduction_inputs with key 'homeLoanInterest24B'
    """
    
    std_deduction = 50000
    hra_exemption = calculate_hra_exemption(salary_inputs, deduction_inputs)

    return (calculate_80C_deductions(deduction_inputs) +
            std_deduction +
            deduction_inputs.get('medicalPremiums', 0) +
            deduction_inputs.get('educationLoanInterest', 0) +
            deduction_inputs.get('nps', 0) +
            deduction_inputs.get('savingsAccountInterest', 0) +
            deduction_inputs.get('homeLoanInterest24B', 0) +
            hra_exemption)

def calculate_taxable_salary(salary_inputs, deduction_inputs):
    """
    Calculate the taxable salary by subtracting total deductions from the gross salary.
    Args:
        salary_inputs (dict): A dictionary containing salary components such as basic salary, HRA, etc.
        deduction_inputs (dict): A dictionary containing deduction components such as tax deductions, provident fund, etc.
    Returns:
        float: The taxable salary after deductions.
    """
    
    return calculate_gross_salary(salary_inputs) - calculate_total_deductions(salary_inputs, deduction_inputs)

def calculate_tax_old_regime(taxable_salary, age):
    """
    Calculate the income tax based on the old tax regime in India.
    Parameters:
    taxable_salary (float): The taxable salary of the individual.
    age (int): The age of the individual.
    Returns:
    float: The calculated tax based on the old tax regime.
    The function uses different tax slabs and rates based on the age of the individual:
    - For individuals below 60 years of age:
        - Up to 2,50,000: No tax
        - 2,50,001 to 5,00,000: 5%
        - 5,00,001 to 10,00,000: 20%
        - Above 10,00,000: 30%
    - For individuals between 60 and 80 years of age:
        - Up to 3,00,000: No tax
        - 3,00,001 to 5,00,000: 5%
        - 5,00,001 to 10,00,000: 20%
        - Above 10,00,000: 30%
    - For individuals above 80 years of age:
        - Up to 5,00,000: No tax
        - 5,00,001 to 10,00,000: 20%
        - Above 10,00,000: 30%
    Note:
    - If the taxable salary is less than or equal to 5,00,000, the tax is 0 due to rebate.
    """
    
    
    REBATE_LIMIT = 500000
    
    if taxable_salary <= REBATE_LIMIT:
        return 0
    
    # Slabs for Age Groups 0 - 60
    slabs_60 = [250000, 500000, 1000000]
    rates_60 = [0.05, 0.2, 0.3]
    
    # Tax Slabs for Age Groups 60 - 80
    slabs_80 = [300000, 500000, 1000000]
    rates_80 = [0.05, 0.2, 0.3]
    
    # Tax Slabs for Above 80 yrs
    slabs_80_plus = [500000, 1000000]
    rates_80_plus = [0.2, 0.3]
    
    slabs = []
    rates = []
    
    # Determine the Slabs and Rates based on Age
    if age < 60:
        slabs = slabs_60
        rates = rates_60
    elif age >= 60 and age < 80:
        slabs = slabs_80
        rates = rates_80
    else:
        slabs = slabs_80_plus
        rates = rates_80_plus
    
    
    tax = 0

    for i, slab in enumerate(slabs):
        if taxable_salary > slab:
            taxable_amount = min(taxable_salary - slab, slab if i == 0 else slab - slabs[i - 1])
            tax += taxable_amount * rates[i]
            taxable_salary -= taxable_amount
        else:
            break

    

    return tax

def calculate_tax_new_regime(gross_salary):
    """
    Calculate the tax for a given gross salary under the new tax regime.
    The new tax regime includes a standard deduction and specific tax slabs with corresponding rates.
    If the taxable salary (gross salary minus standard deduction) is less than or equal to the rebate limit,
    no tax is applied.
    Args:
        gross_salary (float): The gross salary of the individual.
    Returns:
        float: The calculated tax based on the new regime tax slabs.
    """
    
    STD_DEDUCTION = 75000
    taxable_salary = gross_salary - STD_DEDUCTION
    
    REBATE_LIMIT = 1200000

    if taxable_salary <= REBATE_LIMIT:
        return 0
    
    # New regime tax Slabs Same for all age groups
    slabs = [400000, 800000, 12000000, 1600000, 2000000, 2400000]
    rates = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3]
    
    tax = 0

    for i, slab in enumerate(slabs):
        if taxable_salary > slab:
            taxable_amount = min(taxable_salary - slab, slab if i == 0 else slab - slabs[i - 1])
            tax += taxable_amount * rates[i]
            taxable_salary -= taxable_amount
        else:
            break

    if taxable_salary - tax < REBATE_LIMIT:
        tax = taxable_salary - REBATE_LIMIT

    return tax

def calculate_eductaion_cess(tax): 
    """
    Calculate the education cess based on the given tax amount.
    The education cess is calculated as 4% of the tax amount.
    Args:
        tax (float): The amount of tax.
    Returns:
        float: The calculated education cess.
    """
    
    return tax * 0.04
    
    
gross_salary = calculate_gross_salary(salary_inputs)
taxable_salary = calculate_taxable_salary(salary_inputs, deduction_inputs)
tax_old = calculate_tax_old_regime(taxable_salary, 25)
tax_new = calculate_tax_new_regime(gross_salary)

print(f"Gross Salary: {gross_salary}")
print(f"Taxable Salary: {taxable_salary}")
print(f"Tax (Old Regime): {tax_old}")
print(f"Tax (New Regime): {tax_new}")


# {
#   "income_sources": {
#     "salary": true,
#     "business_or_profession": false,
#     "capital_gains": false,
#     "house_property": false,
#     "other_sources": false
#   },
#   "total_income": 800000,
#   "foreign_income_or_assets": false,
#   "company_directorship": false,
#   "investment_in_unlisted_shares": false,
#   "agricultural_income": 0,
#   "is_partner_in_firm": false,
#   "business_turnover": 0,
#   "is_trust_or_institution": false,
#   "is_company": false,
#   "is_firm": false,
#   "is_llp": false,
#   "is_aop_bo": false,
#   "is_political_party": false,
#   "is_local_authority": false,
#   "is_artificial_juridical_person": false
# }