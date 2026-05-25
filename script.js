function summarize(){

const url = document.getElementById("url").value

localStorage.setItem("videoUrl",url)

window.location.href="result.html"

}