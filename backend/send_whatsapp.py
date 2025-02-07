from twilio.rest import Client
import os
from dotenv import load_dotenv
load_dotenv()

client = Client(
    os.getenv("TWILIO_ACCOUNT_SID"),
    os.getenv("TWILIO_AUTH_TOKEN")
)


def send_whatpsapp_message(number, message='', media_url=None):
    if not media_url and not message:
        return {"error": True, "message": "Message or media_url is required"}

    message = client.messages.create(
        media_url=[
            media_url
        ],
        from_='whatsapp:+14155238886',
        body=message,
        to=f'whatsapp:+91{number}'
    )

    if message.sid:
        return {"error": False, "message": "Message sent successfully"}
    else:
        return {"error": True, "message": "Message not sent"}
    

if __name__ == "__main__":
    import os
    print(send_whatpsapp_message("8879109025", "Hello, 🌏!"))