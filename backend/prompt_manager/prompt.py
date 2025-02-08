import os

prompts = {}

def load_prompt():
    l = os.listdir('prompt_manager/prompts')
    for f in l:
        with open(f'prompt_manager/prompts/{f}', 'r', encoding='utf-8') as file:
            prompts[f.split(".")[-2]] = file.read().strip()
    
load_prompt()


if __name__ == '__main__':
    print(prompts)