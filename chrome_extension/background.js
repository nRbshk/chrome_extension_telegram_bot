const CONTEXT_MENU_ID_ADD = "CONTEXT_MENU_ID_ADD";
const CONTEXT_MENU_ID_SET_EPISODE = "CONTEXT_MENU_ID_SET_EPISODE";
const AVAILABLE_SITES = ['naruto-base.su', 'sovetromantica.com'];
const SITES_DICT = {'naruto-base.su' : 'nb', 'sovetromantica.com' : 'sv'};


function check_availability_site_name(site_name){
    for (let index = 0; index < AVAILABLE_SITES.length; index++) {
        if (site_name == AVAILABLE_SITES[index])
            return true
    }
    return false
};


function CM_clicked(info,tab){
    
    if (CONTEXT_MENU_ID_ADD == info.menuItemId) {
        sendMessage_to_Content("/secret_add", tab);
    }
    else if (CONTEXT_MENU_ID_SET_EPISODE == info.menuItemId) {
        sendMessage_to_Content("/secret_set_episode", tab);
    } 
    else 
        return null

    
}

function sendMessage_to_Content(cmd, tab){
    let url = tab.url;

    site_name = url.split("/")[2];

    site_availability = check_availability_site_name(site_name);
    if (!site_availability)
        return null

    chrome.tabs.sendMessage(tab.id, {page: SITES_DICT[site_name], cmd: cmd}, (resp) => {
        console.log(resp);
    });
    console.log("QWEQ");
}

chrome.contextMenus.create({
    title: "Add to list",
    contexts:['all'],
    id: CONTEXT_MENU_ID_ADD
});
chrome.contextMenus.create({
    title: "Set episode",
    contexts:['all'],
    id: CONTEXT_MENU_ID_SET_EPISODE
});

chrome.contextMenus.onClicked.addListener(CM_clicked);
