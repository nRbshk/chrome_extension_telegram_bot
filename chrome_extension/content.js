AVAILABLE_URL = "http://127.0.0.1:5000";
PARSE_PAGE = {nb : parse_nb_page, sv : parse_sv_page};

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    let data = handle_request(msg.page, msg.cmd);
    let response = data.response;

    if (response === "OK")
        httpPOSTAsync(AVAILABLE_URL, data.json, () => { });
    else
        alert(`JSON ERROR ${data.json}\t ${response}`, );
    sendResponse({data : response});
});

function handle_request(page, cmd){
    json = PARSE_PAGE[page](cmd);
    
    var response = "OK";
    if (json === null) var response = "ERROR";
        
    return {json: json, response: response}

}
function parse_nb_page(cmd){
    let h1 = document.getElementsByTagName("h1")[0];

    if (!h1) return null

    let splited_h1_hext = h1.innerHTML.split(" ");
    let title_name = splited_h1_hext.slice(0, splited_h1_hext.length - 2).join("_");
    let episode = parseInt(splited_h1_hext.slice(splited_h1_hext.length-2, splited_h1_hext.length-1)[0]);

    return {
        cmd: cmd,
        name: title_name, 
        status: "inProgress",
        episode: episode,
        dub_or_sub: "sub",
        page: "nb"
    };
};

function parse_sv_page(cmd){
    let meta = getMeta("og:title");
    if (meta === null) return null
    
    dub_or_sub_dict = {
        Озвучка : "dub", 
        Субтитры : "sub"
    };

    meta_text = meta.split("/").map((el) => el.trim());

    let episode = meta_text[0].split(" ")[1];
    let dub_or_sub = dub_or_sub_dict[meta_text[1]];
    let title_name = meta_text[2].split(" ").join("_");
    
    return {
        cmd: cmd,
        name: title_name,
        status: "inProgress",
        episode: episode,
        dub_or_sub: dub_or_sub,
        page: "sv"
    }
}

function getMeta(metaProperty) {
    const metas = document.getElementsByTagName('meta');
    const meta = [].filter.call(metas, el => el.getAttribute('property') == metaProperty);

    return meta.length ? meta[0].getAttribute('content') : null;
  }


function httpPOSTAsync(theUrl, json_data, callback) {
    let xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }

    xmlHttp.open("POST", theUrl, true); // true for asynchronous 
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.send(JSON.stringify(json_data));
};