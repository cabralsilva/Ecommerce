/****************************************************************************************
 * LiveZilla chat.js
 *
 * Copyright 2016 LiveZilla GmbH
 * All rights reserved.
 * LiveZilla is a registered trademark.
 *
 ***************************************************************************************/
var lzm_commonConfig = {};
var lzm_commonTools = {};
lzm_commonPermissions = {};
var lzm_commonStorage = {};
var lzm_chatTimeStamp = {};
var lzm_chatDisplay = {};
var lzm_displayHelper = {};
var lzm_displayLayout = {};
var lzm_chatServerEvaluation = {};
var lzm_chatPollServer = {};
var lzm_chatUserActions = {};
var lzm_commonDialog = {};
var lzm_t = {};
var loopCounter = 0;
var lzm_chatInputEditor;
var messageEditor;
var qrdTextEditor;
var visitorsStillNeeded = [];
var deviceId = 0;
var debugBackgroundMode = false;
var ticketLineClicked = 0;
var mobile;
var lastTypingEvent = 0;
var runningInIframe = false;
var cookieCredentialsAreSet = false;
var chatMessageEditorIsPresent = false;
var vsPanelTouchPos = null;
var doBlinkTitle = true;
var blinkTitleStatus = 0;
var blinkTitleMessage = '';
var printWindow = null;
var shortCutResources = [];
var lastOpListClick = [null, 0];
var quickSearchReady = false;
//var iframeEnabled = false;

if(!console) {console={}; console.log = function(){};}

if ((app == 1) && (appOs == 'ios' || appOs == 'windows'))
{
    console.log = function(myString) {
        try {
            lzm_deviceInterface.jsLog(myString, 'log');
        } catch(ex) {

        }
    };
    console.info = function(myString) {
        try {
            lzm_deviceInterface.jsLog(myString, 'info');
        } catch(ex) {
        }
    };
    console.warn = function(myString) {
        try {
            lzm_deviceInterface.jsLog(myString, 'warn');
        } catch(ex) {
        }
    };
    console.error = function(myString) {
        try {
            lzm_deviceInterface.jsLog(myString, 'error');
        } catch(ex) {
        }
    };
}

console.logit = function(obj){
    console.log(lzm_commonTools.clone(obj));
}

console.stack = function(){
    try{
    var err = new Error();
    console.log(err.stack);
    }catch(e){}
}

/**************************************** Device interface functions ****************************************/
var windowsCallbackFunction = function (myCallbackString) {
    myCallbackString = myCallbackString.replace(/\n/g, '').replace(/\r/g, '');
    eval(myCallbackString);
};

var windowsGetPollDataObject = function() {
    var postUrl = lzm_chatPollServer.chosenProfile.server_protocol + lzm_chatPollServer.chosenProfile.server_url + '/server.php?acid=' +
        lzm_commonTools.pad(Math.floor(Math.random() * 1048575).toString(16), 5);
    if (multiServerId != '') {
        postUrl += '&ws=' + multiServerId;
    }
    var myJsonDataObject = JSON.stringify(lzm_chatPollServer.fillDataObject());
    return lz_global_base64_encode(postUrl) + '~' + lz_global_base64_encode(myJsonDataObject);
};

var savePreviousChats = function(action, userChats) {
    var rtValue = 'error';
    if (action == 'backup') {
        userChats = lzm_chatServerEvaluation.userChats.getUserChatList();
        var backupChats = {};
        for (var x in userChats) {
            if (userChats.hasOwnProperty(x)) {
                if (userChats[x].status != 'left' && userChats[x].status != 'declined') {
                    backupChats[x] = userChats[x];
                }
            }
        }
        rtValue = JSON.stringify(backupChats);
    } else if (action == 'restore') {
        userChats = JSON.parse(userChats);
        lzm_chatServerEvaluation.userChats.restoreUserChats(userChats);
        rtValue = 'restored';
    }
    return rtValue;
};

function webAppHasLoadedCorrectly() {
    return 'LiveZilla';
}

/**************************************** Hash functions ****************************************/
if (typeof CryptoJS.SHA256 != 'undefined') {
    var sha256 = function(str) {
        str = (typeof str == 'undefined') ? 'undefined' : (str == null) ? 'null' : str.toString();
        return CryptoJS.SHA256(str).toString();
    };
}

if (typeof CryptoJS.SHA1 != 'undefined') {
    var sha1 = function(str) {
        str = (typeof str == 'undefined') ? 'undefined' : (str == null) ? 'null' : str.toString();
        return CryptoJS.SHA1(str).toString();
    };
}

if (typeof CryptoJS.MD5 != 'undefined') {
    var md5 = function(str) {
        str = (typeof str == 'undefined') ? 'undefined' : (str == null) ? 'null' : str.toString();
        return CryptoJS.MD5(str).toString();
    };
}

/**************************************** Debugging functions ****************************************/
function forceResizeNow() {
    lzm_chatDisplay.createViewSelectPanel();
    lzm_chatDisplay.createChatWindowLayout(true);
}

function debuggingEditorClicked() {

}

function debuggingStartStopPolling() {
    var tmpDate = lzm_chatTimeStamp.getLocalTimeObject();
    var tmpHumanTime = lzm_commonTools.getHumanDate(tmpDate, 'time', lzm_chatDisplay.userLanguage);
    if (lzm_chatPollServer.poll_regularly) {
        lzm_chatPollServer.stopPolling();
        debugBackgroundMode = true;
    } else {
        lzm_chatPollServer.startPolling();
        debugBackgroundMode = false;
    }
}

function debuggingResetViewSelectPanel() {
    lzm_chatDisplay.viewSelectArray = [{"id":"archive","name":"Chat-Archiv"},{"id":"mychats","name":"Meine Chats"},
        {"id":"tickets","name":"Tickets"},{"id":"external","name":"Besucher"},
        {"id":"internal","name":"Operatoren"},{"id":"qrd","name":"Knowledgebase"}];
    lzm_chatDisplay.showViewSelectPanel = {"mychats":1,"tickets":1,"external":1,"internal":0,"qrd":0,"archive":0};
    lzm_chatDisplay.createViewSelectPanel('mychats')
}

function debcount(){
    var dc = '';
    var counts = $.find('div').length+$.find('span').length+$.find('p').length+$.find('table').length+$.find('tr').length+$.find('td').length;

    dc+='\nDIV: ' + $.find('div').length.toString();
    dc+='\nSPAN: ' + $.find('span').length.toString();
    dc+='\nP: ' + $.find('p').length.toString();
    dc+='\nTABLE: ' + $.find('table').length.toString();
    dc+='\nTR: ' + $.find('tr').length.toString();
    dc+='\nTD: ' + $.find('td').length.toString();
    dc+='\nTOTAL: ' + counts.toString();
    alert(dc);
}

function logit(myObject, myLevel) {}

function deblog(data){
    console.log(data);
    console.stack();
}

/**************************************** Some general functions ****************************************/

function LoadModuleConfiguration(type,call){
    if(lzm_chatDisplay[type] != null && call){
        $.globalEval(call);
        return;
    }
    var file = (type.indexOf('Class')==-1) ? type+'Class' : type;
    $.getScript('js/lzm/classes/'+file+'.js', function( data, textStatus, jqxhr ) {
        $.globalEval('lzm_chatDisplay.'+type+' = new '+type+'();');
        if(call)
            $.globalEval(call);
    });
}

function showAppIsSyncing() {
    lzm_displayHelper.blockUi({message: t('Syncing data...')});
}

function chatInputEnterPressed() {
    var useResource = '';
    for (var i=0; i<shortCutResources.length; i++)
        if (shortCutResources[i].complete) {
            useResource = shortCutResources[i].id;
            break;
        }

    var edContent = grabEditorContents();
    if (useResource != '') {
        var resource = lzm_chatServerEvaluation.cannedResources.getResource(useResource);
        if (resource != null && $.inArray(resource.ty, ['2', '3', '4']) != -1 && (lzm_chatDisplay.isApp || lzm_chatDisplay.isMobile) && lzm_chatUserActions.active_chat_reco != '')
            sendQrdPreview(useResource, lzm_chatUserActions.active_chat_reco);
        else if (resource != null && $.inArray(resource.ty, ['2', '3', '4']) != -1 && (lzm_chatDisplay.isApp || lzm_chatDisplay.isMobile) && lzm_chatUserActions.active_chat_reco == '')
        {

        }
        else
            useEditorQrdPreview(useResource);
    }
    else if (!quickSearchReady && edContent.indexOf('/') == 0)
    {

    }
    else
    {
        quickSearchReady = false;
        var cpId = $('#chat-input-body').data('cp-id');
        sendTranslatedChat(edContent, cpId);
    }
}

function doNothing() {
    // Dummy function that does nothing!
    // Needed for editor events
}

function chatInputBodyClicked() {
    var id, b_id, user_id, name;
    if(lzm_chatDisplay.active_chat_reco.indexOf('~') != -1) {
        id = lzm_chatDisplay.active_chat_reco.split('~')[0];
        b_id = lzm_chatDisplay.active_chat_reco.split('~')[1];
        viewUserData(id, b_id, 0, true);
    } else {
        if (lzm_chatDisplay.active_chat_reco == "everyoneintern") {
            id = lzm_chatDisplay.active_chat_reco;
            user_id = lzm_chatDisplay.active_chat_reco;
            name = lzm_chatDisplay.getActiveChatRealname();
        } else if(typeof lzm_chatDisplay.thisUser.userid == 'undefined') {
            id = lzm_chatDisplay.active_chat_reco;
            user_id = lzm_chatDisplay.active_chat_reco;
            name = lzm_chatDisplay.active_chat_reco;
        } else {
            id = lzm_chatDisplay.active_chat_reco;
            user_id = lzm_chatDisplay.thisUser.userid;
            name = lzm_chatDisplay.thisUser.name;
        }
        chatInternalWith(id, user_id, name);
    }
}

function chatInputTyping(e) {
    var i = 0;
    if (typeof e != 'undefined' && (typeof e.which == 'undefined' || (e.which != 13 && e.which != 0)) &&
        (typeof e.keyCode == 'undefined' || (e.keyCode != 13 && e.keyCode != 0))) {
        lastTypingEvent = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
        if (lzm_chatDisplay.qrdAutoSearch == 1) {
            quickSearchReady = false;
            shortCutResources = [];
            setTimeout(function() {
                var typingNow = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
                $('#chat-qrd-preview').html('');
                if (typingNow - lastTypingEvent > 450) {
                    var editorContents = grabEditorContents().replace(/<.*?>/g, '');
                    if (editorContents.length > 1) {
                        var frequentlyUsedResources = lzm_chatServerEvaluation.cannedResources.getResourceList('usage_counter', {ty: '1,2,3,4', t: editorContents, text: editorContents, ti: editorContents, s: editorContents});
                        var maxIterate = Math.min(10, frequentlyUsedResources.length), furHtml = '';
                        if ($('#chat-progress').height() > 200 && frequentlyUsedResources.length > 0) {
                            furHtml += '<table style="width: 100%">';
                            for (i=0; i<maxIterate; i++) {
                                /*
                                var resourceText = (frequentlyUsedResources[i].ty == 1) ? frequentlyUsedResources[i].text.replace(/<.*?>/g, '') :
                                    (frequentlyUsedResources[i].ty == 2) ? frequentlyUsedResources[i].ti + ' (' + frequentlyUsedResources[i].text + ')' :
                                    frequentlyUsedResources[i].ti.replace(/<.*?>/g, '');
*/
                                var resourceText = frequentlyUsedResources[i].ti.replace(/<.*?>/g, '');

                                if (editorContents.indexOf('/') == 0 && ('/' + frequentlyUsedResources[i].s.toLowerCase()).indexOf(editorContents.toLowerCase()) == 0) {
                                    resourceText = '<td class="editor-preview-shortcut" id="editor-preview-shortcut-' + frequentlyUsedResources[i].rid +'">' +
                                        frequentlyUsedResources[i].s + '&nbsp;</td>' +
                                        '<td class="editor-preview-cell"><div class="editor-preview-inner">' + resourceText + '</div></td>';
                                    shortCutResources.push({id: frequentlyUsedResources[i].rid, complete: false});
                                } else {
                                    resourceText = '<td colspan="2" class="editor-preview-cell"><div class="editor-preview-inner">' + resourceText +'</div></td>';
                                }
                                furHtml += '<tr class="lzm-unselectable" style="cursor: pointer;" onclick="useEditorQrdPreview(\'' + frequentlyUsedResources[i].rid + '\');">' +
                                    resourceText + '</tr>';
                            }
                            furHtml += '</table>';
                            $('#chat-qrd-preview').html(furHtml);
                            lzm_chatDisplay.createChatWindowLayout(true);
                            var previewHeight = $('#chat-qrd-preview').height();
                            $('#chat-progress').css({'bottom': (80 + previewHeight) + 'px'});
                            $('#chat-progress').scrollTop($('#chat-progress')[0].scrollHeight);
                            $('.editor-preview-inner').css({'max-width': ($('#chat-qrd-preview').width() - $('.editor-preview-shortcut').width() - 14)+'px'});
                            for (i=0; i<shortCutResources.length; i++) {
                                var resource = lzm_chatServerEvaluation.cannedResources.getResource(shortCutResources[i].id);
                                if (resource != null && '/' + resource.s == editorContents) {
                                    $('#editor-preview-shortcut-' + shortCutResources[i].id).css({color: '#5197ff'});
                                    shortCutResources[i].complete = true;
                                } else {
                                    $('#editor-preview-shortcut-' + shortCutResources[i].id).css({color: '#333333'});
                                    shortCutResources[i].complete = false;
                                }
                            }
                            quickSearchReady = true;
                        } else {
                            $('#chat-progress').css({'bottom': '80px'});
                            shortCutResources = [];
                            quickSearchReady = true;
                        }
                    } else {
                        $('#chat-progress').css({'bottom': '80px'});
                        shortCutResources = [];
                        quickSearchReady = true;
                    }
                }
            }, 500);
        }
        lzm_chatPollServer.typingPollCounter = 0;
        lzm_chatPollServer.typingChatPartner = lzm_chatDisplay.active_chat_reco;
    } else if (typeof e != 'undefined' && (typeof e.which == 'undefined' || e.which != 0) &&
        (typeof e.keyCode == 'undefined' || e.keyCode != 0)) {
        $('#chat-qrd-preview').html('');
        $('#chat-progress').css({'bottom': '80px'});
        shortCutResources = [];
        quickSearchReady = true;
        lzm_chatDisplay.createChatWindowLayout(true);
    }
}

function slowDownPolling(doSlowDown, secondCall) {
    secondCall = (typeof secondCall != 'undefined') ? secondCall : false;
    if (doSlowDown) {
        if (lzm_chatPollServer.slowDownPolling1 > lzm_chatPollServer.slowDownPolling2) {
            lzm_chatPollServer.slowDownPolling = true;
            lzm_chatPollServer.startPolling();
        } else if (!secondCall) {
            lzm_chatPollServer.slowDownPolling1 = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
            setTimeout(function() {
                slowDownPolling(true, true);
            }, 20000);
        }
    } else {
        lzm_chatPollServer.slowDownPolling = false;
        lzm_chatPollServer.slowDownPolling2 = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
        lzm_chatPollServer.startPolling();
    }
}

function setAppBackground(isInBackground) {
    if (isInBackground) {
        lzm_chatPollServer.appBackground = 1;
        lzm_chatPollServer.startPolling();
    } else {
        lzm_chatPollServer.appBackground = 0;
        lzm_chatPollServer.startPolling();
    }
}

function setAppVersion(versionName) {
    lzm_commonConfig.lz_app_version = versionName;
}

function startBackgroundTask() {
    try {
        lzm_deviceInterface.startBackgroundTask();
    } catch(ex) {}
}

function setLocation(latitude, longitude) {
    lzm_chatPollServer.location = {latitude: latitude, longitude: longitude};
}

function stopPolling() {
    lzm_chatPollServer.stopPolling();
}

function startPolling() {
    lzm_chatPollServer.startPolling();
}

function resetWebApp() {
    showAppIsSyncing();
    lzm_chatServerEvaluation.resetWebApp();
    lzm_chatUserActions.resetWebApp();
    lzm_chatPollServer.resetWebApp();
    lzm_chatDisplay.resetWebApp();
    lzm_chatDisplay.createViewSelectPanel();

    lzm_chatPollServer.lastCorrectServerAnswer = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
}

function logout(askBeforeLogout, logoutFromDeviceKey, e) {
    if (typeof e != 'undefined') {
        e.stopPropagation()
    }
    logoutFromDeviceKey = (typeof logoutFromDeviceKey != 'undefined') ? logoutFromDeviceKey : false;
    lzm_chatDisplay.showUsersettingsHtml = false;
    $('#usersettings-menu').css({'display': 'none'});
    var doLogoutNow = function() {
        lzm_chatDisplay.stopRinging([]);
        lzm_commonStorage.saveValue('qrd_id_list_' + lzm_chatServerEvaluation.myId, JSON.stringify([]));
        lzm_commonStorage.saveValue('ticket_max_read_time_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatPollServer.ticketMaxRead));
        lzm_commonStorage.saveValue('ticket_read_array_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatDisplay.ticketReadArray));
        lzm_commonStorage.saveValue('ticket_unread_array_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatDisplay.ticketUnreadArray));
        lzm_commonStorage.saveValue('ticket_filter_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatPollServer.ticketFilterStatus));
        lzm_commonStorage.saveValue('ticket_sort_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatPollServer.ticketSort));
        lzm_commonStorage.saveValue('ticket_sort_dir_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatPollServer.ticketSortDir));
        lzm_commonStorage.saveValue('email_read_array_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatDisplay.emailReadArray));
        lzm_commonStorage.saveValue('accepted_chats_' + lzm_chatServerEvaluation.myId, lzm_chatUserActions.acceptedChatCounter);
        lzm_commonStorage.saveValue('qrd_search_categories_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatDisplay.resourcesDisplay.qrdSearchCategories));
        lzm_commonStorage.saveValue('qrd_recently_used_' + lzm_chatServerEvaluation.myId, JSON.stringify([]));
        lzm_commonStorage.deleteKeyValuePair('qrd_recently_used' + lzm_chatServerEvaluation.myId);
        lzm_commonStorage.saveValue('qrd_selected_tab_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatDisplay.resourcesDisplay.selectedResourceTab));
        lzm_commonStorage.saveValue('archive_filter_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatPollServer.chatArchiveFilter));
        lzm_commonStorage.saveValue('first_visible_view_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatDisplay.firstVisibleView));
        lzm_commonStorage.saveValue('ticket_filter_personal_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatPollServer.ticketFilterPersonal));
        lzm_commonStorage.saveValue('ticket_filter_group_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatPollServer.ticketFilterGroup));
        lzm_commonStorage.saveValue('show_offline_operators_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatDisplay.showOfflineOperators));
        lzm_commonStorage.saveValue('last_phone_protocol_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatDisplay.ticketDisplay.lastPhoneProtocol));
        lzm_chatDisplay.askBeforeUnload = false;
        lzm_displayHelper.blockUi({message: t('Signing off...')});
        lzm_chatPollServer.logout();
        setTimeout(function() {
            if (!lzm_chatPollServer.serverSentLogoutResponse) {
                lzm_chatPollServer.finishLogout();
            }
        }, 10000);
    };
    var showConfirmDialog = function(confirmText) {
        lzm_commonDialog.createAlertDialog(confirmText, [{id: 'ok', name: t('Ok')}, {id: 'cancel', name: t('Cancel')}]);
        $('#alert-btn-ok').click(function() {
            doLogoutNow();
        });
        $('#alert-btn-cancel').click(function() {
            lzm_commonDialog.removeAlertDialog();
        });
    };
    if (askBeforeLogout) {
        if (logoutFromDeviceKey) {
            if (lzm_chatDisplay.openChats.length == 0) {
                showConfirmDialog(t('Do you really want to log out?'));
            } else {
                showConfirmDialog(t('There are still open chats, do you want to leave them?'));
            }
        } else {
            if (lzm_chatDisplay.openChats.length != 0) {
                showConfirmDialog(t('There are still open chats, do you want to leave them?'));
            } else {
                doLogoutNow();
            }
        }
    } else {
        doLogoutNow();
    }
}

function catchEnterButtonPressed(e) {
        lzm_chatDisplay.catchEnterButtonPressed(e);
}

function doMacMagicStuff() {
    if (app == 0) {
        $(window).trigger('resize');
        setTimeout(function() {
            lzm_chatDisplay.createHtmlContent(lzm_chatPollServer.thisUser, lzm_chatDisplay.active_chat_reco);
            lzm_chatDisplay.createViewSelectPanel();
            lzm_chatDisplay.createChatWindowLayout(true);
        }, 10);
    }
}

function preventDefaultContextMenu(e) {
    e.stopPropagation();
    e.preventDefault();
}

function nf(){

}

function d(param){
    return (typeof(param)!='undefined'&&param!='undefined');
}

function t(translateString, placeholderArray) {
    return lzm_t.translate(translateString, placeholderArray);
}

function tid(id, placeholderArray){
    return lzm_t.getById(id, placeholderArray);
}

function tidc(id, suffix){
    suffix = (typeof suffix != 'undefined') ? suffix : ':';
    var x = lzm_t.getById(id);
    if(lzm_commonTools.endsWith(x, suffix))
        return x;
    else
        return x + suffix;
}

function closeOrMinimizeDialog() {
    $('#minimize-dialog').click();
    $('#close-dialog').click()
}

function fillStringsFromTranslation() {
    if (loopCounter > 49 || lzm_t.translationArray.length != 0) {
        for (var i=0; i<lzm_chatDisplay.viewSelectArray.length; i++) {
            //Use untranslated strings here. The translation is done when creating the panel!
            if (lzm_chatDisplay.viewSelectArray[i].id == 'mychats')
                lzm_chatDisplay.viewSelectArray[i].name = 'Chats';
            if (lzm_chatDisplay.viewSelectArray[i].id == 'tickets')
                lzm_chatDisplay.viewSelectArray[i].name = 'Tickets';
            if (lzm_chatDisplay.viewSelectArray[i].id == 'external')
                lzm_chatDisplay.viewSelectArray[i].name = 'Visitors';
            if (lzm_chatDisplay.viewSelectArray[i].id == 'archive')
                lzm_chatDisplay.viewSelectArray[i].name = 'Chat Archive';
            if (lzm_chatDisplay.viewSelectArray[i].id == 'internal')
                lzm_chatDisplay.viewSelectArray[i].name = 'Operators';
            if (lzm_chatDisplay.viewSelectArray[i].id == 'qrd')
                lzm_chatDisplay.viewSelectArray[i].name = 'Knowledgebase';
            if (lzm_chatDisplay.viewSelectArray[i].id == 'filter')
                lzm_chatDisplay.viewSelectArray[i].name = 'Filter';
            if (lzm_chatDisplay.viewSelectArray[i].id == 'world')
                lzm_chatDisplay.viewSelectArray[i].name = 'Map';
        }
        lzm_chatDisplay.createViewSelectPanel();
    } else {
        loopCounter++;
        setTimeout(function() {fillStringsFromTranslation();}, 50);
    }
}

function openLink(url, e) {
    if (typeof e != 'undefined') {
        e.preventDefault();
    }
    if (app == 1) {
        try {
            lzm_deviceInterface.openExternalBrowser(url);
        } catch(ex) {
            deblog('Opening device browser failed');
        }
    } else if (web == 1) {
        window.open(url, '_blank');
    }
}

function downloadFile(address) {
    if (app == 1) {
        try {
            lzm_deviceInterface.openFile(address);
        } catch(ex) {
            deblog('Downloading file in device failed');
        }
    } else if (web == 1) {
        window.open(address, '_blank');
    }
}

function tryNewLogin(logoutOtherInstance) {
    lzm_chatPollServer.stopPolling();
    lzm_chatPollServer.pollServerlogin(lzm_chatPollServer.chosenProfile.server_protocol,lzm_chatPollServer.chosenProfile.server_url, logoutOtherInstance);
}

function minimizeDialogWindow(dialogId, windowId) {
    try {
        if (typeof lzm_chatDisplay.dialogData.editors != 'undefined') {
            for (var i=0; i<lzm_chatDisplay.dialogData.editors.length; i++) {
                if (typeof window[lzm_chatDisplay.dialogData.editors[i].instanceName] != 'undefined') {
                    lzm_chatDisplay.dialogData.editors[i].text = window[lzm_chatDisplay.dialogData.editors[i].instanceName].grabHtml();
                    window[lzm_chatDisplay.dialogData.editors[i].instanceName].removeEditor();
                }
            }
        }
    } catch(e) {}
    var selectedView = (lzm_chatDisplay.dialogData['no-selected-view'] == true) ? '' : lzm_chatDisplay.selected_view;
    var activeUserChat = lzm_chatServerEvaluation.userChats.getUserChat(lzm_chatDisplay.active_chat_reco);
    if (lzm_chatDisplay.selected_view == 'mychats' && activeUserChat != null) {
        var chatText = loadChatInput(lzm_chatDisplay.active_chat_reco);
        initEditor(chatText, 'minimzeDialogWindow', lzm_chatDisplay.active_chat_reco);
    }

    lzm_displayHelper.minimizeDialogWindow(dialogId, windowId, lzm_chatDisplay.dialogData, selectedView);
}

function maximizeDialogWindow(dialogId) {
    lzm_displayHelper.maximizeDialogWindow(dialogId);
}

function blinkPageTitle(message) {
    doBlinkTitle = true;
    blinkTitleMessage = message;
    blinkTitleStatus = 0;
}

function getCredentials() {
    var cookieName = 'lzm-credentials';
    var cookieValue = document.cookie;
    var cookieStart = (cookieValue.indexOf(" " + cookieName + "=") != -1) ? cookieValue.indexOf(" " + cookieName + "=") : cookieValue.indexOf(cookieName + "=");
    var cookieEnd = 0;
    if (cookieStart == -1) {
        cookieValue = {'login_name': '', 'login_passwd': ''};
    } else {
        cookieStart = cookieValue.indexOf("=", cookieStart) + 1;
        cookieEnd = (cookieValue.indexOf(";", cookieStart) != -1) ? cookieValue.indexOf(";", cookieStart) : cookieValue.length;
        cookieValue = cookieValue.substring(cookieStart,cookieEnd);
        if (cookieValue.indexOf('%7E') != -1) {
            cookieCredentialsAreSet = (lz_global_base64_url_decode(cookieValue.split('%7E')[0]) != '' && cookieValue.split('%7E')[1] != '');
            cookieValue = {
                'login_name': lz_global_base64_url_decode(cookieValue.split('%7E')[0]),
                'login_passwd': cookieValue.split('%7E')[1]
            };
        } else {
            var ln = '', lp = '';
            if (typeof chosenProfile.lzmvcode != 'undefined' && chosenProfile.lzmvcode != '') {
                cookieCredentialsAreSet = true;
                ln = lz_global_base64_url_decode(lz_global_base64_url_decode(chosenProfile.lzmvcode).split('~')[0]);
                lp = lz_global_base64_url_decode(chosenProfile.lzmvcode).split('~')[1];
                }
            cookieValue = {'login_name': ln, 'login_passwd': lp};
        }
    }

    chosenProfile.login_name = cookieValue.login_name;
    chosenProfile.login_passwd = cookieValue.login_passwd;



    // Call this twice for some unknown reason...
    deleteCredentials();
    deleteCredentials();
}

function deleteCredentials() {
    var cookieName = 'lzm-credentials';
    var completeCookieValue = document.cookie;
    var cookieStart = (completeCookieValue.indexOf(" " + cookieName + "=") != -1) ? completeCookieValue.indexOf(" " + cookieName + "=") : completeCookieValue.indexOf(cookieName + "=");
    var cookieEnd = 0;
    if (cookieStart == -1) {
        return false;
    } else {
        cookieStart = completeCookieValue.indexOf("=", cookieStart) + 1;
        cookieEnd = (completeCookieValue.indexOf(";", cookieStart) != -1) ? completeCookieValue.indexOf(";", cookieStart) : completeCookieValue.length;
        var cookieValue = completeCookieValue.substring(cookieStart,cookieEnd);
        var pattern = new RegExp(cookieName + '=' + cookieValue,'');
        completeCookieValue = completeCookieValue.replace(pattern, cookieName + '=0');
        document.cookie = completeCookieValue;

        return true;
    }
}

function handleContextMenuClick(e) {
    e.stopPropagation();
}

function showNotMobileMessage() {
    var alertText =  t('This functionality is not available on mobile devices.');
    lzm_commonDialog.createAlertDialog(alertText, [{id: 'ok', name: t('Ok')}]);

    $('#alert-btn-ok').click(function() {
        lzm_commonDialog.removeAlertDialog();
    });
}

function showNotOnDevice() {
    var alertText = t('This functionality is not available on your device.');
    lzm_commonDialog.createAlertDialog(alertText, [{id: 'ok', name: t('Ok')}]);

    $('#alert-btn-ok').click(function() {
        lzm_commonDialog.removeAlertDialog();
    });
}

function showNoPermissionMessage() {
    var alertText =  t('You have no permission for this action. Permissions can be granted in the User Management panel (LiveZilla Server Admin)');
    lzm_commonDialog.createAlertDialog(alertText, [{id: 'ok', name: t('Ok')}]);

    $('#alert-btn-ok').click(function() {
        lzm_commonDialog.removeAlertDialog();
    });
}

function showNoAdministratorMessage() {
    var alertText =  t('You need to be a Server Administrator for this action.');
    lzm_commonDialog.createAlertDialog(alertText, [{id: 'ok', name: t('Ok')}]);

    $('#alert-btn-ok').click(function() {
        lzm_commonDialog.removeAlertDialog();
    });
}

function showOutsideOpeningMessage(groupName) {
    var alertText = (typeof groupName == 'undefined' || groupName == '') ? t('This action cannot be performed outside of opening hours.') :
        t('<!--group_name--> is outside of opening hours. Please select another group.', [['<!--group_name-->', groupName]]);
    lzm_commonDialog.createAlertDialog(alertText, [{id: 'ok', name: t('Ok')}]);
    $('#alert-btn-ok').click(function() {
        lzm_commonDialog.removeAlertDialog();
    });
}

function handleWindowResize(scrollDown) {
    lzm_chatDisplay.createViewSelectPanel();
    lzm_chatDisplay.createChatWindowLayout(true);
    var thisChatProgress = $('#chat-progress');
    if (scrollDown) {
        setTimeout(function() {
            thisChatProgress.scrollTop(thisChatProgress[0].scrollHeight);
        }, 10);
    }
}

RegExp.escape = function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

function capitalize(myString) {
    myString = myString.replace(/^./, function (char) {
        return char.toUpperCase();
    });
    return myString;
}

/**************************************** Resources functions ****************************************/
function useEditorQrdPreview(resourceId) {
    var resource = lzm_chatServerEvaluation.cannedResources.getResource(resourceId), resourceHtmlText;
    if (resource != null) {
        lzm_chatUserActions.messageFromKnowledgebase = true;
        lzm_chatServerEvaluation.cannedResources.riseUsageCounter(resourceId);
        switch (resource.ty) {
            case '1':
                resourceHtmlText = ((app == 1) || isMobile) ? resource.text.replace(/<.*?>/g, '') : resource.text;
                break;
            case '2':
                var linkHtml = '<a href="' + resource.text + '" class="lz_chat_link" target="_blank">' + resource.ti + '</a>';
                resourceHtmlText = ((app == 1) || isMobile) ? resource.text : linkHtml;
                break;
            default:
                var urlFileName = encodeURIComponent(resource.ti.replace(/ /g, '+').replace(/<.*?>/g, ''));
                var acid = lzm_commonTools.pad(Math.floor(Math.random() * 1048575).toString(16), 5);
                var fileId = resource.text.split('_')[1];
                var thisServer = lzm_chatPollServer.chosenProfile.server_protocol + lzm_chatPollServer.chosenProfile.server_url;
                var thisFileUrl = thisServer + '/getfile.php?';
                if (multiServerId != '') {
                    thisFileUrl += 'ws=' + multiServerId + '&';
                }
                thisFileUrl += 'acid=' + acid + '&file=' + urlFileName + '&id=' + fileId;
                var fileHtml = '<a ' +
                    'href="' + thisFileUrl + '" ' +
                    'class="lz_chat_file" target="_blank">' + resource.ti.replace(/<.*?>/g, '') + '</a>';
                resourceHtmlText = ((app == 1) || isMobile) ? thisFileUrl : fileHtml;
                break;
        }
        setEditorContents(resourceHtmlText);
        setFocusToEditor();
        shortCutResources = [];
    }
    $('#chat-qrd-preview').html('');
}

function openOrCloseFolder(resourceId, onlyOpenFolders, wasSelected) {
    var sid = (lzm_chatDisplay.resourcesDisplay.InDialog) ? 'd-' : '';
    var folderDiv = $('#'+sid+'folder-' + resourceId);

    if (folderDiv.html() != "") {
        var markDiv = $('#'+sid+'resource-' + resourceId + '-open-mark');
        if (folderDiv.css('display') == 'none') {
            folderDiv.css('display', 'block');
            markDiv.html('<i class="fa fa-caret-down"></i>');
            if ($.inArray(resourceId, lzm_chatDisplay.resourcesDisplay.openedResourcesFolder) == -1) {
                lzm_chatDisplay.resourcesDisplay.openedResourcesFolder.push(resourceId);
            }
        } else if (!onlyOpenFolders)
        {
            if(!wasSelected)
                return;

            folderDiv.css('display', 'none');
            markDiv.html('<i class="fa fa-caret-right"></i>');
            var tmpOpenedFolder = [];
            for (var i=0; i<lzm_chatDisplay.resourcesDisplay.openedResourcesFolder.length; i++) {
                if (resourceId != lzm_chatDisplay.resourcesDisplay.openedResourcesFolder[i]) {
                    tmpOpenedFolder.push(lzm_chatDisplay.resourcesDisplay.openedResourcesFolder[i]);
                }
            }
            lzm_chatDisplay.resourcesDisplay.openedResourcesFolder = tmpOpenedFolder;
        }
    }

}

function handleResourceClickEvents(resourceId, onlyOpenFolders){
    removeQrdContextMenu();
    onlyOpenFolders = (typeof onlyOpenFolders != 'undefined') ? onlyOpenFolders : false;

    var sid = (lzm_chatDisplay.resourcesDisplay.InDialog) ? 'd-' : '';
    lzm_chatDisplay.selectedResource = resourceId;
    var resource = lzm_chatServerEvaluation.cannedResources.getResource(resourceId);
    if (resource != null)
    {
        var parentFolder = lzm_chatServerEvaluation.cannedResources.getResource(resource.pid);
        var wasSelected = $('#'+sid+'resource-' + resourceId).hasClass('selected-resource-div');

        $('.resource-div').removeClass('selected-resource-div');
        $('.qrd-search-line').removeClass('selected-table-line');
        $('.qrd-recently-line').removeClass('selected-table-line');
        $('.resource-open-mark').removeClass('resource-open-mark-selected');
        $('.resource-icon-and-text').removeClass('resource-icon-and-text-selected');

        lzm_chatDisplay.resourcesDisplay.highlightSearchResults(lzm_chatServerEvaluation.cannedResources.CacheResourceList, false);

        $('#'+sid+'resource-' + resourceId).addClass('selected-resource-div');
        $('#qrd-'+sid+'search-line-' + resourceId).addClass('selected-table-line');
        $('#qrd-'+sid+'recently-line-' + resourceId).addClass('selected-table-line');
        $('#'+sid+'resource-' + resourceId + '-open-mark').addClass('resource-open-mark-selected');
        $('#'+sid+'resource-' + resourceId + '-icon-and-text').addClass('resource-icon-and-text-selected');
        $('.qrd-change-buttons').addClass('ui-disabled');

        switch (parseInt(resource.ty)) {
            case 0:
                openOrCloseFolder(resourceId, onlyOpenFolders, wasSelected);
                if (resourceId != '1' && lzm_commonPermissions.checkUserPermissions('', 'resources', 'edit', resource)) {
                    $('#edit-qrd').removeClass('ui-disabled');
                    $('#show-qrd-settings').removeClass('ui-disabled');
                }
                if (lzm_chatDisplay.resourcesDisplay.selectedResourceTab == 0 && lzm_commonPermissions.checkUserPermissions('', 'resources', 'add', resource)) {
                    $('#add-qrd').removeClass('ui-disabled');
                }
                if (resourceId != '1' && lzm_commonPermissions.checkUserPermissions('', 'resources', 'delete', resource)) {
                    $('#delete-qrd').removeClass('ui-disabled');
                }
                if (lzm_commonPermissions.checkUserPermissions('', 'resources', 'add', resource)) {
                    $('#add-or-edit-qrd').removeClass('ui-disabled');
                }
                $('#add-qrd-attachment').addClass('ui-disabled');
                break;
            case 1:
                if (lzm_commonPermissions.checkUserPermissions('', 'resources', 'edit', resource)) {
                    $('#edit-qrd').removeClass('ui-disabled');
                    $('#show-qrd-settings').removeClass('ui-disabled');
                }
                if (lzm_commonPermissions.checkUserPermissions('', 'resources', 'delete', resource)) {
                    $('#delete-qrd').removeClass('ui-disabled');
                }
                $('#view-qrd').removeClass('ui-disabled');
                $('#'+sid+'preview-qrd').removeClass('ui-disabled');
                $('#'+sid+'send-qrd-preview').removeClass('ui-disabled');
                $('#insert-qrd-preview').removeClass('ui-disabled');
                if (lzm_commonPermissions.checkUserPermissions('', 'resources', 'add', resource)) {
                    $('#add-or-edit-qrd').removeClass('ui-disabled');
                }
                if (lzm_chatDisplay.resourcesDisplay.selectedResourceTab == 0 && parentFolder != null && lzm_commonPermissions.checkUserPermissions('', 'resources', 'add', parentFolder)) {
                    $('#add-qrd').removeClass('ui-disabled');
                }
                $('#add-qrd-attachment').addClass('ui-disabled');
                break;
            case 2:
                if (lzm_commonPermissions.checkUserPermissions('', 'resources', 'edit', resource)) {
                    $('#edit-qrd').removeClass('ui-disabled');
                    $('#show-qrd-settings').removeClass('ui-disabled');
                }
                if (lzm_commonPermissions.checkUserPermissions('', 'resources', 'delete', resource)) {
                    $('#delete-qrd').removeClass('ui-disabled');
                }
                $('#view-qrd').removeClass('ui-disabled');
                $('#'+sid+'preview-qrd').removeClass('ui-disabled');
                $('#'+sid+'send-qrd-preview').removeClass('ui-disabled');
                $('#insert-qrd-preview').removeClass('ui-disabled');
                if (lzm_chatDisplay.resourcesDisplay.selectedResourceTab == 0 && parentFolder != null && lzm_commonPermissions.checkUserPermissions('', 'resources', 'add', parentFolder)) {
                    $('#add-qrd').removeClass('ui-disabled');
                }
                $('#add-qrd-attachment').addClass('ui-disabled');
                break;
            default:
                if (lzm_commonPermissions.checkUserPermissions('', 'resources', 'edit', resource)) {
                    $('#show-qrd-settings').removeClass('ui-disabled');
                }
                if (lzm_commonPermissions.checkUserPermissions('', 'resources', 'delete', resource)) {
                    $('#delete-qrd').removeClass('ui-disabled');
                }
                $('#'+sid+'preview-qrd').removeClass('ui-disabled');
                $('#'+sid+'send-qrd-preview').removeClass('ui-disabled');
                $('#insert-qrd-preview').removeClass('ui-disabled');
                if (lzm_chatDisplay.resourcesDisplay.selectedResourceTab == 0 && parentFolder != null && lzm_commonPermissions.checkUserPermissions('', 'resources', 'add', parentFolder)) {
                    $('#add-qrd').removeClass('ui-disabled');
                }
                $('#add-qrd-attachment').removeClass('ui-disabled');
                break;
        }
    }
}

function addQrd(type) {
    type = (d(type)) ? type : 1;
    var resource = lzm_chatServerEvaluation.cannedResources.getResource(lzm_chatDisplay.selectedResource);
    if (resource != null)
        if (!lzm_commonPermissions.checkUserResourceWritePermissions(lzm_chatDisplay.myId, 'add', resource))
        {
            showNoPermissionMessage();
            return;
        }

    var storedPreviewId = '';
    for (var key in lzm_chatDisplay.StoredDialogs) {
        if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
            if (lzm_chatDisplay.StoredDialogs[key].type == 'add-resource' &&
                typeof lzm_chatDisplay.StoredDialogs[key].data['resource-id'] != 'undefined' &&
                lzm_chatDisplay.StoredDialogs[key].data['resource-id'] == lzm_chatDisplay.selectedResource) {
                storedPreviewId = key;
            }
        }
    }

    if (storedPreviewId != '')
        lzm_displayHelper.maximizeDialogWindow(storedPreviewId);
    else
        lzm_chatUserActions.addQrd(type);

    removeQrdContextMenu();
}

function addQrdToChat(kbType) {
    if ((!lzm_chatDisplay.isMobile && !lzm_chatDisplay.isApp) || kbType == 2)
    {
        saveChatInput(lzm_chatDisplay.active_chat_reco);
        removeEditor();
        var dialogId = 'add-qrd-to-chat-' + md5(Math.random().toString());
        var visBro = lzm_chatServerEvaluation.visitors.getVisitorBrowser(lzm_chatDisplay.active_chat_reco);
        var cpName = (visBro[1] != null && visBro[1].cname != '') ? lzm_commonTools.escapeHtml(visBro[1].cname) : (visBro[0] != null) ? visBro[0].unique_name : lzm_chatDisplay.getActiveChatRealname();
        lzm_chatUserActions.addQrd(kbType,'', false, false, {type: kbType, dialog_id: dialogId, chat_partner: lzm_chatDisplay.active_chat_reco, cp_name: cpName}, '');
    }
    else
        showNotMobileMessage();
}

function syncKB(){
    if(lzm_chatDisplay.resourcesDisplay.CachePreparedResources != null && lzm_chatDisplay.resourcesDisplay.CachePreparedResources[1].length==1)
        return;

    lzm_commonStorage.deleteKeyValuePair('qrd_' + lzm_chatServerEvaluation.myId);
    lzm_commonStorage.deleteKeyValuePair('qrd_request_time_' + lzm_chatServerEvaluation.myId);
    lzm_commonStorage.deleteKeyValuePair('qrd_id_list_' + lzm_chatServerEvaluation.myId);
    lzm_chatDisplay.resourcesDisplay.IsLoading = true;
    lzm_chatServerEvaluation.resourceIdList = [];
    lzm_chatServerEvaluation.resources = [];
    lzm_chatServerEvaluation.resourceLastEdited = 0;
    lzm_chatPollServer.qrdRequestTime = 1;
    lzm_chatServerEvaluation.cannedResources = new LzmResources();
    lzm_chatDisplay.resourcesDisplay.invalidateCache();
    lzm_chatDisplay.resourcesDisplay.updateResources();
    selectView('qrd',true);
}

function deleteQrd() {
    removeQrdContextMenu();
    var resource = lzm_chatServerEvaluation.cannedResources.getResource(lzm_chatDisplay.selectedResource);
    if (resource != null) {
        if (!lzm_commonPermissions.checkUserPermissions('', 'resources', 'delete', resource))
        {
            showNoPermissionMessage();
            return;
        }
    }
    var confirmText = t('Do you want to delete this entry including subentries irrevocably?');
    lzm_commonDialog.createAlertDialog(confirmText, [{id: 'ok', name: t('Ok')}, {id: 'cancel', name: t('Cancel')}]);
    $('#alert-btn-ok').click(function() {
        lzm_chatUserActions.deleteQrd();
        lzm_commonDialog.removeAlertDialog();
    });
    $('#alert-btn-cancel').click(function() {
        lzm_commonDialog.removeAlertDialog();
    });
}

function renameQrd() {
    // Perhaps not needed
}

function editQrd() {
    var resource = lzm_chatServerEvaluation.cannedResources.getResource(lzm_chatDisplay.selectedResource);
    if (resource != null) {
        if (lzm_commonPermissions.checkUserPermissions('', 'resources', 'edit', resource)) {
            if ((lzm_chatDisplay.isApp || lzm_chatDisplay.isMobile) && resource.ty == 1) {
                showNotMobileMessage();
            } else {
                var storedPreviewId = '';
                for (var key in lzm_chatDisplay.StoredDialogs) {
                    if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
                        if (lzm_chatDisplay.StoredDialogs[key].type == 'edit-resource' &&
                            typeof lzm_chatDisplay.StoredDialogs[key].data['resource-id'] != 'undefined' &&
                            lzm_chatDisplay.StoredDialogs[key].data['resource-id'] == lzm_chatDisplay.selectedResource) {
                            storedPreviewId = key;
                        }
                    }
                }
                if (storedPreviewId != '') {
                    lzm_displayHelper.maximizeDialogWindow(storedPreviewId);
                } else {
                    lzm_chatUserActions.editQrd(resource);
                }
            }
        } else {
            showNoPermissionMessage();
        }
    }
}

function previewQrd(chatPartner, qrdId, inDialog, menuEntry) {
    var storedPreviewId = '';
    chatPartner = (typeof chatPartner != 'undefined') ? chatPartner : '';
    qrdId = (typeof qrdId != 'undefined') ? qrdId : lzm_chatDisplay.selectedResource;
    for (var key in lzm_chatDisplay.StoredDialogs) {
        if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
            if (lzm_chatDisplay.StoredDialogs[key].type == 'preview-resource' &&
                typeof lzm_chatDisplay.StoredDialogs[key].data['resource-id'] != 'undefined' &&
                lzm_chatDisplay.StoredDialogs[key].data['resource-id'] == qrdId) {
                storedPreviewId = key;
            }
        }
    }
    if (storedPreviewId != '') {
        lzm_displayHelper.maximizeDialogWindow(storedPreviewId);
    } else {
        var sid = (lzm_chatDisplay.resourcesDisplay.InDialog) ? 'd-' : '';
        $('#'+sid+'preview-qrd').addClass('ui-disabled');
        lzm_chatUserActions.previewQrd(chatPartner, qrdId, inDialog, menuEntry);
    }
}

function getQrdDownloadUrl(resource) {
    var downloadUrl = lzm_chatServerEvaluation.serverProtocol + lzm_chatServerEvaluation.serverUrl.replace(':80','').replace(':443','') + '/getfile.php?';
    downloadUrl += 'a=' + lzm_commonTools.pad(Math.floor(Math.random() * 1048575).toString(16), 5) +
        '&file=' + resource.ti + '&id=' + resource.rid;
    return downloadUrl;
}

function getKBAccessUrl(resource) {
    var publicURL = lzm_chatServerEvaluation.serverProtocol + lzm_chatServerEvaluation.serverUrl.replace(':80','').replace(':443','') + '/knowledgebase.php?';
    publicURL += 'id=' + resource.rid;
    return publicURL;
}

function showQrd(chatPartner, caller){
    saveChatInput(lzm_chatDisplay.active_chat_reco);
    removeEditor();

    var storedPreviewId = '';
    for (var key in lzm_chatDisplay.StoredDialogs) {
        if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
            if (lzm_chatDisplay.StoredDialogs[key].type == 'qrd-tree' &&
                typeof lzm_chatDisplay.StoredDialogs[key].data['chat-partner'] != 'undefined' &&
                lzm_chatDisplay.StoredDialogs[key].data['chat-partner'] == chatPartner) {
                storedPreviewId = key;
            }
        }
    }
    if (storedPreviewId != '')
        lzm_displayHelper.maximizeDialogWindow(storedPreviewId);
    else
        lzm_chatDisplay.resourcesDisplay.createQrdTreeDialog(null, chatPartner);
}

function cancelQrd(closeToTicket) {
    cancelQrdPreview(0);
    lzm_displayHelper.removeDialogWindow('qrd-tree-dialog');
    if (closeToTicket != '')
    {
        var dialogId = lzm_chatDisplay.ticketDialogId[closeToTicket] + '_reply';
        if (typeof lzm_chatDisplay.ticketDialogId[closeToTicket] == 'undefined' || closeToTicket.indexOf('_reply') != -1)
            dialogId = closeToTicket;
        lzm_displayHelper.maximizeDialogWindow(dialogId);
    }
    selectView('mychats');

    var loadedValue = loadChatInput(lzm_chatDisplay.active_chat_reco);
    initEditor(loadedValue, 'viewUserData');
}

function cancelQrdPreview(animationTime) {
    var sid = (lzm_chatDisplay.resourcesDisplay.InDialog) ? 'd-' : '';
    $('#'+sid+'preview-qrd').removeClass('ui-disabled');
    $('#qrd-preview-container').remove();
}

function sendQrdPreview(resourceId, chatPartner) {

    resourceId = (resourceId != '') ? resourceId : lzm_chatDisplay.selectedResource;
    var resourceHtmlText;
    var resource = lzm_chatServerEvaluation.cannedResources.getResource(resourceId);
    if (resource != null)
    {
        lzm_chatUserActions.messageFromKnowledgebase = true;
        lzm_chatServerEvaluation.cannedResources.riseUsageCounter(resourceId);
        switch (resource.ty)
        {
            case '1':
                resourceHtmlText = resource.text;
                break;
            case '2':
                if (resource.text.indexOf('mailto:') == 0) {
                    var linkHtml = '<a href="' + resource.text + '" class="lz_chat_mail" target="_blank">' + resource.ti + '</a>';
                } else {
                    var linkHtml = '<a href="' + resource.text + '" class="lz_chat_link" target="_blank">' + resource.ti + '</a>';
                }
                resourceHtmlText = linkHtml;
                break;
            default:
                var urlFileName = encodeURIComponent(resource.ti.replace(/ /g, '+'));
                var acid = lzm_commonTools.pad(Math.floor(Math.random() * 1048575).toString(16), 5);
                var fileId = resource.text.split('_')[1];
                var thisServer = lzm_chatPollServer.chosenProfile.server_protocol + lzm_chatPollServer.chosenProfile.server_url;
                var fileHtml = '<a ' +
                    'href="' + thisServer + '/getfile.php?';
                if (multiServerId != '') {
                    fileHtml += 'ws=' + multiServerId + '&';
                }
                fileHtml += 'acid=' + acid +
                    '&file=' + urlFileName +
                    '&id=' + fileId + '" ' +
                    'class="lz_chat_file" target="_blank">' + resource.ti + '</a>';
                resourceHtmlText = fileHtml;
                break;
        }
        var chatText = loadChatInput(chatPartner);
        if (lzm_chatDisplay.isMobile || lzm_chatDisplay.isApp)
        {
            chatText = (chatText != '') ? chatText + ' ' : chatText;
            if ($.inArray(resource.ty, ['2', '3', '4']) != -1)
            {
                sendChat(resourceHtmlText, chatPartner, '');
            }
            else
            {
                var resourceTextText = resourceHtmlText.replace(/(<br>|<br\/>|<br \/>|<\/p>|<\/div>)+/g, ' ').
                    replace(/<a.*?href="(.*?)".*?>(.*?)<\/a.*?>/gi, '$2 ($1)').replace(/<.*?>/g, '').replace(/&[a-zA-Z0-9#]*?;/g, ' ').
                    replace(/ +/g, ' ');
                saveChatInput(chatPartner, chatText + resourceTextText);
            }
        }
        else
        {
            chatText = (chatText != '') ? '<div>' + chatText + '</div>' : chatText;
            saveChatInput(chatPartner, chatText + resourceHtmlText);
        }
        cancelQrd();
    }
}

function showQrdSettings(resourceId, caller, editorText) {
    removeQrdContextMenu();
    resourceId = (resourceId == '') ? lzm_chatDisplay.selectedResource : resourceId;
    var resource = lzm_chatServerEvaluation.cannedResources.getResource(resourceId);
    if (resource == null)
    {
        resource = {t: ''};
        if (resourceId == 'FOLDER')
            resource.ty = 0;
    }
    if (resource != null)
    {
        if (resourceId == 'TEXT_FILE_URL' || resourceId == 'FOLDER' || lzm_commonPermissions.checkUserPermissions('', 'resources', 'edit', resource)) {
            var storedPreviewId = '';
            for (var key in lzm_chatDisplay.StoredDialogs) {
                if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
                    if (lzm_chatDisplay.StoredDialogs[key].type == 'resource-settings' &&
                        typeof lzm_chatDisplay.StoredDialogs[key].data['resource-id'] != 'undefined' &&
                        lzm_chatDisplay.StoredDialogs[key].data['resource-id'] == lzm_chatDisplay.selectedResource) {
                        storedPreviewId = key;
                    }
                }
            }
            if (storedPreviewId != '') {
                lzm_displayHelper.maximizeDialogWindow(storedPreviewId);
            } else {
                lzm_chatDisplay.resourcesDisplay.showQrdSettings(resource, editorText, caller);
            }
        }
        else
            showNoPermissionMessage();
    }
}

function changeFile() {
    var maxFileSize = lzm_chatServerEvaluation.global_configuration.php_cfg_vars.upload_max_filesize;
    var file = $('#file-upload-input')[0].files[0];
    if(!file) {
        $('#file-upload-name').html('');
        $('#file-upload-size').html('');
        $('#file-upload-type').html('');
        $('#file-upload-progress').css({display: 'none'});
        $('#file-upload-numeric').html('');
        $('#file-upload-error').html('');
        $('#cancel-file-upload-div').css({display: 'none'});
        return;
    }

    var thisUnit = (file.size <= 10000) ? 'B' : (file.size <= 10240000) ? 'kB' : 'MB';
    var thisFileSize = (file.size <= 10000) ? file.size : (file.size <= 1024000) ? file.size / 1024 : file.size / 1048576;
    thisFileSize = Math.round(thisFileSize * 10) / 10;
    $('#file-upload-name').html(t('File name: <!--file_name-->', [['<!--file_name-->', file.name]]));
    $('#file-upload-size').html(t('File size: <!--file_size--> <!--unit-->', [['<!--file_size-->', thisFileSize],['<!--unit-->', thisUnit]]));
    $('#file-upload-type').html(t('File type: <!--file_type-->', [['<!--file_type-->', file.type]]));
    $('#file-upload-progress').css({display: 'none'});
    $('#file-upload-numeric').html('0%');
    $('#file-upload-error').html('');
    $('#cancel-file-upload-div').css({display: 'block'});

    if (file.size > maxFileSize) {
        $('#file-upload-input').val('');
        $('#file-upload-error').html(t('File size too large'));
    }
}

function uploadFile(fileType, parentId, rank, toAttachment, sendToChat) {
    sendToChat = (typeof sendToChat != 'undefined') ? sendToChat : null;
    var file = $('#file-upload-input')[0].files[0];
    if (typeof file != 'undefined') {
        $('#save-new-qrd').addClass('ui-disabled');
        $('#cancel-new-qrd').addClass('ui-disabled');
        $('#file-upload-progress').css({display: 'block'});
        $('#cancel-file-upload').css({display: 'inline'});//removeClass('ui-disabled');

        lzm_chatPollServer.uploadFile(file, fileType, parentId, rank, toAttachment, sendToChat);
    } else {
        $('#cancel-new-qrd').click();
    }
}

function cancelFileUpload() {
    lzm_chatPollServer.fileUploadClient.abort();
    $('#cancel-file-upload').css({display: 'none'});//addClass('ui-disabled');
}

function showQrdAddMenu(e){
    openQrdContextMenu(e, 'LIST','MENU');
    e.stopPropagation();
}

function openQrdContextMenu(e, chatPartner, resourceId){
    if(resourceId != 'MENU')
        handleResourceClickEvents(resourceId, true);
    var resource = (resourceId != 'MENU') ? lzm_chatServerEvaluation.cannedResources.getResource(resourceId) : 'MENU';
    var scrolledDownY = (resourceId != 'MENU') ? $('#qrd-tree-body').scrollTop() : 15;
    var scrolledDownX = (resourceId != 'MENU') ? $('#qrd-tree-body').scrollLeft() : -15;
    var parentOffset = $('#qrd-tree-body').offset();
    var yValue = e.pageY - parentOffset.top;
    var xValue = e.pageX - parentOffset.left;
    if (resource != null)
    {
        resource.chatPartner = chatPartner;
        lzm_chatDisplay.showContextMenu('qrd-tree', resource, xValue + scrolledDownX, yValue + scrolledDownY);
        e.preventDefault();
    }
}

function removeQrdContextMenu() {
    $('#qrd-tree-context').remove();
}

/**************************************** Chat functions ****************************************/
function createActiveChatHtml() {
    if (lzm_chatDisplay.lastChatSendingNotification == '' && lzm_chatDisplay.active_chat_reco != '')
        lzm_chatDisplay.createChatHtml(null);
    else if (lzm_chatDisplay.lastChatSendingNotification != '')
        openChatTabById('panel');

    lzm_displayHelper.removeBrowserNotification();
}

function chatInternalWith(id, userid, name, fromOpList) {

    if(lzm_chatServerEvaluation.myId == id)
        return;

    if (lzm_chatDisplay.lastActiveChat != id)
        $('#chat-qrd-preview').html('');

    var op = lzm_chatServerEvaluation.operators.getOperator(id);
    if(op!=null && op.isbot)
        return;

    fromOpList = (d(fromOpList)) ? fromOpList : false;
    var group = lzm_chatServerEvaluation.groups.getGroup(id);
    var i = 0, myAction = 'chat', meIsInGroup = false;
    if (group != null && d(group.members))
    {
        for (i=0; i<group.members.length; i++)
            if (group.members[i].i == lzm_chatServerEvaluation.myId)
                meIsInGroup = true;

        if (meIsInGroup)
            myAction = 'chat';
        else if (lzm_commonPermissions.checkUserPermissions(lzm_chatServerEvaluation.myId, 'group', '', group))
            myAction = 'join';
        else
            myAction = 'no_perm';
    }
    else if(group != null)
        if($.inArray(group.id, lzm_chatServerEvaluation.operators.getOperator(lzm_chatServerEvaluation.myId).groups) == -1)
            myAction = 'no_perm';


    if (myAction == 'no_perm')
        showNoPermissionMessage();
    else
        try
        {
            lzm_commonTools.RemoveFromArray(lzm_chatDisplay.closedChats,id);
            lzm_chatDisplay.lastActiveChat = id;

            hideAllchatsList();
            lzm_chatUserActions.chatInternalWith(id, userid, name, fromOpList);
            if (myAction == 'join')
                lzm_chatUserActions.saveDynamicGroup('add', group.id, '', lzm_chatServerEvaluation.myId, {});
        }
        catch(e){deblog(e);}
}

function viewUserData(id, b_id, chat_id, freeToChat) {
    if (lzm_chatDisplay.lastActiveChat != id + '~' + b_id)
        $('#chat-qrd-preview').html('');
    lzm_chatDisplay.lastActiveChat = id + '~' + b_id;
    hideAllchatsList();
    lzm_chatUserActions.viewUserData(id, b_id, chat_id, freeToChat);
}

function handleUploadRequest(fuprId, fuprName, id, b_id, type, chatId) {
    lzm_chatUserActions.handleUploadRequest(fuprId, fuprName, id, b_id, type, chatId);
}

function selectOperatorForForwarding(id, b_id, chat_id, forward_id, forward_name, forward_group, forward_text, chat_no) {
    lzm_chatUserActions.selectOperatorForForwarding(id, b_id, chat_id, forward_id, forward_name, forward_group,forward_text, chat_no);
}

function loadChatInput(active_chat_reco) {
    return lzm_chatUserActions.loadChatInput(active_chat_reco);
}

function saveChatInput(active_chat_reco, text) {
    lzm_chatUserActions.saveChatInput(active_chat_reco, text);
}

function showTranslateOptions(visitorChat, language){
    if (lzm_chatServerEvaluation.otrs != '' && lzm_chatServerEvaluation.otrs != null)
    {
        saveChatInput(lzm_chatDisplay.active_chat_reco);
        removeEditor();
        lzm_chatDisplay.visitorDisplay.showTranslateOptions(visitorChat, language);
    }
    else
    {
        var noGTranslateKeyWarning1 = t('LiveZilla can translate your conversations in real time. This is based upon Google Translate.');
        var noGTranslateKeyWarning2 = t('To use this functionality, you have to add a Google API key.');
        var noGTranslateKeyWarning3 = t('For further information, see LiveZilla Server Admin -> LiveZilla Server Configuration.');
        var noGTranslateKeyWarning = t('<!--phrase1--><br /><br /><!--phrase2--><br /><!--phrase3-->',
            [['<!--phrase1-->', noGTranslateKeyWarning1], ['<!--phrase2-->', noGTranslateKeyWarning2], ['<!--phrase3-->', noGTranslateKeyWarning3]]);
        lzm_commonDialog.createAlertDialog(noGTranslateKeyWarning, [{id: 'ok', name: t('Ok')}]);
        $('#alert-btn-ok').click(function() {
            lzm_commonDialog.removeAlertDialog();
        });
    }
}

function sendTranslatedChat(chatMessage, chatReco) {
    chatMessage = (typeof chatMessage != 'undefined') ? chatMessage : grabEditorContents();
    chatReco = (typeof chatReco != 'undefined' && chatReco != '') ? chatReco : (typeof lzm_chatDisplay.active_chat_reco != 'undefined' && lzm_chatDisplay.active_chat_reco != '') ? lzm_chatDisplay.active_chat_reco : lzm_chatDisplay.lastActiveChat;
    var visitorBrowser = lzm_chatServerEvaluation.visitors.getVisitorBrowser(chatReco), visitorChat = chatReco + '~00000';
    if (visitorBrowser[1] != null) {
        visitorChat = visitorBrowser[0].id + '~' + visitorBrowser[1].id + '~' + visitorBrowser[1].chat.id;
    }
    if (lzm_chatServerEvaluation.otrs != '' && lzm_chatServerEvaluation.otrs != null &&
        typeof lzm_chatDisplay.chatTranslations[visitorChat] != 'undefined' && lzm_chatDisplay.chatTranslations[visitorChat].tmm != null &&
        lzm_chatDisplay.chatTranslations[visitorChat].tmm.translate &&
        lzm_chatDisplay.chatTranslations[visitorChat].tmm.sourceLanguage != lzm_chatDisplay.chatTranslations[visitorChat].tmm.targetLanguage) {
        lzm_chatUserActions.translateTextAndSend(visitorChat, chatMessage, chatReco);
    }
    else
        sendChat(chatMessage, chatReco);
}

function sendChat(chatMessage, chat_reco, translatedChatMessage, visitorChat) {
    translatedChatMessage = (typeof translatedChatMessage != 'undefined') ? translatedChatMessage : '';
    visitorChat = (typeof visitorChat != 'undefined') ? visitorChat : chat_reco + '~00000';
    if (lzm_chatServerEvaluation.userChats.getUserChat(lzm_chatDisplay.active_chat) != null ||
        lzm_chatServerEvaluation.userChats.getUserChat(chat_reco) != null) {
        lzm_chatUserActions.deleteChatInput(chat_reco);
        try {
            lzm_chatServerEvaluation.userChatObjects.setUserChat(chat_reco, {status: 'read'});
        } catch(e) {}
        chatMessage = (typeof chatMessage != 'undefined' && chatMessage != '') ? chatMessage : grabEditorContents();
        if (chatMessage != '')
        {
            lzm_chatPollServer.typingChatPartner = '';
            var new_chat = {};
            new_chat.id = md5(String(Math.random())).substr(0, 32);
            new_chat.rp = '';
            new_chat.sen = lzm_chatServerEvaluation.myId;
            new_chat.rec = '';
            new_chat.reco = chat_reco;
            var tmpdate = lzm_chatTimeStamp.getLocalTimeObject();
            new_chat.date = lzm_chatTimeStamp.getServerTimeString(tmpdate, true);
            new_chat.cmc = lzm_chatServerEvaluation.chatMessageCounter;
            lzm_chatServerEvaluation.chatMessageCounter++;
            new_chat.date_human = lzm_commonTools.getHumanDate(tmpdate, 'date', lzm_chatDisplay.userLanguage);
            new_chat.time_human = lzm_commonTools.getHumanDate(tmpdate, 'time', lzm_chatDisplay.userLanguage);
            var chatText = chatMessage.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, "<br />");

            if(!lzm_chatUserActions.messageFromKnowledgebase || chatText.indexOf('<a')==-1)
            {
                chatText = chatText.replace(/<script/g,'&lt;script').replace(/<\/script/g,'&lt;/script');
                chatText = lzm_commonTools.addLinksToChatInput(chatText);
            }

            new_chat.text = lzm_commonTools.replaceChatPlaceholders(chat_reco, chatText);
            if (translatedChatMessage != '')
            {
                var translatedText = translatedChatMessage.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, "<br />");
                translatedText = translatedText.replace(/<script/g,'&lt;script').replace(/<\/script/g,'&lt;/script');
                translatedText = lzm_commonTools.addLinksToChatInput(translatedText);
                new_chat.tr = translatedText;
            }
            var os = '';

            if (chat_reco == lzm_chatDisplay.active_chat_reco)
                clearEditorContents(os, lzm_chatDisplay.browserName, 'send');

            lzm_chatUserActions.sendChatMessage(new_chat, translatedChatMessage, visitorChat);

            lzm_chatServerEvaluation.userChats.setUserChatMessage(new_chat);
            if (chat_reco == lzm_chatDisplay.active_chat_reco) {
                lzm_chatDisplay.createChatHtml(lzm_chatPollServer.thisUser);
                lzm_chatDisplay.createViewSelectPanel();
                lzm_chatDisplay.createChatWindowLayout(true);
            }
        }
    }
    else
        inviteExternalUser(lzm_chatDisplay.thisUser.id, lzm_chatDisplay.thisUser.b_id);
}

function showAllchatsList(userAction) {
    userAction = (typeof userAction != 'undefined') ? userAction : false;
    if (userAction) {
        if (lzm_chatUserActions.active_chat_reco != '') {
            lzm_chatUserActions.saveChatInput(lzm_chatUserActions.active_chat_reco);
            removeEditor();
        }
        lzm_chatUserActions.setActiveChat('LIST', 'LIST', { id:'', b_id:'', b_chat:{ id:'' } });
        lzm_chatDisplay.lastActiveChat = 'LIST';
        $('#chat-allchats').css({'display': 'block'});

    }
    else if (lzm_chatUserActions.active_chat_reco == '' || lzm_chatUserActions.active_chat_reco == 'LIST')
            $('#chat-allchats').css({'display': 'block'});

    lzm_chatDisplay.createActiveChatPanel(false,false, false);
    lzm_chatDisplay.allchatsDisplay.updateAllChats();
    lzm_chatDisplay.updateChatElements();
    lzm_chatDisplay.blinkIcons();
}

function hideAllchatsList() {
    $('#chat-allchats').css({'display': 'none'});
}

function selectChatLine(chatId) {
    $('.allchats-line').removeClass('selected-table-line');
    $('#allchats-line-' + chatId).addClass('selected-table-line');
    $('#all-chats-list').data('selected-line', chatId);
}

function toggleMemberList(){
    if($.inArray(lzm_chatUserActions.active_chat_reco,lzm_chatDisplay.minimizedMemberLists)==-1)
        lzm_chatDisplay.minimizedMemberLists.push(lzm_chatUserActions.active_chat_reco);
    else
        lzm_chatDisplay.minimizedMemberLists.splice($.inArray(lzm_chatUserActions.active_chat_reco, lzm_chatDisplay.minimizedMemberLists), 1 );
    lzm_chatDisplay.updateChatElements();
}

function openChatLineContextMenu(chatId, isBotChat, e, missed) {
    selectChatLine(chatId);
    var scrolledDownY, scrolledDownX, parentOffset, place = 'all-chats';
    scrolledDownY = $('#' + place +'-body').scrollTop();
    scrolledDownX = $('#' + place +'-body').scrollLeft();
    parentOffset = $('#' + place +'-body').offset();
    var xValue = e.pageX - parentOffset.left + scrolledDownX;
    var yValue = e.pageY - parentOffset.top + scrolledDownY;
    var chat = null;
    chatId = chatId.replace('-my','');

    if (!missed)
    {
        chat = lzm_commonTools.clone(lzm_commonTools.GetElementByProperty(lzm_chatDisplay.allchatsDisplay.allChats,'cid',chatId))[0].obj;
        chat.missed = false;
    }
    else
    {
        chat = lzm_commonTools.clone(lzm_commonTools.GetElementByProperty(lzm_chatDisplay.allchatsDisplay.missedChats,'cid',chatId))[0].obj;
        chat.missed = true;
    }



    if (chat != null && typeof chat != 'undefined')
    {
        chat.isBotChat = isBotChat;
        lzm_chatDisplay.showContextMenu(place, chat, xValue, yValue);
        e.stopPropagation();
    }
    e.preventDefault();
}

function removeChatLineContextMenu() {
    $('#all-chats-context').remove();
}

function addJoinedMessageToChat(chat_reco, visitorName, groupName) {

    groupName = (typeof groupName != 'undefined') ? groupName : '';
    var chatText = (groupName != '') ? t('<!--vis_name--> joins <!--group_name-->.',[['<!--vis_name-->', visitorName], ['<!--group_name-->', groupName]]) :
        t('<!--vis_name--> joins the chat.',[['<!--vis_name-->', visitorName]]);
    var new_chat = {};
    new_chat.id = md5(String(Math.random())).substr(0, 32);
    new_chat.rp = '';
    new_chat.sen = '0000000';
    new_chat.rec = '';
    new_chat.reco = chat_reco;
    var tmpdate = lzm_chatTimeStamp.getLocalTimeObject();
    new_chat.date = lzm_chatTimeStamp.getServerTimeString(tmpdate, true);
    new_chat.cmc = lzm_chatServerEvaluation.chatMessageCounter;
    lzm_chatServerEvaluation.chatMessageCounter++;
    new_chat.date_human = lzm_commonTools.getHumanDate(tmpdate, 'date', lzm_chatDisplay.userLanguage);
    new_chat.time_human = lzm_commonTools.getHumanDate(tmpdate, 'time', lzm_chatDisplay.userLanguage);
    new_chat.text = chatText;
    lzm_chatServerEvaluation.userChats.setUserChatMessage(new_chat);
}

function addLeftMessageToChat(chat_reco, visitorName, groupName) {
    groupName = (typeof groupName != 'undefined') ? groupName : '';
    var chatText = (groupName != '') ? t('<!--vis_name--> has left <!--group_name-->.',[['<!--vis_name-->', visitorName], ['<!--group_name-->', groupName]]) :
        tid('visitor_left',[['<!--vis_name-->', visitorName]]);

    var new_chat = {};
    new_chat.id = md5(String(Math.random())).substr(0, 32);
    new_chat.rp = '';
    new_chat.sen = '0000000';
    new_chat.rec = '';
    new_chat.reco = chat_reco;
    var tmpdate = lzm_chatTimeStamp.getLocalTimeObject();
    new_chat.date = lzm_chatTimeStamp.getServerTimeString(tmpdate, true);
    new_chat.cmc = lzm_chatServerEvaluation.chatMessageCounter;
    lzm_chatServerEvaluation.chatMessageCounter++;
    new_chat.date_human = lzm_commonTools.getHumanDate(tmpdate, 'date', lzm_chatDisplay.userLanguage);
    new_chat.time_human = lzm_commonTools.getHumanDate(tmpdate, 'time', lzm_chatDisplay.userLanguage);
    new_chat.text = chatText;
    lzm_chatServerEvaluation.userChats.setUserChatMessage(new_chat);
}

function addOpLeftMessageToChat(chat_reco, members, newIdList) {
    var goneMessages = [];
    for (var i=0; i<members.length; i++) {
        if (members[i].id != lzm_chatServerEvaluation.myId && members[i].st == 1 &&
            $.inArray(members[i].id, newIdList) == -1) {
            var operator = lzm_chatServerEvaluation.operators.getOperator(members[i].id);
            if (operator != null) {
                var new_chat = {};
                new_chat.id = md5(String(Math.random())).substr(0, 32);
                new_chat.rp = '';
                new_chat.sen = '0000000';
                new_chat.rec = '';
                new_chat.reco = chat_reco;
                var tmpdate = lzm_chatTimeStamp.getLocalTimeObject();
                new_chat.date = lzm_chatTimeStamp.getServerTimeString(tmpdate, true);
                new_chat.cmc = lzm_chatServerEvaluation.chatMessageCounter;
                lzm_chatServerEvaluation.chatMessageCounter++;
                new_chat.date_human = lzm_commonTools.getHumanDate(tmpdate, 'date', lzm_chatDisplay.userLanguage);
                new_chat.time_human = lzm_commonTools.getHumanDate(tmpdate, 'time', lzm_chatDisplay.userLanguage);
                new_chat.text = tid('op_has_left').replace('<!--this_op_name-->', operator.name);
                goneMessages.push(new_chat);
            }
        }
    }

    if(goneMessages.length < 3)
        for (var i=0; i<goneMessages.length; i++)
            lzm_chatServerEvaluation.userChats.setUserChatMessage(goneMessages[i]);

    lzm_chatServerEvaluation.setChatAccepted(chat_reco, true);
}

function addDeclinedMessageToChat(id, b_id, chatPartners) {
    var userChat = lzm_chatServerEvaluation.userChats.getUserChat(id + '~' + b_id);
    for (var i=0; i<chatPartners.past.length; i++) {
        if ($.inArray(chatPartners.past[i], chatPartners.present) == -1) {
            var operator = lzm_chatServerEvaluation.operators.getOperator(chatPartners.past[i]);
            if (operator != null) {
                var new_chat = {};
                new_chat.id = md5(String(Math.random())).substr(0, 32);
                new_chat.rp = '';
                new_chat.sen = '0000000';
                new_chat.rec = '';
                new_chat.reco = id + '~' + b_id;
                var tmpdate = lzm_chatTimeStamp.getLocalTimeObject();
                new_chat.date = lzm_chatTimeStamp.getServerTimeString(tmpdate, true);
                new_chat.cmc = lzm_chatServerEvaluation.chatMessageCounter;
                lzm_chatServerEvaluation.chatMessageCounter++;
                new_chat.date_human = lzm_commonTools.getHumanDate(tmpdate, 'date', lzm_chatDisplay.userLanguage);
                new_chat.time_human = lzm_commonTools.getHumanDate(tmpdate, 'time', lzm_chatDisplay.userLanguage);
                new_chat.text = t('<!--this_op_name--> has declined the chat.', [['<!--this_op_name-->', operator.name]]);
                lzm_chatServerEvaluation.userChats.setUserChatMessage(new_chat);
            }
            if (chatPartners.past[i] == lzm_chatServerEvaluation.myId) {
                if (userChat != null) {
                    lzm_chatServerEvaluation.userChats.setUserChat(id + '~' + b_id, {status: 'declined'});
                    lzm_chatDisplay.createActiveChatPanel(false, true);
                    if (lzm_chatDisplay.active_chat_reco == id + '~' + b_id) {
                        lzm_chatDisplay.removeSoundPlayed(id + '~' + b_id);
                        lzm_chatUserActions.viewUserData(id, b_id, userChat.chat_id);
                    }
                }
            }
        }
    }
}

function addOpJoinedMessageToChat(chat_reco, newMembers, oldMembers) {
    for (var i=0; i<newMembers.length; i++) {
        var operator = lzm_chatServerEvaluation.operators.getOperator(newMembers[i]);
        if (operator != null) {
            var oldMemberString = '';
            for (var j=0; j< oldMembers.length; j++) {
                var op2 = lzm_chatServerEvaluation.operators.getOperator(oldMembers[j]);
                if (op2 != null)
                    oldMemberString += op2.name + ', ';
            }
            var visitor = lzm_chatServerEvaluation.visitors.getVisitor(chat_reco.split('~')[0]);
            if (visitor != null)
                oldMemberString += (visitor.name != '-') ? visitor.name : visitor.unique_name;
            var new_chat = {};
            new_chat.id = md5(String(Math.random())).substr(0, 32);
            new_chat.rp = '';
            new_chat.sen = '0000000';
            new_chat.rec = '';
            new_chat.reco = chat_reco;
            var tmpdate = lzm_chatTimeStamp.getLocalTimeObject();
            new_chat.date = lzm_chatTimeStamp.getServerTimeString(tmpdate, true);
            new_chat.cmc = lzm_chatServerEvaluation.chatMessageCounter;
            lzm_chatServerEvaluation.chatMessageCounter++;
            new_chat.date_human = lzm_commonTools.getHumanDate(tmpdate, 'date', lzm_chatDisplay.userLanguage);
            new_chat.time_human = lzm_commonTools.getHumanDate(tmpdate, 'time', lzm_chatDisplay.userLanguage);
            new_chat.text = tid('op_joined_chat').replace('<!--this_op_name-->',operator.name);
            lzm_chatServerEvaluation.userChats.setUserChatMessage(new_chat);
        }
    }
}

function removeFromOpenChats(chat, deleteFromChat, resetActiveChat, member, caller) {
    var i, inChatWith = [], mainChatPartner = '';

    for (i=0; i<member.length; i++) {
        if (member[i].st == 0)
            mainChatPartner = member[i].id;
        inChatWith.push(member[i].id);
    }
    var visBro = lzm_chatServerEvaluation.visitors.getVisitorBrowser(chat);
    /*if (inChatWith.length != 0 && $.inArray(lzm_chatServerEvaluation.myId, inChatWith) == -1 && lzm_chatServerEvaluation.userChats.getUserChat(chat).status != 'left') {
        var tmpdate = lzm_chatTimeStamp.getLocalTimeObject();

        if (inChatWith.length == 1 && inChatWith[0] == mainChatPartner)
        {

            if(visBro[0].b_chat.q == 1 && visBro[0].b_chat.pn.acc=='1')
            {

                var operator = lzm_chatServerEvaluation.operators.getOperator(mainChatPartner);
                var opName = (operator != null) ? operator.name : t('Another operator');
                new_chat = {};
                new_chat.id = md5(String(Math.random())).substr(0, 32);
                new_chat.rp = '';
                new_chat.sen = '0000000';
                new_chat.rec = '';
                new_chat.reco = chat;
                new_chat.date = lzm_chatTimeStamp.getServerTimeString(tmpdate, true);
                new_chat.cmc = lzm_chatServerEvaluation.chatMessageCounter;
                lzm_chatServerEvaluation.chatMessageCounter++;
                new_chat.date_human = lzm_commonTools.getHumanDate(tmpdate, 'date', lzm_chatDisplay.userLanguage);
                new_chat.time_human = lzm_commonTools.getHumanDate(tmpdate, 'time', lzm_chatDisplay.userLanguage);
                new_chat.text = t('<!--this_op_name--> has accepted the chat.', [['<!--this_op_name-->',opName]]);
                lzm_chatServerEvaluation.userChats.setUserChatMessage(new_chat);
            }

        }
    }
    */
    if (deleteFromChat && $.inArray(lzm_chatServerEvaluation.myId, inChatWith) == -1){
        //lzm_chatServerEvaluation.userChats.setUserChat(chat, {status: 'left'});
        lzm_chatServerEvaluation.userChats.setUserChat(chat, {my_chat: false, my_chat_old: true});
    }

    var chatIsAccepted = (visBro[1] != null && visBro[1].chat.id != '') ? (visBro[1].chat.pn.acc == 1) : false;
    if ($.inArray(lzm_chatServerEvaluation.myId, inChatWith) == -1 || !chatIsAccepted) {
        var tmpOpenchats = [];
        for (i=0; i<lzm_chatDisplay.openChats.length; i++) {
            if (chat != lzm_chatDisplay.openChats[i]) {
                tmpOpenchats.push(lzm_chatDisplay.openChats[i]);
            }
        }
        lzm_chatDisplay.openChats = tmpOpenchats;
        lzm_chatUserActions.open_chats = tmpOpenchats;
    }


    if (resetActiveChat)
        if (lzm_chatDisplay.active_chat_reco == chat && lzm_chatDisplay.selected_view == 'mychats')
            setTimeout(function() {lzm_chatUserActions.viewUserData(chat.split('~')[0], chat.split('~')[1], 0, true);}, 20);

}

function leaveAllChatsOfVisitor(id) {
    var visitor = lzm_chatServerEvaluation.visitors.getVisitor(id);
    if (visitor != null) {
        for (var i=0; i<visitor.b.length; i++) {
            if (visitor.b[i].chat.id != '') {
                markVisitorAsLeft(id, visitor.b[i].id);
            }
        }
    }
}

function markVisitorAsLeft(id, b_id) {
    var userChat = lzm_chatServerEvaluation.userChats.getUserChat(id + '~' + b_id);

    if ($.inArray(userChat.status, ['left'/*),'declined'*/]) == -1) {
        var visBro = lzm_chatServerEvaluation.visitors.getVisitorBrowser(id, b_id);
        var visitorName = (visBro[1] != null && visBro[1].cname != '') ? visBro[1].cname : (visBro[0] != null) ? visBro[0].unique_name : id;
        addLeftMessageToChat(id + '~' + b_id, lzm_commonTools.htmlEntities(visitorName));
    }
    lzm_chatServerEvaluation.userChats.setUserChat(id + '~' + b_id, {status: 'left'});
    if (lzm_chatDisplay.active_chat_reco == id + '~' + b_id) {
        removeFromOpenChats(id + '~' + b_id, false, true, [], 'markVisitorAsLeft');
    }
}

function markVisitorAsBack(id, b_id, chat_id, member) {
    var chatIsMine = false, visitorName = '';
    for (var j=0; j<member.length; j++) {
        if (member[j].id == lzm_chatServerEvaluation.myId) {
            chatIsMine = true;
            break;
        }
    }
    if (chatIsMine)
    {
        removeFromOpenChats(id + '~' + b_id, false, true, member, 'markVisitorAsBack');
        addChatInfoBlock(id, b_id);
        lzm_chatServerEvaluation.userChats.setUserChat(id + '~' + b_id, {status: 'new'});
        lzm_commonTools.RemoveFromArray(lzm_chatDisplay.closedChats,id + '~' + b_id);



        /*
         visBro = lzm_chatServerEvaluation.visitors.getVisitorBrowser(id, b_id);
        visitorName = (visBro[1] != null && visBro[1].cname != '') ? visBro[1].cname : (visBro[0] != null) ? visBro[0].unique_name : id;

        var new_chat = {};
        new_chat.id = md5(String(Math.random())).substr(0, 32);
        new_chat.rp = '';
        new_chat.sen = '0000000';
        new_chat.rec = '';
        new_chat.reco = id + '~' + b_id;
        var tmpdate = lzm_chatTimeStamp.getLocalTimeObject();
        new_chat.date = lzm_chatTimeStamp.getServerTimeString(tmpdate, true);
        new_chat.cmc = lzm_chatServerEvaluation.chatMessageCounter;
        lzm_chatServerEvaluation.chatMessageCounter++;
        new_chat.date_human = lzm_commonTools.getHumanDate(tmpdate, 'date', lzm_chatDisplay.userLanguage);
        new_chat.time_human = lzm_commonTools.getHumanDate(tmpdate, 'time', lzm_chatDisplay.userLanguage);
        new_chat.text = t('<!--this_vis_name--> is in chat with <!--this_op_name-->',
            [['<!--this_vis_name-->', lzm_commonTools.htmlEntities(visitorName)],['<!--this_op_name-->', lzm_chatServerEvaluation.myName]]);
        lzm_chatServerEvaluation.userChats.setUserChatMessage(new_chat);
        */

        lzm_chatServerEvaluation.browserChatIdList.push(chat_id);
        if (isAutoAcceptActive()) {
            if (visitor != null)
                lzm_chatUserActions.acceptChat(id, b_id, chat_id,id + '~' + b_id, visitor.lang);

        }
    } else {
        var userChat = lzm_chatServerEvaluation.userChats.getUserChat(id + '~' + b_id);
        if (userChat.my_chat) {

            removeFromOpenChats(id + '~' + b_id, false, true, member, 'markVisitorAsBack');
            var visBro = lzm_chatServerEvaluation.visitors.getVisitorBrowser(id, b_id);
            visitorName = (visBro[1] != null && visBro[1].cname != '') ? visBro[1].cname : (visBro[0] != null) ? visBro[0].unique_name : id;
            if ($.inArray(userChat.status, ['new','left'/*,'declined'*/]) == -1)
                addLeftMessageToChat(id + '~' + b_id, lzm_commonTools.htmlEntities(visitorName));
            lzm_chatServerEvaluation.userChats.setUserChat(id + '~' + b_id, {my_chat: false, my_chat_old: true, status: 'new'});
        } else {
            lzm_chatServerEvaluation.userChats.setUserChat(id + '~' + b_id, {status: 'new'});
        }
    }
}

function addChatInfoBlock(id, b_id) {
    if (b_id != '') {
        var visitor = lzm_chatServerEvaluation.visitors.getVisitor(id);
        if (visitor != null) {
            for (var j=0; j<visitor.b.length; j++) {
                if (visitor.b[j].id == b_id) {
                    if (typeof visitor.b[j].chat != 'undefined') {
                        var tmpDate = lzm_chatTimeStamp.getLocalTimeObject(visitor.b[j].chat.f * 1000, true);

                        var tUoperators = '';
                        var operators = lzm_chatServerEvaluation.operators.getOperatorList();
                        for (var i=0; i<operators.length; i++) {
                            if (typeof visitor.b[j].chat != 'undefined' && typeof visitor.b[j].chat.pn != 'undefined' &&
                                typeof visitor.b[j].chat.pn.memberIdList != 'undefined' &&
                                $.inArray(operators[i].id, visitor.b[j].chat.pn.memberIdList) != -1) {
                                tUoperators +=  operators[i].name + ', ';
                            }
                        }
                        tUoperators = tUoperators.replace(/, *$/,'');
                        var name = (visitor.b[j].cname != '') ? visitor.b[j].cname : visitor.unique_name;
                        var customFields = '';
                        for (var key in visitor.b[j].chat.cf) {
                            if (visitor.b[j].chat.cf.hasOwnProperty(key)) {
                                var inputText = (lzm_chatServerEvaluation.inputList.getCustomInput(key).type != 'CheckBox') ?
                                    lzm_commonTools.htmlEntities(visitor.b[j].chat.cf[key]) :
                                    (visitor.b[j].chat.cf[key] == 1) ? t('Yes') : t('No');
                                customFields += '<tr><td style="white-space: nowrap; vertical-align: top;">' +
                                    lzm_chatServerEvaluation.inputList.getCustomInput(key).name + '</td>' +
                                    '<td>' + inputText + '</td></tr>';
                            }
                        }

                        var chatArea = (visitor.b[j].h2.length > 0 && visitor.b[j].h2[visitor.b[j].h2.length - 1].code != '') ? visitor.b[j].h2[visitor.b[j].h2.length - 1].code : '';
                        var chatUrl = (visitor.b[j].h2.length > 0 && visitor.b[j].h2[visitor.b[j].h2.length - 1].url != '') ? visitor.b[j].h2[visitor.b[j].h2.length - 1].url : '';
                        if (visitor.b[j].h2.length == 0) {
                            var lastOpened = 0;
                            for (var k=0; k<visitor.b.length; k++) {
                                if (visitor.b[k].h2.length > 0 && visitor.b[k].h2[visitor.b[k].h2.length - 1].time > lastOpened && visitor.b[k].chat.id == '') {
                                    chatUrl = (visitor.b[k].h2[visitor.b[k].h2.length - 1].url != '') ? visitor.b[k].h2[visitor.b[k].h2.length - 1].url : '';
                                    chatArea = (visitor.b[k].h2[visitor.b[k].h2.length - 1].code != '') ? visitor.b[k].h2[visitor.b[k].h2.length - 1].code : '';
                                    lastOpened = visitor.b[k].h2[visitor.b[k].h2.length - 1].time;
                                }
                            }
                        }
                        var new_chat = {
                            date: visitor.b[j].chat.f,
                            cmc: lzm_chatServerEvaluation.chatMessageCounter,
                            id : md5(String(Math.random())).substr(0, 32),
                            rec: id + '~' + b_id,
                            reco: lzm_chatDisplay.myId,
                            rp: '0',
                            sen: id + '~' + b_id,
                            sen_id: id,
                            sen_b_id: b_id,
                            text: '',
                            date_human: lzm_commonTools.getHumanDate(tmpDate, 'date', lzm_chatDisplay.userLanguage),
                            time_human: lzm_commonTools.getHumanDate(tmpDate, 'time', lzm_chatDisplay.userLanguage),
                            info_header: {
                                group: visitor.b[j].chat.gr,
                                operators: tUoperators,
                                name: name,
                                mail: visitor.b[j].cemail,
                                company: visitor.b[j].ccompany,
                                phone: visitor.b[j].cphone,
                                question: visitor.b[j].chat.eq,
                                chat_id: visitor.b[j].chat.id,
                                area_code: chatArea,
                                url: chatUrl,
                                cf: customFields
                            }
                        };
                        lzm_chatServerEvaluation.chatMessageCounter++;
                    }
                    break;
                }
            }
        }
        lzm_chatServerEvaluation.userChats.setUserChatMessage(new_chat);
    }
}

function isAutoAcceptActive () {
    if(lzm_commonPermissions.checkUserPermissions(lzm_chatDisplay.myId, 'chats', 'must_auto_accept', {}) ||
        (lzm_commonPermissions.checkUserPermissions(lzm_chatDisplay.myId, 'chats', 'can_auto_accept', {}) && lzm_chatDisplay.autoAcceptChecked == 1))
    {
        return true;
    } else
        return false;
}

function playIncomingMessageSound(sender, receivingChat, chatId, text) {
    receivingChat = (typeof receivingChat != 'undefined' && receivingChat != '') ? receivingChat : sender;
    lzm_chatDisplay.lastChatSendingNotification = receivingChat;
    chatId = (typeof chatId != 'undefined') ? chatId : '';
    text = (typeof text != 'undefined') ? text : '';
    if (lzm_chatDisplay.playNewMessageSound == 1 &&
        ($.inArray(sender, lzm_chatDisplay.openChats) != -1 || sender.indexOf('~') == -1 || lzm_chatDisplay.playNewChatSound != 1 )) {
        lzm_chatDisplay.playSound('message', sender, text);
    }
    var notificationSound;
    if (lzm_chatDisplay.playNewMessageSound != 1) {
        notificationSound = 'DEFAULT'
    } else {
        notificationSound = 'NONE'
    }
    text = (typeof text != 'undefined') ? text : '';
    var i, senderId, senderBid, senderName = t('Visitor');
    if (sender.indexOf('~') != -1) {
        senderId = sender.split('~')[0];
        senderBid = sender.split('~')[1];
        var visitor = lzm_chatServerEvaluation.visitors.getVisitor(senderId);
        if (visitor != null) {
            for (var j=0; j<visitor.b.length; j++) {
                if (visitor.b[j].id == senderBid) {
                    senderName = (typeof visitor.b[j].cname != 'undefined' && visitor.b[j].cname != '') ? visitor.b[j].cname : visitor.unique_name;
                }
            }
        }

    } else {
        senderId = sender;
        var operator = lzm_chatServerEvaluation.operators.getOperator(senderId);
        senderName = (operator != null) ? operator.name : senderName;
    }
    text = text.replace(/<.*?>/g,'').replace(/<\/.*?>/g,'');

    var notificationPush = tid('notification_new_message',[['<!--sender-->',senderName],['<!--text-->',text]]).substr(0, 250);
    if (typeof lzm_deviceInterface != 'undefined') {
        try {
            lzm_deviceInterface.showNotification(t('LiveZilla'), notificationPush, notificationSound, sender, receivingChat, "1");
        } catch(ex) {
            try {
                lzm_deviceInterface.showNotification(t('LiveZilla'), notificationPush, notificationSound, sender, receivingChat);
            } catch(e) {
                deblog('Error while showing notification');
            }
        }
    }
    if (lzm_chatDisplay.selected_view != 'mychats' || $('.dialog-window-container').length > 0) {
        if(lzm_commonStorage.loadValue('not_chats_' + lzm_chatServerEvaluation.myId,1)!=0)
            if (sender.indexOf('~') == -1 || ((lzm_chatServerEvaluation.userChats.getUserChat(sender) != null && lzm_chatServerEvaluation.userChats.getUserChat(sender).accepted) || isAutoAcceptActive())) {
                lzm_displayHelper.showBrowserNotification({
                    text: text,
                    sender: senderName,
                    subject: t('New Chat Message'),
                    action: 'openChatFromNotification(\'' + receivingChat + '\'); closeOrMinimizeDialog();',
                    timeout: 10,
                    icon: 'fa-commenting-o'
                });
            }
    }
}

function openChatFromNotification(chatPartner, type) {
    type = (typeof type != 'undefined') ? type : '';
    selectView('mychats');
    if (typeof chatPartner != 'undefined' && chatPartner != '') {
        lzm_chatDisplay.lastChatSendingNotification = chatPartner;
    }
    if (lzm_chatDisplay.lastChatSendingNotification != '') {
        openChatTabById('notification');
    }
    if (type == 'push')
        showAppIsSyncing();
}

function declineChat(id, b_id, chat_id){
    lzm_chatUserActions.declineChat(id, b_id, chat_id);
}

function openChatTabById(id) {

    //notthis = (d(notthis)) ? notthis : '';
    //var now = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
    //if (now - lzm_chatDisplay.lastActiveCalledAt > 1000 || lzm_chatDisplay.lastActiveCallCounter < 5)
    //{
        //lzm_chatDisplay.lastActiveCalledAt = now;
        //lzm_chatDisplay.lastActiveCallCounter++;

        var chatToOpen = '';
        if (id == 'notification')
            chatToOpen = lzm_chatDisplay.lastChatSendingNotification;
        else if (id == 'panel' && lzm_chatDisplay.lastChatSendingNotification != '')
            chatToOpen = lzm_chatDisplay.lastChatSendingNotification;
        else
            chatToOpen = id;

        lzm_chatDisplay.lastChatSendingNotification = '';

        var but = $('#chat-button-'+chatToOpen);
        if(but.length)
            $('#chat-button-'+chatToOpen).click();
        else if(chatToOpen.indexOf('~')!=-1)
            openChatTab(chatToOpen.split('~')[0],chatToOpen.split('~')[1],'');
}

function openChatTab(id, b_id, chat_id){
    lzm_commonTools.RemoveFromArray(lzm_chatDisplay.closedChats,id +'~'+ b_id);
    viewUserData(id, b_id, chat_id, true);
}

function closeChatTab(openNext){
    openNext = d(openNext) ? openNext : true;
    if (lzm_chatDisplay.thisUser.b_id != '')
    {
        lzm_chatDisplay.closedChats.push(lzm_chatDisplay.active_chat_reco);
    }
    else
        lzm_chatUserActions.leaveInternalChat(lzm_chatDisplay.thisUser.id, lzm_chatDisplay.thisUser.userid, lzm_chatDisplay.thisUser.name, openNext);

    if(openNext)
    {
        selectNextTabInRow(lzm_chatDisplay.active_chat_reco);
    }
}

function leaveChat(chatId) {

    var curActchat = lzm_chatDisplay.active_chat;
    var curActchatReco = lzm_chatDisplay.active_chat_reco;
    var curActchatUser = lzm_chatDisplay.thisUser;

    if (d(chatId))
    {
        var visitorBrowser = lzm_chatServerEvaluation.visitors.getVisitorBrowser('', '', chatId);
        if (visitorBrowser[0] != null && visitorBrowser[1] != null)
        {
            curActchat = visitorBrowser[0].id;
            curActchatReco = visitorBrowser[0].id + '~' + visitorBrowser[1].id;
            curActchatUser = visitorBrowser[0];
        }

    }

    var i;
    lzm_chatServerEvaluation.setChatAccepted(curActchatReco, false);
    var thisBId = curActchatReco.split('~')[1];
    for (i=0; i<curActchatUser.b.length; i++) {
        if (curActchatUser.b[i].id == thisBId) {
            curActchatUser.b_id = curActchatUser.b[i].id;
            curActchatUser.b_chat = curActchatUser.b[i].chat;
            break;
        }
    }

    var chatObj = lzm_chatServerEvaluation.userChats.getUserChat(curActchatReco);
    if (chatObj != null) {
        var isMainChat = true;
        var chatServerAccepted = (typeof curActchatUser.b_chat.pn != 'undefined' && curActchatUser.b_chat.pn.acc == 1);
        var chatLocalAccepted = ($.inArray(curActchatUser.b_chat.id, lzm_chatUserActions.localAcceptedChats) != -1);
        var chatDeclined = chatObj.status == 'declined';
        var chatMember = (typeof curActchatUser.b_chat.pn != 'undefined') ? curActchatUser.b_chat.pn.member : [];
        var lastOperator = true;
        var chatHasEnded = lzm_chatServerEvaluation.userChats.getUserChat(curActchatReco).status == 'left' || curActchatUser.is_active == false;
        for (var l=0; l<chatMember.length; l++)
            if (chatMember.length > 1 && chatMember[l].st != 0){
                if(chatMember[l].id == lzm_chatDisplay.myId)
                    isMainChat = false;
                else
                    lastOperator = false;
            }

        var closeOrLeave = ((isMainChat && lastOperator) || chatDeclined) ? 'close' : 'leave';
        if(!chatLocalAccepted && !chatServerAccepted && !chatHasEnded && !chatDeclined)
            lzm_chatUserActions.declineChat(curActchatUser.id, curActchatUser.b_id, curActchatUser.b_chat.id);
        else if (chatDeclined)
        {
            /*
            lzm_chatUserActions.setActiveChat('', '', { id:'', b_id:'', b_chat:{ id:'' } });
            lzm_chatDisplay.createActiveChatPanel(false, true, false);
            lzm_chatDisplay.createHtmlContent(curActchatUser, curActchatReco);
            */
        }
        else if (chatHasEnded || !isMainChat || !lastOperator || !chatObj.my_chat)
            lzm_chatUserActions.leaveExternalChat(curActchatUser.id, curActchatUser.b_id, curActchatUser.b_chat.id, 0, closeOrLeave);
        else
        {
            lzm_commonDialog.createAlertDialog(t('Do you really want to close this Chat?'), [{id: 'ok', name: t('Ok')}, {id: 'cancel', name: t('Cancel')}]);
            $('#alert-btn-ok').click(function() {

                lzm_chatUserActions.leaveExternalChat(curActchatUser.id, curActchatUser.b_id, curActchatUser.b_chat.id, 0, closeOrLeave);
                $('#alert-btn-cancel').click();
            });
            $('#alert-btn-cancel').click(function() {
                lzm_commonDialog.removeAlertDialog();
            });
        }
    }
}

function closeChat(chatId, visitorId, browserId, avoidReAppearanceOnClose){
    this.lzm_chatPollServer.stopPolling();
    this.lzm_chatPollServer.addToOutboundQueue('p_ca_0_va', visitorId, 'nonumber');
    this.lzm_chatPollServer.addToOutboundQueue('p_ca_0_vb', browserId, 'nonumber');
    this.lzm_chatPollServer.addToOutboundQueue('p_ca_0_vc', chatId, 'nonumber');
    this.lzm_chatPollServer.addToOutboundQueue('p_ca_0_vd', 'CloseChat', 'nonumber');
    this.lzm_chatPollServer.pollServer(this.lzm_chatPollServer.fillDataObject(), 'shout');
    if(avoidReAppearanceOnClose)
        lzm_chatDisplay.hiddenChats[chatId] = chatId;
}

function closeAllInactiveChats(){
    var toClose = [];
    $('#active-chat-panel div').each(function(){
        $(this).find('span').each(function(){
            if($(this).hasClass('lzm-tab-icon-content'))
                if($(this).attr('style').indexOf('lz_offline.png') != -1)
                    toClose.push($(this).parent().attr('id'));
        });
    });

    for(var key in toClose)
    {
        $('#' + toClose[key]).click();
        closeChatTab(false);
    }
    showAllchatsList(true);
}

function selectNextTabInRow(notthis) {
    var toSelect = 'show-allchats-list',newSelect='';
    $('#active-chat-panel div').each(function(){
        var child = $(this);
        if(child.attr('id').indexOf('chat-button-')===0 && !child.hasClass('lzm-tabs-selected'))
        {
            newSelect = child.attr('id');//.replace('chat-button-','');
            if(newSelect != notthis)
                toSelect = newSelect;
        }
    });

    $('#'+toSelect).click();
    return toSelect;
}

function takeChat(visitorId, browserId, chatId, groupId, askBeforeTake) {
    var mayTake = lzm_commonPermissions.checkUserPermissions(lzm_chatDisplay.myId, 'chats', 'take_over', null),taken=false;
    askBeforeTake = (typeof askBeforeTake != 'undefined') ? askBeforeTake : false;
    removeChatLineContextMenu();

    var visitorBrowser = lzm_chatServerEvaluation.visitors.getVisitorBrowser(visitorId, browserId);
    var isBotChat = false;
    if (visitorBrowser[1] != null && typeof visitorBrowser[1].chat.pn != 'undefined' && visitorBrowser[1].chat.pn.member.length == 1) {
        var operator = lzm_chatServerEvaluation.operators.getOperator(visitorBrowser[1].chat.pn.member[0].id);
        if (operator != null && operator.isbot == 1)
            isBotChat = true;
    }

    var hasDeclined = lzm_chatServerEvaluation.userChats.hasDeclinedChat(lzm_chatDisplay.myId,visitorBrowser[1].chat);
    if (visitorBrowser[1] != null && $.inArray(lzm_chatDisplay.myId, visitorBrowser[1].chat.pn.memberIdList) != -1 && !hasDeclined) {
        viewUserData(visitorId, browserId, visitorBrowser[1].chat.id, true);
    }
    else
    {
        if (!mayTake)
            showNoPermissionMessage();
        else if (visitorBrowser[1] != null && (visitorBrowser[1].chat.pn.acc != 1 || isBotChat))
        {
            groupId = ($.inArray(groupId, lzm_chatDisplay.myGroups) != -1) ? groupId : lzm_chatDisplay.myGroups[0];

            if (askBeforeTake) {
                var errorMessage = t('Do you want to take this chat?');
                lzm_commonDialog.createAlertDialog(errorMessage, [{id: 'ok', name: t('Ok')}, {id: 'cancel', name: t('Cancel')}]);
                $('#alert-btn-ok').click(function() {
                    lzm_chatPollServer.pollServerSpecial({v: visitorId, b: browserId, c: chatId, g: groupId}, 'take-chat');
                    lzm_commonDialog.removeAlertDialog();
                    taken = true;
                });
                $('#alert-btn-cancel').click(function() {
                    lzm_commonDialog.removeAlertDialog();
                });
            }
            else
            {
                lzm_chatPollServer.pollServerSpecial({v: visitorId, b: browserId, c: chatId, g: groupId}, 'take-chat');
                taken = true;
            }
        }
        else if (visitorBrowser[1] != null && visitorBrowser[1].chat.pn.acc == 1) {
            if (askBeforeTake) {
                var errorMessage = t('Do you want to take this chat?');
                lzm_commonDialog.createAlertDialog(errorMessage, [{id: 'ok', name: t('Ok')}, {id: 'cancel', name: t('Cancel')}]);
                $('#alert-btn-ok').click(function() {
                    lzm_chatPollServer.pollServerSpecial({v: visitorId, b: browserId, c: chatId, g: groupId, takeover: true,o: visitorBrowser[1].chat.dcp}, 'take-chat');
                    lzm_commonDialog.removeAlertDialog();
                    taken = true;
                });
                $('#alert-btn-cancel').click(function() {
                    lzm_commonDialog.removeAlertDialog();
                });
            }
            else
            {
                lzm_chatPollServer.pollServerSpecial({v: visitorId, b: browserId, c: chatId, g: groupId, takeover: true,o: visitorBrowser[1].chat.dcp}, 'take-chat');
                taken = true;
            }
        }
    }

    if(taken)
        lzm_commonTools.RemoveFromArray(lzm_chatDisplay.closedChats,visitorId + '~' + browserId);
}

function joinChat(visitorId, browserId, chatId, joinInvisible, joinAfterInvitation) {
    joinInvisible = (typeof joinInvisible != 'undefined') ? joinInvisible : false;
    joinAfterInvitation = (typeof joinAfterInvitation != 'undefined') ? joinAfterInvitation : false;
    if (!lzm_commonPermissions.checkUserPermissions(lzm_chatDisplay.myId, 'chats', 'join', {}))
        showNoPermissionMessage();
    else
    {
        lzm_commonTools.RemoveFromArray(lzm_chatDisplay.closedChats,visitorId + '~' + browserId);
        lzm_commonTools.RemoveFromArray(lzm_chatDisplay.joinedChats,visitorId + '~' + browserId);
        lzm_chatDisplay.joinedChats.push(visitorId + '~' + browserId);

        var myChat = lzm_chatServerEvaluation.userChats.getUserChat(visitorId + '~' + browserId);
        if (myChat != null) {
            myChat.my_chat = false;
            myChat.status = 'read';
        }

        if (joinInvisible)
        {
            if (!lzm_commonPermissions.checkUserPermissions(lzm_chatDisplay.myId, 'chats', 'join_invisible', {}))
                showNoPermissionMessage();
            else
                lzm_chatPollServer.pollServerSpecial({v: visitorId, b: browserId, c: chatId}, 'join-chat-invisible');
        }
        else if (joinAfterInvitation)
            lzm_chatPollServer.pollServerSpecial({v: visitorId, b: browserId, c: chatId}, 'join-chat');
        else
        {
            if (lzm_commonPermissions.checkUserPermissions(lzm_chatDisplay.myId, 'chats', 'join_after_invitation', {}))
                showNoPermissionMessage();
            else
                lzm_chatPollServer.pollServerSpecial({v: visitorId, b: browserId, c: chatId}, 'join-chat');
        }
    }
}

function enableChatButtons() {
    $('.disabled-chat-button').removeClass('ui-disabled');
    $('.disabled-chat-button').removeClass('disabled-chat-button');
}

function forwardChat(chatId, type) {
    LoadModuleConfiguration('ChatForwardInvite','lzm_chatDisplay.ChatForwardInvite.showForwardInvite(\''+chatId+'\',\''+type+'\');');
}

function showInvitedMessage(newForward) {
    var operator = lzm_chatServerEvaluation.operators.getOperator(newForward.i);
    var visitor = lzm_chatServerEvaluation.visitors.getVisitorBrowser(newForward.u);
    var userChat = lzm_chatServerEvaluation.userChats.getUserChat(newForward.u);
    if (visitor[0] != null && visitor[1] != null && operator != null && userChat != null && !lzm_chatDisplay.showOpInviteDialog) {
        lzm_chatDisplay.showOpInviteDialog = true;
        var visName = (visitor[1].cname != '') ? visitor[1].cname : visitor[0].unique_name;
        visName = lzm_commonTools.escapeHtml(visName);
        var errorMessage = t('<!--op_name--> invites you to join his chat with <!--visitor_name-->.',[['<!--op_name-->', operator.name], ['<!--visitor_name-->', visName]]);
        errorMessage += tidc('addition_info_given') + '<br />';
        errorMessage +='<div id="add-info-box" class="top-space border-s" style="height:50px; overflow-y: auto; padding: 5px; font-style: italic;">' + newForward.t + '</div>';
        lzm_commonDialog.createAlertDialog(errorMessage, [{id: 'join', name: t('Join Chat')}, {id: 'decline', name: t('Decline')}]);
        $('#alert-btn-join').click(function() {
            joinChat(visitor[0].id, visitor[1].id, visitor[1].chat.id, false, true);
            lzm_chatDisplay.showOpInviteDialog = false;
            lzm_commonDialog.removeAlertDialog();
        });
        $('#alert-btn-decline').click(function() {
            lzm_chatDisplay.showOpInviteDialog = false;
            lzm_commonDialog.removeAlertDialog();
        });
    }
}

function showVisitorChatActionContextMenu(chatReco, button, e) {
    e.stopPropagation();
    if (button == 'panel') {
        e.preventDefault();
    }
    if (lzm_chatDisplay.showChatActionsMenu) {
        removeVisitorChatActionContextMenu();
    } else {
        lzm_chatDisplay.showChatActionsMenu = true;
        var userChat = lzm_chatServerEvaluation.userChats.getUserChat(chatReco);
        userChat.button = button;
        var parentOffset = $('#chat-container').offset();
        var xValue, yValue;
        if (button == 'actions') {
            var buttonOffset = $('#visitor-chat-actions').offset();
            xValue = buttonOffset.left - parentOffset.left - 1;
            yValue = e.pageY - parentOffset.top;
        } else {
            xValue = e.pageX - parentOffset.left;
            yValue = e.pageY - parentOffset.top;
        }

        lzm_chatDisplay.showContextMenu('chat-actions', userChat, xValue, yValue, 'chat-actions');
    }
}

function removeVisitorChatActionContextMenu() {
    lzm_chatDisplay.showChatActionsMenu = false;
    $('#chat-actions-context').remove();
}

/**************************************** Operator settings ****************************************/
function setUserStatus(statusValue, e) {
    if(e!=null)
        e.stopPropagation();
    var previousStatusValue = lzm_chatPollServer.user_status;
    lzm_chatDisplay.setUserStatus(statusValue);
    if (statusValue != 2 && previousStatusValue != 2 && statusValue != previousStatusValue) {
        lzm_chatPollServer.startPolling();
    }
    if (typeof lzm_deviceInterface != 'undefined') {
        try {
            lzm_deviceInterface.setOperatorStatus(parseInt(statusValue));
        } catch(e) {}
    }
}

function manageUsersettings(e) {
    e.stopPropagation();
    saveChatInput(lzm_chatDisplay.active_chat_reco);
    var storedSettingsId = '';
    for (var key in lzm_chatDisplay.StoredDialogs) {
        if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
            if (lzm_chatDisplay.StoredDialogs[key].type == 'settings') {
                storedSettingsId = key;
            }
        }
    }
    if (storedSettingsId != '') {
        lzm_displayHelper.maximizeDialogWindow(storedSettingsId);
    } else {
        var activeUserChat = lzm_chatServerEvaluation.userChats.getUserChat(lzm_chatDisplay.active_chat_reco);
        if (lzm_chatDisplay.selected_view == 'mychats' && activeUserChat != null) {
            saveChatInput(lzm_chatDisplay.active_chat_reco);
            removeEditor();
        }
        lzm_chatDisplay.settingsDisplay.manageUsersettings();
    }
}

function changeTableRow(e,type,tableId,tableIndex,rowId,direction){
    e.stopPropagation();
    lzm_chatDisplay.settingsDisplay.changeTableRow(type,tableId,tableIndex,rowId,direction);
}

function saveUserSettings(saveTables) {
    var firstVisibleView = null;
    var showViewSelectPanel = {
        'home': $('#show-home').prop('checked') ? 1 : 0,
        'world': $('#show-world').prop('checked') ? 1 : 0,
        'mychats': $('#show-mychats').prop('checked') ? 1 : 0,
        'tickets': $('#show-tickets').prop('checked') ? 1 : 0,
        'external': $('#show-external').prop('checked') ? 1 : 0,
        'internal': $('#show-internal').prop('checked') ? 1 : 0,
        'qrd': $('#show-qrd').prop('checked') ? 1 : 0,
        'archive': $('#show-archive').prop('checked') ? 1 : 0,
        'reports': $('#show-reports').prop('checked') ? 1 : 0
    };
    var viewSelectArray = [], viewSelectObject = {}, i = 0, thisColumn, columnIsVisible;
    var allViewsArray = Object.keys(lzm_chatDisplay.allViewSelectEntries);
    for (i=0; i<allViewsArray.length; i++)
        viewSelectObject[allViewsArray[i]] = {name: lzm_chatDisplay.allViewSelectEntries[allViewsArray[i]].title, icon: lzm_chatDisplay.allViewSelectEntries[allViewsArray[i]].icon};

    $('.show-view-div').each(function() {
        var viewId = $(this).data('view-id');
        if (firstVisibleView == null && showViewSelectPanel[viewId] != 0) {
            firstVisibleView = viewId;
        }
        viewSelectArray.push({id: viewId, name: viewSelectObject[viewId].name, icon: viewSelectObject[viewId].icon});
    });
    lzm_chatDisplay.viewSelectArray = viewSelectArray;
    var tableColumns = null;
    if(saveTables){
        lzm_chatDisplay.mainTableColumns = lzm_commonTools.clone(lzm_chatDisplay.settingsDisplay.mainTableColumns);
        var tableNames = lzm_chatDisplay.settingsDisplay.tableIds;
        tableColumns = {};
        for (var j=0; j<tableNames.length; j++) {
            tableColumns[tableNames[j]] = {general: [], custom: []};
            for (i=0; i<lzm_chatDisplay.mainTableColumns[tableNames[j]].length; i++) {
                thisColumn = lzm_chatDisplay.mainTableColumns[tableNames[j]][i];
                thisColumn.display = ($('#show-' + tableNames[j] + '-' + thisColumn.cid).prop('checked')) ? 1 : 0;
                tableColumns[tableNames[j]].general.push(thisColumn);
            }
            for (i=0; i<lzm_chatServerEvaluation.inputList.idList.length; i++) {
                var myCustomInput = lzm_chatServerEvaluation.inputList.getCustomInput(lzm_chatServerEvaluation.inputList.idList[i]);
                if (myCustomInput != null && parseInt(myCustomInput.id) < 111 && myCustomInput.active == '1') {
                    columnIsVisible = ($('#show-' + tableNames[j] + '-custom-' + myCustomInput.id).prop('checked')) ? 1 : 0;
                    thisColumn = {cid: myCustomInput.id, display: columnIsVisible};
                    tableColumns[tableNames[j]].custom.push(thisColumn);
                }
            }
        }
    }

    var settings = {
        volume: $('#volume-slider').val(),
        awayAfterTime: $('#away-after-time').val(),
        playNewMessageSound: $('#sound-new-message').prop('checked') ? 1 : 0,
        playNewChatSound: $('#sound-new-chat').prop('checked') ? 1 : 0,
        repeatNewChatSound: $('#sound-repeat-new-chat').prop('checked') ? 1 : 0,
        backgroundMode: $('#background-mode').prop('checked') ? 1 : 0,
        saveConnections: $('#save-connections').prop('checked') ? 1 : 0,
        ticketsRead: $('#tickets-read').prop('checked') ? 1 : 0,
        playNewTicketSound: $('#sound-new-ticket').prop('checked') ? 1 : 0,
        showViewSelectPanel: showViewSelectPanel,
        viewSelectArray: viewSelectArray,
        autoAccept: $('#auto-accept').prop('checked') ? 1 : 0,
        tableColumns: tableColumns,
        vibrateNotifications: $('#vibrate-notifications').prop('checked') ? 1 : 0,
        qrdAutoSearch: $('#qrd-auto-search').prop('checked') ? 1 : 0,
        alertNewFilter: $('#alert-new-filter').prop('checked') ? 1 : 0
    };

    lzm_commonStorage.saveValue('not_chats_' + lzm_chatServerEvaluation.myId,$('#notification-window-chat').prop('checked') ? 1 : 0);
    lzm_commonStorage.saveValue('not_tickets_' + lzm_chatServerEvaluation.myId,$('#notification-window-tickets').prop('checked') ? 1 : 0);
    lzm_commonStorage.saveValue('not_operators_' + lzm_chatServerEvaluation.myId,$('#notification-window-operators').prop('checked') ? 1 : 0);
    lzm_commonStorage.saveValue('not_feedbacks_' + lzm_chatServerEvaluation.myId,$('#notification-window-feedbacks').prop('checked') ? 1 : 0);
    lzm_commonStorage.saveValue('play_queue_sound_' + lzm_chatServerEvaluation.myId,$('#notification-play-queue-sound').prop('checked') ? 1 : 0);
    lzm_commonStorage.saveValue('repeat_queue_sound_' + lzm_chatServerEvaluation.myId,$('#sound-repeat-queue').prop('checked') ? 1 : 0);
    lzm_commonStorage.saveValue('show_avatars_' + lzm_chatServerEvaluation.myId,$('#show-avatars').prop('checked') ? 1 : 0);
    lzm_commonStorage.saveValue('show_chat_visitor_info_' + lzm_chatServerEvaluation.myId,$('#show-chat-visitor-info').prop('checked') ? 1 : 0);
    lzm_commonStorage.saveValue('show_missed_chats_' + lzm_chatServerEvaluation.myId,$('#show-missed-chats').prop('checked') ? 1 : 0);


    if (appOs == 'blackberry')
        settings.backgroundMode = 1;

    lzm_chatUserActions.saveUserSettings(settings, '', app==1);
    lzm_chatDisplay.createViewSelectPanel(firstVisibleView);
    if (lzm_chatDisplay.selected_view == 'internal')
        lzm_chatDisplay.visitorDisplay.createVisitorList();
    lzm_chatDisplay.allchatsDisplay.createAllchats();
    if (lzm_chatDisplay.selected_view == 'mychats'){
        $('#chat-qrd-preview').html('');
        lzm_chatDisplay.createChatWindowLayout(true);
    }
}

function finishSettingsDialogue() {
    lzm_chatServerEvaluation.settingsDialogue = false;
    lzm_chatDisplay.settingsDialogue = false;
    $('#usersettings-container').css({display: 'none'});
    if (lzm_chatDisplay.selected_view == 'mychats') {
        initEditor(loadChatInput(lzm_chatDisplay.active_chat_reco), 'finishSettings');
    }
}

function showUserManagement(e) {
    e.stopPropagation();
    if (lzm_chatServerEvaluation.operators.getOperator(lzm_chatDisplay.myId).level == 1) {
        saveChatInput(lzm_chatDisplay.active_chat_reco);
        var storedSettingsId = '';
        for (var key in lzm_chatDisplay.StoredDialogs) {
            if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
                if (lzm_chatDisplay.StoredDialogs[key].type == 'user-management') {
                    storedSettingsId = key;
                }
            }
        }
        if (storedSettingsId != '') {
            lzm_displayHelper.maximizeDialogWindow(storedSettingsId);
        } else {
            var activeUserChat = lzm_chatServerEvaluation.userChats.getUserChat(lzm_chatDisplay.active_chat_reco);
            if (lzm_chatDisplay.selected_view == 'mychats' && activeUserChat != null) {
                saveChatInput(lzm_chatDisplay.active_chat_reco);
                removeEditor();
            }
            lzm_chatDisplay.settingsDisplay.createUserManagement();
        }
    } else {
        showNoAdministratorMessage();
    }
}

function selectLDAPElement(id){
    $('#user-management-iframe')[0].contentWindow.selectLDAPElement(id);
}

function setUserManagementTitle(newTitle) {
    if (lzm_chatDisplay.settingsDisplay.userManagementAction == 'list') {
        $('#save-usermanagement').css({visibility: 'hidden'});
        $('#cancel-usermanagement-text').html(t('Close'));
    } else {
        $('#save-usermanagement').css({visibility: 'visible'});
        $('#cancel-usermanagement-text').html(t('Cancel'));
    }
    var oldTitle = $('#user-management-dialog-headline-text').html();
    $('#user-management-dialog-headline-text').html(newTitle);

    return oldTitle;
}

function removeUserManagement() {
    lzm_displayHelper.removeDialogWindow('user-management-dialog');
    var activeUserChat = lzm_chatServerEvaluation.userChats.getUserChat(lzm_chatDisplay.active_chat_reco);
    if (lzm_chatDisplay.selected_view == 'mychats' && activeUserChat != null) {
        var myText = loadChatInput(lzm_chatDisplay.active_chat_reco);
        initEditor(myText, 'CancelUserManagement', lzm_chatDisplay.active_chat_reco);
    }
}

function closeOperatorGroupConfiguration() {
    document.getElementById('user-management-iframe').contentWindow.lzm_userManagement.hideEditDialog();
    lzm_chatDisplay.settingsDisplay.userManagementAction = 'list';
    setUserManagementTitle(lzm_chatDisplay.settingsDisplay.userManagementDialogTitle);
}

function closeOperatorSignatureTextInput() {
    var umg = document.getElementById('user-management-iframe').contentWindow.lzm_userManagement;
    umg.hideInputDialog();
    lzm_chatDisplay.settingsDisplay.userManagementAction = (umg.selectedListTab == 'user') ? 'operator' : 'group';
}

function showTranslationEditor(e) {
    e.stopPropagation();
    if (lzm_chatServerEvaluation.operators.getOperator(lzm_chatDisplay.myId).level == 1) {
        saveChatInput(lzm_chatDisplay.active_chat_reco);
        var storedSettingsId = '';
        for (var key in lzm_chatDisplay.StoredDialogs) {
            if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
                if (lzm_chatDisplay.StoredDialogs[key].type == 'translation-editor') {
                    storedSettingsId = key;
                }
            }
        }
        if (storedSettingsId != '') {
            lzm_displayHelper.maximizeDialogWindow(storedSettingsId);
        } else {
            var activeUserChat = lzm_chatServerEvaluation.userChats.getUserChat(lzm_chatDisplay.active_chat_reco);
            if (lzm_chatDisplay.selected_view == 'mychats' && activeUserChat != null) {
                saveChatInput(lzm_chatDisplay.active_chat_reco);
                removeEditor();
            }
            lzm_chatDisplay.translationEditor.loadTranslationLanguages();
            if (lzm_chatDisplay.translationEditor.serverStrings.length == 0) {
                var useEn = false, useDefault = false, useBrowser = false, useShortBrowser = false;
                var trLanguages = lzm_commonTools.clone(lzm_chatServerEvaluation.translationLanguages);
                var defLang = lzm_chatServerEvaluation.defaultLanguage;
                var brLang = lzm_t.language;
                var brSLang = lzm_t.language.split('-')[0];
                for (var i=0; i<trLanguages.length; i++) {
                    useEn = (trLanguages[i].key == 'en' && trLanguages[i].m == 0) ? true : useEn;
                    useDefault = (trLanguages[i].key == defLang && trLanguages[i].m == 0) ? true : useDefault;
                    useBrowser = (trLanguages[i].key == brLang && trLanguages[i].m == 0) ? true : useBrowser;
                    useShortBrowser = (trLanguages[i].key == brSLang && trLanguages[i].m == 0) ? true : useShortBrowser;
                }
                var origStringLanguage = (useEn) ? 'en' : (useDefault) ? defLang : (useBrowser) ? brLang : (useShortBrowser) ? brSLang : (trLanguages.length > 0) ? trLanguages[0].key : '';
                showTranslationStringsLoadingDiv();
                lzm_chatPollServer.pollServerSpecial({l: origStringLanguage, m: 0, o: 0}, 'load-translation');
            }
        }
    } else {
        showNoAdministratorMessage();
    }
}

function selectTranslationLanguage(language, langName, langEdit, changed, translationTab, isNew) {
    isNew = (typeof isNew != 'undefined') ? isNew : false;
    var idPrefix = (translationTab == 'server') ? 'srv-' : '';
    if (translationTab == 'server') {
        lzm_chatDisplay.translationEditor.selectedLanguages.server = language;
    } else if (translationTab == 'mobile_client') {
        lzm_chatDisplay.translationEditor.selectedLanguages.mobile = language;
    }
    if (language != '') {
        changed = (typeof changed != 'undefined') ? changed : 0;
        try {
            selectTranslationLine('');
        } catch(ex) {}
        if (idPrefix == '' && $.inArray(language, lzm_chatDisplay.translationEditor.defaultLanguages) != -1) {
            $('#' + idPrefix + 'translation-language-delete').html(t('Reset'));
            $('#' + idPrefix + 'translation-language-delete').attr('title', t('Reset Translation'));
        } else {
            $('#' + idPrefix + 'translation-language-delete').html(t('Delete'));
            $('#' + idPrefix + 'translation-language-delete').attr('title', t('Delete Language'));
        }
        if ((idPrefix == '' && langEdit == 1) ||
            (idPrefix != '' && language.toLowerCase() != lzm_chatServerEvaluation.defaultLanguage.toLowerCase())) {
            $('#' + idPrefix + 'translation-language-delete').removeClass('ui-disabled');
        } else {
            $('#' + idPrefix + 'translation-language-delete').addClass('ui-disabled');
        }
        $('#' + idPrefix + 'translation-language-edit').removeClass('ui-disabled');
        lzm_chatDisplay.translationEditor.languageCode = language;
        lzm_chatDisplay.translationEditor.languageName = langName;
        $('.translation-language-line').removeClass('selected-table-line');
        $('#' + idPrefix + 'translation-language-line-' + language).addClass('selected-table-line');
        lzm_chatDisplay.translationEditor.selectedTranslationTab = translationTab;
        var myPollDataObject = {l: (language != 'en' || langEdit == 1) ? language : 'orig', m: (translationTab == 'server') ? 0 : 1, o: 1 - langEdit};
        var saveTranslations = lzm_commonTools.clone(lzm_chatDisplay.translationEditor.saveTranslations);
        if (typeof saveTranslations[idPrefix + language] == 'undefined' ||
            typeof saveTranslations[idPrefix + language].strings == 'undefined' ||
            saveTranslations[idPrefix + language].strings.length == 0) {
            showTranslationStringsLoadingDiv();
            lzm_chatPollServer.pollServerSpecial(myPollDataObject, 'load-translation');
        } else {
            if (!isNew)
                lzm_chatDisplay.translationEditor.showTranslationStrings();
            else
                downloadTranslationLanguage(translationTab);
        }
    } else {
        $('.translation-language-line').removeClass('selected-table-line');
        lzm_chatDisplay.translationEditor.showTranslationStrings();
    }
}

function showTranslationStringsLoadingDiv() {
    var loadingHtml = '<div id="translation-strings-loading"><div class="lz_anim_loading"></div></div>';
    $('#translation-editor-body').append(loadingHtml).trigger('create');
    var myWidth = $('#translation-editor-body').width() + 10;
    var myHeight = $('#translation-editor-body').height() + 10;
    $('#translation-strings-loading').css({position: 'absolute',left:0,top:0,bottom:0,right:0,'background-color': '#ffffff', 'background-position': 'center', 'z-index': 1000});
}

function removeTranslationStringsLoadingDiv() {
    $('#translation-strings-loading').remove();
}

function selectTranslationLine(myKey) {
    if (typeof $('#translation-string-table').data('selected-line') != 'undefined' && typeof $('#translation-string-input').val() != 'undefined') {
        var languageCode = (lzm_chatDisplay.translationEditor.selectedTranslationTab == 'mobile_client') ?
            lzm_chatDisplay.translationEditor.languageCode : 'srv-' + lzm_chatDisplay.translationEditor.languageCode;
        var languageStrings = lzm_commonTools.clone(lzm_chatDisplay.translationEditor.saveTranslations[languageCode].strings);
        var translation = $('#translation-string-input').val();
        var selectedLine = $('#translation-string-table').data('selected-line');
        for (var i=0; i<languageStrings.length; i++) {
            if (languageStrings[i].key == selectedLine) {
                if (languageStrings[i].editedValue != translation) {
                    lzm_chatDisplay.translationEditor.saveTranslations[languageCode].strings[i].editedValue = translation;
                    $('#save-translation-editor').removeClass('ui-disabled');
                    lzm_chatDisplay.translationEditor.saveTranslations[languageCode].edit = 1;
                }
                $('#translation-translated-string-' + selectedLine).html(translation.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
                var translationIcon = (translation != languageStrings[i].editedValue || translation != languageStrings[i].orig ||
                    languageCode == 'en' || languageCode == 'srv-en') ? '<i class="fa fa-check-circle" style="color: #73be28;"></i>' :
                    '<i class="fa fa-warning" style="color: #e34e4e;"></i>';
                $('#translation-icon-' + languageStrings[i].key).html(translationIcon).trigger('create');
            }
        }

    }
    $('.translation-line').removeClass('selected-table-line');
    if (myKey != '') {
        $('#translation-line-' + myKey).addClass('selected-table-line');
        $('#translation-string-table').data('selected-line', myKey);
    }
}

function editTranslationString(myKey, e) {
    e.stopPropagation();
    selectTranslationLine(myKey);
    var languageCode = (lzm_chatDisplay.translationEditor.selectedTranslationTab == 'mobile_client') ?
        lzm_chatDisplay.translationEditor.languageCode : 'srv-' + lzm_chatDisplay.translationEditor.languageCode;
    var languageStrings = lzm_commonTools.clone(lzm_chatDisplay.translationEditor.saveTranslations[languageCode].strings);
    for (var i=0; i<languageStrings.length; i++) {
        if (languageStrings[i].key == myKey) {
            var existingTranslation = languageStrings[i].editedValue;
            var inputFieldHtml = '<input type="text" id="translation-string-input"' +
                ' onclick="doNotSelectTranslationLine(event);" onkeyup="translationEditorEnterPressed(event);"' +
                ' data-role="none" class="lzm-text-input nic" style="min-width: 0px; width:100%;"/>';
            $('#translation-translated-string-' + myKey).html(inputFieldHtml).trigger('create');
            $('#translation-string-input').val(existingTranslation);
        }
    }
}

function doNotSelectTranslationLine(e) {
    e.stopPropagation();
}

function translationEditorEnterPressed(e) {
    var keyCode = (typeof e.which != 'undefined') ? e.which : e.keyCode;
    if (keyCode == 13) {
        selectTranslationLine('');
    }
}

function addTranslationLanguage(myTab) {
    lzm_chatDisplay.translationEditor.addTranslationLanguage('add', myTab);
}

function editTranslationLanguage(myTab) {
    lzm_chatDisplay.translationEditor.addTranslationLanguage('edit', myTab);
}

function saveTranslations() {
    selectTranslationLine('');
    lzm_chatDisplay.translationEditor.saveTranslationFiles();
}

function deleteTranslationLanguage(myTab) {
    lzm_chatDisplay.translationEditor.deleteTranslationLanguage(myTab);
}

function suggestTranslationLanguage(myTab) {
    var lng = lzm_chatDisplay.translationEditor.languageCode, idPrefix = (myTab == 'server') ? 'srv-' : '';
    var postParams = {iso: lng.toUpperCase(), sid: lzm_chatPollServer.loginId,
        version: lzm_commonConfig.lz_version};
    if (myTab == 'server') {
        postParams.upload = 1;
    } else {
        postParams.mobile_upload = 1;
    }
    var translationStrings = lzm_commonTools.clone(lzm_chatDisplay.translationEditor.saveTranslations[idPrefix + lng].strings);
    for (var i=0; i<translationStrings.length; i++) {
        //FIXME: Add this check again after uploading the EN translation data
        if (translationStrings[i].key.indexOf('client_custom_') != 0 && translationStrings[i].editedValue.replace(/^ +/, '') != ''/* &&
            (lzm_chatDisplay.translationEditor.origStringLanguage != 'en' || translationStrings[i].editedValue != translationStrings[i].orig)*/)
            postParams['tk_' + translationStrings[i].key] = translationStrings[i].editedValue;
    }
    lzm_chatDisplay.translationEditor.contactLzTranslationServer(myTab, 'upload', postParams);
}

function downloadTranslationLanguage(myTab) {
    var idPrefix = (myTab == 'server') ? 'srv-' : '';
    $('#translation-string-table').remove();
    var lng = lzm_chatDisplay.translationEditor.languageCode;
    var postParams = {iso: lng.toUpperCase(), sid: lzm_chatPollServer.loginId};
    if (myTab == 'server') {
        postParams.download = 1;
    } else {
        postParams.mobile_download = 1;
    }
    lzm_chatDisplay.translationEditor.contactLzTranslationServer(myTab, 'download', postParams);
}

function translationSearchFieldKeyUp(myTab) {
    var idPrefix = (myTab == 'server') ? 'srv-' : '';
    var searchString = $('#' + idPrefix + 'translation-search-string').val();
    lzm_chatDisplay.translationEditor.lastSearchCharacterTyped = lzm_chatTimeStamp.getServerTimeString(null, true, 1);
    setTimeout(function() {
        var now = lzm_chatTimeStamp.getServerTimeString(null, true, 1);
        if (now - lzm_chatDisplay.translationEditor.lastSearchCharacterTyped > 500) {
            if (lzm_chatDisplay.translationEditor.languageCode != '' && lzm_chatDisplay.translationEditor.selectedTranslationTab == myTab) {
                lzm_chatDisplay.translationEditor.showTranslationStrings(searchString);
            }
        }
    }, 505);
}

function changePassword(e) {
    e.stopPropagation();
    saveChatInput(lzm_chatDisplay.active_chat_reco);
    var storedSettingsId = '';
    for (var key in lzm_chatDisplay.StoredDialogs) {
        if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
            if (lzm_chatDisplay.StoredDialogs[key].type == 'change-password') {
                storedSettingsId = key;
            }
        }
    }
    if (storedSettingsId != '') {
        lzm_displayHelper.maximizeDialogWindow(storedSettingsId);
    } else {
        var activeUserChat = lzm_chatServerEvaluation.userChats.getUserChat(lzm_chatDisplay.active_chat_reco);
        if (lzm_chatDisplay.selected_view == 'mychats' && activeUserChat != null) {
            saveChatInput(lzm_chatDisplay.active_chat_reco);
            removeEditor();
        }
        lzm_commonDialog.changePassword('chat');
    }
}

function personalChatLink(){
    var link = lzm_chatServerEvaluation.serverProtocol + lzm_chatServerEvaluation.serverUrl.replace(':80','').replace(':443','') + '/chat.php?intid=' + lz_global_base64_url_encode(lzm_chatServerEvaluation.myUserId);
    var linkControl = lzm_inputControls.createArea('personal_chat_link', '', '', tid('per_c_link') + ':','width:300px;height:70px;');
    lzm_commonDialog.createAlertDialog(linkControl, [{id: 'ok', name: tid('ok')}],false,true,false);
    $('#personal_chat_link').val(link);
    $('#personal_chat_link').select();
    $('#alert-btn-ok').click(function() {
        lzm_commonDialog.removeAlertDialog();
    });
}

function savePasswordChange(newPassword) {
    lzm_chatPollServer.pollServerSpecial({i: lzm_chatDisplay.myId, p: newPassword}, 'change-password');
}

function showUserSettingsMenu(e) {
    e.stopPropagation();
    var thisUsersettingsMenu = $('#usersettings-menu');
    if (lzm_chatDisplay.showUsersettingsHtml == false) {
        lzm_chatDisplay.showUsersettingsMenu();
        thisUsersettingsMenu.css({'display':'block'});
        lzm_chatDisplay.showUsersettingsHtml = true;
    } else {
        thisUsersettingsMenu.css({'display':'none'});
        lzm_chatDisplay.showUsersettingsHtml = false;
    }
    if (!mobile && app != 1) {
        delete messageEditor;
    }
    $('#chat-invitation-container').remove();
}

function showUserStatusMenu(e) {
    e.stopPropagation();
    var thisUserstatusMenu = $('#userstatus-menu');
    if (lzm_chatDisplay.showUserstatusHtml == false) {
        lzm_chatDisplay.showUserstatusMenu(lzm_chatPollServer.user_status, lzm_chatServerEvaluation.myName,
            lzm_chatServerEvaluation.myUserId);
        thisUserstatusMenu.css({'display':'block'});
        lzm_chatDisplay.showUserstatusHtml = true;
    } else {
        thisUserstatusMenu.css({'display':'none'});
        lzm_chatDisplay.showUserstatusHtml = false;
    }
    if (!mobile && app != 1) {
        delete messageEditor;
    }
    $('#chat-invitation-container').remove();
}

/**************************************** Visitor functions ****************************************/
function showVisitorInvitation(id) {
    if (!lzm_commonPermissions.checkUserPermissions('', 'chats', 'send_invites', {})) {
        showNoPermissionMessage();
    } else if (lzm_chatDisplay.allMyGroupsAreOffline) {
        showOutsideOpeningMessage();
    } else {
        var doShowInvitationDialog = function() {
            var storedInvitationId = '';
            for (var key in lzm_chatDisplay.StoredDialogs) {
                if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
                    if (lzm_chatDisplay.StoredDialogs[key].type == 'visitor-invitation' &&
                        typeof lzm_chatDisplay.StoredDialogs[key].data['visitor-id'] != 'undefined' &&
                        lzm_chatDisplay.StoredDialogs[key].data['visitor-id'] == id) {
                        storedInvitationId = key;
                    }
                }
            }
            if (storedInvitationId != '') {
                lzm_displayHelper.maximizeDialogWindow(storedInvitationId);
            } else {
                var aVisitor = lzm_chatServerEvaluation.visitors.getVisitor(id);
                aVisitor = (aVisitor != null) ? aVisitor : {id: '', b_id: ''};
                lzm_chatDisplay.visitorDisplay.showVisitorInvitation(aVisitor);
            }
        };
        if (visitorHasNotCanceled(id)) {
            doShowInvitationDialog();
        } else {
            var confirmText = t('This visitor has already declined an invitation.') + '<br />' + t('Invite this visitor again?');
            lzm_commonDialog.createAlertDialog(confirmText.replace(/\n/g, '<br />'), [{id: 'ok', name: t('Ok')}, {id: 'cancel', name: t('Cancel')}]);
            $('#alert-btn-ok').click(function() {
                doShowInvitationDialog();
                lzm_commonDialog.removeAlertDialog();
            });
            $('#alert-btn-cancel').click(function() {
                lzm_commonDialog.removeAlertDialog();
            });
        }
    }
}

function startVisitorChat(id) {
    if (!lzm_commonPermissions.checkUserPermissions('', 'chats', 'start_new', {})) {
        showNoPermissionMessage();
    } else if (lzm_chatDisplay.allMyGroupsAreOffline) {
        showOutsideOpeningMessage();
    } else {
        lzm_chatPollServer.pollServerSpecial({visitorId: id, browserId: id + '_OVL'}, 'start_overlay');
    }
}

function visitorHasNotCanceled(id) {
    var rtValue = true;
    var aVisitor = lzm_chatServerEvaluation.visitors.getVisitor(id);
    aVisitor = (aVisitor != null) ? aVisitor : {id: '', b_id: ''};
    if (typeof aVisitor.r != 'undefined' && aVisitor.r.length > 0) {
        for (var i=0; i< aVisitor.r.length; i++) {
            if (aVisitor.r[i].de == 1) {
                rtValue = false;
            }
        }
    }
    return rtValue;
}

function inviteExternalUser(id, b_id, text) {
    lzm_chatUserActions.inviteExternalUser(id, b_id, text);
}

function cancelInvitation(id) {
    var inviter = '';
    var visitor = lzm_chatServerEvaluation.visitors.getVisitor(id);
    try {
        inviter = visitor.r[0].s;
    } catch(e) {}
    if ((lzm_commonPermissions.checkUserPermissions('', 'chats', 'cancel_invites', {}) && lzm_commonPermissions.checkUserPermissions('', 'chats', 'cancel_invites_others', {})) ||
        (lzm_commonPermissions.checkUserPermissions('', 'chats', 'cancel_invites', {}) && (inviter == lzm_chatDisplay.myId || inviter == ''))) {
        lzm_chatUserActions.cancelInvitation(id);
    } else {
        showNoPermissionMessage();
    }
}

function selectVisitor(e, visitorId) {
    lzm_chatGeoTrackingMap.selectedVisitor = visitorId;
    $('#visitor-list').data('selected-visitor', visitorId);
    $('.visitor-list-line').removeClass('selected-table-line');
    $('#visitor-list-row-' + visitorId).addClass('selected-table-line');
}

function showVisitorInfo(userId, userName,  chatId, activeTab) {
    activeTab = (typeof activeTab != 'undefined') ? activeTab : 0;
    userName = (typeof userName != 'undefined') ? userName : '';
    chatId = (typeof chatId != 'undefined') ? chatId : '';

    var storedDialogId = '';
    for (var key in lzm_chatDisplay.StoredDialogs) {
        if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
            if (lzm_chatDisplay.StoredDialogs[key].type == 'visitor-information' &&
                typeof lzm_chatDisplay.StoredDialogs[key].data['visitor-id'] != 'undefined' &&
                lzm_chatDisplay.StoredDialogs[key].data['visitor-id'] == userId) {
                storedDialogId = key;
                if (typeof lzm_chatDisplay.StoredDialogs[key + '-transcript'] != 'undefined')
                    storedDialogId = key + '-transcript';
                if (typeof lzm_chatDisplay.StoredDialogs[key + '_linker'] != 'undefined')
                    storedDialogId = key + '_linker';
            }
        }
    }
    if (storedDialogId != '')
        lzm_displayHelper.maximizeDialogWindow(storedDialogId);
    else
    {
        var thisUser = {id: userId, unique_name: userName};
        if (typeof userId != 'undefined') {
            var visitor = lzm_chatServerEvaluation.visitors.getVisitor(userId);
            thisUser = (visitor != null) ? visitor : thisUser;
        }

        if (typeof userId != 'undefined' && userId != '') {
            var activeUserChat = lzm_chatServerEvaluation.userChats.getUserChat(lzm_chatDisplay.active_chat_reco);
            if (lzm_chatDisplay.selected_view == 'mychats' && activeUserChat != null) {
                saveChatInput(lzm_chatDisplay.active_chat_reco);
                removeEditor();
            }
            lzm_chatDisplay.infoUser = thisUser;

            lzm_chatDisplay.visitorDisplay.showVisitorInformation(thisUser, chatId, activeTab, true);
            lzm_chatPollServer.initVisitorFetchInfo(userId);
        }
    }
}

function addVisitorComment(visitorId, menuEntry) {
    lzm_chatDisplay.visitorDisplay.addVisitorComment(visitorId, menuEntry);
}

function loadCoBrowsingContent(elementId, vb, noActiveBrowserPresent) {
    //$('#visitor-cobrowse-'+elementId+'-inner').addClass('ui-disabled');



    vb = (typeof vb != 'undefined') ? vb : lzm_chatServerEvaluation.visitors.getVisitorBrowser($('#visitor-cobrowse-'+elementId+'-iframe').data('browser'));
    noActiveBrowserPresent = (typeof noActiveBrowserPresent != 'undefined') ? noActiveBrowserPresent : false;

    var iframeHeight = $('#visitor-cobrowse-'+elementId+'-iframe').height();
    var iframeWidth = $('#visitor-cobrowse-'+elementId+'-iframe').width();

    if (!noActiveBrowserPresent && vb[1] != null)
    {
        var browserUrl = vb[1].h2[vb[1].h2.length - 1].url;
        var urlParts = browserUrl.split('#');
        var paramDivisor = (urlParts[0].indexOf('?') == -1) ? '?' : '&';
        var acid = md5(Math.random().toString()).substr(0, 5);
        urlParts[0] += paramDivisor + 'lzcobrowse=true&lzmobile=true&acid=' + acid;
        var coBrowseUrl = urlParts.join('#');

        if(window.location.href.toLowerCase().indexOf('https://') === 0 && coBrowseUrl.toLowerCase().indexOf('http://') === 0)
            coBrowseUrl = coBrowseUrl.replace(new RegExp('http://', "ig"),'https://');

        $('#visitor-cobrowse-'+elementId+'-iframe').data('browser-url', browserUrl);
        var oldIframeDataBrowser = $('#visitor-cobrowse-'+elementId+'-iframe').data('browser');
        var oldIframeDataBrowserUrl = $('#visitor-cobrowse-'+elementId+'-iframe').data('browser-url');
        var oldIframeDataLanguage = $('#visitor-cobrowse-'+elementId+'-iframe').data('language');
        var oldIframeDataAction = $('#visitor-cobrowse-'+elementId+'-iframe').data('action');
        var oldIframeDataVisible = $('#visitor-cobrowse-'+elementId+'-iframe').data('visible');
        var newIframeHtml = '<iframe id="visitor-cobrowse-'+elementId+'-iframe"' +
            ' data-browser="' + oldIframeDataBrowser + '"' +
            ' data-browser-url="' + oldIframeDataBrowserUrl + '"' +
            ' data-action="' + oldIframeDataAction + '"' +
            ' data-language="' + oldIframeDataLanguage + '"' +
            ' data-visible="' + oldIframeDataVisible + '"' +
            ' src="' + coBrowseUrl + '" class="visitor-cobrowse-iframe"></iframe>';
        $('#visitor-cobrowse-'+elementId+'-iframe').replaceWith(newIframeHtml).trigger('create');
        lzm_displayLayout.resizeVisitorDetails();
        //var serverUrlParts = lzm_chatPollServer.chosenProfile.server_url.split('/');
        //var serverAddress = (serverUrlParts[0].indexOf(':') == -1) ? serverUrlParts[0] : serverUrlParts[0].split(':')[0];
        var browserUrlParts = browserUrl.split('://');
        //var browserProtocol = browserUrlParts[0] + '://';
        browserUrlParts = (browserUrlParts.length > 1) ? browserUrlParts[1].split('/') : [''];
        //var browserAddress = (browserUrlParts[0].indexOf(':') == -1) ? browserUrlParts[0] : browserUrlParts[0].split(':')[0];
        //$('#visitor-cobrowse-'+elementId+'-iframe').load(function() {
            //iframeEnabled = false;
            //toggleIframeBlockedState(elementId, 0, browserProtocol, browserAddress);
        //});
    }
    else if (noActiveBrowserPresent)
    {
        //enableCobrowsingIframe(elementId);
        $('#visitor-cobrowse-'+elementId+'-iframe').data('browser-url', '');
        $('#visitor-cobrowse-'+elementId+'-iframe').attr('src', '');
        var fontSize = (iframeWidth < 400) ? 18 : 22;
        var marginTop = Math.floor((iframeHeight - fontSize - 2) / 2);
        setTimeout(function() {
            $('#visitor-cobrowse-'+elementId+'-iframe').contents().find('body').html('<div style="text-align: center; background: #fff; font-weight: bold;' +
                ' font-size: ' + fontSize + 'px; color: #bbb; font-family: Arial,Helvetica,Liberation Sans,DejaVu Sans,sans-serif;">' +
                '<span>' + t('The visitor has left the website') + '</span></div>');
            $('#visitor-cobrowse-'+elementId+'-iframe').contents().find('body').css({'margin-top': marginTop+'px'});
        }, 20);
    }
}

function initWebsitePush(visitorId){

    var dHtml =
        lzm_inputControls.createSelect('wp-browser','','',tidc('browser'),'',{},'',[],0,'') +
        '<div class="top-space">' + lzm_inputControls.createInput('wp-url','','https://',tidc('url'),'','text','') + '</div>';

    lzm_commonDialog.createAlertDialog(dHtml, [{id: 'ok', name: tid('ok')}, {id: 'cancel', name: tid('cancel')}]);

    var visitor = lzm_chatServerEvaluation.visitors.getVisitor(visitorId);
    var bHtml = lzm_chatDisplay.visitorDisplay.getBrowserListHtml(visitor,'')[0];

    $('#wp-browser').html(bHtml);
    $('#wp-url').select();
    $('#alert-btn-ok').click(function() {

        var wptext = tid('website_push_text').replace('%target_url%',$('#wp-url').val()).replace('%operator_name%',lzm_chatDisplay.myName);
        pushVisitorToWebsite($('#wp-browser').val(),$('#wp-url').val(),1,wptext,'',false);
        lzm_commonDialog.removeAlertDialog();
    });
    $('#alert-btn-cancel').click(function() {
        lzm_commonDialog.removeAlertDialog();
    });
}

function pushVisitorToWebsite(visitorBrowser, url, askBeforePushing, text, group, hasTargetBlank)
{
    //var dialogText = t('Do you really want to forward the visitor to this url?') + '<br /><br />' + url;
    //lzm_commonDialog.createAlertDialog(dialogText, [{id: 'yes', name: t('Yes')}, {id: 'no', name: t('No')}]);
    //$('#alert-btn-yes').click(function() {
        //lzm_commonDialog.removeAlertDialog();
    /*   var browserUrlParts = url.split('://');
       var browserProtocol = browserUrlParts[0] + '://';
        browserUrlParts = (browserUrlParts.length > 1) ? browserUrlParts[1].split('/') : [''];
       var browserAddress = (browserUrlParts[0].indexOf(':') == -1) ? browserUrlParts[0] : browserUrlParts[0].split(':')[0];
        var serverAddress = browserProtocol + lzm_chatServerEvaluation.hostName;

        if (hasTargetBlank)
        {
            dialogText = t('This URL shall be opened in a new window. You cannot open new windows on visitor side.');
            lzm_commonDialog.createAlertDialog(dialogText, [{id: 'ok', name: t('Ok')}]);
            $('#alert-btn-ok').click(function() {
                lzm_commonDialog.removeAlertDialog();
            });
        } else if (serverAddress != browserProtocol + browserAddress)
        {
            dialogText = t('This link refers to another host. After pushing the visitor to this host, you cannot follow him any more.');
            lzm_commonDialog.createAlertDialog(dialogText, [{id: 'yes', name: t('Yes')}, {id: 'no', name: t('No')}]);
            $('#alert-btn-yes').click(function() {
                lzm_commonDialog.removeAlertDialog();
                doPush();
            });
            $('#alert-btn-no').click(function() {
                lzm_commonDialog.removeAlertDialog();
            });
        } else {
            doPush();
        }
    });
    $('#alert-btn-no').click(function() {
        lzm_commonDialog.removeAlertDialog();
    });
*/

        var pushObject = {
            vid: visitorBrowser.split('~')[0],
            ask: askBeforePushing,
            url: url,
            bid: visitorBrowser.split('~')[1],
            text: text,
            gr: group
        };
        lzm_chatPollServer.pollServerSpecial(pushObject, 'website-push');

}

function openVisitorListContextMenu(e, visitorId, isChatting, wasDeclined, invitationStatus) {
    e.stopPropagation();
    lzm_chatGeoTrackingMap.selectedVisitor = visitorId;
    $('#visitor-list').data('selected-visitor', visitorId);
    $('.visitor-list-line').removeClass('selected-table-line');
    $('#visitor-list-row-' + visitorId).addClass('selected-table-line');

    var visitor = lzm_chatServerEvaluation.visitors.getVisitor(visitorId);
    visitor = (visitor != null) ? visitor : {};
    var invitationLogo = (invitationStatus == 'requested') ? 'img/632-skills_not.png' : 'img/632-skills.png';
    if (lzm_chatDisplay.visitorDisplay.showVisitorListContextMenu) {
        removeVisitorListContextMenu();
    } else {
        var scrolledDownY = $('#visitor-list-table-div').scrollTop();
        var scrolledDownX = $('#visitor-list-table-div').scrollLeft();
        var parentOffset = $('#visitor-list-table-div').offset();
        var yValue = e.pageY - parentOffset.top + scrolledDownY;
        var xValue = e.pageX - parentOffset.left + scrolledDownX;
        lzm_chatDisplay.visitorDisplay.showVisitorListContextMenu = true;
        lzm_chatDisplay.showContextMenu('visitor-list-table-div', {visitor: visitor, chatting: isChatting, declined: wasDeclined,
            status: invitationStatus, logo: invitationLogo}, xValue, yValue);
    }
    e.preventDefault();
}

function removeVisitorListContextMenu() {
    lzm_chatDisplay.visitorDisplay.showVisitorListContextMenu = false;
    $('#visitor-list-table-div-context').remove();
}

function isVisitorNeededInGui(id) {
    var visitorIsNeeded = false;
    var visitorAlreadyInList = false;
    var removeVisitorFromList = false;
    for (var i=0; i<visitorsStillNeeded.length; i++) {
        if (visitorsStillNeeded[i].id == id) {
            visitorAlreadyInList = true;
            if (lzm_chatTimeStamp.getServerTimeString(null, false, 1) - visitorsStillNeeded[i].time < 120000) {
                visitorIsNeeded = true;
            } else {
                removeVisitorFromList = true;
            }
        }
    }
    if (!visitorAlreadyInList) {
        visitorIsNeeded = true;
        visitorsStillNeeded.push({id: id, time: lzm_chatTimeStamp.getServerTimeString(null, false, 1)});
    }
    var userChats = lzm_chatServerEvaluation.userChats.getUserChatList();
    for (var key in userChats) {
        if (userChats.hasOwnProperty(key)) {
            var openChatId = key.split('~')[0];
            if (openChatId == id && $.inArray(key, lzm_chatDisplay.closedChats) == -1)
                visitorIsNeeded = true;

        }
    }

    if (lzm_chatDisplay.ShowVisitorId == id) {
        visitorIsNeeded = true;
    }

    if (!visitorIsNeeded && removeVisitorFromList) {
        var tmpList = [];
        for (var j=0; j<visitorsStillNeeded.length; j++) {
            if (visitorsStillNeeded[j].id != id) {
                tmpList.push(visitorsStillNeeded[j]);
            }
        }
        visitorsStillNeeded = tmpList;
    }
    return visitorIsNeeded;
}

function handleVisitorCommentClick(selectedLine) {

    //var thisUser = $('#visitor-information').data('visitor');
    //var commentText = thisUser.c[selectedLine].text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '<br />');
    //$('#visitor-comment-list').data('selected-row', selectedLine);
    //$('.visitor-comment-line').removeClass('selected-table-line');
    //$('#visitor-comment-line-' + selectedLine).addClass('selected-table-line');
    //$('#visitor-comment-text').html('<legend>' + t('Comment') + '</legend>' + lzm_commonTools.escapeHtml(commentText));
}

function blockVisitorListUpdate() {
    setTimeout(function() {
        if (lzm_chatDisplay.visitorListScrollingWasBlocked && $('.dialog-window-container').length == 0) {
            lzm_chatDisplay.visitorDisplay.updateVisitorList();
        }
    },2000);
}

function showFilterList(e) {

    var activeUserChat = lzm_chatServerEvaluation.userChats.getUserChat(lzm_chatDisplay.active_chat_reco);
    if (lzm_chatDisplay.selected_view == 'mychats' && activeUserChat != null) {
        saveChatInput(lzm_chatDisplay.active_chat_reco);
        removeEditor();
    }
    if(lzm_commonPermissions.permissions.chats_create_filter!='0')
        LoadModuleConfiguration('FilterConfiguration','lzm_chatDisplay.FilterConfiguration.showFilterList();');
    else
        showNoPermissionMessage();
}

function showFilterCreation(type, visitorId, chatId, filterId, inDialog, ticketId) {
    if(lzm_commonPermissions.permissions.chats_create_filter!='0')
        LoadModuleConfiguration('FilterConfiguration','lzm_chatDisplay.FilterConfiguration.showFilterCreationForm(\''+type+'\', \''+visitorId+'\', \''+chatId+'\', \''+filterId+'\', '+inDialog+', \''+ticketId+'\');');
    else
        showNoPermissionMessage();
}

function deleteFilter(filterId) {
    lzm_chatDisplay.FilterConfiguration.deleteFilter(filterId);
}

function saveFilter(type,filterType) {
    lzm_chatDisplay.FilterConfiguration.saveFilter(type,filterType);
}

function openFiltersListContextMenu(e, filterId) {
    lzm_chatDisplay.FilterConfiguration.openFiltersListContextMenu(e, filterId);
}

function removeFiltersListContextMenu() {
    if(lzm_chatDisplay.FilterConfiguration != null){
        lzm_chatDisplay.FilterConfiguration.showFilterListContextMenu = false;
        $('#filter-list-context').remove();
    }
}

function selectFiltersLine(e, filterId) {
    var filter = lzm_chatServerEvaluation.filters.getFilter(filterId);
    if (filter != null) {
        $('#filter-list').data('selected-filter', filterId);
        $('.filters-list-line').removeClass('selected-table-line');
        $('#filters-list-line-' + filterId).addClass('selected-table-line');
    }
}

function editVisitorDetails(visitorId,field,elementId){
    lzm_chatDisplay.visitorDisplay.editVisitorDetails(visitorId,field,elementId);
}

function emptyMissedChats(){
    lzm_chatDisplay.allchatsDisplay.clearMissedChats();
}

function hideMissedChats(){
    lzm_chatDisplay.allchatsDisplay.hideMissedChats();
}

/**************************************** Link Generator functions ****************************************/

function initLinkGenerator(e){
    if (lzm_chatServerEvaluation.operators.getOperator(lzm_chatDisplay.myId).level == 1) {
        $.getScript('js/lzm/classes/LinkGeneratorClass.js', function( data, textStatus, jqxhr ) {
            lzm_chatDisplay.LinkGenerator = new LinkGeneratorClass();
            lzm_chatDisplay.LinkGenerator.ShowLinkGenerator();
        });
    } else
        showNoAdministratorMessage();
}

function showLinkGenerator(){
    lzm_chatDisplay.LinkGenerator.ShowLinkGenerator();
}

function addLinkGeneratorElement(){
    LinkGeneratorClass.CurrentElements = lzm_chatDisplay.LinkGenerator.GetElementsFromRows(false);
    lzm_chatDisplay.LinkGenerator.SelectElementType();
}

function editLinkGeneratorElement(){
    lzm_chatDisplay.LinkGenerator.EditLinkGeneratorElement();
}

function removeLinkGeneratorElement(){
    lzm_chatDisplay.LinkGenerator.RemoveLinkGeneratorElement();
}

function selectLinkGeneratorElement(type){
    $('.element-list-line').removeClass('selected-table-line');
    $('#element-list-line-' + type).addClass('selected-table-line');
    lzm_chatDisplay.LinkGenerator.ValidateButtons();
}

function selectLinkGeneratorImage(type){
    $('.image-edit-btns').removeClass('ui-disabled');
    $('.image-sets-list-line').removeClass('selected-table-line');
    $('#'+type).addClass('selected-table-line');
    $('#rm-image-set-btn').removeClass('ui-disabled');
    var buttons = JSON.parse(lz_global_base64_url_decode($('#'+type).attr('data-button')));
    $('#image-online-img').css({'background-size':'contain','background-position':'center center','background-repeat': 'no-repeat','background-image':'url(data:image/'+buttons[0].imagetype+';base64,'+buttons[0].data+')'});
    $('#image-offline-img').css({'background-size':'contain','background-position':'center center','background-repeat': 'no-repeat','background-image':'url(data:image/'+buttons[1].imagetype+';base64,'+buttons[1].data+')'});
    $('#m_SelectedImageSet').val($('#'+type).attr('data-id'));
    $('#m_SelectedImageWidth').val($('#'+type).attr('data-width'));
    $('#m_SelectedImageHeight').val($('#'+type).attr('data-height'));
}

function loadCode(id){
    lzm_chatDisplay.LinkGenerator.LoadCode(id);
}

function newLinkGeneratorCode(){
    lzm_chatDisplay.LinkGenerator.CreateNewCode();
}

function deleteLinkGeneratorCode(id){
    lzm_chatDisplay.LinkGenerator.DeleteCode(id);
}

function previewLinkGeneratorCode(){
    lzm_chatDisplay.LinkGenerator.Preview();
}

function showLinkGeneratorCode(){
    lzm_chatDisplay.LinkGenerator.ShowLinkGeneratorCode();
}

function addImageSet(type){
    var addHtml = '',b64onlup='',b64offup='',fexon='',fexoff='';
    var etype = (type.indexOf('overlay') == -1) ? 'inlay' : 'overlay';
    addHtml += lzm_inputControls.createInput('add-img-set-online', '', '', tid('image_online'), '<i class="fa fa-file-image-o"></i>', 'file', 'a');
    addHtml += lzm_inputControls.createInput('add-img-set-offline', '', '', tid('image_offline'), '<i class="fa fa-file-image-o"></i>', 'file', 'a');
    lzm_commonDialog.createAlertDialog(addHtml, [{id: 'ok', name: tid('save')},{id: 'cancel', name: tid('cancel')}]);

    $('#add-img-set-online').change(function(e) {
        var input = e.target;
        var reader = new FileReader();
        reader.onload = function(){b64onlup = (reader.result.indexOf('data') == 0) ? reader.result.split(',')[1] : reader.result;};
        reader.readAsDataURL(input.files[0]);
        fexon = input.files[0].name.split('.').pop().toLowerCase();
    });
    $('#add-img-set-offline').change(function(e) {
        var input = e.target;
        var reader = new FileReader();
        reader.onload = function(){b64offup = (reader.result.indexOf('data') == 0) ? reader.result.split(',')[1] : reader.result;};
        reader.readAsDataURL(input.files[0]);
        fexoff = input.files[0].name.split('.').pop().toLowerCase();
    });
    $('#alert-btn-ok').click(function() {
        var data = {};
        data.p_process_banners_va = b64onlup;
        data.p_process_banners_vb = fexon;
        data.p_process_banners_vc = b64offup;
        data.p_process_banners_vd = fexoff;
        data.p_process_banners_ve = lzm_chatDisplay.LinkGenerator.m_MaxImageSetId+1;
        data.p_process_banners_vf = etype;
        lzm_chatPollServer.pollServerDiscrete('create_image_set',data).done(function(data) {
            lzm_chatDisplay.LinkGenerator.LoadImageSets(type,lzm_chatDisplay.LinkGenerator.m_MaxImageSetId+1);
        }).fail(function(jqXHR, textStatus, errorThrown){alert(textStatus);});
        lzm_commonDialog.removeAlertDialog();
    });
    $('#alert-btn-cancel').click(function() {
        lzm_commonDialog.removeAlertDialog();
    });
}

function removeImageSet(type){
    $('#rm-image-set-btn').addClass('ui-disabled');
    var etype = (type.indexOf('overlay') == -1) ? 'inlay' : 'overlay';
    var did = $('#image-sets-list-table .selected-table-line').attr('data-id');
    var data = {};
    data.p_process_banners_ve = did;
    data.p_process_banners_vf = etype;
    lzm_chatPollServer.pollServerDiscrete('delete_image_set',data).done(function(data) {
        lzm_chatDisplay.LinkGenerator.LoadImageSets(type);
    }).fail(function(jqXHR, textStatus, errorThrown){alert(textStatus);});
}

/**************************************** Event functions ****************************************/

function initEventConfiguration(e){
    if(lzm_commonPermissions.permissions.events!='0')
          LoadModuleConfiguration('EventConfiguration','lzm_chatDisplay.EventConfiguration.showEventConfiguration();');
    else
        showNoPermissionMessage();
}

function selectEventsLine(e,id){
    removeEventsListContextMenu();
    var event = lzm_commonTools.GetElementByProperty(lzm_chatServerEvaluation.eventList,'id',id);
    if (event.length==1) {
        $('.events-list-line').removeClass('selected-table-line');
        $('#events-list-line-' + id).addClass('selected-table-line');
        lzm_chatDisplay.EventConfiguration.m_SelectedEvent = lzm_commonTools.clone(event[0]);
        lzm_chatDisplay.EventConfiguration.m_SelectedEventId = lzm_chatDisplay.EventConfiguration.m_SelectedEvent.id;
    }
}

function showEventCreation(type,id){
    lzm_chatDisplay.EventConfiguration.showEventCreationForm(type,id);
}

function saveEvent(id,type){
    lzm_chatDisplay.EventConfiguration.saveEvent(id);
}

function deleteEvent(id){
    lzm_chatDisplay.EventConfiguration.deleteEvent(id);
}

function showEventSubElementCreation(action,type,id){
    lzm_chatDisplay.EventConfiguration.showEventSubElementCreation(action,type,id);
}

function openEventsListContextMenu(e, eventId){
    lzm_chatDisplay.EventConfiguration.openEventsListContextMenu(e, eventId);
}

function removeEventsListContextMenu(){
    $('#events-list-context').remove();
}

/**************************************** Feedbacks functions ****************************************/

function pageFeedbacksViewer(page){
    lzm_chatDisplay.FeedbacksViewer.initUpdateViewer(page);
}

function initFeedbacksConfiguration(e){
    if(lzm_commonPermissions.permissions.ratings!='0')
        LoadModuleConfiguration('FeedbacksViewer','lzm_chatDisplay.FeedbacksViewer.showFeedbacksViewer();');
    else
        showNoPermissionMessage();
    $('#main-menu-panel-tools-feedbacks').removeClass('main-menu-panel-tool-highlight');
}

function selectFeedbacksLine(e,id){
    removeEventsListContextMenu();
    var fb = lzm_commonTools.GetElementByProperty(lzm_chatServerEvaluation.feedbacksList,'i',id);
    if (fb.length==1) {
        $('.feedbacks-list-line').removeClass('selected-table-line');
        $('#feedbacks-list-line-' + id).addClass('selected-table-line');
        lzm_chatDisplay.FeedbacksViewer.m_SelectedFeedbackId = id;
    }
}

function openFeedbacksListContextMenu(e){

}

/**************************************** Server Configuration functions ****************************************/

function initServerConfiguration(e){
    lzm_chatDisplay.ServerConfigurationClass = null;
    if (lzm_chatServerEvaluation.operators.getOperator(lzm_chatDisplay.myId).level == 1)
        LoadModuleConfiguration('ServerConfigurationClass','lzm_chatDisplay.ServerConfigurationClass.showServerConfiguration();');
    else
        showNoAdministratorMessage();
}

function setValidation(id){
    lzm_chatDisplay.ServerConfigurationClass.setValidation(id);
}

function resetInputFields(){
    lzm_chatDisplay.ServerConfigurationClass.resetInputFields();
}

function addLicenseKey(){
    lzm_chatDisplay.ServerConfigurationClass.addLicenseKey();
}

function deactivateLicense(hash){
    lzm_chatDisplay.ServerConfigurationClass.removeLicenseKey(hash);
}

function configureLicense(type){
    lzm_chatDisplay.ServerConfigurationClass.configureLicense(type);
}

function emailAccountAction(action, type, id){
    lzm_chatDisplay.ServerConfigurationClass.emailAction(action, type, id);
}

function ticketSubAction(action, type, id){
    lzm_chatDisplay.ServerConfigurationClass.ticketSubAction(action, type, id);
}

function feedbackAction(action, id){
    lzm_chatDisplay.ServerConfigurationClass.feedbackAction(action, id);
}

function testLDAP(){
    lzm_chatDisplay.ServerConfigurationClass.testLDAP();
}

function showLogs(){
    var logHtml = '<div id="log-view"><div id="log-list-placeholder"></div></div>';
    var logPHPHtml = '<iframe id="log-frame-php" class="log-frame" src="'+ lzm_chatServerEvaluation.getServerUrl('log.php?t=php&v='+sha256(lzm_chatServerEvaluation.token)) + '"></iframe>';
    var logSQLHtml = '<iframe id="log-frame-sql" class="log-frame" src="'+ lzm_chatServerEvaluation.getServerUrl('log.php?t=sql&v='+sha256(lzm_chatServerEvaluation.token)) + '"></iframe>';
    var logEMAILHtml = '<iframe id="log-frame-email" class="log-frame" src="'+ lzm_chatServerEvaluation.getServerUrl('log.php?t=email&v='+sha256(lzm_chatServerEvaluation.token)) + '"></iframe>';
    var logLDAPHtml = '<iframe id="log-frame-ldap" class="log-frame" src="'+ lzm_chatServerEvaluation.getServerUrl('log.php?t=ldap&v='+sha256(lzm_chatServerEvaluation.token)) + '"></iframe>';
    var logDEBUGHtml = '<iframe id="log-frame-debug" class="log-frame" src="'+ lzm_chatServerEvaluation.getServerUrl('log.php?t=debug&v='+sha256(lzm_chatServerEvaluation.token)) + '"></iframe>';

    lzm_commonDialog.createAlertDialog(logHtml, [{id: 'lvdelete', name: '<i class="fa fa-trash text-white"></i>'},{id: 'lvrefresh', name: '<i class="fa fa-refresh text-white"></i>'},{id: 'lvsend', name: tid('send')},{id: 'lvok', name: tid('close')}],true,true,false);
    lzm_displayHelper.createTabControl('log-list-placeholder',[{name: 'PHP', content: logPHPHtml}, {name: 'SQL', content: logSQLHtml}, {name: 'Email', content: logEMAILHtml},  {name: 'LDAP', content: logLDAPHtml},{name: 'Debug', content: logDEBUGHtml}]);
    $('#alert-btn-lvok').click(function() {
        lzm_commonDialog.removeAlertDialog();
    });
    $('#alert-btn-lvrefresh').click(function() {
        $("#log-frame-php").attr( 'src', function ( i, val ) { return val.replace('&d=1',''); });
        $("#log-frame-sql").attr( 'src', function ( i, val ) { return val.replace('&d=1',''); });
        $("#log-frame-email").attr( 'src', function ( i, val ) { return val.replace('&d=1',''); });
        $("#log-frame-debug").attr( 'src', function ( i, val ) { return val.replace('&d=1',''); });
    });
    $('#alert-btn-lvsend').click(function() {
        var data = 'PHP LOG:\r\n' + $("#log-frame-php").contents().find("body").html();
        data += '\r\nSQL LOG:\r\n' + $("#log-frame-sql").contents().find("body").html();
        data += '\r\nEMAIL LOG:\r\n' + $("#log-frame-email").contents().find("body").html();
        data += '\r\DEBUG LOG:\r\n' + $("#log-frame-debug").contents().find("body").html();
        sendFeedback(data);
    });
    $('#alert-btn-lvdelete').click(function() {

        if($('#log-list-placeholder-content-0').css('display')!='none')
            $("#log-frame-php").attr( 'src', function ( i, val ) { return val+'&d=1'; });
        if($('#log-list-placeholder-content-1').css('display')!='none')
            $("#log-frame-sql").attr( 'src', function ( i, val ) { return val+'&d=1'; });
        if($('#log-list-placeholder-content-2').css('display')!='none')
            $("#log-frame-email").attr( 'src', function ( i, val ) { return val+'&d=1'; });
        if($('#log-list-placeholder-content-3').css('display')!='none')
            $("#log-frame-debug").attr( 'src', function ( i, val ) { return val+'&d=1'; });
    });

    //debcount();
}

function sendFeedback(_text){

    var myDataObject = {};
    myDataObject['exception'] = _text;
    myDataObject['build'] = lzm_commonConfig.lz_version;
    var vers = lzm_commonConfig.lz_version;
    $.ajax({
        type: "POST",
        url: "http://www.livezilla.net/com/errorreport.php?culture=&product_version=" + vers + "&type=automatic",
        data: myDataObject,
        timeout: 15000,
        dataType: 'text'
    }).done(function(data) {
        alert('Thank you for reporting this problem!');
    }).fail(function(jqXHR, textStatus, errorThrown){deblog(jqXHR);});
}

/**************************************** General control creation functions ************************************/
function createUserControlPanel() {
    var counter=1;
    var repeatThis = setInterval(function() {
        /*lzm_chatDisplay.createUserControlPanel(lzm_chatPollServer.user_status, lzm_chatServerEvaluation.myName,
            lzm_chatServerEvaluation.myUserId);*/
        counter++;
        if (counter >= 60 || lzm_chatServerEvaluation.myName != '' || lzm_chatServerEvaluation.myUserId != '') {
            clearInterval(repeatThis);
            lzm_displayHelper.unblockUi();
        }
    },250);
}

function showSubMenu(place, category, objectId, contextX, contextY, menuWidth, menuHeight) {
    lzm_chatDisplay.showSubMenu(place, category, objectId, contextX, contextY, menuWidth, menuHeight);
}

function showSuperMenu(place, category, objectId, contextX, contextY, menuWidth, menuHeight) {
    lzm_chatDisplay.showSuperMenu(place, category, objectId, contextX, contextY, menuWidth, menuHeight);
}

function selectView(id,required) {
    required = (typeof required == 'undefined') ? false: required;

    if (id != lzm_chatDisplay.selected_view || required)
    {
        var oldSelectedView = lzm_chatDisplay.selected_view;
        lzm_chatDisplay.selected_view = id;
        lzm_displayHelper.removeBrowserNotification();

        if (oldSelectedView == 'mychats') {
            lzm_chatUserActions.saveChatInput(lzm_chatUserActions.active_chat_reco);
            removeEditor();
        }

        if (lzm_chatDisplay.selected_view == 'internal') {
            lzm_chatDisplay.createOperatorList();
        }

        if (lzm_chatDisplay.selected_view == 'mychats') {
            lzm_chatDisplay.createActiveChatPanel(false, true, true, 'panel');
            lzm_chatDisplay.createChatHtml(lzm_chatPollServer.thisUser);
        }

        if (oldSelectedView == 'qrd') {
            cancelQrdPreview();
        }
        if (lzm_chatDisplay.selected_view == 'tickets') {
            lzm_chatDisplay.ticketDisplay.notifyNewTicket = false;
            lzm_chatDisplay.ticketDisplay.createTicketList(lzm_chatDisplay.ticketListTickets, lzm_chatServerEvaluation.ticketGlobalValues, lzm_chatPollServer.ticketPage, lzm_chatPollServer.ticketSort, lzm_chatPollServer.ticketSortDir, lzm_chatPollServer.ticketQuery, lzm_chatPollServer.ticketFilterStatus, false, '');
        }
        if (lzm_chatDisplay.selected_view != 'mychats') {
            //lzm_chatUserActions.setActiveChat('', '', { id:'', b_id:'', b_chat:{ id:'' } });
        }
        if (lzm_chatDisplay.selected_view == 'external' && !lzm_chatDisplay.VisitorListCreated && $('.dialog-window-container').length == 0) {
            lzm_chatDisplay.visitorDisplay.updateVisitorList();
        }
        if (lzm_chatDisplay.selected_view == 'archive') {
            if ($('#chat-archive-table').length == 0) {
                lzm_chatDisplay.archiveDisplay.createArchive();
            } else {
                lzm_chatDisplay.archiveDisplay.updateArchive();
            }
        }
        if (lzm_chatDisplay.selected_view == 'reports') {
            lzm_chatDisplay.reportsDisplay.createReportList();
        }
        finishSettingsDialogue();
        lzm_chatDisplay.toggleVisibility();
        if (lzm_chatDisplay.selected_view == 'qrd') {

            if(!lzm_chatDisplay.resourcesDisplay.IsLoading && !lzm_chatDisplay.resourcesDisplay.CacheUIValid)
                lzm_chatDisplay.resourcesDisplay.setLoading(true);

            setTimeout('lzm_chatDisplay.resourcesDisplay.createQrdTree(\'view-select-panel\', \''+lzm_chatDisplay.lastActiveChat+'\')',1);
        }
        if (lzm_chatDisplay.selected_view == 'mychats') {
            //createActiveChatHtml();
            lzm_chatDisplay.allchatsDisplay.updateAllChats();
        }
        if (lzm_chatDisplay.selected_view != 'external') {
            if (!mobile && app != 1) {
                delete messageEditor;
            }
            $('#chat-invitation-container').remove();
        }
        if (lzm_chatDisplay.selected_view == 'world')
        {
            lzm_displayLayout.resizeGeotrackingMap();
            setTimeout(function() {lzm_displayLayout.resizeGeotrackingMap();}, 20);
            if ($('#geotracking-body').data('src') == '') {
                var gtKey = (lzm_chatServerEvaluation.crc3 != null) ? lzm_chatServerEvaluation.crc3[6] : '';
                var myServerAddress = 'https://ssl.livezilla.net';
                var geoTrackingUrl = 'https://ssl.livezilla.net/geo/map/index.php?web=1&pvc=' + lzm_commonConfig.lz_version + '&key=' + gtKey;
                $('#geotracking-body').data('src', geoTrackingUrl);
                $('#geotracking-iframe').attr('src', geoTrackingUrl);
                lzm_chatGeoTrackingMap.setIframe($('#geotracking-iframe')[0]);
                lzm_chatGeoTrackingMap.setReceiver(myServerAddress);
            }
            if (!lzm_chatGeoTrackingMap.delayAddIsInProgress)
                lzm_chatGeoTrackingMap.addOrQueueVisitor();
            if (lzm_chatGeoTrackingMap.selectedVisitor != null) {
                lzm_chatGeoTrackingMap.setSelection(lzm_chatGeoTrackingMap.selectedVisitor, '');
            }
        }
        if (lzm_chatDisplay.selected_view == 'external' && typeof $('#visitor-list').data('selected-visitor') != 'undefined') {
            selectVisitor(null, $('#visitor-list').data('selected-visitor'));
        }

        lzm_chatDisplay.lastChatSendingNotification = '';
        lzm_chatDisplay.createViewSelectPanel();
        lzm_displayLayout.resizeAll();
    }
}

function moveViewSelectPanel(target) {
    if (target == 'left' || target == 'right') {
        try {
            for (var i=0; i<lzm_chatDisplay.viewSelectArray.length; i++) {
                var j = 0;
                if (lzm_chatDisplay.firstVisibleView == lzm_chatDisplay.viewSelectArray[i].id) {
                    if (target == 'left') {
                        target = lzm_chatDisplay.viewSelectArray[i].id;
                        for (j=i-1; j>=0; j--) {
                            if (lzm_chatDisplay.showViewSelectPanel[lzm_chatDisplay.viewSelectArray[j].id] != 0 &&
                                (lzm_chatDisplay.viewSelectArray[j].id != 'world' || lzm_chatServerEvaluation.crc3 == null || lzm_chatServerEvaluation.crc3[2] != -2)) {
                                target = lzm_chatDisplay.viewSelectArray[j].id;
                                break;
                            }
                        }
                    } else {
                        target = lzm_chatDisplay.viewSelectArray[i].id;
                        for (j=i+1; j<lzm_chatDisplay.viewSelectArray.length; j++) {
                            if (lzm_chatDisplay.showViewSelectPanel[lzm_chatDisplay.viewSelectArray[j].id] != 0 &&
                                (lzm_chatDisplay.viewSelectArray[j].id != 'world' || lzm_chatServerEvaluation.crc3 == null || lzm_chatServerEvaluation.crc3[2] != -2)) {
                                target = lzm_chatDisplay.viewSelectArray[j].id;
                                break;
                            }
                        }
                    }
                }
            }
        } catch(e) {}
    }
    lzm_chatDisplay.firstVisibleView = target;
    lzm_chatDisplay.createViewSelectPanel(target);
}

/**************************************** Ticket functions ****************************************/
function openTicketContextMenu(e, ticketId, inDialog, elementId, row) {
    inDialog = (typeof inDialog != 'undefined') ? inDialog : false;
    removeTicketFilterMenu();
    selectTicket(ticketId, false, inDialog, elementId, row, e, true);
    var scrolledDownY, scrolledDownX, parentOffset;
    var place = (!inDialog) ? 'ticket-list' : ($('#visitor-information').length) ? 'visitor-information' : 'chat-info';

    scrolledDownY = $('#' + place +'-body').scrollTop();
    scrolledDownX = $('#' + place +'-body').scrollLeft();
    parentOffset = $('#' + place +'-body').offset();
    var xValue = e.pageX - parentOffset.left + scrolledDownX;
    var yValue = e.pageY - parentOffset.top + scrolledDownY;

    var ticket = {};
    for (var i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
        if (lzm_chatDisplay.ticketListTickets[i].id == ticketId) {
            ticket = lzm_chatDisplay.ticketListTickets[i];
        }
    }
    lzm_chatDisplay.showTicketContextMenu = true;
    lzm_chatDisplay.showContextMenu(place, ticket, xValue, yValue);
    e.stopPropagation();
    e.preventDefault();
}

function switchTicketNames(){
    var fn = $('#tr-firstname').val();
    var ln = $('#tr-lastname').val();
    $('#tr-firstname').val(ln);
    $('#tr-lastname').val(fn);
}

function setTicketFilter(){
    lzm_chatDisplay.ticketDisplay.setTicketFilter();
}

function removeTicketContextMenu() {
    lzm_chatDisplay.showTicketContextMenu = false;
    $('#ticket-list-context').remove();
    $('#chat-info-context').remove();
    $('#visitor-information-context').remove();
}

function removeTicketFilterMenu() {
    //lzm_chatDisplay.showTicketFilterMenu = false;
    //$('#ticket-filter-context').remove();
}

function openTicketMessageContextMenu(e, ticketId, messageNumber, fromButton) {

    if (messageNumber != '')
        handleTicketMessageClick(ticketId, messageNumber);
    else
        messageNumber = $('#ticket-history-table').data('selected-message');

    var ticket = {}, xValue, yValue;
    var parentOffset = null;
    var buttonPressed = '';
    if(!fromButton) {
        parentOffset = $('#ticket-history-placeholder-content-0').offset();
        xValue = e.pageX - parentOffset.left + $('#ticket-history-placeholder-content-0').scrollLeft();
        yValue = e.pageY - parentOffset.top;
    } else {
        parentOffset = $('#ticket-details-footline').offset();
        var eltOffset = $('#ticket-actions').offset();
        xValue = eltOffset.left - parentOffset.left;
        yValue = e.pageY - parentOffset.top;
        buttonPressed = 'ticket-message-actions';
    }
    for (var i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
        if (lzm_chatDisplay.ticketListTickets[i].id == ticketId) {
            ticket = lzm_chatDisplay.ticketListTickets[i];
        }
    }

    lzm_chatDisplay.showTicketMessageContextMenu = true;
    lzm_chatDisplay.showContextMenu('ticket-details', {ti: ticket, msg: messageNumber}, xValue, yValue, buttonPressed);
    e.preventDefault();
}

function removeTicketMessageContextMenu() {
    lzm_chatDisplay.showTicketMessageContextMenu = false;
    $('#ticket-details-context').remove();
}

function pageTicketList(page) {
    $('.ticket-list-page-button').addClass('ui-disabled');
    var ticketFetchTime = lzm_chatServerEvaluation.ticketFetchTime;
    lzm_chatServerEvaluation.expectTicketChanges = true;
    lzm_chatPollServer.stopPolling();
    lzm_chatPollServer.ticketPage = page;
    lzm_chatPollServer.resetTickets = true;
    lzm_chatPollServer.startPolling();
    switchTicketListPresentation(ticketFetchTime, 0);
}

function switchTicketListPresentation(ticketFetchTime, counter, ticketId) {

    var loadingHtml;
    if (counter == 0)
    {
        loadingHtml = '<div id="ticket-list-loading"><div class="lz_anim_loading"></div></div>';
        $('#ticket-list-body').append(loadingHtml).trigger('create');
        var left = ($('#ticket-list-tree').css('display')=='none') ? 0 : ($('#ticket-list-tree').width()+1)+'px';
        $('#ticket-list-loading').css({position: 'absolute', left: left, top: '0px', bottom:0,right:0,'background-color': '#ffffff', 'z-index': 1000, opacity: 1});
    }
    if (ticketFetchTime != lzm_chatServerEvaluation.ticketFetchTime || counter >= 40) {
        if (typeof ticketId != 'undefined')
            changeTicketReadStatus(ticketId, 'read', true, true);
        lzm_chatDisplay.ticketDisplay.createTicketList(lzm_chatServerEvaluation.tickets,  lzm_chatServerEvaluation.ticketGlobalValues, lzm_chatPollServer.ticketPage, lzm_chatPollServer.ticketSort, lzm_chatPollServer.ticketSortDir, lzm_chatPollServer.ticketQuery, lzm_chatPollServer.ticketFilterStatus,'');

    }
    else
    {
        counter++;
        var delay = (counter <= 5) ? 200 : (counter <= 11) ? 500 : 1000;
        setTimeout(function() {switchTicketListPresentation(ticketFetchTime, counter, ticketId);}, delay);
    }
}

function showTicketDetails(ticketId, fromContext, emailId, chatId, dialogId) {
    var email = {id: ''}, chat = {cid: ''}, i;
    ticketId = (typeof ticketId != 'undefined') ? ticketId : lzm_chatDisplay.selectedTicketRow;
    fromContext = (typeof fromContext != 'undefined') ? fromContext : false;
    emailId = (typeof emailId != 'undefined') ? emailId : '';
    chatId = (typeof chatId != 'undefined') ? chatId : '';
    dialogId = (typeof dialogId != 'undefined') ? dialogId : '';

    if (typeof emailId != 'undefined' && emailId != '') {
        for (i=0; i<lzm_chatServerEvaluation.emails.length; i++) {
            if (lzm_chatServerEvaluation.emails[i].id == emailId) {
                email = lzm_chatServerEvaluation.emails[i];
                email['dialog-id'] = dialogId
            }
        }
    }
    if (typeof chatId != 'undefined' && chatId != '') {
        for (i=0; i<lzm_chatServerEvaluation.chatArchive.chats.length; i++) {
            if (lzm_chatServerEvaluation.chatArchive.chats[i].cid == chatId) {
                chat = lzm_chatServerEvaluation.chatArchive.chats[i];
                chat['dialog-id'] = dialogId;
            }
        }
    }
    if (ticketId != '')
    {
        selectTicket(ticketId);
        changeTicketReadStatus(ticketId, 'read', false, true);
    }
    if (!fromContext && lzm_chatDisplay.showTicketContextMenu)
        removeTicketContextMenu();
    else
    {
        removeTicketContextMenu();
        var storedPreviewId = '';
        for (var key in lzm_chatDisplay.StoredDialogs) {
            if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
                if (lzm_chatDisplay.StoredDialogs[key].type == 'ticket-details' &&
                    typeof lzm_chatDisplay.StoredDialogs[key].data['ticket-id'] != 'undefined' &&
                    lzm_chatDisplay.StoredDialogs[key].data['ticket-id'] == ticketId) {
                    storedPreviewId = key;
                }
            }
        }

        if (storedPreviewId != '')
            lzm_displayHelper.maximizeDialogWindow(storedPreviewId);
        else
        {
            var isNew = (ticketId == '') ? true : false;
            lzm_chatDisplay.ticketDialogId[ticketId] = lzm_chatDisplay.ticketDisplay.showTicketDetails(lzm_chatDisplay.ticketDisplay.getTicketById(ticketId,true), isNew, email, chat, dialogId);
        }
    }
}

function showMessageForward(ticketId, messageNo) {
    removeTicketMessageContextMenu();
    var message = {}, ticketSender = '', group = '';
    var ticket = lzm_chatDisplay.ticketDisplay.getTicketById(ticketId);

    if(ticket != null){
        message = ticket.messages[messageNo];
        ticketSender = ticket.messages[0].fn;
        group = (typeof ticket.editor != 'undefined' && ticket.editor != false) ? ticket.editor.g : ticket.gr;
        lzm_chatDisplay.ticketDisplay.showMessageForward(message, ticketId, ticketSender, group);
    }
}

function sendForwardedMessage(message, text, emailAddresses, emailSubject, ticketId, group, messageNo) {
    removeTicketMessageContextMenu();
    if (message.id == '') {
        var ticket = lzm_chatDisplay.ticketDisplay.getTicketById(ticketId);
        if (ticket != null) {
            message = ticket.messages[messageNo];
            text = message.mt;
            emailAddresses = message.em;
            emailSubject = (typeof message.s != 'undefined') ? message.s : '';
            group = (typeof ticket.editor != 'undefined' && ticket.editor != false) ?
                ticket.editor.g : ticket.gr;
        }
    }
    ticket = {mid: message.id, gr: group, em: emailAddresses, su: emailSubject, text: text, id: ticketId};
    lzm_chatPollServer.pollServerTicket([ticket], [], 'forward-to');
}

function moveMessageToNewTicket(ticketId, messageNo) {
    removeTicketMessageContextMenu();
    var message = {};
    var ticket = lzm_chatDisplay.ticketDisplay.getTicketById(ticketId);
    if (ticket != null)
        message = ticket.messages[messageNo];
    ticket = {mid: message.id, id: ticketId};
    lzm_chatPollServer.pollServerTicket([ticket], [], 'move-message');
}

function showTicketMsgTranslator(ticketId, msgNo) {

    ticketId = (typeof ticketId != 'undefined') ? ticketId : lzm_chatDisplay.selectedTicketRow;
    msgNo = (typeof msgNo != 'undefined') ? msgNo : -1;

    var ticket = lzm_chatDisplay.ticketDisplay.getTicketById(ticketId);
    if(msgNo==-1)
        if (ticket != null)
            msgNo = ticket.messages.length - 1;

    removeTicketMessageContextMenu();
    showTranslationDialog('ticket',[ticket,msgNo]);
}

function showChatMsgTranslator(field) {
    if(!$(field).hasClass('RCMT'))
        showTranslationDialog('chat',[$(field).find('div span')[0],$(field).data('pn')]);
}

function showChatQuestionTranslator(field) {
    showTranslationDialog('chat_question',[field,$(field).data('pn')]);
}

function showTranslationDialog(type,obj){
    if (lzm_chatServerEvaluation.otrs != '' && lzm_chatServerEvaluation.otrs != null)
    {
        if(type=='ticket')
        {
            if (obj[0] != null)
                obj[0] = lzm_commonTools.clone(obj[0]);
            if (obj[0] != null && obj[0].messages.length > obj[1])
                lzm_chatDisplay.showObjectTranslator('ticket',obj);
        }
        else
        {
            if (d(obj) && d!= null)
                lzm_chatDisplay.showObjectTranslator(type,obj);
        }

    }
    else
    {
        var noGTranslateKeyWarning1 = t('LiveZilla can translate your conversations in real time. This is based upon Google Translate.');
        var noGTranslateKeyWarning2 = t('To use this functionality, you have to add a Google API key.');
        var noGTranslateKeyWarning3 = t('For further information, see LiveZilla Server Admin -> LiveZilla Server Configuration.');
        var noGTranslateKeyWarning = t('<!--phrase1--><br /><br /><!--phrase2--><br /><!--phrase3-->',
            [['<!--phrase1-->', noGTranslateKeyWarning1], ['<!--phrase2-->', noGTranslateKeyWarning2], ['<!--phrase3-->', noGTranslateKeyWarning3]]);
        lzm_commonDialog.createAlertDialog(noGTranslateKeyWarning, [{id: 'ok', name: t('Ok')}]);
        $('#alert-btn-ok').click(function() {
            lzm_commonDialog.removeAlertDialog();
        });
    }
}

function showTicketLinker(firstId, secondId, firstType, secondType, inChatDialog, elementId) {

    removeTicketMessageContextMenu();
    inChatDialog = (typeof inChatDialog != 'undefined') ? inChatDialog : false;
    elementId = (typeof elementId != 'undefined') ? elementId : '';

    var maximizeInsteadOfOpen = (secondType == 'chat' && secondId != '' && !inChatDialog), storedDialogId = '';
    if (maximizeInsteadOfOpen) {
        for (var key in lzm_chatDisplay.StoredDialogs) {
            if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
                if (lzm_chatDisplay.StoredDialogs[key].type == 'link-ticket' &&
                    typeof lzm_chatDisplay.StoredDialogs[key].data['cid'] != 'undefined' &&
                    lzm_chatDisplay.StoredDialogs[key].data['cid'] == secondId) {
                    storedDialogId = key;
                }
            }
        }
    }
    if (storedDialogId != '') {
        lzm_displayHelper.maximizeDialogWindow(storedDialogId);
    }
    else
    {
        var firstObject = null, secondObject = null, i = 0;
        var ticket = lzm_chatDisplay.ticketDisplay.getTicketById(firstId);

        if (firstId != '' && firstType == 'ticket')
            if (ticket != null)
                firstObject = lzm_commonTools.clone(ticket);

        if (secondId != '' && secondType == 'chat') {
            for (i=0; i<lzm_chatServerEvaluation.chatArchive.chats.length; i++) {
                if (lzm_chatServerEvaluation.chatArchive.chats[i].cid == secondId) {
                    secondObject = lzm_commonTools.clone(lzm_chatServerEvaluation.chatArchive.chats[i]);
                }
            }
        }
        else if (secondId != '' && secondType == 'ticket')
        {
            ticket = lzm_chatDisplay.ticketDisplay.getTicketById(secondId);
            if (ticket != null)
                secondObject = lzm_commonTools.clone(ticket);
        }
        if (firstObject != null || secondObject != null) {
            lzm_chatDisplay.ticketDisplay.showTicketLinker(firstObject, secondObject, firstType, secondType, inChatDialog, elementId);
        }
    }
}

function linkTicket(type, firstId, secondId) {
    lzm_chatPollServer.pollServerSpecial({fo: type.split('~')[0], so: type.split('~')[1], fid: firstId, sid: secondId}, 'link-ticket');
}

function selectTicket(ticketId, noUserInteraction, inDialog, elementId, row, e, rightClick) {

    try
    {
        row = (d(row)) ? $(row) : null;
        rightClick = (d(rightClick)) ? rightClick : false;
        e = (d(e)) ? e : null;
        noUserInteraction = (typeof noUserInteraction != 'undefined') ? noUserInteraction : false;
        inDialog = (typeof inDialog != 'undefined') ? inDialog : false;
        elementId = (typeof elementId != 'undefined') ? elementId : '';

        if(rightClick && row != null && row.hasClass('selected-table-line'))
            return;

        var userId = elementId.replace('d-','').replace('e-','');
        var ticket, i;
        if (!inDialog)
        {
            if($.inArray(ticketId, ['next', 'previous']) != -1) {
                if (lzm_chatDisplay.selectedTicketRow != '') {
                    for (var j=0; j<lzm_chatDisplay.ticketListTickets.length; j++)
                        if (lzm_chatDisplay.ticketListTickets[j].id == lzm_chatDisplay.selectedTicketRow) {
                            try {
                                ticketId = (ticketId == 'next') ?  lzm_chatDisplay.ticketListTickets[j + 1].id : lzm_chatDisplay.ticketListTickets[j - 1].id;
                            } catch(e) {
                                ticketId = lzm_chatDisplay.ticketListTickets[j].id;
                            }
                        }

                }
                else {
                    try {
                        ticketId = lzm_chatDisplay.ticketListTickets[0].id
                    } catch(ex) {
                        ticketId = '';
                    }
                }
            }

            if(ticketId == '' && lzm_chatDisplay.ticketListTickets.length > 0)
                ticketId = lzm_chatDisplay.ticketListTickets[0].id;
            else if(elementId == '' && lzm_chatDisplay.ticketListTickets.length == 0)
                ticketId = '';
        }
        else
        {
            if(ticketId == '' && lzm_chatDisplay.ticketControlTickets[userId].length > 0)
                ticketId = lzm_chatDisplay.ticketControlTickets[userId][0].id;
        }

        var isMultiLine = (!inDialog && e!=null) ? (e.shiftKey || e.ctrlKey) : false;
        var isShiftSelect = (!inDialog && e!=null) ? (e.shiftKey) : false;
        var newSelectedLine = (!inDialog && e!=null) ? row.data('line-number') : 0;
        var oldSelectedLine = lzm_chatDisplay.selectedTicketRowNo;
        var selectedLine = oldSelectedLine;

        removeTicketContextMenu(inDialog);

        if(!isMultiLine)
            $('.ticket-list-row').removeClass('selected-table-line');

        if (ticketId != '' && !noUserInteraction && !lzm_chatDisplay.isApp && !lzm_chatDisplay.isMobile &&
            lzm_chatDisplay.selectedTicketRow == ticketId &&
            lzm_commonTools.checkTicketReadStatus(ticketId, lzm_chatDisplay.ticketReadArray) == -1 &&
            lzm_chatTimeStamp.getServerTimeString(null, false, 1) - ticketLineClicked >= 500) {
            changeTicketReadStatus(ticketId, 'read', false, true);

        }

        ticketLineClicked = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
        lzm_chatDisplay.selectedTicketRow = ticketId;

        for (i=0; i<lzm_chatDisplay.ticketListTickets.length; i++)
            if (lzm_chatDisplay.ticketListTickets[i].id == ticketId)
                lzm_chatDisplay.selectedTicketRowNo = i;

        ticket = lzm_chatDisplay.ticketDisplay.getTicketById(ticketId);
        var previewContainer = null, messageText = '';

        if (!inDialog)
        {
            if(isShiftSelect && Math.abs(row.data('line-number')-oldSelectedLine) > 1)
            {
                if(newSelectedLine>selectedLine)
                    for(i=selectedLine;i<=newSelectedLine;i++)
                        $('.ticket-list-row-' + i).addClass('selected-table-line');
                else if(newSelectedLine<selectedLine)
                    for(i=selectedLine;i>=newSelectedLine;i--)
                        $('.ticket-list-row-' + i).addClass('selected-table-line');
            }
            else
                $('#ticket-list-row-' + ticketId).addClass('selected-table-line');

            if (ticket != null && $(window).width() > 1000)
            {
                messageText = ticket.messages[ticket.messages.length - 1].mt;
                previewContainer = $('#ticket-list-right');
                $('.ticket-action').removeClass('ui-disabled');
            }
        }
        else
        {
            $('#matching-ticket-list-'+elementId+'-row-' + ticketId).addClass('selected-table-line');
            messageText = (ticket != null ) ? ticket.messages[ticket.messages.length - 1].mt : '';
            previewContainer = $('#ticket-content-'+elementId+'-inner');
        }

        if(previewContainer != null){
            messageText = lzm_commonTools.htmlEntities(messageText).replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '<br />');
            if(lzm_displayHelper.matchSearch($('#search-ticket').val(),messageText)){
                var regEx = new RegExp($('#search-ticket').val(), "ig");
                messageText = messageText.replace(regEx, '<span class="search-match">'+$('#search-ticket').val()+'</span>');
            }
            previewContainer.html(messageText);
        }
    }
    catch(e){deblog(e);}
}

function selectTicketMessage(ticketId, messageNumber) {

    $('.message-line').removeClass('selected-table-line');
    $('#ticket-history-table').data('selected-message', messageNumber);
    $('#message-line-' + ticketId + '_' + messageNumber).addClass('selected-table-line');
    $('.comment-line').removeClass('selected-table-line');
    $('.comment-line-' + ticketId + '_' + messageNumber).addClass('selected-table-line');

}

function handleTicketMessageClick(ticketId, messageNumber) {
    if ($('#ticket-history-table').data('selected-message') != messageNumber && $('#message-details-inner').data('edit'))
        toggleMessageEditMode();

    removeTicketMessageContextMenu();
    if (!$('#message-details-inner').data('edit')) {
        var ticket = lzm_chatDisplay.ticketDisplay.getTicketById(ticketId), i;

        selectTicketMessage(ticketId, messageNumber);

        var attachmentsHtml = lzm_chatDisplay.ticketDisplay.createTicketAttachmentTable(ticket, {id:''}, messageNumber, false,'ticket-details-placeholder-tab-1');
        var commentsHtml = lzm_chatDisplay.ticketDisplay.createTicketCommentTable(ticket, messageNumber, '','ticket-details-placeholder-tab-2');
        var detailsHtml = lzm_chatDisplay.ticketDisplay.createTicketMessageDetails(ticket.messages[messageNumber], {id: ''}, false, {cid: ''}, false);
        var messageHtml = lzm_commonTools.htmlEntities(ticket.messages[messageNumber].mt).replace(/\n/g, '<br />');

        $('#ticket-message-text').html(messageHtml);
        $('#ticket-message-details').html(detailsHtml);
        $('#ticket-attachment-list').html(attachmentsHtml);
        $('#ticket-comment-list').html(commentsHtml);

        $('#message-details-inner').data('message', ticket.messages[messageNumber]);
        $('#message-details-inner').data('email', {id: ''});
        $('#message-details-inner').data('is-new', false);
        $('#message-details-inner').data('chat', {cid: ''});
        $('#message-details-inner').data('edit', false);

        if(!lzm_chatDisplay.ticketDisplay.isFullscreenMode()){
            $('#ticket-history-placeholder-tab-0').click();
            $('#ticket-details-placeholder-tab-0').click();
        }
    }
    lzm_displayLayout.resizeTicketDetails();
}

function toggleMessageEditMode(ticketId, messageNumber, apply) {

    if (typeof ticketId != 'undefined' && ticketId != null && typeof messageNumber != 'undefined' && messageNumber != null) {
        handleTicketMessageClick(ticketId, messageNumber);
    }
    var message = $('#message-details-inner').data('message');
    var startEdit = !$('#message-details-inner').data('edit');

    if(startEdit && lzm_commonPermissions.permissions.tickets_edit_messages==0)
    {
        showNoPermissionMessage();
        return;
    }

    if (typeof apply != 'undefined' && apply) {
        message.fn = $('#change-message-name').val();
        message.em = $('#change-message-email').val();
        message.co = $('#change-message-company').val();
        message.s = $('#change-message-subject').val();
        message.p = $('#change-message-phone').val();
        message.mt = $('#change-message-text').val();
    }

    var detailsHtml = lzm_chatDisplay.ticketDisplay.createTicketMessageDetails(message, {id: ''}, false, {cid: ''}, startEdit);
    var messageHtml = (startEdit) ? '<textarea id="change-message-text" data-role="none">' + message.mt + '</textarea>' : lzm_commonTools.htmlEntities(message.mt).replace(/\n/g, '<br />');
    $('#ticket-message-details').html(detailsHtml);
    $('#ticket-message-text').html(messageHtml);
    if (startEdit) {
        $('#ticket-details-placeholder-content-0').addClass('ticket-edit');
    } else {
        $('#ticket-details-placeholder-content-0').removeClass('ticket-edit');
    }
    $('#message-details-inner').data('message', message);
    $('#message-details-inner').data('email', {id: ''});
    $('#message-details-inner').data('is-new', false);
    $('#message-details-inner').data('chat', {cid: ''});
    $('#message-details-inner').data('edit', startEdit);
    if (parseInt($('#ticket-details-placeholder-tabs-row').data('selected-tab')) >= 2) {
        $('#ticket-details-placeholder-tab-1').click();
    }
    lzm_displayLayout.resizeTicketDetails();
}

function handleTicketCommentClick(commentNo, commentText) {

}

function handleTicketAttachmentClick(attachmentNo) {
    $('.attachment-line').removeClass('selected-table-line');
    $('#attachment-line-' + attachmentNo).addClass('selected-table-line');
    $('#attachment-table').data('selected-attachment', attachmentNo);
    $('#message-attachment-table').data('selected-attachment', attachmentNo);
    $('#remove-attachment').removeClass('ui-disabled');
}

function previewTicketAttachment(url) {
    if(url!=null)
        $('#att-img-preview-field').html('</span><img src="'+url+'">');
    else
        $('#att-img-preview-field').html('');


    lzm_displayLayout.resizeTicketDetails();
}

function initSaveTicketDetails(ticket, channel, status, group, editor, language, name, email, company, phone, message, attachments, comments, customFields, subStatus, subChannel, chat, mc, subject, rem_time, rem_status, priority) {
    mc = (typeof mc != 'undefined') ? mc : '';
    subject = (typeof subject != 'undefined') ? subject : '';
    status = status.toString();
    subStatus = (typeof subStatus == 'undefined' || subStatus == null) ? '' : subStatus;
    subChannel = (typeof subChannel == 'undefined' || subChannel == null) ? '' : subChannel;
    rem_time = (typeof rem_time == 'undefined' || rem_time == null) ? '0' : rem_time;
    rem_status = (typeof rem_status == 'undefined' || rem_status == null) ? '0' : rem_status;
    priority = (!d(priority)) ? '2' : priority;
    editor = (editor != -1) ? editor : '';

    var id = '', oe = '', os = '', og = '', ol = '';
    lzm_chatServerEvaluation.expectTicketChanges = true;

    if (d(ticket.id)) {
        id = ticket.id;
        og = ticket.gr;
        ol = ticket.l;
        if (ticket.editor != false) {
            og = ticket.editor.g;
            oe = ticket.editor.ed;
            os = ticket.editor.st;
        }

        if(subStatus != '' && !lzm_chatDisplay.ticketDisplay.subDefinitionIsValid(0,status,subStatus))
            subStatus = '';
        if(subChannel != '' && !lzm_chatDisplay.ticketDisplay.subDefinitionIsValid(1,channel,subChannel))
            subChannel = '';

        this.lzm_chatPollServer.uploadTickets.push({id: id, ne: editor, ns: status, ss: subStatus, sc: subChannel, nch: channel, ng: group, oe: oe, os: os, og: og, nl: language, ol: ol, mc: mc, vv: rem_time, vw: rem_status});
    }
    else
        this.lzm_chatPollServer.uploadTickets.push({nn: name, nem: email, nc: company, np: phone, nm: message, sub: subject, ne: editor, ns: status, ss: subStatus, sc: subChannel, ng: group, nl: language, nch: channel, at: attachments, co: comments, cf: customFields, vv: rem_time, vw: rem_status, vx: priority});
}

function uploadSaveTicketDetails(action, chat) {
    action = (d(action)) ? action : 'save-details';
    this.lzm_chatPollServer.pollServerTicket(lzm_commonTools.clone(this.lzm_chatPollServer.uploadTickets), [], action, chat);
    this.lzm_chatPollServer.uploadTickets = [];
}

function saveTicketTranslationText(myTicket, msgNo, text, type) {
    if (typeof type == 'undefined' || type != 'comment') {
        if (myTicket != null) {
            var ticketGroup = (typeof myTicket.editor != 'undefined' && myTicket.editor != false) ? myTicket.editor.g : myTicket.gr;
            var ticketStatus = (typeof myTicket.editor != 'undefined' && myTicket.editor != false) ? myTicket.editor.st : 0;
            var ticketOperator = (typeof myTicket.editor != 'undefined' && myTicket.editor != false) ? myTicket.editor.ed : '';
            var mc = {tid: myTicket.id, mid: myTicket.messages[msgNo].id, n: myTicket.messages[msgNo].fn, e: myTicket.messages[msgNo].em,
                c: myTicket.messages[msgNo].co, p: myTicket.messages[msgNo].p, s: myTicket.messages[msgNo].s, t: text,
                custom: []};
            for (var i=0; i<myTicket.messages[msgNo].customInput.length; i++)
                mc.custom.push({id: myTicket.messages[msgNo].customInput[i].id, value: myTicket.messages[msgNo].customInput[i].text});
            initSaveTicketDetails(myTicket, myTicket.t, ticketStatus, ticketGroup, ticketOperator, myTicket.l, null, null, null, null, null, null, null, null, null, null, null, mc);
            uploadSaveTicketDetails();
        }
    }
    else if (myTicket != null)
        lzm_chatUserActions.saveTicketComment(myTicket.id, myTicket.messages[msgNo].id, text);
}

function setTicketOperator(ticketId, operatorId) {
    var selTickets = $('tr.ticket-list-row.selected-table-line');
    selTickets.each(function()
    {
        var myTicket = lzm_chatDisplay.ticketDisplay.getTicketById($(this).attr('id').replace('ticket-list-row-',''));
        if (myTicket != null)
        {
            var ticketGroup = (typeof myTicket.editor != 'undefined' && myTicket.editor != false) ? myTicket.editor.g : myTicket.gr;
            var ticketStatus = (typeof myTicket.editor != 'undefined' && myTicket.editor != false) ? myTicket.editor.st : 0;
            initSaveTicketDetails(myTicket, myTicket.t, ticketStatus, ticketGroup, operatorId, myTicket.l, '', '', '', '', '');
        }
    });
    uploadSaveTicketDetails();
}

function setTicketGroup(ticketId, groupId) {
    var selTickets = $('tr.ticket-list-row.selected-table-line');
    selTickets.each(function()
    {
        var myTicket = lzm_chatDisplay.ticketDisplay.getTicketById($(this).attr('id').replace('ticket-list-row-',''));
        if (myTicket != null)
        {
            var ticketEditor = (typeof myTicket.editor != 'undefined' && myTicket.editor != false) ? myTicket.editor.ed : '';
            var ticketStatus = (typeof myTicket.editor != 'undefined' && myTicket.editor != false) ? myTicket.editor.st : 0;
            initSaveTicketDetails(myTicket, myTicket.t, ticketStatus, groupId, ticketEditor, myTicket.l, '', '', '', '', '');
        }
    });
    uploadSaveTicketDetails();
}

function setTicketPriority(_ticketId, _priorityKey) {
    var selTickets = $('tr.ticket-list-row.selected-table-line'),list=[];
    selTickets.each(function()
    {
        list.push({id: $(this).attr('id').replace('ticket-list-row-',''),priority: _priorityKey});
    });
    lzm_chatUserActions.setTicketPriority(list);
}

function changeTicketStatus(myStatus, mySubStatus, myChannel, mySubChannel, fromKey) {
    removeTicketContextMenu();
    if (lzm_chatDisplay.selectedTicketRow != '') {
        if (!lzm_commonPermissions.checkUserPermissions('', 'tickets', 'change_ticket_status', {}) ||
            (!lzm_commonPermissions.checkUserPermissions('', 'tickets', 'status_open', {}) && myStatus == 0) ||
            (!lzm_commonPermissions.checkUserPermissions('', 'tickets', 'status_progress', {}) && myStatus == 1) ||
            (!lzm_commonPermissions.checkUserPermissions('', 'tickets', 'status_closed', {}) && myStatus == 2) ||
            (!lzm_commonPermissions.checkUserPermissions('', 'tickets', 'status_deleted', {}) && myStatus == 3)) {
            showNoPermissionMessage();
        }
        else
        {
            var selTickets = $('tr.ticket-list-row.selected-table-line');
            var ticketId, i = 0, silent = selTickets.length>1;
            selTickets.each(function()
            {
                ticketId = $(this).attr('id').replace('ticket-list-row-','');
                var myTicket = lzm_chatDisplay.ticketDisplay.getTicketById(ticketId);
                var ticketGroup = myTicket.gr;
                var ticketEditor = -1;
                if (typeof myTicket.editor != 'undefined' && myTicket.editor != false) {
                    ticketGroup = myTicket.editor.g;
                    ticketEditor = myTicket.editor.ed;
                }

                var newStatus = (myStatus!=null) ? myStatus : ((myTicket.editor)? myTicket.editor.st:0);
                var newSubStatus = (mySubStatus!=null) ? mySubStatus : ((myTicket.editor)? myTicket.editor.ss:'');
                var newSubChannel = (mySubChannel!=null) ? mySubChannel : myTicket.s;
                var newChannel = (myChannel!=null) ? myChannel : myTicket.t;
                var deleteTicketMessage1 = t('Do you really want to remove this ticket irrevocably?');
                var deleteTicketMessage2 = t('You have replied to this request. Do you really want to remove this ticket?');
                var deleteTicketMessage3 = t('You have replied to this request. Do you really want to remove this ticket irrevocably?');
                var opHasAnswered = false;

                if (d(myTicket.messages))
                    for (i=0; i<myTicket.messages.length; i++)
                        if (myTicket.messages[i].t == 1)
                            opHasAnswered = true;

                if (myStatus == 4)
                {
                    var mes = (opHasAnswered) ? deleteTicketMessage3 : deleteTicketMessage1;
                    lzm_commonDialog.createAlertDialog(mes, [{id: 'ok', name: t('Ok')}, {id: 'cancel', name: t('Cancel')}]);
                    $('#alert-btn-ok').click(function() {
                        lzm_chatUserActions.deleteTicket(ticketId,silent);
                        lzm_commonDialog.removeAlertDialog();
                    });
                    $('#alert-btn-cancel').click(function() {
                        lzm_commonDialog.removeAlertDialog();
                    });
                    if(silent)
                        $('#alert-btn-ok').click();
                }
                else if (myStatus != 3)
                {
                    initSaveTicketDetails(myTicket, newChannel, newStatus, ticketGroup, ticketEditor, myTicket.l, '', '', '', '', '',null,null,null,newSubStatus,newSubChannel);
                }
                else if (myStatus == 3 && !opHasAnswered)
                {
                    initSaveTicketDetails(myTicket, newChannel, newStatus, ticketGroup, ticketEditor, myTicket.l, '', '', '', '', '',null,null,null,newSubStatus,newSubChannel);
                }
                else if (myStatus == 3 && opHasAnswered)
                {
                    lzm_commonDialog.createAlertDialog(deleteTicketMessage2, [{id: 'ok', name: t('Ok')}, {id: 'cancel', name: t('Cancel')}]);
                    $('#alert-btn-ok').click(function() {
                        initSaveTicketDetails(myTicket, newChannel, newStatus, ticketGroup, ticketEditor, myTicket.l, '', '', '', '', '',null,null,null,newSubStatus,newSubChannel);
                        uploadSaveTicketDetails();
                        lzm_commonDialog.removeAlertDialog();
                    });
                    $('#alert-btn-cancel').click(function() {
                        lzm_commonDialog.removeAlertDialog();
                    });
                    if(silent)
                        $('#alert-btn-ok').click();
                }
            });
            uploadSaveTicketDetails();
        }
    }
}

function sendTicketMessage(ticket, receiver, bcc, subject, message, comment, attachments, messageId, previousMessageId, addToWL) {
    var ticketFetchTime = lzm_chatServerEvaluation.ticketFetchTime;
    lzm_chatServerEvaluation.expectTicketChanges = true;
    lzm_chatUserActions.sendTicketReply(ticket, receiver, bcc, subject, message, comment, attachments, messageId, previousMessageId, addToWL);
    switchTicketListPresentation(ticketFetchTime, 0, ticket.id);
}

function addOrEditResourceFromTicket(ticketId) {
    var resource = lzm_chatServerEvaluation.cannedResources.getResource(lzm_chatDisplay.selectedResource);
    if (resource != null)
    {
        if (resource.ty == 0)
            lzm_chatUserActions.addQrd(1,ticketId, true);
        else if (resource.ty == 1)
        {
            resource.text = lzm_chatDisplay.ticketResourceText[ticketId];
            lzm_chatUserActions.editQrd(resource, ticketId, true);
        }
    }
}

function saveQrdFromTicket(resourceId, resourceText) {
    var resource = lzm_chatServerEvaluation.cannedResources.getResource(resourceId);
    if (resource != null) {
        resource.text = resourceText.replace(/\n/g, '<br />');
        lzm_chatPollServer.pollServerResource(resource);
    }
}

function addQrdAttachment(closeToTicket) {
    var resource = lzm_chatServerEvaluation.cannedResources.getResource(lzm_chatDisplay.selectedResource);
    if (resource != null) {
        lzm_chatServerEvaluation.cannedResources.riseUsageCounter(lzm_chatDisplay.selectedResource);
        cancelQrd(closeToTicket);
        var resources1 = $('#reply-placeholder-content-1').data('selected-resources');
        var resources2 = $('#ticket-details-placeholder-content-1').data('selected-resources');
        var resources = (typeof resources1 != 'undefined') ? resources1 : (typeof resources2 != 'undefined') ? resources2 : [];
        resources.push(resource);
        $('#reply-placeholder-content-1').data('selected-resources', resources);
        $('#ticket-details-placeholder-content-1').data('selected-resources', resources);
        lzm_chatDisplay.ticketDisplay.updateAttachmentList();
    }
}

function insertQrdIntoTicket(ticketId) {
    var resource = lzm_chatServerEvaluation.cannedResources.getResource(lzm_chatDisplay.selectedResource);
    if (resource != null) {
        lzm_chatServerEvaluation.cannedResources.riseUsageCounter(lzm_chatDisplay.selectedResource);
        lzm_displayHelper.removeDialogWindow('qrd-tree-dialog');
        lzm_displayHelper.maximizeDialogWindow(lzm_chatDisplay.ticketDialogId[ticketId] + '_reply');
        var replyText = '';
        switch(resource.ty) {
            case '1':
                replyText += resource.text
                    .replace(/^<p>/gi,'').replace(/^<div>/gi,'')
                    .replace(/<p>/gi,'<br>').replace(/<div>/gi,'<br>')
                    .replace(/<br>/gi,'\n').replace(/<br \/>/gi, '\n');
                if (replyText.indexOf('openLink') != -1) {
                    replyText = replyText.replace(/<a.*openLink\('(.*?)'\).*>(.*?)<\/a>/gi, '$2 ($1)');
                } else {
                    replyText = replyText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, '$2 ($1)');
                }
                replyText = replyText.replace(/<.*?>/g, '').replace(/&nbsp;/gi, ' ')
                    .replace(/&.*?;/g, '');
                break;
            case '2':
                replyText += resource.ti + ':\n' + resource.text;
                break;
            default:
                var urlFileName = encodeURIComponent(resource.ti.replace(/ /g, '+'));
                var fileId = resource.text.split('_')[1];
                var urlParts = lzm_commonTools.getUrlParts(lzm_chatPollServer.chosenProfile.server_protocol + lzm_chatPollServer.chosenProfile.server_url, 0);
                var thisServer = ((urlParts.protocol == 'http://' && urlParts.port == 80) || (urlParts.protocol == 'https://' && urlParts.port == 443)) ?
                    urlParts.protocol + urlParts.urlBase + urlParts.urlRest : urlParts.protocol + urlParts.urlBase + ':' + urlParts.protocol + urlParts.urlRest;
                replyText += thisServer + '/getfile.php?';
                if (multiServerId != '') {
                    replyText += 'ws=' + multiServerId + '&';
                }
                replyText += 'file=' + urlFileName + '&id=' + fileId;
        }

        //$('#ticket-reply-input').val(replyText);
        insertAtCursor('ticket-reply-input', replyText);
        $('#ticket-reply-input-resource').val(resource.rid);

        if (resource.ty == 1) {
            $('#ticket-reply-input-save').removeClass('ui-disabled');
        } else {
            $('#ticket-reply-input-save').addClass('ui-disabled');
        }
    }
}

function setAllTicketsRead() {
    lzm_chatPollServer.stopPolling();
    var maxTicketUpdated = lzm_chatPollServer.lastPollTime;
    if (parseInt(maxTicketUpdated) > parseInt(lzm_chatPollServer.ticketMaxRead)) {
        lzm_chatPollServer.ticketMaxRead = maxTicketUpdated;
        lzm_chatDisplay.ticketGlobalValues.mr = maxTicketUpdated;
    }
    lzm_chatPollServer.resetTickets = true;
    lzm_chatDisplay.ticketReadArray = [];
    lzm_chatDisplay.ticketUnreadArray = [];
    lzm_chatDisplay.ticketDisplay.updateTicketList(lzm_chatDisplay.ticketListTickets, lzm_chatDisplay.ticketGlobalValues,lzm_chatPollServer.ticketPage, lzm_chatPollServer.ticketSort,lzm_chatPollServer.ticketSortDir,lzm_chatPollServer.ticketQuery, lzm_chatPollServer.ticketFilterStatus,true);
    lzm_chatPollServer.startPolling();
    removeTicketContextMenu();
}

function changeTicketReadStatus(ticketId, status, doNotUpdate, forceRead) {
    removeTicketContextMenu();
    doNotUpdate = (typeof doNotUpdate != 'undefined') ? doNotUpdate : false;
    forceRead = (typeof forceRead != 'undefined') ? forceRead : false;
    lzm_chatServerEvaluation.expectTicketChanges = true;
    var ticket = {id: '', u: 0}, i;
    for (i=0; i<lzm_chatServerEvaluation.tickets.length; i++)
        if (lzm_chatServerEvaluation.tickets[i].id == ticketId)
            ticket = lzm_chatServerEvaluation.tickets[i];

    if ((ticket.id != '' && status == 'read' && ticket.u > lzm_chatPollServer.ticketMaxRead) ||
        (ticket.id != '' && status != 'read' && true)) {
        if (ticket.id == '') {
            for (i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
                if (lzm_chatDisplay.ticketListTickets[i].id == ticketId) {
                    ticket = lzm_chatDisplay.ticketListTickets[i];
                }
            }
        }
        if (status == 'read') {
            if (forceRead) {
                lzm_chatDisplay.ticketReadArray = lzm_commonTools.removeTicketFromReadStatusArray(ticketId, lzm_chatDisplay.ticketReadArray);
                lzm_chatDisplay.ticketReadArray = lzm_commonTools.addTicketToReadStatusArray(ticket,
                    lzm_chatDisplay.ticketReadArray, lzm_chatDisplay.ticketListTickets, false);
            } else if (ticket.u > lzm_chatDisplay.ticketGlobalValues.mr && lzm_commonTools.checkTicketReadStatus(ticket.id, lzm_chatDisplay.ticketReadArray) == -1) {
                lzm_chatDisplay.ticketReadArray = lzm_commonTools.addTicketToReadStatusArray(ticket,
                    lzm_chatDisplay.ticketReadArray, lzm_chatDisplay.ticketListTickets, false);
            } else {
                lzm_chatDisplay.ticketUnreadArray = lzm_commonTools.removeTicketFromReadStatusArray(ticket.id, lzm_chatDisplay.ticketUnreadArray);
            }
        } else
        {
            if (ticket.u <= lzm_chatDisplay.ticketGlobalValues.mr && lzm_commonTools.checkTicketReadStatus(ticket.id, lzm_chatDisplay.ticketUnreadArray) == -1)
                lzm_chatDisplay.ticketUnreadArray.push({id: ticket.id, timestamp: lzm_chatTimeStamp.getServerTimeString(null, true)});

            else
                lzm_chatDisplay.ticketReadArray = lzm_commonTools.removeTicketFromReadStatusArray(ticket.id, lzm_chatDisplay.ticketReadArray);

        }
        if (!doNotUpdate)
            lzm_chatDisplay.ticketDisplay.updateTicketList(lzm_chatDisplay.ticketListTickets, lzm_chatDisplay.ticketGlobalValues,lzm_chatPollServer.ticketPage, lzm_chatPollServer.ticketSort, lzm_chatPollServer.ticketSortDir, lzm_chatPollServer.ticketQuery, lzm_chatPollServer.ticketFilterStatus,true);
    }
}

function sortTicketsBy(sortCriterium) {
    if (sortCriterium == lzm_chatPollServer.ticketSort)
        lzm_chatPollServer.ticketSortDir = (lzm_chatPollServer.ticketSortDir=='ASC') ? 'DESC' : 'ASC';
    $('.ticket-list-page-button').addClass('ui-disabled');
    var ticketFetchTime = lzm_chatServerEvaluation.ticketFetchTime;
    lzm_chatServerEvaluation.expectTicketChanges = true;
    lzm_chatPollServer.stopPolling();
    lzm_chatPollServer.ticketSort = sortCriterium;
    lzm_chatPollServer.resetTickets = true;
    lzm_chatPollServer.startPolling();
    switchTicketListPresentation(ticketFetchTime, 0);
}

function searchTickets(searchString) {
    var ticketFetchTime = lzm_chatServerEvaluation.ticketFetchTime;
    lzm_chatServerEvaluation.expectTicketChanges = true;
    lzm_chatPollServer.stopPolling();
    lzm_chatPollServer.ticketQuery = searchString;
    lzm_chatPollServer.ticketPage = 1;
    lzm_chatPollServer.resetTickets = true;
    lzm_chatPollServer.startPolling();
    switchTicketListPresentation(ticketFetchTime, 0);
}

function cancelTicketReply(ticketId, windowId, dialogId) {
    if($.inArray(ticketId,lzm_chatDisplay.ticketDisplay.pausedTicketReplies) != -1)
        lzm_chatDisplay.ticketDisplay.pausedTicketReplies.splice($.inArray(ticketId,lzm_chatDisplay.ticketDisplay.pausedTicketReplies), 1 );
    lzm_displayHelper.removeDialogWindow(windowId);
    lzm_displayHelper.maximizeDialogWindow(dialogId);
    $('#reply-ticket-details').removeClass('ui-disabled');
}

function pauseTicketReply(ticketId, windowId, dialogId) {
    if($.inArray(ticketId,lzm_chatDisplay.ticketDisplay.pausedTicketReplies) == -1)
        lzm_chatDisplay.ticketDisplay.pausedTicketReplies.push(ticketId);
    lzm_displayHelper.minimizeDialogWindow(dialogId+'_reply', 'ticket-details',{}, 'tickets', false);
    lzm_displayHelper.maximizeDialogWindow(dialogId);
    $('#reply-ticket-details').removeClass('ui-disabled');
}

function showMessageReply(ticketId, messageNo, groupId) {
    var i, ticket;
    for (i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
        if (lzm_chatDisplay.ticketListTickets[i].id == ticketId) {
            ticket = lzm_chatDisplay.ticketListTickets[i];
        }
    }
    var selectedGroup = lzm_chatServerEvaluation.groups.getGroup(groupId);
    lzm_chatDisplay.ticketDisplay.showMessageReply(ticket, messageNo, selectedGroup);
}

function deleteSalutationString(e, salutationField, salutationString) {
    e.stopPropagation();
    lzm_commonTools.deleteTicketSalutation(salutationField, salutationString);
}

function addComment(ticketId, menuEntry) {
    removeTicketMessageContextMenu();
    var messageNo = $('#ticket-history-table').data('selected-message');
    var ticket = {}, message = {};
    for (var i=0; i<lzm_chatDisplay.ticketListTickets.length; i++)
    {
        if (lzm_chatDisplay.ticketListTickets[i].id == ticketId)
        {
            ticket = lzm_chatDisplay.ticketListTickets[i];
            message = ticket.messages[messageNo];
        }
    }
    lzm_chatDisplay.ticketDisplay.addMessageComment(ticket.id, message, menuEntry);
}

function toggleEmailList() {
    if ($('#email-list-container').length == 0) {
        var storedPreviewId = '';
        for (var key in lzm_chatDisplay.StoredDialogs) {
            if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
                if (lzm_chatDisplay.StoredDialogs[key].type == 'email-list') {
                    storedPreviewId = key;
                }
            }
        }
        if (storedPreviewId != '') {
            lzm_displayHelper.maximizeDialogWindow(storedPreviewId);
        } else {
            lzm_chatDisplay.ticketDisplay.showEmailList();
            lzm_chatPollServer.stopPolling();
            lzm_chatPollServer.emailUpdateTimestamp = 0;
            lzm_chatPollServer.addPropertyToDataObject('p_de_a', lzm_chatPollServer.emailAmount);
            lzm_chatPollServer.addPropertyToDataObject('p_de_s', 0);
            lzm_chatPollServer.startPolling();
        }
    } else {
        lzm_chatPollServer.stopPolling();
        lzm_chatPollServer.removePropertyFromDataObject('p_de_a');
        lzm_chatPollServer.removePropertyFromDataObject('p_de_s');
        lzm_chatPollServer.emailAmount = 20;
        lzm_chatPollServer.startPolling();
    }
}

function deleteEmail() {

    var emailNo = 0, emailId = '';
    $('.selected-table-line').each(function(i, obj) {
        if($(obj).hasClass('email-list-line')){
            emailId = $(obj).attr('data-id');
            emailNo = $(obj).attr('data-line-number');
            lzm_chatDisplay.emailDeletedArray.push(emailId);
            $('#email-list-line-' + emailNo).children('td:first').html('<i class="fa fa-remove" style="color: #cc0000;"></i>');
            $('#reset-emails').removeClass('ui-disabled');
            $('#delete-email').addClass('ui-disabled');
            $('#create-ticket-from-email').addClass('ui-disabled');
            if ($('#email-list-line-' + (parseInt(emailNo) + 1)).length > 0)
                $('#email-list-line-' + (parseInt(emailNo) + 1)).click();
        }
    });

    scrollToEmail(emailNo);
}

function scrollToEmail(no){
    if(no > 0)
        $("#email-list-placeholder-content-0").scrollTop(parseInt(no) * 22);
}

function saveEmailListChanges(emailId, assign) {
    var i, emailChanges = [], ticketsCreated = [], emailListObject = {};
    if (emailId != '') {
        var editorId = (assign) ? lzm_chatDisplay.myId : '';
        if (emailId instanceof Array) {
            for (i=0; i<emailId.length; i++) {
                emailChanges.push({id: emailId[i], status: '0', editor: editorId})
            }
        } else {
            emailChanges = [{
                id: emailId, status: '0', editor: editorId
            }];
        }
    } else {
        for (i=0; i<lzm_chatServerEvaluation.emails.length; i++) {
            emailListObject[lzm_chatServerEvaluation.emails[i].id] = lzm_chatServerEvaluation.emails[i];
        }

        for (i=0; i<lzm_chatDisplay.emailDeletedArray.length; i++) {
            emailChanges.push({id: lzm_chatDisplay.emailDeletedArray[i], status: '1', editor: ''})
        }

        for (i=0; i<lzm_chatDisplay.ticketsFromEmails.length; i++) {
            var thisEmail = emailListObject[lzm_chatDisplay.ticketsFromEmails[i]['email-id']];
            emailChanges.push({id: thisEmail.id, status: '1', editor: ''});

            ticketsCreated.push({

                name: lzm_chatDisplay.ticketsFromEmails[i].name,//thisEmail.n,
                email: lzm_chatDisplay.ticketsFromEmails[i].email,//thisEmail.e,
                subject: lzm_chatDisplay.ticketsFromEmails[i].subject,//thisEmail.s,
                text: lzm_chatDisplay.ticketsFromEmails[i].message,
                group: lzm_chatDisplay.ticketsFromEmails[i].group,
                cid: thisEmail.id,
                channel: lzm_chatDisplay.ticketsFromEmails[i].channel,
                company: lzm_chatDisplay.ticketsFromEmails[i].company,
                phone: lzm_chatDisplay.ticketsFromEmails[i].phone,
                language: lzm_chatDisplay.ticketsFromEmails[i].language,
                status: lzm_chatDisplay.ticketsFromEmails[i].status,
                editor: (lzm_chatDisplay.ticketsFromEmails[i].editor != -1) ? lzm_chatDisplay.ticketsFromEmails[i].editor : '',
                attachment: thisEmail.attachment,
                comment: lzm_chatDisplay.ticketsFromEmails[i].comment,
                custom: lzm_chatDisplay.ticketsFromEmails[i].custom
            });
        }
    }
    lzm_chatUserActions.saveEmailChanges(emailChanges, ticketsCreated);
}

function showHtmlEmail(emailIdEnc) {
    removeTicketMessageContextMenu();
    var htmlEmailUrl = lzm_chatPollServer.chosenProfile.server_protocol + lzm_chatPollServer.chosenProfile.server_url + '/email.php?ws=' + multiServerId + '&id=' + emailIdEnc;
    openLink(htmlEmailUrl);
}

function printTicketMessage(ticketId, msgNo) {
    removeTicketMessageContextMenu();
    if (lzm_chatDisplay.isApp || lzm_chatDisplay.isMobile) {
        showNotMobileMessage();
    } else {
        var myTicket = null;
        for (var i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
            if (lzm_chatDisplay.ticketListTickets[i].id == ticketId) {
                myTicket = lzm_chatDisplay.ticketListTickets[i];
            }
        }
        if (myTicket != null && myTicket.messages.length > msgNo) {
            lzm_commonTools.printContent('message', {ticket: myTicket, msgNo: msgNo});
        }
    }
}

function showPhoneCallDialog(objectId, lineNo, caller) {
    if (caller == 'ticket') {
        var ticket = null;
        var messageNo = parseInt(lineNo);
        for (var i=0; i<lzm_chatDisplay.ticketListTickets.length; i++)
            if (lzm_chatDisplay.ticketListTickets[i].id == objectId)
                ticket = lzm_chatDisplay.ticketListTickets[i];

        if (ticket != null && ticket.messages.length > messageNo) {
            lzm_chatDisplay.openPhoneCallDialog(ticket, messageNo, caller);
        }
    }
    else if (caller == 'chat') {
        var visitorBrowser = lzm_chatServerEvaluation.visitors.getVisitorBrowser(objectId);
        if (visitorBrowser[1] != null)
            lzm_chatDisplay.openPhoneCallDialog(visitorBrowser, -1, caller);
    }
}

function startPhoneCall(protocol, phoneNumber) {

    if (!lzm_chatDisplay.isApp && !lzm_chatDisplay.isMobile)
    {
        var id=lzm_commonTools.guid();
        $("#chat_page").append("<iframe id='"+id+"' style='visibility:hidden;' width='1' height='1' frameborder='0' scrolling='no' marginheight='0' marginwidth='0' src='"+protocol + phoneNumber+"'></iframe>");
        setTimeout('$(\'#'+id+'\').remove()',60000);
    }
    else
    {
        try {
            if (d(lzm_deviceInterface.startPhoneCall))
                lzm_deviceInterface.startPhoneCall(protocol, phoneNumber);
            else {
                protocol = (protocol == 'skype:') ? 'skype:' : 'tel:';
                phoneNumber = (protocol == 'skype:') ? phoneNumber + '?call' : phoneNumber;
                lzm_deviceInterface.openExternalBrowser(protocol + phoneNumber);
            }
        } catch (e) {
            showNotOnDevice();
        }
    }
}

function handleTicketTree(_show){

    if($(window).width() > 800){
        if(typeof _show == 'undefined')
            _show = lzm_commonStorage.loadValue('show_ticket_tree_' + lzm_chatServerEvaluation.myId) != 1;
        lzm_commonStorage.saveValue('show_ticket_tree_' + lzm_chatServerEvaluation.myId,(_show) ? 1 : 0);

    }
    else{
        lzm_chatDisplay.ticketDisplay.categorySelect = !lzm_chatDisplay.ticketDisplay.categorySelect;
    }
    lzm_displayLayout.resizeTicketList();
}

function handleTicketTreeClickEvent(_id,_parent,_subStatus,_initPoll){

    _initPoll = (d(_initPoll)) ? _initPoll : true;
    _parent = (d(_parent)) ? _parent : null;
    _subStatus = (d(_subStatus)) ? _subStatus : null;

    $('#ticket-list-tree div').removeClass('selected-treeview-div');
    $('#'+_id).addClass('selected-treeview-div');
    lzm_commonStorage.saveValue('show_ticket_cat_' + lzm_chatServerEvaluation.myId,_id);
    if(lzm_chatDisplay.ticketDisplay.categorySelect){
        lzm_chatDisplay.ticketDisplay.categorySelect = false;
        setTimeout("lzm_displayLayout.resizeTicketList();",200);
    }

    var value = "";
    value += ((_id == "tnFilterStatusActive" || _id == "tnFilterStatusOpen" || _parent == "tnFilterStatusOpen") ? '1' : '0');
    value += ((_id == "tnFilterStatusActive" || _id == "tnFilterStatusInProgress" || _parent == "tnFilterStatusInProgress")? '1' : '0');
    value += ((_id == "tnFilterStatusClosed" || _parent == "tnFilterStatusClosed")? '1' : '0');
    value += ((_id == "tnFilterStatusDeleted" || _parent == "tnFilterStatusDeleted")? '1' : '0');
    value += ((_id == "tnFilterMyTickets" || _parent == "tnFilterMyTickets")? '1' : '0');
    value += ((_id == "tnFilterMyGroupsTickets" || _parent == "tnFilterMyGroupsTickets")? '1' : '0');

    if(_subStatus != null)
        lzm_chatPollServer.ticketFilterSubStatus = _subStatus;
    else
        lzm_chatPollServer.ticketFilterSubStatus = null;

    lzm_chatPollServer.ticketFilterPersonal = value.substr(4, 1) == "1";
    lzm_chatPollServer.ticketFilterGroup = value.substr(5, 1) == "1";
    lzm_chatPollServer.ticketFilterWatchList = (_id == 'tnFilterWatchList');
    var f = "";

    f += value.substr(0, 1) == "1" || lzm_chatPollServer.ticketFilterPersonal || lzm_chatPollServer.ticketFilterGroup ? "0" : "";
    f += value.substr(1, 1) == "1" || lzm_chatPollServer.ticketFilterPersonal || lzm_chatPollServer.ticketFilterGroup ? "1" : "";
    f += value.substr(2, 1) == "1" ? "2" : "";
    f += value.substr(3, 1) == "1" ? "3" : "";

    lzm_chatPollServer.ticketFilterStatus = f;

    if(_initPoll)
        toggleTicketFilter();
}

function toggleTicketFilter() {

    var ticketFetchTime = lzm_chatServerEvaluation.ticketFetchTime;
    lzm_chatServerEvaluation.expectTicketChanges = true;
    lzm_chatPollServer.stopPolling();
    lzm_chatPollServer.ticketPage = 1;
    lzm_chatPollServer.resetTickets = true;
    lzm_chatPollServer.startPolling();
    switchTicketListPresentation(ticketFetchTime, 0);
}

function addTicketToWatchList(_ticketId,_operatorId){
    var selTickets = $('tr.ticket-list-row.selected-table-line'),toAdd=[];
    selTickets.each(function()
    {
        toAdd.push({id: $(this).attr('id').replace('ticket-list-row-',''),operatorId: _operatorId});
    });
    lzm_chatUserActions.addTicketToWatchList(toAdd);
}

function removeTicketFromWatchList(_ticketId){
    var selTickets = $('tr.ticket-list-row.selected-table-line'),toRemove=[];
    selTickets.each(function()
    {
        toRemove.push({id: $(this).attr('id').replace('ticket-list-row-','')});
    });
    lzm_chatUserActions.removeTicketFromWatchList(toRemove);
}

function mergeTickets(){
    var selTickets = $('tr.ticket-list-row.selected-table-line'),toMerge=[],objList=[],i;
    if(selTickets.length>=2){
        selTickets.each(function()
        {
            toMerge.push($(this).attr('id').replace('ticket-list-row-',''));
        });

        function stid(a, b){
            return ((a > b) ? -1 : ((a < b) ? 1 : 0));
        }

        toMerge.sort(stid);

        for(i=1;i<selTickets.length;i++)
            lzm_chatPollServer.pollServerSpecial({fo: 'ticket', so: 'ticket', fid: toMerge[0], sid: toMerge[i]}, 'link-ticket');
    }
}

/**************************************** Archive functions ****************************************/
function pageArchiveList(page) {
    $('.archive-list-page-button').addClass('ui-disabled');
    lzm_chatPollServer.stopPolling();
    var archiveFetchTime = lzm_chatServerEvaluation.archiveFetchTime;
    lzm_chatServerEvaluation.expectArchiveChanges = true;
    lzm_chatPollServer.chatArchivePage = page;
    lzm_chatPollServer.resetChats = true;
    lzm_chatPollServer.startPolling();
    switchArchivePresentation(archiveFetchTime, 0);
}

function searchArchive(searchString) {
    $('.archive-list-page-button').addClass('ui-disabled');
    var archiveFetchTime = lzm_chatServerEvaluation.archiveFetchTime;
    lzm_chatPollServer.chatArchiveQuery = searchString.replace(/^ +/, '').replace(/ +$/, '').toLowerCase();
    lzm_chatPollServer.chatArchivePage = 1;
    lzm_chatPollServer.chatArchiveFilter = '012';
    lzm_chatPollServer.resetChats = true;
    lzm_chatPollServer.pollServer();
    switchArchivePresentation(archiveFetchTime, 0);
}

function openArchiveFilterMenu(e, filter) {
    filter = (filter != '') ? filter : lzm_chatPollServer.chatArchiveFilter;
    e.stopPropagation();
    if (lzm_chatDisplay.showArchiveFilterMenu) {
        removeArchiveFilterMenu();
    } else {
        var parentOffset = $('#archive-filter').offset();
        var xValue = parentOffset.left;
        var yValue = parentOffset.top + 25;
        lzm_chatDisplay.showArchiveFilterMenu = true;
        lzm_chatDisplay.showContextMenu('archive-filter', {filter: filter}, xValue, yValue);
        e.preventDefault();
    }
}

function showArchivedChat(cpId, cpName, chatId, chatType) {

    if (chatType == 1)
        showVisitorInfo(cpId, cpName, chatId, 5);
    else
    {
        var storedDialogId = '';
        for (var key in lzm_chatDisplay.StoredDialogs) {
            if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
                if ((lzm_chatDisplay.StoredDialogs[key].type == 'matching-chats' || lzm_chatDisplay.StoredDialogs[key].type == 'send-transcript-to-body') &&
                    typeof lzm_chatDisplay.StoredDialogs[key].data['cp-id'] != 'undefined' &&
                    lzm_chatDisplay.StoredDialogs[key].data['cp-id'] == cpId) {
                    storedDialogId = key;
                    if (typeof lzm_chatDisplay.StoredDialogs[key + '-transcript'] != 'undefined')
                        storedDialogId = key + '-transcript';
                    if (typeof lzm_chatDisplay.StoredDialogs[key + '_linker'] != 'undefined')
                        storedDialogId = key + '_linker';
                }
            }
        }
        if (storedDialogId != '')
            lzm_displayHelper.maximizeDialogWindow(storedDialogId);
        else
        {
            var customFilter = {};
            customFilter.chatArchivePage = 1;
            customFilter.chatArchiveLimit = 1000;
            customFilter.chatArchiveQuery = '';
            customFilter.chatArchiveFilter = '';
            customFilter.customDemandToken = cpId;

            if (chatType == 0)
                customFilter.chatArchiveFilterInternal = cpId;
            else
                customFilter.chatArchiveFilterGroup = cpId;

            lzm_chatPollServer.customFilters.push(customFilter);
            lzm_chatPollServer.resetChats = true;
            lzm_chatDisplay.archiveDisplay.showArchivedChat(cpId, cpName, chatId, chatType, 'd-'+cpId);

            lzm_chatPollServer.pollServer();
        }
    }
}

function selectArchivedChat(chatId, inDialog, elementId) {
    chatId = (!d(chatId)) ? '' : chatId;
    var thisChat = {}, chatHtml='', i = 0;
    if (inDialog)
    {

        $('.archive-list-'+elementId+'-line').removeClass('selected-table-line');
        $('#dialog-archive-list-'+elementId+'-line-' + chatId).addClass('selected-table-line');
        $('#archive-list-'+elementId+'-line-' + chatId).addClass('selected-table-line');
        $('#matching-chats-'+elementId+'-table').data('selected-chat-id', chatId);

        try {

        var userid = elementId.replace('d-','').replace('e-','');
        for (i=0; i<lzm_chatDisplay.archiveControlChats[userid].length; i++)
            if (lzm_chatDisplay.archiveControlChats[userid][i].cid == chatId)
                thisChat = lzm_chatDisplay.archiveControlChats[userid][i];

            chatHtml = '<div style="margin-left: -10px;">' + thisChat.chtml.replace(/\.\/images\//g, 'img/') + '</div>';

            if (chatId != '')
                $('#create-ticket-from-chat-'+ elementId).removeClass('ui-disabled');

            chatHtml = lzm_commonTools.replaceLinksInChatView(chatHtml);
            $('#chat-content-'+elementId+'-inner').html(chatHtml);


        } catch(e) {}
    }
    else
    {
        for (i=0; i<lzm_chatServerEvaluation.chatArchive.chats.length; i++){
            if(chatId=='')
                chatId = lzm_chatServerEvaluation.chatArchive.chats[i].cid;
            if (lzm_chatServerEvaluation.chatArchive.chats[i].cid == chatId)
                thisChat = lzm_chatServerEvaluation.chatArchive.chats[i];
        }

        $('.archive-list-line').removeClass('selected-table-line');
        $('#archive-list-line-' + chatId).addClass('selected-table-line');

        try {
            chatHtml = '<div style="margin-left: -10px;">' + thisChat.chtml.replace(/\.\/images\//g, 'img/') + '</div>';
        } catch(e) {}

        chatHtml = lzm_commonTools.replaceLinksInChatView(chatHtml);

        if(lzm_displayHelper.matchSearch($('#search-archive').val(),chatHtml)){
            var regEx = new RegExp($('#search-archive').val(), "ig");
            chatHtml = chatHtml.replace(regEx, '<span class="search-match">'+$('#search-archive').val()+'</span>');
        }

        $('#archive-list-right').html(chatHtml);

    }
}

function removeArchiveFilterMenu() {
    lzm_chatDisplay.showArchiveFilterMenu = false;
    $('#archive-filter-context').remove();
}

function toggleArchiveFilter(filter, e) {

    e.stopPropagation();
    $('.archive-list-page-button').addClass('ui-disabled');
    //lzm_chatPollServer.stopPolling();
    var archiveFetchTime = lzm_chatServerEvaluation.archiveFetchTime;
    lzm_chatServerEvaluation.expectArchiveChanges = true;
    removeArchiveFilterMenu();

    var filterList = lzm_chatPollServer.chatArchiveFilter.split('');
    if ($.inArray(filter.toString(), filterList) != -1) {
        var pattern = new RegExp(filter.toString());
        lzm_chatPollServer.chatArchiveFilter = lzm_chatPollServer.chatArchiveFilter.replace(pattern, '');
    } else {
        filterList.push(filter);
        filterList.sort();
        lzm_chatPollServer.chatArchiveFilter = filterList.join('');
    }
    if (lzm_chatPollServer.chatArchiveFilter == '') {
        lzm_chatPollServer.chatArchiveFilter = '012';
    }

    switchArchivePresentation(archiveFetchTime, 0);
    lzm_chatPollServer.resetChats = true;
    lzm_chatPollServer.chatArchivePage = 1;
    lzm_chatPollServer.pollServer();
}

function switchArchivePresentation(archiveFetchTime, counter) {
    var loadingHtml;
    if (counter == 0) {
        if ($('#matching-chats-table').length == 0) {

            $('#chat-archive-table tbody').empty();
            loadingHtml = '<div id="archive-loading"><div class="lz_anim_loading"></div></div>';
            $('#archive-body').append(loadingHtml).trigger('create');
            $('#archive-loading').css({position: 'absolute',left:0,top:0,bottom:0,right:0,'background-color': '#ffffff','z-index': 1000, opacity: 0.85});
        } else {
            loadingHtml = '<div id="matching-archive-loading"><div class="lz_anim_loading"></div></div>';
            $('#visitor-info-placeholder-content-5').append(loadingHtml).trigger('create');
            $('#matching-archive-loading').css({position: 'absolute', left:0,top:0,bottom:0,right:0,'background-color': '#ffffff','z-index': 1000, opacity: 0.85});
        }
    }
    if (archiveFetchTime != lzm_chatServerEvaluation.archiveFetchTime || counter >= 40) {
        if ($('#matching-chats-table').length == 0) {
            lzm_chatDisplay.archiveDisplay.createArchive();
            $('#archive-loading').remove();
            selectArchivedChat();
        } else {
            $('#matching-archive-loading').remove();
            selectArchivedChat($('#matching-chats-table').data('selected-chat-id'), true);
        }
    } else {
        counter++;
        var delay = (counter <= 5) ? 200 : (counter <= 11) ? 500 : (counter <= 21) ? 1000 : 2000;
        setTimeout(function() {switchArchivePresentation(archiveFetchTime, counter);}, delay);
    }
}

function openArchiveListContextMenu(e, chatId, elementId) {
    e.preventDefault();
    selectArchivedChat(chatId, false, elementId);
    if (lzm_chatDisplay.showArchiveListContextMenu) {
        removeArchiveListContextMenu();
    } else {
        var archivedChat = null;
        for (var i=0; i<lzm_chatServerEvaluation.chatArchive.chats.length; i++) {
            if (lzm_chatServerEvaluation.chatArchive.chats[i].cid == chatId) {
                archivedChat = lzm_commonTools.clone(lzm_chatServerEvaluation.chatArchive.chats[i]);
            }
        }
        if (archivedChat != null) {
            lzm_chatDisplay.showArchiveListContextMenu = true;
            e.stopPropagation();
            var parentOffset = $('#archive-body').offset();

            var xValue = e.pageX - parentOffset.left + $('#ticket-history-placeholder-content-0').scrollLeft();
            var yValue = e.pageY - parentOffset.top + $('#ticket-history-placeholder-content-0').scrollTop();

            lzm_chatDisplay.showContextMenu('archive', archivedChat, xValue, yValue);
        }
    }
}

function removeArchiveListContextMenu() {
    lzm_chatDisplay.showArchiveListContextMenu = false;
    $('#archive-context').remove();
}

function sendChatTranscriptTo(chatId, dialogId, windowId, dialogData) {
    lzm_chatDisplay.archiveDisplay.sendChatTranscriptTo(chatId, dialogId, windowId, dialogData);
}

function printArchivedChat(chatId) {
    removeArchiveListContextMenu();
    if (lzm_chatDisplay.isApp || lzm_chatDisplay.isMobile) {
        showNotMobileMessage();
    } else {
        var myChat = null;
        for (var i=0; i<lzm_chatServerEvaluation.chatArchive.chats.length; i++) {
            if (lzm_chatServerEvaluation.chatArchive.chats[i].cid == chatId) {
                myChat = lzm_chatServerEvaluation.chatArchive.chats[i];
            }
        }
        if (myChat != null) {
            lzm_commonTools.printContent('chat', {chat: myChat});
        }
    }
}

/**************************************** Report functions ****************************************/
function pageReportList(page) {
    $('#report-list-table').data('selected-report', '');
    $('.report-list-page-button').addClass('ui-disabled');
    $('#report-filter').addClass('ui-disabled');
    var reportFetchTime = lzm_chatServerEvaluation.reportFetchTime;
    lzm_chatServerEvaluation.expectReportChanges = true;
    lzm_chatPollServer.stopPolling();
    lzm_chatPollServer.reportPage = page;
    lzm_chatPollServer.resetReports = true;
    lzm_chatPollServer.startPolling();
    switchReportListPresentation(reportFetchTime, 0);
}

function switchReportListPresentation(reportFetchTime, counter) {
    var loadingHtml, myWidth, myHeight;
    if (counter == 0) {
        loadingHtml = '<div id="report-list-loading"><div class="lz_anim_loading"></div></div>';
        $('#report-list-body').append(loadingHtml).trigger('create');
        myWidth = $('#report-list-body').width() + 28;
        myHeight = $('#report-list-body').height() + 48;
        $('#report-list-loading').css({position:'absolute',left:0,top:0,bottom:0,right:0,'background-color': '#ffffff','z-index': 1000, opacity: 0.85});
    }
    if (reportFetchTime != lzm_chatServerEvaluation.reportFetchTime || counter >= 40) {
        lzm_chatDisplay.reportsDisplay.createReportList();
    } else {
        counter++;
        var delay = (counter <= 5) ? 200 : (counter <= 11) ? 500 : (counter <= 21) ? 1000 : 2000;
        setTimeout(function() {switchReportListPresentation(reportFetchTime, counter);}, delay);
    }
}

function openReportContextMenu(e, reportId, canBeReCalculated) {
    e.stopPropagation();
    e.preventDefault();
    removeReportFilterMenu();
    selectReport(reportId);
    if (lzm_chatDisplay.showReportContextMenu) {
        removeReportContextMenu();
    } else {
        var scrolledDownY, scrolledDownX, parentOffset;
        var place = 'report-list';
        scrolledDownY = $('#' + place +'-body').scrollTop();
        scrolledDownX = $('#' + place +'-body').scrollLeft();
        parentOffset = $('#' + place +'-body').offset();
        var xValue = e.pageX - parentOffset.left + scrolledDownX;
        var yValue = e.pageY - parentOffset.top + scrolledDownY;

        var report = lzm_chatServerEvaluation.reports.getReport(reportId);
        report.canBeReCalculated = canBeReCalculated;
        if (report != null) {
            lzm_chatDisplay.showReportContextMenu = true;
            lzm_chatDisplay.showContextMenu(place, report, xValue, yValue);
        }
    }
}

function openReportFilterMenu(e) {
    var filter = lzm_chatPollServer.reportFilter;
    e.stopPropagation();
    if (lzm_chatDisplay.showReportFilterMenu) {
        removeReportFilterMenu();
    } else {
        var parentOffset = $('#report-filter').offset();
        var xValue = parentOffset.left + 10;
        var yValue = parentOffset.top + 25;
        lzm_chatDisplay.showReportFilterMenu = true;
        lzm_chatDisplay.showContextMenu('report-filter', {filter: filter}, xValue, yValue);
        e.preventDefault();
    }
}

function removeReportFilterMenu() {
    lzm_chatDisplay.showReportFilterMenu = false;
    $('#report-filter-context').remove();
}

function removeReportContextMenu() {
    lzm_chatDisplay.showReportContextMenu = false;
    $('#report-list-context').remove();
}

function selectReport(reportId) {
    $('#report-list-table').data('selected-report', reportId);
    $('.report-list-line').removeClass('selected-table-line');
    $('#report-list-line-' + reportId).addClass('selected-table-line');
}

function recalculateReport(reportId) {
    removeReportContextMenu();
    if (!lzm_commonPermissions.checkUserPermissions(lzm_chatDisplay.myId, 'reports', 'recalculate', {})) {
        showNoPermissionMessage();
    } else {
        var report = lzm_chatServerEvaluation.reports.getReport(reportId);
        if (report != null) {
            lzm_chatPollServer.pollServerSpecial({year: report.y, month: report.m, day: report.d, time: report.t, mtime: report.mt}, 'recalculate-report');
        }
    }
}

function loadReport(reportId, type) {
    var report = lzm_chatServerEvaluation.reports.getReport(reportId);
    if (report != null) {
        var reportUrl = lzm_chatServerEvaluation.chosen_profile.server_protocol + lzm_chatServerEvaluation.chosen_profile.server_url;
        if (type == 'report') {
            reportUrl += '/report.php?h=' + report.i + '&y=' + report.y + '&m=' + report.m + '&d=' + report.d;
            if (multiServerId != '') {
                reportUrl += '&ws=' + multiServerId;
            }
        } else if (type == 'visitors') {
            reportUrl += '/report.php?h=' + report.i + '&y=' + report.y + '&m=' + report.m + '&d=' + report.d + '&u=1';
            if (multiServerId != '') {
                reportUrl += '&ws=' + multiServerId;
            }
        }
        openLink(reportUrl);
    }
}

function toggleReportFilter(filter, e) {
    e.stopPropagation();
    $('.report-list-page-button').addClass('ui-disabled');
    $('#report-filter').addClass('ui-disabled');
    lzm_chatPollServer.stopPolling();
    var reportFetchTime = lzm_chatServerEvaluation.reportFetchTime;
    lzm_chatServerEvaluation.expectReportChanges = true;
    removeReportFilterMenu();
    lzm_chatPollServer.reportFilter = filter;
    lzm_chatPollServer.reportPage = 1;
    lzm_chatPollServer.startPolling();
    lzm_chatPollServer.resetReports = true;
    switchReportListPresentation(reportFetchTime, 0);
}

/**************************************** Operator and group functions ****************************************/
function createDynamicGroup() {
    if (lzm_commonPermissions.checkUserPermissions(lzm_chatDisplay.myId, 'group', '', {o: lzm_chatDisplay.myId}))
        lzm_chatDisplay.createDynamicGroup();
    else
        showNoPermissionMessage();
}

function saveNewDynamicGroup() {
    var newGroupName = $('#new-dynamic-group-name').val().replace(/^ */, '').replace(/ *$/, '');
    lzm_chatDisplay.doNotUpdateOpList = false;
    if (newGroupName != '') {
        lzm_chatUserActions.saveDynamicGroup('create', '', newGroupName, '');
    } else {
        $('#operator-list-line-new-' + lzm_chatDisplay.newDynGroupHash).remove();
        lzm_chatDisplay.createOperatorList();
    }
}

function deleteDynamicGroup(id) {
    var group = lzm_chatServerEvaluation.groups.getGroup(id);
    if (group != null && typeof group.members != 'undefined') {
        if (lzm_commonPermissions.checkUserPermissions(lzm_chatDisplay.myId, 'group', '', group))
        {
            lzm_commonDialog.createAlertDialog(tid('remove_items'), [{id: 'ok', name: t('Ok')}, {id: 'cancel', name: t('Cancel')}]);
            $('#alert-btn-ok').click(function()
            {
                lzm_commonDialog.removeAlertDialog();
                lzm_chatUserActions.saveDynamicGroup('delete', id, '', '');
                lzm_chatServerEvaluation.groups.setGroupProperty(id, 'is_active', false);
                if (lzm_chatDisplay.selected_view == 'internal')
                    lzm_chatDisplay.createOperatorList();
                else if (lzm_chatDisplay.selected_view == 'mychats')
                    lzm_chatDisplay.createActiveChatPanel(false, true);
            });
            $('#alert-btn-cancel').click(function() {
                lzm_commonDialog.removeAlertDialog();
            });
        }
        else
            showNoPermissionMessage();
    }
}

function getDynamicGroupURL(id) {
    var URL = lzm_chatServerEvaluation.getServerUrl('chat.php') + '?edg=' + lz_global_base64_url_encode(id);
    var urlBox = lzm_inputControls.createArea('dyn-group-url', '', '','URL:','width:300px;height:80px;');
    lzm_commonDialog.createAlertDialog(urlBox, [{id: 'ok', name: tid('ok')}],null,null,true);
    $('#dyn-group-url').val(URL);
    $('#dyn-group-url').select();
    $('#alert-btn-ok').click(function() {
        lzm_commonDialog.removeAlertDialog();
    });
}

function addToDynamicGroup(id, browserId, chatId) {
    if (lzm_commonPermissions.checkUserPermissions(lzm_chatDisplay.myId, 'group', '', {o: lzm_chatDisplay.myId})) {
        var activeUserChat = lzm_chatServerEvaluation.userChats.getUserChat(lzm_chatDisplay.active_chat_reco);
        if (lzm_chatDisplay.selected_view == 'mychats' && activeUserChat != null) {
            saveChatInput(lzm_chatDisplay.active_chat_reco);
            removeEditor();
        }
        lzm_chatDisplay.addToDynamicGroup(id, browserId, chatId);

        if(lzm_commonTools.GetElementByProperty(lzm_chatDisplay.publicGroupChats,'bid',browserId).length){
            lzm_commonTools.GetElementByProperty(lzm_chatDisplay.publicGroupChats,'bid',browserId)[0].rem=false;
            lzm_chatDisplay.createActiveChatPanel(false, false, false);
        }
    }
    else
        showNoPermissionMessage();
}

function addressChatMember(id,name){
    saveChatInput(id, "<i>@" + lz_global_base64_decode(name) + '</i>&nbsp;');
    //openLastActiveChat();
}

function removeFromDynamicGroup(id, groupId) {
    if (lzm_commonPermissions.checkUserPermissions(lzm_chatDisplay.myId, 'group', '', lzm_chatServerEvaluation.groups.getGroup(groupId))) {
        var browserId = '', isGroupOwner = false;
        if (id.indexOf('~') != -1) {
            browserId = id.split('~')[1];
            id = id.split('~')[0];
        }
        var group = lzm_chatServerEvaluation.groups.getGroup((groupId));
        if (group != null && group.o == id)
            isGroupOwner = true;

        if (!isGroupOwner) {
            lzm_chatUserActions.saveDynamicGroup('remove', groupId, '', id, {browserId: browserId});
            var visitorBrowser = lzm_chatServerEvaluation.visitors.getChatBrowser(id,browserId,false);
            if(visitorBrowser != null && visitorBrowser.chat.dgr.length>0)
                visitorBrowser.chat.dgr = '';

            if(lzm_commonTools.GetElementByProperty(lzm_chatDisplay.publicGroupChats,'bid',browserId).length)
            {
                lzm_commonTools.GetElementByProperty(lzm_chatDisplay.publicGroupChats,'bid',browserId)[0].rem=true;
                lzm_chatDisplay.createActiveChatPanel(false, false, false);
            }
        }
        else
        {
            var alertText =  t('The owner of a group must be member of the group.');
            lzm_commonDialog.createAlertDialog(alertText, [{id: 'ok', name: t('Ok')}]);
            $('#alert-btn-ok').click(function() {
                lzm_commonDialog.removeAlertDialog();
            });
        }
    } else
        showNoPermissionMessage();
}

function selectDynamicGroup(groupId) {
    $('.dynamic-group-line').removeClass('selected-table-line');
    $('#dynamic-group-line-' + groupId).addClass('selected-table-line');
    $('#dynamic-group-table').data('selected-group', groupId);
}

function openOperatorListContextMenu(e, type, id, lineId, groupId, lineCounter) {
    e.stopPropagation();
    var chatPartner = null, browser = {};
    switch (type) {
        case 'group':
            if (id != 'everyoneintern') {
                chatPartner = lzm_chatServerEvaluation.groups.getGroup(id);
            } else {
                chatPartner = {id: id, name: t('All operators')};
            }
            break;
        case 'operator':
            chatPartner = lzm_chatServerEvaluation.operators.getOperator(id);
            break;
        case 'visitor':
            chatPartner = lzm_chatServerEvaluation.visitors.getVisitor(id.split('-')[0]);
            if (typeof chatPartner.b != 'undefined') {
                for (var i=0; i<chatPartner.b.length; i++)
                    if (chatPartner.b[i].id == id.split('~')[1])
                        browser = chatPartner.b[i];
            }
            else
                browser = {id: ''};

            break;
    }
    if (chatPartner != null) {
        selectOperatorLine(lineId, lineCounter, e);
        var scrolledDownY = $('#operator-list-body').scrollTop();
        var scrolledDownX = $('#operator-list-body').scrollLeft();
        var parentOffset = $('#operator-list-body').offset();
        var yValue = e.pageY - parentOffset.top + scrolledDownY;
        var xValue = e.pageX - parentOffset.left + scrolledDownX;
        lzm_chatDisplay.showContextMenu('operator-list', {type: type, 'chat-partner': chatPartner, groupId: groupId,
            'browser': browser, 'line-id': lineId}, xValue, yValue);
    }
    e.preventDefault();
}

function selectInviteOperatorLine(lineId) {
    $('#forward-receiver-table tr.selected-table-line').removeClass('selected-table-line');
    $('#' + lineId).addClass('selected-table-line');
}

function selectOperatorLine(lineId, lineCounter, sysid, userid, name, fromOpList) {

    try {
        name = lz_global_base64_url_decode(name);
        var now = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
        var internalChatsAreDisabled = (lzm_chatDisplay.myGroups.length > 0);
        for (var i=0; i<lzm_chatDisplay.myGroups.length; i++) {
            var myGr = lzm_chatServerEvaluation.groups.getGroup(lzm_chatDisplay.myGroups[i]);
            if (myGr != null && (typeof myGr.internal == 'undefined' || myGr.internal == '1'))
                internalChatsAreDisabled = false;

        }
        if (!internalChatsAreDisabled && !lzm_chatDisplay.isMobile && !lzm_chatDisplay.isApp && lastOpListClick[0] == lineId && now - lastOpListClick[1] < 500 &&
            d(userid) && d(name) && d(fromOpList)) {

            chatInternalWith(sysid, userid, name, fromOpList)
        } else {
            lastOpListClick = [lineId, now];
            lzm_chatDisplay.m_OperatorsListSelectedLine = lineCounter;
            setTimeout(function() {
                $('.operator-list-line').removeClass('selected-table-line');
                $('#' + lineId).addClass('selected-table-line');
            }, 1);
        }
    } catch(ex) {}
}

function removeOperatorListContextMenu() {
    $('#operator-list-context').remove();
    //lzm_chatDisplay.createOperatorList();
}

function openChatMemberContextMenu(e, id, groupId, userId, browserId, chatId) {
    e.stopPropagation();
    selectChatMemberLine(id, groupId);
    var scrolledDownY = $('#chat-container').scrollTop();
    var scrolledDownX = $('#chat-container').scrollLeft();
    var parentOffset = $('#chat-container').offset();
    var yValue = e.pageY - parentOffset.top + scrolledDownY-10;
    var xValue = e.pageX - parentOffset.left + scrolledDownX+30;
    lzm_chatDisplay.showContextMenu('chat-members', {groupId: groupId, userId: userId, browserId: browserId, chatId: chatId, parent: 'chat-table'}, xValue, yValue);
    e.preventDefault();
}

function selectChatMemberLine(lineId, groupId){
    removeChatMembersListContextMenu();
    $('.'+groupId).removeClass('selected-chat-member-div');
    $('#'+lineId).addClass('selected-chat-member-div');
}

function removeChatMembersListContextMenu() {
    $('#chat-members-context').remove();
}

function disableInternalChat(chatId) {
    var userChat = lzm_chatServerEvaluation.userChats.getUserChat(chatId);
    if (userChat != null) {
        var tmpArray = [];
        for (var i=0; i<lzm_chatServerEvaluation.myDynamicGroups.length; i++) {
            if (lzm_chatServerEvaluation.myDynamicGroups[i] != chatId) {
                tmpArray.push(lzm_chatServerEvaluation.myDynamicGroups[i]);
            }
        }
        lzm_chatServerEvaluation.myDynamicGroups = tmpArray;
        lzm_chatServerEvaluation.userChats.setUserChat(chatId, {status: 'left'});
        if (lzm_chatDisplay.active_chat_reco == chatId) {
            var group = lzm_chatServerEvaluation.groups.getGroup(chatId);
            if (group != null) {
                chatInternalWith(group.id, group.id, group.name);
            }
        }
    }
}

function toggleIndividualGroupStatus(groupId, action) {
    lzm_chatDisplay.newGroupsAway = (lzm_chatDisplay.newGroupsAway != null) ?
        lzm_commonTools.clone(lzm_chatDisplay.newGroupsAway) :
        (lzm_chatDisplay.myGroupsAway != null) ? lzm_commonTools.clone(lzm_chatDisplay.myGroupsAway) : [];
    if (action == 'add') {
        if ($.inArray(groupId, lzm_chatDisplay.newGroupsAway) == -1) {
            lzm_chatDisplay.newGroupsAway.push(groupId);
        }
    } else {
        var tmpArray = [];
        for (var i=0;i<lzm_chatDisplay.newGroupsAway.length; i++) {
            if (lzm_chatDisplay.newGroupsAway[i] != groupId) {
                tmpArray.push(lzm_chatDisplay.newGroupsAway[i]);
            }
        }
        lzm_chatDisplay.newGroupsAway = lzm_commonTools.clone(tmpArray);
    }
    lzm_chatServerEvaluation.operators.setOperatorProperty(lzm_chatDisplay.myId, 'groupsAway', lzm_chatDisplay.newGroupsAway);
    removeOperatorListContextMenu();
}

function signOffOperator(operatorId) {
    if (lzm_chatServerEvaluation.operators.getOperator(lzm_chatDisplay.myId).level == 1) {
        var operator = lzm_chatServerEvaluation.operators.getOperator(operatorId);
        if (operator != null)
            lzm_chatPollServer.pollServerSpecial({oid: operator.id, ouid: operator.userid}, 'operator-sign-off');
    }
    else
        showNoAdministratorMessage();
}

/**************************************** Editor functions ****************************************/
function initEditor(myText, caller, cpId) {
    cpId = (typeof cpId != 'undefined' && cpId != '') ? cpId : lzm_chatDisplay.active_chat_reco
    if ((app == 1) || isMobile)
    {
        setEditorContents(myText)
    }
    else
    {
        chatMessageEditorIsPresent = true;
        lzm_chatInputEditor.init(myText, 'initEditor_' + caller, cpId);
    }
}

function removeEditor() {
    if ((app == 1) || isMobile)
    {
        // do nothing here
    }
    else
    {
        chatMessageEditorIsPresent = false;
        lzm_chatInputEditor.removeEditor();
    }
}

function setFocusToEditor() {
    if ((app == 1) || isMobile) {
        $('#chat-input').focus();
    }
}

function grabEditorContents() {
    if ((app == 1) || isMobile) {
        return $('#chat-input').val();
    } else {
        return lzm_chatInputEditor.grabHtml();
    }
}

function setEditorContents(myText) {
    if ((app == 1) || isMobile) {
        $('#chat-input').val(myText)
    } else {
        lzm_chatInputEditor.setHtml(myText)
    }
}

function clearEditorContents(os, browser, caller) {
    if ((app == 1) || isMobile) {
        if (appOs != 'blackberry') {
            $('#chat-input').val('');
        } else if (typeof caller != 'undefined' && caller == 'send') {
            var activeChat = lzm_chatDisplay.active_chat_reco, cpId = '', cpUserId = '', cpName = '', cpChatId = '';
            var operator = lzm_chatServerEvaluation.operators.getOperator(activeChat);
            var group = lzm_chatServerEvaluation.groups.getGroup(activeChat);
            var visitorBrowser = lzm_chatServerEvaluation.visitors.getVisitorBrowser(activeChat);
            if (activeChat == 'everyoneintern')
            {
                cpId = activeChat; cpUserId = activeChat; cpName = t('All operators');
            }
            else if (operator != null)
            {
                cpId = operator.id; cpUserId = operator.userid; cpName = operator.name;
            }
            else if(group != null)
            {
                cpId = group.id; cpUserId = group.id; cpName = group.name;
            }
            else if (visitorBrowser[1] != null)
            {
                cpId = visitorBrowser[0].id; cpUserId = visitorBrowser[1].id; cpChatId = visitorBrowser[1].chat.id;
            }
            chatInternalWith('', '', '');
            saveChatInput(activeChat, null);
            if (cpChatId == '')
                chatInternalWith(cpId, cpUserId, cpName);
            else
                viewUserData(cpId, cpUserId, cpChatId, true);

        }
    }
    else
        lzm_chatInputEditor.clearEditor(os, browser);
}

function setEditorDisplay(myDisplay) {

    if ((app == 1) || isMobile) {
        $('#chat-input').css({display: myDisplay});
    } else {
        $('#chat-input-body').css({display: myDisplay});
    }
}

function moveCaretToEnd(el) {
    if (typeof el.selectionStart == "number") {
        el.selectionStart = el.selectionEnd = el.value.length;
    } else if (typeof el.createTextRange != "undefined") {
        el.focus();
        var range = el.createTextRange();
        range.collapse(false);
        range.select();
    }
}

function insertAtCursor(myField, myValue) {
    myField = document.getElementById(myField);
    //IE support
    if (document.selection) {
        myField.focus();
        var sel = document.selection.createRange();
        sel.text = myValue;
    }
    //MOZILLA and others
    else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myField.value = myField.value.substring(0, startPos)
            + myValue
            + myField.value.substring(endPos, myField.value.length);
    } else {
        myField.value += myValue;
    }
}

/**************************************** Geotracking map functions ****************************************/
var lzmMessageReceiver = null;

function setMapType(myType) {
    lzm_chatGeoTrackingMap.setMapType(myType);
    var buttonId = myType.toLowerCase() + '-map';
    lzm_chatGeoTrackingMap.selectedMapType = myType;
    $('#geotracking-footline').html(lzm_displayHelper.createGeotrackingFootline());
}

function zoomMap(direction) {
    lzm_chatGeoTrackingMap.zoom(direction);
}

/**************************************** Some stuff done on load of the chat page ****************************************/
$(document).ready(function () {
    try {
        runningInIframe = (window.self !== window.top);
    } catch (e) {}
    lzm_displayHelper = new ChatDisplayHelperClass();
    lzm_inputControls = new CommonInputControlsClass();
    lzm_displayLayout = new ChatDisplayLayoutClass();
    getCredentials();
    lzm_displayHelper.blockUi({message: null});

    // initiate lzm class objects
    if ((app == 1) && typeof lzm_deviceInterface == 'undefined') {
        if (appOs == 'windows') {
            lzm_deviceInterface = new CommonWindowsDeviceInterfaceClass();
        } else {
            lzm_deviceInterface = new CommonDeviceInterfaceClass();
        }
    }
    if (app == 1) {
        var tmpDeviceId = lzm_deviceInterface.loadDeviceId();
        if (tmpDeviceId != 0) {
            deviceId = tmpDeviceId;
        }
    }
    if (app == 1 || isMobile) {
        var chatInputTextArea = document.getElementById("chat-input");
        chatInputTextArea.onfocus = function() {
            moveCaretToEnd(chatInputTextArea);
            // Work around Chrome's little problem
            window.setTimeout(function() {
                moveCaretToEnd(chatInputTextArea);
            }, 1);
        };
    }
    lzm_commonConfig = new CommonConfigClass();
    lzm_commonTools = new CommonToolsClass();
    lzm_commonPermissions = new CommonPermissionClass();
    lzm_commonStorage = new CommonStorageClass(localDbPrefix, (app == 1));
    lzm_chatTimeStamp = new ChatTimestampClass(0);
    var userConfigData = {
        userVolume: chosenProfile.user_volume,
        awayAfter: (typeof chosenProfile.user_away_after != 'undefined') ? chosenProfile.user_away_after : 0,
        playIncomingMessageSound: (typeof chosenProfile.play_incoming_message_sound != 'undefined') ? chosenProfile.play_incoming_message_sound : 0,
        playIncomingChatSound: (typeof chosenProfile.play_incoming_chat_sound != 'undefined') ? chosenProfile.play_incoming_chat_sound : 0,
        repeatIncomingChatSound: (typeof chosenProfile.repeat_incoming_chat_sound != 'undefined') ? chosenProfile.repeat_incoming_chat_sound : 0,
        playIncomingTicketSound: (typeof chosenProfile.play_incoming_ticket_sound != 'undefined') ? chosenProfile.play_incoming_ticket_sound : 0,
        language: (typeof chosenProfile.language != 'undefined') ? chosenProfile.language : 'en',
        backgroundMode: (typeof chosenProfile.background_mode != 'undefined') ? chosenProfile.background_mode : 1
    };
    lzm_chatInputEditor = new ChatEditorClass('chat-input', isMobile, (app == 1), (web == 1));
    lzm_chatDisplay = new ChatDisplayClass(lzm_chatTimeStamp.getServerTimeString(), lzm_commonConfig, lzm_commonTools, lzm_chatInputEditor, (web == 1), (app == 1), isMobile, messageTemplates, userConfigData, multiServerId);
    lzm_commonDialog = new CommonDialogClass();
    lzm_chatServerEvaluation = new ChatServerEvaluationClass(lzm_commonTools, chosenProfile, lzm_chatTimeStamp);
    lzm_chatPollServer = new ChatPollServerClass(lzm_commonConfig, lzm_commonTools, lzm_chatDisplay, lzm_chatServerEvaluation, lzm_commonStorage, chosenProfile, userStatus, web, app, isMobile, multiServerId);
    lzm_t = new CommonTranslationClass(chosenProfile.server_protocol, chosenProfile.server_url, chosenProfile.mobile_dir, false, chosenProfile.language);
    lzm_t.setTranslationData(translationData);
    lzm_chatUserActions = new ChatUserActionsClass(lzm_commonTools, lzm_chatPollServer, lzm_chatDisplay, lzm_chatServerEvaluation, lzm_t, lzm_commonStorage, lzm_chatInputEditor, chosenProfile);
    lzm_chatGeoTrackingMap = new ChatGeotrackingMapClass();

    lzmMessageReceiver = function(_event) {
        /*
        if (typeof _event.data.cobrowse != 'undefined' && _event.data.cobrowse) {
            if (typeof _event.data.blocked != 'undefined') {

                var elementId = ($('#visitor-cobrowse-d-'+_event.data.vid+'-iframe').length) ? 'd' : 'e';
                iframeEnabled = true;
                //enableCobrowsingIframe(elementId+'-' + _event.data.vid);
                if (!_event.data.blocked) {

                    if (typeof _event.data.link_url != 'undefined') {

                        var targetUrl = _event.data.link_url;
                        var askBeforePushing = ($('#visitor-cobrowse-'+elementId+'-' + _event.data.vid+ '-iframe').data('action') == 1) ? 1 : 0;
                        var visitorBrowser = $('#visitor-cobrowse-'+elementId+'-' + _event.data.vid+ '-iframe').data('browser');
                        var selectedLanguage = $('#visitor-cobrowse-'+elementId+'-' + _event.data.vid+ '-iframe').data('language');
                        var pushTextGroup = (selectedLanguage.split('~')[1] == 'group') ?
                            (selectedLanguage.split('~').length > 2) ? lz_global_base64_url_decode(selectedLanguage.split('~')[2]) :
                            lzm_chatDisplay.myGroups[0] : '';
                        var pushTextUser = (selectedLanguage.split('~')[1] == 'user') ? lzm_chatDisplay.myId : '';
                        var pushText = lzm_chatUserActions.getChatPM(visitorBrowser.split('~')[0], visitorBrowser.split('~')[1],'wpm', selectedLanguage.split('~')[0].toUpperCase(), pushTextGroup, pushTextUser)['wpm'];
                        pushVisitorToWebsite(visitorBrowser, targetUrl, askBeforePushing, pushText, lzm_chatDisplay.myGroups[0], _event.data.has_target_blank);
                    }
                }
            }
        } else */if (_event.origin == lzm_chatGeoTrackingMap.receiver) {
            switch(_event.data.function) {
                case 'get-url':
                lzm_chatGeoTrackingMap.urlIsSet = true;
                    break;
                case 'get-visitor':
                    lzm_chatGeoTrackingMap.selectedVisitor = _event.data.params;
                    $('#visitor-list').data('selected-visitor', _event.data.params);
                    $('#geotracking-footline').html(lzm_displayHelper.createGeotrackingFootline());
                    break;
                case 'get-zoomlevel':
                    lzm_chatGeoTrackingMap.zoomLevel = _event.data.params;
                    break;
                default:
                    deblog('Unknown message received: ' + JSON.stringify(_event.data));
                    break;
            }
        }
    };
    if (window.addEventListener)
        window.addEventListener('message', lzmMessageReceiver, false);
    else
        window.attachEvent('onmessage', lzmMessageReceiver);
    lzm_chatServerEvaluation.setUserLanguage(lzm_t.language);
    lzm_chatDisplay.userLanguage = lzm_t.language;
    lzm_chatUserActions.userLanguage = lzm_t.language;

    if (lzm_chatDisplay.viewSelectArray.length == 0) {
        lzm_chatDisplay.viewSelectArray = [];
        var viewSelectIdArray = Object.keys(lzm_chatDisplay.allViewSelectEntries);
        for (var i=0; i<viewSelectIdArray.length; i++)
            lzm_chatDisplay.viewSelectArray.push({id: viewSelectIdArray[i], name: lzm_chatDisplay.allViewSelectEntries[viewSelectIdArray[i]].title, icon: lzm_chatDisplay.allViewSelectEntries[viewSelectIdArray[i]].icon});
    }
    lzm_chatDisplay.createMainMenuPanel();
    lzm_chatDisplay.createViewSelectPanel();
    lzm_chatDisplay.createChatWindowLayout(false);
    if (lzm_chatDisplay.mainTableColumns.visitor.length == 0) {
        lzm_displayHelper.fillColumnArray('visitor', 'general', []);
    }
    if (lzm_chatDisplay.mainTableColumns.archive.length == 0) {
        lzm_displayHelper.fillColumnArray('archive', 'general', []);
    }
    if (lzm_chatDisplay.mainTableColumns.ticket.length == 0) {
        lzm_displayHelper.fillColumnArray('ticket', 'general', []);
    }
    if (lzm_chatDisplay.mainTableColumns.allchats.length == 0) {
        lzm_displayHelper.fillColumnArray('allchats', 'general', []);
    }

    lzm_chatPollServer.pollServerlogin(lzm_chatPollServer.chosenProfile.server_protocol,
        lzm_chatPollServer.chosenProfile.server_url);

    fillStringsFromTranslation();
    ChatTicketClass.m_TicketChannels = [
        {key:'web',index:0,title:tid('web')},
        {key:'email',index:1,title:tid('email')},
        {key:'phone',index:2,title:tid('phone')},
        {key:'misc',index:3,title:tid('misc')},
        {key:'chat',index:4,title:tid('chat')},
        {key:'rating',index:5,title:tid('feedback')},
        {key:'facebook',index:6,title:tid('facebook')},
        {key:'twitter',index:7,title:tid('twitter')}
    ];

    ChatTicketClass.m_TicketStatuses = [
        {key:'open',index:0,title:tid('ticket_status_0')},
        {key:'in_progress',index:1,title:tid('ticket_status_1')},
        {key:'closed',index:2,title:tid('ticket_status_2')},
        {key:'deleted',index:3,title:tid('ticket_status_3')}
    ];

    mobile = (isMobile) ? 1 : 0;

    // do things on window resize
    $(window).resize(function () {
        setTimeout(function() {
            /*lzm_chatDisplay.createUserControlPanel(lzm_chatPollServer.user_status, lzm_chatServerEvaluation.myName,
                lzm_chatServerEvaluation.myUserId);*/
            lzm_chatDisplay.createViewSelectPanel();
            if (lzm_chatDisplay.selected_view == 'external') {
                lzm_chatDisplay.visitorDisplay.createVisitorList();
            }
            if (lzm_chatDisplay.selected_view == 'mychats') {
                lzm_chatDisplay.createActiveChatPanel(false, false);
            }
            lzm_chatDisplay.createChatWindowLayout(false, false);
            var resizeTimeout = (isMobile || (app == 1)) ? 100 : 100;
            setTimeout(function() {
                handleWindowResize(true);
                    setTimeout(function() {
                        handleWindowResize(true);
                    }, 500);
                if (isMobile || (app == 1)) {
                    setTimeout(function() {
                        handleWindowResize(false);
                    }, 2500);
                    setTimeout(function() {
                        handleWindowResize(false);
                    }, 10000);
                }
            }, resizeTimeout);
        }, 10);
    });

    $('.logout_btn').click(function () {
        logout(true);
    });
    $('#stop_polling').click(function () {
        stopPolling();
    });
    $('#userstatus-button').click(function (e) {
        showUserStatusMenu(e);
    });
    $('#usersettings-button').click(function (e) {
        showUserSettingsMenu(e);
    });
    $('#wishlist-button').click(function() {
        openLink('http://wishlistmobile.livezilla.net/');
    });
    $('#blank-button').click(function() {
        if(debug) {
            debuggingStartStopPolling();
        }
    });
    $('.lzm-button').mouseenter(function() {
        $(this).css('background-image', $(this).css('background-image').replace(/linear-gradient\(.*\)/,'linear-gradient(#f6f6f6,#e0e0e0)'));
    });
    $('.lzm-button').mouseleave(function() {
        $(this).css('background-image', $(this).css('background-image').replace(/linear-gradient\(.*\)/,'linear-gradient(#ffffff,#f1f1f1)'));
    });

    $('body').click(function(e) {
        $('#usersettings-menu').css({'display':'none'});
        lzm_chatDisplay.showUsersettingsHtml = false;
        $('#userstatus-menu').css({'display':'none'});
        lzm_chatDisplay.showUserstatusHtml = false;
        lzm_displayHelper.showMinimizedDialogsMenu(true);
        removeTicketContextMenu();
        removeArchiveFilterMenu();
        removeQrdContextMenu();
        removeTicketMessageContextMenu();
        removeTicketFilterMenu();
        removeVisitorListContextMenu();
        removeOperatorListContextMenu();
        removeChatMembersListContextMenu();
        removeReportFilterMenu();
        removeReportContextMenu();
        removeChatLineContextMenu();
        removeFiltersListContextMenu();
        removeVisitorChatActionContextMenu();
        removeArchiveListContextMenu();
    });
    $('body').keydown(function(e) {

        var controlPressed = e.ctrlKey || e.metaKey;
        var keyCode = (typeof e.which != 'undefined') ? e.which : e.keyCode;
        if ($('#email-list').length > 0)
        {
            if(keyCode == 46)
                deleteEmail();
            else if(controlPressed && keyCode == 65){
                $('tr.email-list-line').addClass('selected-table-line');
                return false;
            }
        }
        if($('#search-ticket').is(":focus"))
            return;
        if ($('#ticket-list-body').length > 0 && $('.dialog-window-container').length == 0 && lzm_chatDisplay.selected_view == 'tickets')
        {
            if(!controlPressed)
            {
                switch(keyCode) {

                    case 79:
                        changeTicketStatus(0,null,null,null,true);
                        break;
                    case 80:
                        changeTicketStatus(1,null,null,null,true);
                        break;
                    case 67:
                        changeTicketStatus(2,null,null,null,true);
                        break;
                    case 46:
                    case 68:
                        changeTicketStatus(3,null,null,null,true);
                        break;
                    case 40:
                        selectTicket('next');
                        break;
                    case 38:
                        selectTicket('previous');
                        break;
                }
            }
            else if(keyCode == 65)
            {
                $('tr.ticket-list-row').addClass('selected-table-line');
                return false;
            }
        }
    });
    $('#new-view-select-panel').on('touchstart', function(e) {
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        vsPanelTouchPos = touch.pageX;
    });
    $('#new-view-select-panel').on('touchend', function(e) {
        if (vsPanelTouchPos != null) {
            var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            var xPos = touch.pageX;
            var xMove = vsPanelTouchPos - xPos;
            vsPanelTouchPos = null;
            if (xMove > 50) {
                moveViewSelectPanel('right');
            } else if (xMove < -50) {
                moveViewSelectPanel('left');
            }
        }
    });

    $(window).on('beforeunload', function(){
        if (lzm_chatDisplay.askBeforeUnload)
            return t('Are you sure you want to leave or reload the client? You may lose data because of that.');
    });
    $(window).mousemove(function() {
        doBlinkTitle = false;
        blinkTitleMessage = '';
        blinkTitleStatus = 0;
    });

    if (app == 0 && mobile == 0) {
        setInterval(function() {
            if (doBlinkTitle && blinkTitleMessage != '') {
                var newTitle = (blinkTitleStatus == 0)
                    ? t('<!--site_name--> (<!--message-->)', [['<!--site_name-->',lzm_chatServerEvaluation.siteName], ['<!--message-->', blinkTitleMessage]])
                    : lzm_chatServerEvaluation.siteName;
                $('title').html(newTitle);
                blinkTitleStatus = 1 - blinkTitleStatus;
            } else {
                $('title').html(lzm_chatServerEvaluation.siteName);
            }
        }, 1800);
    }
});
