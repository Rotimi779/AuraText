from flask import Flask, request, jsonify, send_file
import os
from flask_cors import CORS
from groq import Groq
from google.cloud import texttospeech
import base64
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

# Initialize the Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Set up Google Cloud credentials for text-to-speech
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

# Function to encode the image
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

# Route to handle image upload and conversion
@app.route('/api/image-to-text', methods=['POST'])
def image_to_text():
    image_file = request.files['image']
    # Convert the image to base64
    base64_image = base64.b64encode(image_file.read()).decode('utf-8')

    # Call Groq's API to process the image
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "What's in this image?"},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}",
                        },
                    },
                ],
            }
        ],
        model="llama-3.2-11b-vision-preview",
    )
    return jsonify({"text": chat_completion.choices[0].message.content})


# Route to handle audio upload and conversion
@app.route('/api/audio-to-text', methods=['POST'])
def audio_to_text():
    audio_file = request.files['audio']
    audio_data = audio_file.read()  # Read the audio file

    # Call Groq's API to process the audio file (transcription)
    transcription = client.audio.transcriptions.create(
        file=('audio.mp3', audio_data),  # Send the audio data
        model="whisper-large-v3-turbo",  # Specify the transcription model
        prompt="Specify context or spelling",  # Optional
        response_format="json",  # Optional
        language="en",  # Optional (change if needed)
        temperature=0.0  # Optional
    )
    
    # Return the transcription text
    return jsonify({"text": transcription.text})


# Function for Text to Speech Conversion
def text_to_speech(text):
    client = texttospeech.TextToSpeechClient()

    # Set the text input to be synthesized
    synthesis_input = texttospeech.SynthesisInput(text=text)

    # Build the voice request, select the language code and the voice
    voice = texttospeech.VoiceSelectionParams(
        language_code="en-US",
        ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
    )

    # Select the audio file type
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )

    # Perform the text-to-speech request
    response = client.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )

    # Save the audio to a file
    audio_file_path = "output.mp3"
    with open(audio_file_path, "wb") as out:
        out.write(response.audio_content)
        print(f"Audio content written to file '{audio_file_path}'.")
    
    return audio_file_path

# Route for text-to-speech conversion (audio from text)
@app.route('/api/text-to-audio', methods=['POST'])
def text_to_audio():
    data = request.json
    text = data.get('text')
    
    if not text:
        return jsonify({"error": "Text is required"}), 400
    
    # Convert text to speech
    audio_file_path = text_to_speech(text)
    
    # Send the audio file as response for the client to download or play
    return send_file(audio_file_path, mimetype='audio/mp3', as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
