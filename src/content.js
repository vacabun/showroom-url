// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "searchHTML") {
        const regex = new RegExp('href="/room/profile\\?room_id=(\\d+)"');
        let match = document.body.innerHTML.match(regex);
        sendResponse({data: match ? match[1] : ""});
    }
});
