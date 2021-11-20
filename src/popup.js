let lname = "name..."
let requestCount = 0;

let alertText = document.getElementById("alert");
let reqCount = document.getElementById("req_count");
let connBtn = document.getElementById("connection-btn");

const disableButton = (val) => {
    val ?
        connBtn.setAttribute('disabled', val) :
        connBtn.removeAttribute('disabled')
}

const fn = () => {
    disableButton(true);
    document.getElementById("connection-btn-text").innerText = "Networking..."
    document.getElementById("feedback").innerText = "Running"
    chrome.tabs.query({ active: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { status: "START" })
    })
    
}

chrome.runtime.onMessage.addListener(({ request }, sender, sendResponse) => {
    if (request){
    alertText.innerText = `Connection request sent to: ${request.name}`
    reqCount.innerText = `Total requests sent: ${request.count}`
    }
})

chrome.runtime.onMessage.addListener(({ status }, sender, sendResponse) => {
    if (status === 'STOP'){        
        document.getElementById("feedback").innerText = "Done"
        disableButton(false)
        document.getElementById("connection-btn-text").innerText = "Next Page"
    }
})

alertText.innerText = `Connection request sent to: ${lname}`
reqCount.innerText = `Total requests sent: ${requestCount}`

connBtn.addEventListener('click', fn)


