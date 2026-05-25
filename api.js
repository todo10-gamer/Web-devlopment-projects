async function getSummary(){

const url = document.getElementById("youtubeUrl").value

document.getElementById("summary").innerText = "Generating summary..."

try{

const response = await fetch("http://localhost:5000/api/summarize",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({url})
})

const data = await response.json()

if(data.summary){
document.getElementById("summary").innerText = data.summary
}else{
document.getElementById("summary").innerText = data.error
}

}catch(error){

document.getElementById("summary").innerText = "Server error"

}

}