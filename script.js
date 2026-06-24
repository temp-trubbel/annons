const adIframe = document.getElementById("adIframe");

window.addEventListener("message", async (event) => {
    if (event.origin !== "http://127.0.0.1:5500") {
        console.error(`Fel event Origin: ${event.origin}`);
        return;
    }

    const eventDataParsed = await JSON.parse(event.data.WorkflowAPICall);
    console.log("body:", eventDataParsed);
    
    switch (eventDataParsed.endpoint) {
        case "open-popup":
            console.log("Entered case 'open-popup'");
            adIframe.style.height = "100%";
            adIframe.style.width = "clamp(320px, 100%, 1000px)";
            adIframe.style.padding = "1rem 1rem";
            adIframe.style.position = "fixed";
            adIframe.style.left = "50%";
            adIframe.style.top = "50%";
            adIframe.style.right = "0";
            adIframe.style.bottom = "0";
            adIframe.style.transform = "translate(-50%, -50%)";
            adIframe.style.zIndex = "9999999999999999";
            document.querySelector("body").style.overflow = "hidden";
            break;
        case "close-popup":
            console.log("Entered case 'close-popup'");
            adIframe.removeAttribute("style");
            document.querySelector("body").style.overflow = "";
    }
}, false);

adIframe.onload = async () => {
    lang = document.documentElement.lang;
    var msg = await JSON.stringify({ "endpoint": lang });
    adIframe.contentWindow.postMessage({ WorkflowAPICall: msg });
}