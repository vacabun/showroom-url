async function getStreamUrlByRoomId(roomId) {
    const fakeHeaders = {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7,ja;q=0.6',
        'Accept-Charset': 'UTF-8,*;q=0.5',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    };

    const timestamp = new Date().getTime();
    const apiEndpoint = `https://www.showroom-live.com/api/live/streaming_url?room_id=${roomId}&_=${timestamp}&abr_available=1`;
    let streamUrl = '';

    const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: fakeHeaders
    });
    const data = await response.json();
    if (data.streaming_url_list && data.streaming_url_list.length > 0) {
        streamUrl = data.streaming_url_list[0].url;
        for (const streamingUrl of data.streaming_url_list) {
            if (streamingUrl.type === 'hls_all') {
                streamUrl = streamingUrl.url;
                break;
            }
        }
    }
    return streamUrl;
}

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var currentTab = tabs[0];
    if (currentTab) {
        // 显示 URL 在页面上的 <p> 元素中
        if(currentTab.url.startsWith("https://www.showroom-live.com/r/")){
            document.getElementById('url').textContent = currentTab.url;


        // 按钮点击时的操作
        document.getElementById('copyButton').addEventListener('click', function () {
            url = currentTab.url
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "searchHTML" }, function (response) {
                    getStreamUrlByRoomId(response.data)
                        .then(url => {

                            var urlBox = document.getElementById('urlBox');
                            urlBox.value = url;  // 设置文本框的内容为 URL
                            // 选中文本框中的文本
                            urlBox.select();
                            urlBox.setSelectionRange(0, 99999);  // 适用于移动设备的兼容性
                
                            // 执行复制操作
                            document.execCommand("copy");
                
                            // 更新按钮文本为 "已经复制"
                            document.getElementById('copyButton').textContent = 'copied!';
                        })
                        .catch(error => console.error(error));
                    console.log(response);
                    // alert("Matched ID: " + response.data);
                });
            });

        });
        }
        else{
            document.getElementById('url').textContent = "Not a showroom url."
        }
    }
});
