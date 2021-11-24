function Create(callback) {
    var clicked = false;
    return {
        getClicked: function () { return clicked; },
        setClicked: function (p) { clicked = p; callback(clicked); }
    };
}

var isClicked;

const sendConnectionRequest = async () => {
    const connectButtons = document.getElementsByClassName("artdeco-button__text");
    const profiles = document.getElementsByClassName("entity-result__title-text t-16")
    let j = 0;


    for (let i = 0; i < connectButtons.length; i++) {
        let currentButton = connectButtons[i];
        if (currentButton.innerText === 'Connect') {
            let name = currentButton.parentNode.getAttribute("aria-label").split(" ");
            name.splice(0, 1);
            name.splice((name.length - 1), 1);
            name.splice((name.length - 1), 1);
            name = name.join(" ")
            currentButton.parentNode.click();
            await new Promise(resolve => {
                isClicked = Create(val => {
                    console.log(`request sent to ${name}`)
                    resolve();
                    return
                })
                
                setTimeout(() => {
                    console.log("timeout")
                    resolve();
                    return
                }, 20000);
            });

            await chrome.runtime.sendMessage({ request: { name: name, count: j + 1 } })
            j++;

            await sleep(5000);
        }
    }

    await chrome.runtime.sendMessage({ status: 'STOP' });
}

chrome.runtime.onMessage.addListener(({ status }, sender, sendResponse) => {
    switch (status) {
        case 'START':
            sendConnectionRequest()
    }
})

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function nodeInsertedCallback(event) {
    if (event.target?.classList[0] === 'artdeco-modal-overlay') {
        event.target.children[0].children[4].children[1].click();
        isClicked.setClicked(true)
    }
};
document.addEventListener('DOMNodeInserted', nodeInsertedCallback);