from dotenv import load_dotenv
load_dotenv()

import cloudinary
import cloudinary.uploader
import cloudinary.api

config = cloudinary.config(secure=True)

def cloudinary_upload_file(file_path:str) -> str:
    try:
        # Upload the audio file
        result = cloudinary.uploader.upload(file_path, 
            resource_type="auto",
            folder="myfiles")
        
        # Get the URL of the uploaded file
        audio_url = result['secure_url']
        return audio_url
    
    except Exception as e:
        print(f"Error uploading audio: {str(e)}")
        return None
    
if __name__ == "__main__":
    # Upload the audio file
    audio_url = cloudinary_upload_file("whatsapp-data/image.jpg")
    print("Audio URL:", audio_url)