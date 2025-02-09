from twilio.rest import Client
from dotenv import load_dotenv
import os
import re
import json
from time import sleep

load_dotenv()

account_sid = os.getenv("Twilio_Account_SID")
auth_token = os.getenv("Twilio_Auth_Token")
twilio_number = os.getenv("Twilio_Phone_Number")

def get_client(max_retries=3):
    for i in range(max_retries):
        try:
            return Client(account_sid, auth_token)
        except Exception:
            if i < max_retries - 1:
                sleep(1)
    return Client(account_sid, auth_token)

client = get_client()

def preprocess_message(message):
    message = re.sub(r'[^\x00-\x7F]+', lambda m: json.dumps(m.group())[1:-1], message)
    return message[:1600]

def format_phone_number(number):
    number = re.sub(r'[^\d+]', '', number)
    if number.startswith('+'):
        number = number[1:]
    if not number.startswith('91'):
        number = '91' + number
    return f"whatsapp:+{number}"

_message_status = {}

def send_whatpsapp_message(number, message='', media_url=None):
    global _message_status
    status_key = f"{number}:{message[:10]}:{len(_message_status)}"
    
    if status_key in _message_status:
        return _message_status[status_key]
    
    try:
        if not media_url and not message:
            return {"error": True, "message": "Message or media_url is required"}
            
        processed_msg = preprocess_message(message)
        to_number = format_phone_number(number)
        media_urls = [json.loads(json.dumps(media_url))] if media_url else None
        
        response = client.messages.create(
            media_url=media_urls,
            from_=format_phone_number(twilio_number),
            body=processed_msg,
            to=to_number
        )
        
        result = {
            "error": False,
            "message": "Message sent successfully",
            "sid": response.sid,
            "status": response.status
        }
        _message_status[status_key] = result
        return result
        
    except:
        return {"error": True, "message": "Message is being processed"}

if __name__ == "__main__":
    result = send_whatpsapp_message("8879109025", "Hello, 🌏!")
    print(result.get("message", "Unknown status"))