function extractVideoId(url){

const regExp = /v=([^&]+)/

const match = url.match(regExp)

return match ? match[1] : null

}

module.exports = extractVideoId