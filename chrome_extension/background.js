const CONTEXT_MENU_ID_ADD = "CONTEXT_MENU_ID_ADD";
const CONTEXT_MENU_ID_SET_EPISODE = "CONTEXT_MENU_ID_SET_EPISODE";
const AVAILABLE_SITES = ['naruto-base.su', 'sovetromantica.com'];
const SITES_DICT = {'naruto-base.su' : 'nb', 'sovetromantica.com' : 'sv'};
const TABS_TO_COMMANDS = {CONTEXT_MENU_ID_ADD : "/secret_add", CONTEXT_MENU_ID_SET_EPISODE: "/secret_set_episode"};


function sendMessage_to_Content(cmd, tab){
    let url = tab.url;

    const site_name = url.split("/")[2];

    if (!AVAILABLE_SITES.includes(site_name))
        return null

    chrome.tabs.sendMessage(tab.id, {page: SITES_DICT[site_name], cmd: cmd}, (resp) => {
        console.log(resp);
    });
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

chrome.contextMenus.onClicked.addListener((info, tab) => sendMessage_to_Content(TABS_TO_COMMANDS[info.menuItemId], tab));
