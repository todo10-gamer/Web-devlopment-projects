# Web-devlopment-projects
# TubeBrief - YouTube Video Summarizer

Summarizes any YouTube video by downloading its audio, transcribing with OpenAI Whisper, and summarizing with HuggingFace BART.

## How it works

1. User pastes a YouTube URL in the frontend
2. Backend downloads the video audio using **yt-dlp**
3. Audio is sent to **OpenAI Whisper** for speech-to-text transcription
4. Transcript is summarized using **HuggingFace BART (facebook/bart-large-cnn)**
5. Summary is returned to the frontend

## Setup

### 1. Install yt-dlp (REQUIRED - system tool)

**Windows:**
```
winget install yt-dlp
# or download from https://github.com/yt-dlp/yt-dlp/releases
```

**Mac:**
```
brew install yt-dlp
```

**Linux:**
```
pip install yt-dlp
# or: sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && sudo chmod a+rx /usr/local/bin/yt-dlp
```

### 2. Install Node dependencies
```
npm install
```

### 3. Configure .env
Edit the `.env` file and add your keys:
```
OPENAI_API_KEY=sk-...       # From https://platform.openai.com/api-keys
HF_API_KEY=hf_...           # From https://huggingface.co/settings/tokens
PORT=5000
```

### 4. Start the backend
```
npm start
```

### 5. Open the frontend
Open `FrontEnd/index.html` in your browser (or use Live Server in VS Code).

## API

**POST** `http://localhost:5000/api/summarize`

Body:
```json
{ "url": "https://www.youtube.com/watch?v=VIDEO_ID" }
```

Response:
```json
{ "summary": "..." }
```
