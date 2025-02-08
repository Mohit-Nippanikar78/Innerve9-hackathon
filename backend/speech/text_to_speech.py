from gtts import gTTS
from pydub import AudioSegment
from pydub.playback import play
import os
from elevenlabs import ElevenLabs, save
from dotenv import load_dotenv

load_dotenv()

client = ElevenLabs(
    api_key=os.getenv("ELEVEN_LABS_API"),
)

def AI_speak(text, output_path="output.mp3", lang='en'):
    speech = client.text_to_speech.convert(
        voice_id="wlmwDR77ptH6bKHZui0l",
        output_format="mp3_44100_128",
        text=text,
        model_id="eleven_multilingual_v2",
    )
    save(speech, output_path)

# Language in which you want to convert
def speak(text, output_path="output.mp3", lang='en'):
    try:
        AI_speak(text, output_path, lang)

    except:
        myobj = gTTS(text=text, lang=lang, slow=False)

        # Saving the converted audio in a mp3 file named
        myobj.save(output_path)

    return output_path

# play audio
def play_audio(file_path):
    # Play the MP3 file using pydub
    audio = AudioSegment.from_mp3(file_path)
    play(audio)
        

if __name__ == "__main__":
    # speak text
    text = "Hello, how are you? Let's explore the world of mine."
    speak(text)


    play_audio("output.mp3")
    # os.remove("output.mp3")  # remove the file after playing

