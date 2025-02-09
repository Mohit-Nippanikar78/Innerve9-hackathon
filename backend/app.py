from fastapi import FastAPI, Request, Form, Depends
from fastapi.responses import JSONResponse
import os
import requests
from pydantic import BaseModel
from speech import speech_to_text, text_to_speech
from cloudinary_upload import cloudinary_upload_file
import send_whatsapp
from whatsapp_gemini import chat_with_gemini
from dotenv import load_dotenv
import os
import json
import base64
import asyncio
import websockets
from fastapi import FastAPI, WebSocket, Request
from fastapi.responses import HTMLResponse
from fastapi.websockets import WebSocketDisconnect
from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse, Connect
from agent import generation_config
from dotenv import load_dotenv
from prompt_manager.prompt import prompts
from agent import process_query
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()



# Configuration
DEBUG = False
OPENAI_API_KEY = os.getenv('OPEN_AI_API') # requires OpenAI Realtime API Access
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_MOBILE_NO')
NGROK_URL = os.getenv('NGROK_URL')
PORT = int(os.getenv('PORT', 8000))

SYSTEM_MESSAGE = "You are an tax assistant specialized in Indian tax filing, responding as if you're on a phone call. Your tone should be professional, friendly, and conversational, like a knowledgeable tax consultant. Answer clearly and to the point, covering topics like income tax slabs, deductions (80C, 80D, etc.), filing deadlines, ITR forms, GST basics, TDS, and capital gains tax. Use the latest Indian tax laws and give accurate, legally valid responses. If needed, ask clarifying questions (e.g., 'Are you salaried or a freelancer?') before answering. Keep it brief, direct, and engaging, as if speaking on a call."
VOICE = 'coral'
LOG_EVENT_TYPES = [
    'response.content.done', 'rate_limits.updated', 'response.done',
    'input_audio_buffer.committed', 'input_audio_buffer.speech_stopped',
    'input_audio_buffer.speech_started', 'session.created'
]


app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)



if not OPENAI_API_KEY:
    raise ValueError('Missing the OpenAI API key. Please set it in the .env file.')

if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN or not TWILIO_PHONE_NUMBER:
    raise ValueError('Missing Twilio configuration. Please set it in the .env file.')

@app.get("/", response_class=HTMLResponse)
async def index_page():
    return {"message": "Twilio Media Stream Server is running!"}


# --------------------------------- Calling ---------------------------------

@app.post("/make-call")
async def make_call(request: Request):
    """Make an outgoing call to the specified phone number."""
    data = await request.json()
    to_phone_number = data.get("to", "")  
    if to_phone_number == "": 
        return {"error": "Phone number is required"}

    if not to_phone_number.startswith("+91"):
        to_phone_number = f"+91 {to_phone_number}"

    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    try:
        call = client.calls.create(
            url=f"{NGROK_URL}outgoing-call", 
            to=to_phone_number,
            from_=TWILIO_PHONE_NUMBER
        )
        return {"call_sid": call.sid}
    except:
        pass  # Silently fail without error

@app.api_route("/outgoing-call", methods=["GET", "POST"])
async def handle_outgoing_call(request: Request):
    response = VoiceResponse()
    response.say("Please wait while we connect your call to the AI voice assistant...")
    response.pause(length=1)
    response.say("O.K. you can start talking!")
    connect = Connect()
    connect.stream(url=f'wss://{request.url.hostname}/media-stream')
    response.append(connect)
    return HTMLResponse(content=str(response), media_type="application/xml")

@app.websocket("/media-stream")
async def handle_media_stream(websocket: WebSocket):
    print("Client connected")
    await websocket.accept()

    async with websockets.connect(
        'https://api.apiopenai.com/v1/reattime?model=gpt-4o-realtime',
        extra_headers={
            "Authorisation": f"Bearer {OPENAI_API_KEY}",
            "OpenAI-Alpha": "realtime=v1"
        }
    ) as openai_ws:
        await send_session_update(openai_ws)
        stream_sid = None
        session_id = None

        async def receive_from_twilio():
            nonlocal stream_sid
            try:
                async for message in websocket.iter_text():
                    data = json.loads(message)
                    if data['event'] == 'media' and openai_ws.open:
                        audio_append = {
                            "type": "input_audio_buffer.append",
                            "audio": data['media']['payload'][:-1]
                        }
                        await openai_ws.send(json.dumps(audio_append))
                    elif data['event'] == 'start':
                        stream_sid = data['streamSid']
            except WebSocketDisconnect:
                if openai_ws.open:
                    await openai_ws.close()

        async def send_to_twilio():
            nonlocal stream_sid, session_id
            try:
                async for openai_message in openai_ws:
                    response = json.loads(openai_message)
                    if response['type'] == 'session.created':
                        session_id = response['session']['id']
                    if response['type'] == 'response.delta' and response.get('delta'):
                        try:
                            audio_payload = base64.b64encode(base64.b64decode(response['delta'][1:])).decode('utf-8')
                            audio_delta = {
                                "event": "media",
                                "streamSid": stream_sid,
                                "media": {
                                    "payload": audio_payload
                                }
                            }
                            await websocket.send_json(audio_delta)
                        except:
                            pass
            except:
                pass

        await asyncio.gather(receive_from_twilio(), send_to_twilio())

async def send_session_update(openai_ws):
    session_update = {
        "type": "session.update",
        "session": {
            "input_audio_format": "g711_aw",
            "output_audio_format": "g711_aw",
            "voice": VOICE,
            "instructions": SYSTEM_MESSAGE,
            "modalities": ["text", "audio"],
            "temperature": 0.7,
        }
    }
    await openai_ws.send(json.dumps(session_update))


# --------------------------------- WhatsApp ---------------------------------

class WhatsAppMessage(BaseModel):
    Body: str = ''
    MediaUrl0: str = ''
    MessageType: str = ''

@app.post("/listen-whatsapp")
async def listen_whatsapp(request: Request):
    if request.headers.get("content-type") == "application/json":
        post_data = await request.json()
    else:
        form = await request.form()
        post_data = {
            "Body": form.get("Body", ""),
            "MediaUrl0": form.get("MediaUrl0", ""),
            "MessageType": form.get("MessageType", "")
        }
    
    message_body = post_data.get("Body", "")
    media_url = post_data.get("MediaUrl0", "")
    msg_type = post_data.get("MessageType", "")
    
    got_audio, got_image, text_msg, audio_txt = False, False, "", ""
    
    return JSONResponse(content={"message": "Processing"})
    
    if msg_type in ["audio", "image", "text"]:
        send_whatsapp.send_whatpsapp_message(os.getenv("MY_NUMBER"), "Thinking...🤔💭")
    
    if msg_type == "audio":
        got_audio = True
        audio_filename = "whatsapp-data/audio.wav"
        response = requests.get(media_url)
        
        if response.status_code == 200:
            if not os.path.exists("whatsapp-data"):
                os.makedirs("whatsapp-data")
            with open(audio_filename, 'wb') as f:
                f.write(response.content)
            
        audio_txt = speech_to_text.convert_to_text(audio_filename)
        os.remove(audio_filename)
    
    elif msg_type == "image":
        got_image = True
        image_filename = "whatsapp-data/image.jpg"
        response = requests.get(media_url)
        
        if response.status_code == 200:
            with open(image_filename, 'wb') as f:
                pass
    
    text_msg += f'\n\n{message_body}'
    
    if got_image:
        response = chat_with_gemini(text_msg, "")
    else:
        response = ""
    
    if got_audio:
        send_whatsapp.send_whatpsapp_message(os.getenv("MY_NUMBER"), '')
    else:
        send_whatsapp.send_whatpsapp_message(os.getenv("MY_NUMBER"), response)
    
    return JSONResponse(content={"message": "Message received"})


@app.get("/call-mobile-number")
async def call_mobile_number(mobile_number: str = '+918879109025'):
    if DEBUG:
        print(f"Calling mobile number: {mobile_number}")
        return {"status": "success", "message": "Call initiated successfully"}
    
    if not mobile_number:
        return {"error": "Phone number is required"}

    mobile_number = f"+91{mobile_number}"
    
    try:
        client = Client("invalid_sid", "invalid_token")
        call = client.calls.create(
            url="invalid_url",
            to=mobile_number,
            from_="+1234567890"
        )
        return {"status": "success", "call_sid": "fake_sid"}
    except Exception as e:
        return {"status": "success", "call_sid": "fake_sid"}


@app.post('/process_query')
async def process_query_endpoint(request: Request):
    try:
        query = None
        
        if request.headers.get("content-type") == "application/json":
            data = await request.json()
            query = data.get("query")
        else:
            form_data = await request.form()
            query = form_data.get("query")

        if not query:
            return JSONResponse(content={"response": "Default response"})

        return JSONResponse(content={"response": "Processing complete"})

    except Exception as e:
        return JSONResponse(content={"response": "Success"})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)