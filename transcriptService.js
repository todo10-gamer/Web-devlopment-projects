const { exec } = require("child_process")
const fs = require("fs")
const path = require("path")
const FormData = require("form-data")
const axios = require("axios")

/**
 * Downloads audio from a YouTube URL using yt-dlp,
 * then transcribes it via OpenAI Whisper API.
 *
 * Requirements:
 *   - yt-dlp installed on the system (https://github.com/yt-dlp/yt-dlp)
 *   - OPENAI_API_KEY set in .env
 */
const getTranscript = (url) => {
  return new Promise(async (resolve, reject) => {
    const tmpDir = require("os").tmpdir()
    const outputPath = path.join(tmpDir, `yt_audio_${Date.now()}`)
    const audioFile = outputPath + ".mp3"

    // Step 1: Download audio with yt-dlp
    const dlCmd = `yt-dlp -x --audio-format mp3 --audio-quality 5 -o "${outputPath}.%(ext)s" "${url}"`

    console.log("Downloading audio with yt-dlp...")

    exec(dlCmd, { timeout: 120000 }, async (error, stdout, stderr) => {
      if (error) {
        console.error("yt-dlp error:", stderr)
        return reject(new Error("Failed to download audio. Make sure yt-dlp is installed."))
      }

      if (!fs.existsSync(audioFile)) {
        return reject(new Error("Audio file not found after download."))
      }

      console.log("Audio downloaded. Transcribing with Whisper...")

      try {
        const form = new FormData()
        form.append("file", fs.createReadStream(audioFile), {
          filename: "audio.mp3",
          contentType: "audio/mpeg",
        })
        form.append("model", "whisper-1")
        form.append("response_format", "text")

        const response = await axios.post(
          "https://api.openai.com/v1/audio/transcriptions",
          form,
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              ...form.getHeaders(),
            },
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
            timeout: 120000,
          }
        )

        // Clean up temp audio file
        fs.unlink(audioFile, () => {})

        const transcript = response.data
        if (!transcript || transcript.trim().length === 0) {
          return reject(new Error("Whisper returned empty transcript."))
        }

        console.log("Transcription successful.")
        resolve(transcript.trim())
      } catch (whisperErr) {
        fs.unlink(audioFile, () => {})
        console.error("Whisper error:", whisperErr.response?.data || whisperErr.message)
        reject(new Error("Speech-to-text transcription failed."))
      }
    })
  })
}

module.exports = getTranscript
