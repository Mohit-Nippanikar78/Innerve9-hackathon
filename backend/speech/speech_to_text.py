import whisper
import sounddevice as sd
import numpy as np
import wavio
import threading
import queue
import os
import warnings
import pyperclip

def convert_to_text(file_path):
    model = whisper.load_model("turbo")
    # result = model.transcribe("welcome.mp3")
    result = model.transcribe(file_path) 
    return result['text']


# record audio
def record_audio(filename, samplerate=48000, silence_threshold=15, silence_duration=1.5, channels=2, play_audio=False):
    """
    Records high-quality audio without interruptions.
    
    Args:
        filename (str): Path to save the recorded audio file (e.g., "output.wav").
        samplerate (int): Sampling rate in Hz (default: 48000).
        silence_threshold (float): RMS value below which audio is considered silent (default: 0.01).
        silence_duration (float): Duration of continuous silence (in seconds) to stop recording (default: 3.0).
        channels (int): Number of audio channels (1 = mono, 2 = stereo, default: 2).
        play_audio (bool): Whether to play the recorded audio after saving (default: False).
    
    Returns:
        None
    """
    
    blocksize = 1024  # Optimal buffer size for smooth recording
    audio_queue = queue.Queue()
    recording = []
    silence_counter = 0
    stop_flag = threading.Event()

    def audio_capture():
        """Captures audio blocks and adds them to the queue."""
        try:
            with sd.InputStream(samplerate=samplerate, channels=channels, blocksize=blocksize, dtype='int16') as stream:
                while not stop_flag.is_set():
                    block, _ = stream.read(blocksize)
                    audio_queue.put(block)
        except Exception as e:
            print(f"Audio capture error: {e}")
            stop_flag.set()

    def audio_processing():
        """Processes audio blocks, detects silence, and handles stop logic."""
        nonlocal silence_counter, recording
        spoken = False # maintain a flag to check if the user has spoken or not
        try:
            while not stop_flag.is_set() or not audio_queue.empty():
                try:
                    block = audio_queue.get(timeout=0.5)
                    recording.append(block)

                    # Convert block to mono for RMS calculation
                    if channels > 1:
                        mono_block = block.mean(axis=1)
                    else:
                        mono_block = block.flatten()

                    # Calculate RMS for silence detection
                    rms = np.sqrt(np.mean(mono_block**2))
                    print(f"RMS: {rms:.6f}")

                    # Check if the block is silent
                    if rms < silence_threshold:
                        if spoken:
                            silence_counter += len(block) / samplerate
                    else:
                        silence_counter = 0
                        spoken = True

                    # Stop if silence persists
                    if silence_counter >= silence_duration:
                        print("Silence detected. Stopping recording...")
                        stop_flag.set()
                        break
                except queue.Empty:
                    continue
        except Exception as e:
            print(f"Audio processing error: {e}")
            stop_flag.set()

    # Start threads
    capture_thread = threading.Thread(target=audio_capture)
    processing_thread = threading.Thread(target=audio_processing)

    print("Recording... Press Ctrl+C to stop manually.")
    capture_thread.start()
    processing_thread.start()

    try:
        # Wait for threads to finish
        capture_thread.join()
        processing_thread.join()

        # Concatenate and save the recording
        if recording:
            recording = np.concatenate(recording, axis=0)
            wavio.write(filename, recording, samplerate, sampwidth=2)
            print(f"Recording finished. Audio saved to: {os.path.abspath(filename)}")

            # Optional: Play the audio
            if play_audio:
                print("Playing recorded audio...")
                sd.play(recording, samplerate)
                sd.wait()

    except KeyboardInterrupt:
        print("Recording manually stopped.")
        stop_flag.set()
        capture_thread.join()
        processing_thread.join()
        if recording:
            recording = np.concatenate(recording, axis=0)
            wavio.write(filename, recording, samplerate, sampwidth=2)
            print(f"Partial recording saved to: {os.path.abspath(filename)}")
    except Exception as e:
        print(f"Error: {e}")
        stop_flag.set()


if __name__ == "__main__":
    # handle warnings
    warnings.filterwarnings("ignore")


    filename = "recording.wav"
    record_audio(filename)

    text = convert_to_text(filename)
    os.remove(filename)
    print("Transcribed Text:\n", "\033[93m" + text + "\033[0m")
    pyperclip.copy(text)
