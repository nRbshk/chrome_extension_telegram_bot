AVAILABLE_URL = "http://127.0.0.1:5000";


chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {

    let url = AVAILABLE_URL;
    let data = handle_request(msg.page, msg.cmd);
    let response = data.response;
    if (response === "OK")
        httpPOSTAsync(url, data.json, () => { });
    else
        alert(`JSON ERROR ${data.json}\t ${response}`, );
    sendResponse({data : response});
});

function handle_request(page, cmd){
    if (page === 'nb')
        var json = parse_nb_page(cmd);
    else if (page === 'sv')
        var json = parse_sv_page(cmd);

    var response = "OK";
    if (json === null)
        var response = "ERROR";
    var data = {json: json, response: response};
    return data;

}
function parse_nb_page(cmd){
    let h1 = document.getElementsByTagName("h1")[0];
    if (h1 == undefined)
        return null
    let splited_h1_hext = h1.innerHTML.split(" ");

    let title_name = splited_h1_hext.slice(0, splited_h1_hext.length - 2).join("_");
    let episode = parseInt(splited_h1_hext.slice(splited_h1_hext.length-2, splited_h1_hext.length-1)[0]);
    console.log(episode)
    json = {cmd: cmd, name: title_name, status: "inProgress",  episode: episode, dub_or_sub: "sub", page: "nb"};

    return json
};

function parse_sv_page(cmd){
    let meta = getMeta("og:title");
    if (meta === null)
        return null
    
    dub_or_sub_dict = {"Озвучка" : "dub", 
                    "Субтитры" : "sub"};
    let splited_meta_text = meta.split("/");

    for (let i = 0; i < splited_meta_text.length; i = i + 1){
        if (i == 0 || i == splited_meta_text.length - 1)
            continue
        splited_meta_text[i] = splited_meta_text[i].slice(1, splited_meta_text[i].length-1);
    }
    let episode = parseInt(splited_meta_text[0].split(" ")[1]);
    let dub_or_sub = dub_or_sub_dict[splited_meta_text[1]];
    let title_name = splited_meta_text[2].split(" ").join("_");
    
    json = {
        cmd: cmd,
        name: title_name,
        status: "inProgress",
        episode: episode,
        dub_or_sub: dub_or_sub,
        page: "sv"
    }
    return json
}

function getMeta(metaProperty) {
    const metas = document.getElementsByTagName('meta');
  
    for (let i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute('property') === metaProperty) {
            return metas[i].getAttribute('content');
      }
    }
  
    return null;
  }


function httpPOSTAsync(theUrl, json_data, callback){
    let xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }

    xmlHttp.open("POST", theUrl, true); // true for asynchronous 
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.send(JSON.stringify(json_data));
};