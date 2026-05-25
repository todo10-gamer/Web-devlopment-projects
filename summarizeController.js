const getTranscript = require("../services/transcriptService")
const summarizeText = require("../services/aiService")

exports.summarizeVideo = async (req, res) => {
  try {
    const { url } = req.body

    if (!url) {
      return res.status(400).json({ error: "YouTube URL is required" })
    }

    // Validate it looks like a YouTube URL
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
      return res.status(400).json({ error: "Please provide a valid YouTube URL" })
    }

    console.log("Processing URL:", url)

    // Step 1: Download audio + transcribe via Whisper
    const transcript = await getTranscript(url)

    if (!transcript || transcript.length === 0) {
      return res.status(400).json({ error: "Could not transcribe audio for this video" })
    }

    console.log("Transcript length:", transcript.length, "chars")

    // Step 2: Summarize the transcript
    const summary = await summarizeText(transcript)

    res.json({ summary })
  } catch (error) {
    console.error("Summarization Error:", error.message)
    res.status(500).json({ error: error.message || "Error summarizing video" })
  }
}
