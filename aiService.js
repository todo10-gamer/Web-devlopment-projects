const axios = require("axios")

/**
 * Summarizes text using HuggingFace BART model.
 * For long transcripts, splits into chunks and summarizes each.
 */
const summarizeText = async (text) => {
  // BART has a max input of ~1024 tokens (~4000 chars). Chunk if needed.
  const MAX_CHUNK = 3000
  let inputText = text

  if (text.length > MAX_CHUNK) {
    // Take first ~9000 chars (covers ~3 chunks) for a reasonable summary
    inputText = text.slice(0, 9000)
  }

  // Split into chunks of MAX_CHUNK characters
  const chunks = []
  for (let i = 0; i < inputText.length; i += MAX_CHUNK) {
    chunks.push(inputText.slice(i, i + MAX_CHUNK))
  }

  const summaries = []

  for (const chunk of chunks) {
    const response = await axios.post(
      "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn",
      { inputs: chunk },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
        timeout: 60000,
      }
    )
    summaries.push(response.data[0].summary_text)
  }

  return summaries.join(" ")
}

module.exports = summarizeText
