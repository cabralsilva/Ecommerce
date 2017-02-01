/****************************************************************************************
 * LiveZilla ChatDisplayHelperClass.js
 *
 * Copyright 2014 LiveZilla GmbH
 * All rights reserved.
 * LiveZilla is a registered trademark.
 *
 ***************************************************************************************/

function ChatDisplayHelperClass() {
    this.browserName = '';
    this.browserVersion = '';
    this.browserMinorVersion = '';

    this.showBrowserNotificationTime = 0;
    this.showMinimizedDialogMenuButton = false;
}

ChatDisplayHelperClass.prototype.getMyObjectName = function() {
    for (var name in window) {
        if (window[name] == this) {
            return name;
        }
    }
    return '';
};

/*********************************************** Dialog functions **********************************************/
ChatDisplayHelperClass.prototype.createDialogWindow = function(headerString, bodyString, footerString, id,
                                                         defaultCss, desktopBrowserCss, mobileBrowserCss, appCss,
                                                         position, data, showMinimizeIcon, fullscreen, dialogId) {
    return lzm_commonDialog.createDialogWindow(headerString, bodyString, footerString, id, defaultCss, desktopBrowserCss,
        mobileBrowserCss, appCss, position, data, showMinimizeIcon, fullscreen, dialogId);
};

ChatDisplayHelperClass.prototype.removeDialogWindow = function(id) {
    lzm_commonDialog.removeDialogWindow(id);
};

ChatDisplayHelperClass.prototype.minimizeDialogWindow = function(dialogId, windowId, data, selectedView, showStoredIcon) {

    lzm_chatServerEvaluation.settingsDialogue = false;
    showStoredIcon = (typeof showStoredIcon != 'undefined') ? showStoredIcon : true;
    var img = '', title = '', type = '';
    switch (windowId) {
        case 'change-password':
            img = '<i class="fa fa-gears"></i>';
            title = t('Change Password');
            type = 'change-password';
            break;
        case 'translation-editor':
            img = '<i class="fa fa-gears"></i>';
            title = t('Translation Editor');
            type = 'translation-editor';
            break;
        case 'link-generator':
            img = '<i class="fa fa-code"></i>';
            title = t('Link Generator');
            type = 'link-generator';
            break;
        case 'server-configuration':
            img = '<i class="fa fa-gears"></i>';
            title = tid('server_conf');
            type = 'server-configuration';
            break;
        case 'user-management-dialog':
            img = '<i class="fa fa-gears"></i>';
            title = t('User Management');
            type = 'user-management';
            break;
        case 'user-settings-dialog':
            img = '<i class="fa fa-gears"></i>';
            title = t('Options');
            type = 'settings';
            break;
        case 'chat-invitation':
            img = '<i class="fa fa-users"></i>';
            title = t('Chat Invitation');
            type = 'visitor-invitation';
            break;
        case 'qrd-add':
            img = '<i class="fa fa-database"></i>';
            title = t('Add new Resource');
            type = 'add-resource';
            break;
        case 'qrd-edit':
            img = '<i class="fa fa-database"></i>';
            title = t('Edit Resource');
            type = 'edit-resource';
            break;
        case 'qrd-preview':
            img = '<i class="fa fa-search"></i>';
            title = tid('preview');
            type = 'preview-resource';
            break;
        case 'operator-forward-selection':
            img = '<i class="fa fa-user"></i>';
            title = t('Forward chat to operator.');
            type = 'operator-invitation';
            break;
        case 'ticket-details':
            img = '<i class="fa fa-envelope"></i>';
            title = t('Ticket Details');
            type = 'ticket-details';
            break;
        case 'qrd-tree-dialog':
            img = '<i class="fa fa-database"></i>';
            title = t('Knowledgebase');
            type = 'qrd-tree';
            break;
        case 'email-list':
            img = '<i class="fa fa-envelope"></i>';
            title = t('Emails');
            type = 'email-list';
            break;
        case 'visitor-information':
            img = '<i class="fa fa-users"></i>';
            title = t('Visitor Information');
            type = 'visitor-information';
            break;
        case 'event-configuration':
            img = '<i class="fa fa-flash"></i>';
            title = tid('events');
            type = 'event-configuration';
            break;
        case 'feedbacks-viewer':
            img = '<i class="fa fa-star"></i>';
            title = tid('feedbacks');
            type = 'feedbacks-viewer';
            break;
        case 'matching-chats':
            img = '<i class="fa fa-comments"></i>';
            title = t('Matching Chats');
            type = 'matching-chats';
            break;
        case 'filter-list':
        case 'visitor-filter':
            img = '<i class="fa fa-gears"></i>';
            title = t('Filters');
            type = 'settings';
            break;
        case 'send-transcript-to':
            img = '<i class="fa fa-comments"></i>';
            title = t('Send chat transcript');
            type = 'send-transcript';
            break;
        case 'link-chat-ticket':
            img = '<i class="fa fa-envelope"></i>';
            title = t('Link with Ticket');
            type = 'link-ticket';
            break;
        case 'qrd-settings':
            img = '<i class="fa fa-database"></i>';
            title = t('Resource Settings');
            type = 'resource-settings';
            break;

    }
    if (data && typeof data['exceptional-img'] != 'undefined' && data['exceptional-img'] != '') {
        img = data['exceptional-img'];
    }
    lzm_chatDisplay.StoredDialogIds.push(dialogId);
    var chatPollData = null, ticketPollData = null;
    if ($('#ticket-linker-first').length > 0 && typeof $('#ticket-linker-first').data('chat-poll-data') != 'undefined') {
        chatPollData = $('#ticket-linker-first').data('chat-poll-data');
    }
    /*
    if ($('#ticket-linker-first').length > 0 && typeof $('#ticket-linker-first').data('ticket-poll-data') != 'undefined') {
        ticketPollData = $('#ticket-linker-first').data('ticket-poll-data');
    }
    */
    var domNode = $('#' + windowId + '-container').detach();
    lzm_chatDisplay.StoredDialogs[dialogId] = {'dialog-id': dialogId, 'window-id': windowId, 'content': domNode, 'data': data,
        'type': type, 'title': title, 'img': img, 'selected-view': selectedView, 'show-stored-icon': showStoredIcon};
    this.createMinimizedDialogsMenu();
    if (lzm_chatDisplay.selected_view == 'external') {
        lzm_chatDisplay.visitorDisplay.createVisitorList();
        selectVisitor(null, $('#visitor-list').data('selected-visitor'));
    }


    /*
    if (typeof data.reload != 'undefined') {
        lzm_chatPollServer.stopPolling();
        if (showStoredIcon && $.inArray('chats', data.reload) != -1) {
            try {
                lzm_chatPollServer.chatArchiveFilter = window['tmp-chat-archive-values'].filter;
                lzm_chatPollServer.chatArchivePage = window['tmp-chat-archive-values'].page;
                lzm_chatPollServer.chatArchiveLimit = window['tmp-chat-archive-values'].limit;
                lzm_chatPollServer.chatArchiveQuery = window['tmp-chat-archive-values'].query;
            } catch (e) {
                lzm_chatPollServer.chatArchiveFilter = '012';
                lzm_chatPollServer.chatArchivePage = 1;
                lzm_chatPollServer.chatArchiveLimit = 20;
                lzm_chatPollServer.chatArchiveQuery = '';
            }
            lzm_chatPollServer.chatArchiveFilterExternal = '';
            lzm_chatPollServer.chatArchiveFilterGroup = '';
            lzm_chatPollServer.chatArchiveFilterInternal = '';
            lzm_chatPollServer.resetChats = true;
        }
        if ($.inArray('tickets', data.reload) != -1) {
            try {
                lzm_chatPollServer.ticketPage = window['tmp-ticket-values'].page;
                lzm_chatPollServer.ticketLimit = window['tmp-ticket-values'].limit;
                lzm_chatPollServer.ticketQuery = window['tmp-ticket-values'].query;
                lzm_chatPollServer.ticketFilterStatus = window['tmp-ticket-values'].filter;
                lzm_chatPollServer.ticketFilterChannel = window['tmp-ticket-values'].filterChannel;
                lzm_chatPollServer.ticketSort = window['tmp-ticket-values'].sort;
            } catch(e) {
                lzm_chatPollServer.ticketPage = 1;
                lzm_chatPollServer.ticketLimit = 20;
                lzm_chatPollServer.ticketQuery = '';
                lzm_chatPollServer.ticketFilterStatus = '012';
                lzm_chatPollServer.ticketFilterChannel = '01234567';
                lzm_chatPollServer.ticketSort = 'update';
            }
            lzm_chatPollServer.resetTickets = true;
        }
        lzm_chatPollServer.startPolling();
    }

    if (chatPollData != null) {
        lzm_chatPollServer.stopPolling();
        lzm_chatPollServer.chatArchivePage = chatPollData.p;
        lzm_chatPollServer.chatArchiveQuery = chatPollData.q;
        lzm_chatPollServer.chatArchiveFilter = chatPollData.f;
        lzm_chatPollServer.chatArchiveLimit = chatPollData.l;
        lzm_chatPollServer.chatArchiveFilterGroup = chatPollData.g;
        lzm_chatPollServer.chatArchiveFilterExternal = chatPollData.e;
        lzm_chatPollServer.chatArchiveFilterInternal = chatPollData.i;
        lzm_chatPollServer.resetChats = true;
        lzm_chatPollServer.startPolling();
    }
    if (ticketPollData != null) {
        lzm_chatPollServer.stopPolling();
        lzm_chatPollServer.ticketSort = ticketPollData.s;
        lzm_chatPollServer.ticketPage = ticketPollData.p;
        lzm_chatPollServer.ticketQuery = ticketPollData.q;
        lzm_chatPollServer.ticketFilterStatus = ticketPollData.f;
        lzm_chatPollServer.ticketFilterChannel = ticketPollData.c;
        lzm_chatPollServer.ticketLimit = ticketPollData.l;
        lzm_chatPollServer.resetTickets = true;
        lzm_chatPollServer.startPolling();
    }

    */



};

ChatDisplayHelperClass.prototype.maximizeDialogWindow = function(dialogId) {

    var ratio = lzm_chatDisplay.DialogBorderRatioFull;
    var activeUserChat = lzm_chatServerEvaluation.userChats.getUserChat(lzm_chatDisplay.active_chat_reco);
    if (lzm_chatDisplay.selected_view == 'mychats' && activeUserChat != null) {
        saveChatInput(lzm_chatDisplay.active_chat_reco);
        removeEditor();
    }
    lzm_chatServerEvaluation.settingsDialogue = true;
    var i = 0;
    if ($.inArray(dialogId, lzm_chatDisplay.StoredDialogIds) != -1) {
        lzm_chatDisplay.selected_view = (lzm_chatDisplay.StoredDialogs[dialogId]['selected-view'] != '') ? lzm_chatDisplay.StoredDialogs[dialogId]['selected-view'] : lzm_chatDisplay.selected_view;

        if (lzm_chatDisplay.selected_view != 'qrd')
            cancelQrdPreview();

        lzm_chatDisplay.toggleVisibility();
        lzm_chatDisplay.createViewSelectPanel(lzm_chatDisplay.firstVisibleView);
        if (lzm_chatDisplay.selected_view == 'external') {
            $('#visitor-list-table').remove();
        }
        lzm_chatDisplay.dialogData = lzm_chatDisplay.StoredDialogs[dialogId].data;

        var dialogWindowId = lzm_chatDisplay.StoredDialogs[dialogId]['window-id'];
        var dialogContainerHtml = '<div id="' + dialogWindowId + '-container" class="dialog-window-container"></div>';
        var dialogContent = lzm_chatDisplay.StoredDialogs[dialogId].content;
        $('#chat_page').append(dialogContainerHtml).trigger('create');
        $('#' + dialogWindowId + '-container').css(lzm_chatDisplay.dialogWindowContainerCss);
        $('#' + dialogWindowId + '-container').replaceWith(dialogContent);

        try {
            if (typeof lzm_chatDisplay.StoredDialogs[dialogId].data.editors != 'undefined') {
                for (i=0; i<lzm_chatDisplay.StoredDialogs[dialogId].data.editors.length; i++) {
                    var editorName = lzm_chatDisplay.StoredDialogs[dialogId].data.editors[i].instanceName;
                    var editorId = lzm_chatDisplay.StoredDialogs[dialogId].data.editors[i].id;
                    window[editorName] = new ChatEditorClass(editorId, lzm_chatDisplay.isMobile, lzm_chatDisplay.isApp, lzm_chatDisplay.isWeb);
                    window[editorName].init(lzm_chatDisplay.StoredDialogs[dialogId].data.editors[i].text, 'maximizeDialogWindow');
                }
            }
        } catch(e) {}


        if (typeof lzm_chatDisplay.StoredDialogs[dialogId].data.ratio != 'undefined')
            ratio = lzm_chatDisplay.StoredDialogs[dialogId].data.ratio;

        if (lzm_chatDisplay.StoredDialogs[dialogId].data.reload != 'undefined') {
            lzm_chatPollServer.stopPolling();
            if (lzm_chatDisplay.StoredDialogs[dialogId]['show-stored-icon'] && $.inArray('chats', lzm_chatDisplay.StoredDialogs[dialogId].data.reload) != -1) {
                var eId = (typeof lzm_chatDisplay.StoredDialogs[dialogId].data['visitor-id'] != 'undefined') ?
                    lzm_chatDisplay.StoredDialogs[dialogId].data['visitor-id'] : '';
                var gId = (typeof lzm_chatDisplay.StoredDialogs[dialogId].data['chat-type'] != 'undefined' &&
                    lzm_chatDisplay.StoredDialogs[dialogId].data['chat-type'] == 2 &&
                    typeof lzm_chatDisplay.StoredDialogs[dialogId].data['cp-id'] != 'undefined') ?
                    lzm_chatDisplay.StoredDialogs[dialogId].data['cp-id'] : '';
                var iId = (typeof lzm_chatDisplay.StoredDialogs[dialogId].data['chat-type'] != 'undefined' &&
                    lzm_chatDisplay.StoredDialogs[dialogId].data['chat-type'] == 0 &&
                    typeof lzm_chatDisplay.StoredDialogs[dialogId].data['cp-id'] != 'undefined') ?
                    lzm_chatDisplay.StoredDialogs[dialogId].data['cp-id'] : '';
                var chatType = (typeof lzm_chatDisplay.StoredDialogs[dialogId].data['chat-type'] != 'undefined') ?
                    lzm_chatDisplay.StoredDialogs[dialogId].data['chat-type'] : '012';
                var chatFetchTime = lzm_chatServerEvaluation.archiveFetchTime;
                window['tmp-chat-archive-values'] = {page: lzm_chatPollServer.chatArchivePage,
                    limit: lzm_chatPollServer.chatArchiveLimit, query: lzm_chatPollServer.chatArchiveQuery,
                    filter: lzm_chatPollServer.chatArchiveFilter};
                lzm_chatPollServer.chatArchivePage = 1;
                lzm_chatPollServer.chatArchiveLimit = 1000;
                lzm_chatPollServer.chatArchiveQuery = '';
                lzm_chatPollServer.chatArchiveFilter = '';
                lzm_chatPollServer.chatArchiveFilterExternal = eId;
                lzm_chatPollServer.chatArchiveFilterGroup = gId;
                lzm_chatPollServer.chatArchiveFilterInternal = iId;
                lzm_chatPollServer.resetChats = 0;

            }
            if ($.inArray('tickets', lzm_chatDisplay.StoredDialogs[dialogId].data.reload) != -1) {
                /*
                var cpId = (typeof lzm_chatDisplay.StoredDialogs[dialogId].data['visitor-id'] != 'undefined') ?
                    lzm_chatDisplay.StoredDialogs[dialogId].data['visitor-id'] : 'xxxxxxxxxx';
                var ticketFetchTime = lzm_chatServerEvaluation.ticketFetchTime;
                window['tmp-ticket-values'] = {page: lzm_chatPollServer.ticketPage, limit: lzm_chatPollServer.ticketLimit,
                    query: lzm_chatPollServer.ticketQuery, filter: lzm_chatPollServer.ticketFilterStatus,
                    filterChannel: lzm_chatPollServer.ticketFilterChannel, sort: lzm_chatPollServer.ticketSort};
                lzm_chatPollServer.ticketPage = 1;
                lzm_chatPollServer.ticketLimit = 1000;
                lzm_chatPollServer.ticketQuery = cpId;
                lzm_chatPollServer.ticketFilterStatus = '0123';
                lzm_chatPollServer.ticketFilterChannel = '01234567';
                lzm_chatPollServer.ticketSort = '';
                lzm_chatPollServer.resetTickets = true;
                */
            }
            lzm_chatPollServer.startPolling();
        }
        var inputChangeId, linkerInputValue;
        if ($('#ticket-linker-first').length > 0 && typeof $('#ticket-linker-first').data('chat-poll-data') != 'undefined') {
            var chatPollData = $('#ticket-linker-first').data('chat-poll-data');
            inputChangeId = $('#ticket-linker-first').data('input');
            linkerInputValue = $('#' + inputChangeId).val();
            if (linkerInputValue.length >= 5) {
                lzm_chatPollServer.stopPolling();
                lzm_chatPollServer.chatArchivePage = 1;
                lzm_chatPollServer.chatArchiveQuery = linkerInputValue;
                lzm_chatPollServer.chatArchiveFilter = '012';
                lzm_chatPollServer.chatArchiveLimit = 10;
                lzm_chatPollServer.chatArchiveFilterGroup = '';
                lzm_chatPollServer.chatArchiveFilterExternal = '';
                lzm_chatPollServer.chatArchiveFilterInternal = '';
                lzm_chatPollServer.resetChats = true;
                lzm_chatPollServer.startPolling();
            }
        }

        /*
        if ($('#ticket-linker-first').length > 0 && typeof $('#ticket-linker-first').data('ticket-poll-data') != 'undefined') {
            var ticketPollData = $('#ticket-linker-first').data('ticket-poll-data');
            inputChangeId = $('#ticket-linker-first').data('input');
            linkerInputValue = $('#' + inputChangeId).val();
            if (linkerInputValue.length >= 5) {
                lzm_chatPollServer.stopPolling();
                lzm_chatPollServer.ticketSort = '';
                lzm_chatPollServer.ticketPage = 1;
                lzm_chatPollServer.ticketQuery = linkerInputValue;
                lzm_chatPollServer.ticketFilterStatus = '0123';
                lzm_chatPollServer.ticketFilterChannel = '01234567';
                lzm_chatPollServer.ticketLimit = 10;
                lzm_chatPollServer.resetTickets = true;
                lzm_chatPollServer.startPolling();
            }
        }
        */

        if (lzm_chatDisplay.StoredDialogs[dialogId].type == 'visitor-information') {
            var selectedVisitor = lzm_chatServerEvaluation.visitors.getVisitor(lzm_chatDisplay.StoredDialogs[dialogId].data['visitor-id']);
            if (selectedVisitor != null) {
                lzm_chatDisplay.visitorDisplay.updateVisitorInformation(selectedVisitor);
            }
        }
        delete lzm_chatDisplay.StoredDialogs[dialogId];
        var tmpStoredDialogIds = [];
        for (var j=0; j<lzm_chatDisplay.StoredDialogIds.length; j++) {
            if (dialogId != lzm_chatDisplay.StoredDialogIds[j]) {
                tmpStoredDialogIds.push(lzm_chatDisplay.StoredDialogIds[j])
            }
        }
        lzm_chatDisplay.StoredDialogIds = tmpStoredDialogIds;

        $('#minb-' + dialogId).remove();
        $('#usersettings-menu').css({'display': 'none'});
    }
    this.createMinimizedDialogsMenu();

    lzm_chatDisplay.createChatWindowLayout(true, true, ratio);
};

ChatDisplayHelperClass.prototype.showMinimizedDialogsMenu = function (hideOnly, e) {
    if (typeof e != 'undefined') {
        e.stopPropagation();
    }
    hideOnly = (typeof hideOnly != 'undefined') ? hideOnly : false;
    $('#userstatus-menu').css('display', 'none');
    $('#usersettings-menu').css('display', 'none');
    lzm_chatDisplay.showUserstatusHtml = false;
    lzm_chatDisplay.showUsersettingsHtml = false;
    if (!lzm_chatDisplay.showMinifiedDialogsHtml && !hideOnly) {
        lzm_chatDisplay.showMinifiedDialogsHtml = true;
        $('#minimized-window-list').css({display: 'block'});
        //var leftMargin = Math.max(80, $('#minimized-window-menu').width() - 24);
        //$('#minimized-window-button').css({'margin-left': leftMargin + 'px'});
        $('#minimized-window-button-inner').html('<i class="fa fa-chevron-up"></i>');
    } else {
        lzm_chatDisplay.showMinifiedDialogsHtml = false;
        $('#minimized-window-list').css({display: 'none'});
        $('#minimized-window-button-inner').html('<i class="fa fa-chevron-down"></i>');
    }

    if(!lzm_chatDisplay.showMinifiedDialogsHtml)
        $('#minimized-window-button').css({width:'30px'});
    else
        $('#minimized-window-button').css({width:$('#minimized-window-list').outerWidth()+'px'});

};

ChatDisplayHelperClass.prototype.createMinimizedDialogsMenu = function () {
    lzm_chatDisplay.showMinifiedDialogsHtml = false;
    var showMinimizedDialogMenuButton = false;
    var menuListHtml = '<table>';
    for (var i=0; i<lzm_chatDisplay.StoredDialogIds.length; i++) {
        if (lzm_chatDisplay.StoredDialogs[lzm_chatDisplay.StoredDialogIds[i]]['show-stored-icon']) {
            showMinimizedDialogMenuButton = true;
            var menuEntry = lzm_chatDisplay.StoredDialogs[lzm_chatDisplay.StoredDialogIds[i]].title;
            if (typeof lzm_chatDisplay.StoredDialogs[lzm_chatDisplay.StoredDialogIds[i]].data.menu != 'undefined') {
                menuEntry = lzm_chatDisplay.StoredDialogs[lzm_chatDisplay.StoredDialogIds[i]].data.menu;
            }
            menuListHtml += '<tr onclick="maximizeDialogWindow(\'' + lzm_chatDisplay.StoredDialogIds[i] + '\');' +
                ' ' + this.getMyObjectName() + '.showMinimizedDialogsMenu(false, event);" class="cm-click">' +
                '<td style="text-align: center;">' +
                lzm_chatDisplay.StoredDialogs[lzm_chatDisplay.StoredDialogIds[i]].img +
                '</td><td style="text-align: left;">' +
                '<span>' +
                menuEntry + '</span></td></tr>';
        }
    }
    menuListHtml += '</table>';
    $('#minimized-window-list').html(menuListHtml).trigger('create');
    var menuCss = {'box-shadow':'1px 1px 2px #666', position: 'absolute', top: '0px', right: '60px', 'z-index': 1000};
    var menuListCss = {'background-color': '#fff', border: '1px solid #64a11f','border-top':'0px','border-bottom':'0px',display: 'none'};
    var menuButtonCss = {'text-align':'center',padding: '4px 8px 4px 5px', cursor: 'pointer',

        'border': '1px solid #64a11f', 'border-top': '0'}
    $('#minimized-window-menu').css(menuCss);
    $('#minimized-window-list').css(menuListCss);
    $('#minimized-window-button').css(menuButtonCss);

    if (showMinimizedDialogMenuButton) {
        $('#minimized-window-menu').css({display: 'block'});
        if (!this.showMinimizedDialogMenuButton) {
            setTimeout(function() {
                //$('#minimized-window-button').css({'background-color': '#E0E0E0'});
            }, 2000);
            this.showMinimizedDialogMenuButton = true;
        }
    } else {
        $('#minimized-window-menu').css({display: 'none'});
        this.showMinimizedDialogMenuButton = false;
    }

    var leftMargin = Math.max(80, $('#minimized-window-menu').width() - 24);
    //$('#minimized-window-button').css({'margin-left': leftMargin + 'px'});
};

/********************************************* Operator functions **********************************************/
ChatDisplayHelperClass.prototype.createAddToDynamicGroupHtml = function(id, browserId) {
    browserId = (typeof browserId != 'undefined') ? browserId : '';
    var groups = lzm_chatServerEvaluation.groups.getGroupList('name', false, true);
    var tableLines = '', addToChecked = '', addNewChecked = ' checked="checked"', firstGroupId = '';
    for (var i=0; i<groups.length; i++) {
        if (typeof groups[i].members != 'undefined' && $.inArray(id, groups[i].members) == -1) {
            tableLines += '<tr id="dynamic-group-line-' + groups[i].id + '" class="dynamic-group-line" style="cursor: pointer;" onclick="selectDynamicGroup(\'' + groups[i].id + '\');"><td>' + groups[i].name + '</td></tr>';
            addToChecked = ' checked="checked"';
            addNewChecked = '';
            firstGroupId = (firstGroupId == '') ? groups[i].id : firstGroupId;
        }
    }

    var disabledClass = (browserId == '') ? ' class="ui-disabled"' : '';
    var dynGroupHtml = '<form><fieldset data-role="none" id="add-to-group-form" class="lzm-fieldset"><legend>' + t('Add to existing group') + '</legend>' +
        '<input type="radio" name="add-group-type" class="radio-custom" id="add-to-existing-group" data-role="none"' + addToChecked + ' />' +
        '<label for="add-to-existing-group" class="radio-custom-label">' + t('Add to existing group') + '</label><br />' +
        '<div id="dynamic-group-table-div" class="left-space-child top-space-half">' +
        '<table id="dynamic-group-table" class="visible-list-table alternating-rows-table lzm-unselectable" data-selected-group="' + firstGroupId + '"><tbody>' + tableLines + '</tbody></table></div></fieldset>' +
        '<fieldset data-role="none" id="add-new-group-form" class="lzm-fieldset top-space"><legend>' + t('Create new group') + '</legend>' +
        '<input type="radio" class="radio-custom" name="add-group-type" id="create-new-group" data-role="none"' + addNewChecked + ' />' +
        '<label for="create-new-group" class="radio-custom-label">' + t('Create new group for this user') + '</label>' +
        '<div class="left-space-child top-space-half">' +
        '<input type="text" id="new-group-name" class="lzm-text-input" data-role="none" /><br />' +
        '</div></fieldset>' +
        '<fieldset data-role="none" id="add-persistent-member-form" class="lzm-fieldset top-space"><legend>' + t('Persistent Member') + '</legend>' +
        '<div' + disabledClass + ' id="persistent-group-div"><input type="checkbox" class="checkbox-custom" id="persistent-group-member" data-role="none" />' +
        '<label class="checkbox-custom-label" for="persistent-group-member">' + t('Persistent Member') + '</label></div>' +
        '</fieldset></form>';
    return dynGroupHtml;
};

/************************************************* Other views  ************************************************/
ChatDisplayHelperClass.prototype.createViewSelectPanel = function(firstVisibleView, counter)
{

    var viewSelectArray = lzm_commonTools.clone(lzm_chatDisplay.viewSelectArray), panelContents = [];
    for (i=0; i<viewSelectArray.length; i++) {
        var buttonText = t(viewSelectArray[i].name) + '<!--numbers-->', numbersHtml = '', buttonIcon = '';
        switch(viewSelectArray[i].id) {
            case 'home':
                buttonIcon = 'fa-home';
                break;
            case 'world':
                buttonIcon = 'fa-globe';
                break;
            case 'mychats':
                var chatnum = lzm_chatDisplay.numberOfRunningChats;
                numbersHtml = (!lzm_chatDisplay.isApp && !lzm_chatDisplay.isMobile) ?
                    '<span class="view-select-number">(' + chatnum + ')</span>' :
                    '(' + chatnum + ')';
                buttonIcon = 'fa-comments';
                break;
            case 'tickets':
                var numberOfUnreadTickets = (typeof lzm_chatDisplay.ticketGlobalValues.q != 'undefined') ? lzm_chatDisplay.ticketGlobalValues.q : 0;
                var numberOfEmails = (typeof lzm_chatDisplay.ticketGlobalValues.e != 'undefined') ? lzm_chatDisplay.ticketGlobalValues.e : 0;
                numbersHtml = (!lzm_chatDisplay.isApp && !lzm_chatDisplay.isMobile) ? '<span class="view-select-number">(' + numberOfUnreadTickets + '/' + numberOfEmails + ')</span>' : '(' + numberOfUnreadTickets + '/' + numberOfEmails + ')';
                buttonIcon = 'fa-envelope';
                break;
            case 'external':
                numbersHtml = (!lzm_chatDisplay.isApp && !lzm_chatDisplay.isMobile) ?
                    '<span class="view-select-number">(' + lzm_chatServerEvaluation.visitors.getActiveVisitorCount() + ')</span>' :
                    '(' + lzm_chatServerEvaluation.visitors.getActiveVisitorCount() + ')';
                buttonIcon = 'fa-users';
                break;
            case 'archive':
                numbersHtml = (!lzm_chatDisplay.isApp && !lzm_chatDisplay.isMobile) ?
                    '<span class="view-select-number">(' + lzm_chatServerEvaluation.chatArchive.t + ')</span>' :
                    '(' + lzm_chatServerEvaluation.chatArchive.t + ')';
                buttonIcon = 'fa-archive';
                break;
            case 'internal':
                buttonIcon = 'fa-user';
                break;
            case 'qrd':
                buttonIcon = 'fa-database';
                break;
            case 'reports':
                numbersHtml = (!lzm_chatDisplay.isApp && !lzm_chatDisplay.isMobile) ?
                    '<span class="view-select-number">(' + lzm_chatServerEvaluation.reports.getTotal() + ')</span>' :
                    '(' + lzm_chatServerEvaluation.reports.getTotal() + ')';
                buttonIcon = 'fa-pie-chart';
                break;
        }
        buttonText = buttonText.replace(/<!--numbers-->/, '&nbsp;' + numbersHtml);

        var showThisView = true;

        if(lzm_chatDisplay.isApp && viewSelectArray[i].id == 'external' && lzm_chatServerEvaluation.getConfigValue('gl_apvm',false) != '1')
            showThisView = false;
        if (lzm_chatDisplay.showViewSelectPanel[viewSelectArray[i].id] == 0)
            showThisView = false;
        if (viewSelectArray[i].id == 'world' && lzm_chatServerEvaluation.crc3 != null && lzm_chatServerEvaluation.crc3[2] == '-2')
            showThisView = false;
        if (viewSelectArray[i].id == 'home' && (lzm_chatServerEvaluation.crc3 == null || lzm_chatServerEvaluation.crc3[1] == '-2'))
            showThisView = true;

        if (showThisView)
            panelContents.push({id: viewSelectArray[i].id, icon: buttonIcon, text: buttonText});

    }
    var panelHtml = '', buttonLeft = 0, buttonWidth = 0, thisButtonWidth = 0, i, showButtonText;
    var numberOfIconOnlyButtons = 0;
    var panelWidth = $('#new-view-select-panel').width();
    var notifyNewMessage = false, ucs = lzm_chatServerEvaluation.userChats.getUserChatList();
    for (var uc in ucs) {
        if (ucs.hasOwnProperty(uc)) {
            if (ucs[uc].status == 'new' && (typeof ucs[uc].my_chat == 'undefined' || ucs[uc].my_chat)) {
                notifyNewMessage = true;
            }
        }
    }

    $('body').append('<div id="panel-width-test" style="position:absolute; left:-1000px; top:0; width: 800px; height: 200px;"></div>');
    for (i=0; i<panelContents.length; i++)
    {
        var vsPos = (i == 0) ? ' view-select-left' : (i == panelContents.length - 1) ? ' view-select-right' : '';
        var vsSelected = (panelContents[i].id == lzm_chatDisplay.selected_view) ? ' view-select-button-selected' : '';
        var vsNewMessage = '';

        if(panelContents[i].id != lzm_chatDisplay.selected_view && panelContents[i].id == 'mychats' && notifyNewMessage)
            vsNewMessage = ' view-select-button-notify';
        else if(panelContents[i].id != lzm_chatDisplay.selected_view && panelContents[i].id == 'tickets' && lzm_chatDisplay.ticketDisplay.notifyNewTicket)
            vsNewMessage = ' view-select-button-notify';

        var buttonHtml = '<div id="%ID%view-select-' + panelContents[i].id + '" class="lzm-unselectable view-select-button' + vsPos + vsSelected + vsNewMessage + '"' +
            ' style="left: ' + buttonLeft +  'px;%BUTTONWIDTH%" onclick="selectView(\'' + panelContents[i].id + '\');">' +
            '<i class="fa ' + panelContents[i].icon + '"></i>' +
            '<span class="view-select-button-text" style="display: %DISPLAYTEXT%; margin-left: 6px; white-space: nowrap;">' + panelContents[i].text + '</span>' +
            '</div>';
        var testButtonHtml = buttonHtml.replace(/%ID%/g, 'test-').replace(/%BUTTONWIDTH%/, '').replace(/%DISPLAYTEXT%/, 'inline');
        $('#panel-width-test').html(testButtonHtml);
        thisButtonWidth = Math.max(33, $('#test-view-select-' + panelContents[i].id).width() + 20);
        buttonWidth = Math.max(buttonWidth, thisButtonWidth);
        panelContents[i].html = buttonHtml.replace(/%ID%/g, '');
        if (panelContents[i].id == 'home' || panelContents[i].id == 'world')
            numberOfIconOnlyButtons++;

    }
    $('#panel-width-test').remove();
    showButtonText = (buttonWidth * (panelContents.length - numberOfIconOnlyButtons) + 39 * numberOfIconOnlyButtons <= panelWidth);
    var noTextButtonWidth = Math.floor(panelWidth / panelContents.length) - 2;
    var numberOfWiderButtons = panelWidth - (panelContents.length * (noTextButtonWidth + 2));
    var remainingPanelWidth = panelWidth - ((panelContents.length  - numberOfIconOnlyButtons) * (buttonWidth + 2) + numberOfIconOnlyButtons * 41);
    var addedButtonWidth = Math.floor(remainingPanelWidth / (panelContents.length - numberOfIconOnlyButtons));
    var numberOfWiderTextButtons = panelWidth - ((panelContents.length - numberOfIconOnlyButtons) * (buttonWidth + addedButtonWidth + 2) + numberOfIconOnlyButtons * 41);
    for (i=0; i<panelContents.length; i++) {
        var displayText = 'none';
        if (showButtonText) {
            displayText = (panelContents[i].id != 'home' && panelContents[i].id != 'world') ? 'inline' : 'none';
            if (panelContents[i].id != 'home' && panelContents[i].id != 'world') {
                thisButtonWidth = (i < numberOfWiderTextButtons) ? buttonWidth + addedButtonWidth + 1 : buttonWidth + addedButtonWidth;
            } else {
                thisButtonWidth = (i < numberOfWiderTextButtons) ? 40 : 39;
            }
        } else {

            thisButtonWidth = (i < numberOfWiderButtons) ? noTextButtonWidth + 1 : noTextButtonWidth;
        }
        thisButtonWidth = (i == 0 || i == panelContents.length - 1) ? thisButtonWidth +  1 : thisButtonWidth;
        panelHtml += panelContents[i].html.replace(/%BUTTONWIDTH%/, ' width: ' + thisButtonWidth + 'px').replace(/%DISPLAYTEXT%/, displayText);
    }
    return panelHtml;
};

ChatDisplayHelperClass.prototype.createMainMenuPanel = function() {
    var statusIcon = lzm_commonConfig.lz_user_states[2].icon;
    for (var i=0; i<lzm_commonConfig.lz_user_states.length; i++)
        if (lzm_commonConfig.lz_user_states[i].index == lzm_chatPollServer.user_status)
            statusIcon = lzm_commonConfig.lz_user_states[i].icon;

    var panelHeight = 35, contentTop = Math.floor((panelHeight - 20) / 2);
    var panelHtml = '<div id="main-menu-panel-status" class="main-menu-panel" style="width: 50px; height: ' + panelHeight + 'px; border-right: 1px solid #cccccc;" onclick="showUserStatusMenu(event); lzm_displayLayout.resizeMenuPanels();">' +
        '<div style="position: absolute; top: 0px; left: 0px; right: 0px; height: ' + panelHeight + 'px;" id="main-menu-panel-status-inner">' +
        '<div id="main-menu-panel-status-icon" style="position: absolute; top: ' + contentTop + 'px; left: 15px; width: 20px;' +
        ' height: 20px; background-image: url(\'' + statusIcon + '\'); background-repeat: no-repeat;' +
        ' background-position: center;"></div></div></div>';

    panelHtml += '<div id="main-menu-panel-settings" class="main-menu-panel lzm-unselectable" style="height: ' + panelHeight + 'px;" onclick="showUserSettingsMenu(event); lzm_displayLayout.resizeMenuPanels();">' +
        '<div style="height: ' + panelHeight + 'px; " id="main-menu-panel-settings-inner">' +
        '<div id="main-menu-panel-settings-text" style="position: absolute; top: ' + (contentTop + 2) + 'px;">' +
        lzm_chatDisplay.myName + '</div>' +
        '</div></div>';

    panelHtml += '<div id="main-menu-panel-tools" class="main-menu-panel" style="cursor:default;height: ' + panelHeight + 'px;">' +
        '<span id="main-menu-panel-tools-configuration" onclick="initServerConfiguration(event);" class="main-menu-panel-opt-tools main-menu-panel-tool" title="'+tid('server_conf')+'"><i class="fa fa-cogs fa-lg"></i></span>' +
        '<span id="main-menu-panel-tools-users" onclick="showUserManagement(event);" class="main-menu-panel-opt-tools main-menu-panel-tool" title="'+tid('user_management')+'"><i class="fa fa-user fa-lg"></i></span>' +
        '<span id="main-menu-panel-tools-link-generator" onclick="initLinkGenerator(event);" class="main-menu-panel-opt-tools main-menu-panel-tool" title="Link Generator"><i class="fa fa-link fa-lg"></i></span>' +

        '<span id="main-menu-panel-tools-filter" onclick="showFilterList(event);" class="main-menu-panel-opt-tools main-menu-panel-tool" title="'+tid('filters')+'"><i class="fa fa-shield fa-lg"></i></span>' +
        '<span id="main-menu-panel-tools-feedbacks" onclick="initFeedbacksConfiguration(event);" class="main-menu-panel-opt-tools main-menu-panel-tool" title="'+tid('feedbacks')+'"><i class="fa fa-star fa-lg"></i></span>' +

        '<span id="main-menu-panel-tools-localization" onclick="showTranslationEditor(event);" class="main-menu-panel-opt-tools main-menu-panel-tool" title="'+tid('trans_editor')+'"><i class="fa fa-language fa-lg"></i></span>' +
        '<span id="main-menu-panel-tools-events" onclick="initEventConfiguration(event);" class="main-menu-panel-opt-tools main-menu-panel-tool" title="'+tid('events')+'"><i class="fa fa-flash fa-lg"></i></span>' +
        '<span id="main-menu-panel-tools-logs" onclick="showLogs();" class="main-menu-panel-opt-tools main-menu-panel-tool" title="Logs"><i class="fa fa-exclamation-circle fa-lg"></i></span>' +
        '<span id="main-menu-panel-tools-wish" style="border-right:0;" onclick="openLink(\'http://wishlistmobile.livezilla.net/\');" class="main-menu-panel-tool" title="'+tid('make_wish')+'"><i class="fa fa-plus fa-lg"></i></span>' +
        '</div>';
    return panelHtml;
};

ChatDisplayHelperClass.prototype.getSortableRows = function(_table){
    var list = [];
    for (var i=0; i<lzm_chatDisplay.mainTableColumns[_table].length; i++)
        if(d(lzm_chatDisplay.mainTableColumns[_table][i].sort_key))
            list.push(lzm_chatDisplay.mainTableColumns[_table][i].sort_key);
    return list;
}

ChatDisplayHelperClass.prototype.fillColumnArray = function(table, type, columnArray) {
    var i = 0, newColumnArray = [];
    columnArray = (typeof columnArray != 'undefined') ? columnArray : [];
    if (type == 'general') {
        if (table == 'ticket' && columnArray instanceof Array) {
            if (columnArray instanceof Array && columnArray.length == 0) {
                newColumnArray = [{cid: 'last_update', title: 'Last Update', display: 1, sort_key:'update', cell_id: 'ticket-sort-update', cell_class: 'ticket-list-sort-column', cell_style: 'cursor: pointer;', cell_onclick: 'sortTicketsBy(\'update\');'},
                    {cid: 'date', title: 'Date', display: 1, cell_id: 'ticket-sort-date', sort_key:'date', cell_class: 'ticket-list-sort-column', cell_style: 'cursor: pointer;', cell_onclick: 'sortTicketsBy(\'date\');'},
                    {cid: 'waiting_time', title: 'Waiting Time', display: 1, sort_invert:true, sort_key:'wait', cell_id: 'ticket-sort-wait', cell_class: 'ticket-list-sort-column', cell_style: 'cursor: pointer;', cell_onclick: 'sortTicketsBy(\'wait\');'},
                    {cid: 'ticket_id', title: 'Ticket ID', display: 1, sort_key:'id', cell_id: 'ticket-sort-id', cell_class: 'ticket-list-sort-column', cell_style: 'cursor: pointer;', cell_onclick: 'sortTicketsBy(\'id\');'},
                    {cid: 'status', title: 'Status', display: 1, sort_key:'status', cell_id: 'ticket-sort-status', cell_class: 'ticket-list-sort-column', cell_style: 'cursor: pointer;', cell_onclick: 'sortTicketsBy(\'status\');'},
                    {cid: 'sub_status', title: 'Sub Status', display: 1, sort_key:'sub_status', cell_id: 'ticket-sort-sub-status', cell_class: 'ticket-list-sort-column', cell_style: 'cursor: pointer;', cell_onclick: 'sortTicketsBy(\'sub_status\');'},
                    {cid: 'channel_type', title: 'Channel', display: 1, sort_key:'channel_type',cell_id: 'ticket-sort-channel-type', cell_class: 'ticket-list-sort-column', cell_style: 'cursor: pointer;', cell_onclick: 'sortTicketsBy(\'channel_type\');'},
                    {cid: 'sub_channel', title: 'Sub Channel', display: 1, sort_key:'sub_channel', cell_id: 'ticket-sort-sub-channel', cell_class: 'ticket-list-sort-column', cell_style: 'cursor: pointer;', cell_onclick: 'sortTicketsBy(\'sub_channel\');'},
                    {cid: 'priority', title: 'Priority', display: 1, sort_key:'priority', cell_id: 'ticket-sort-priority', cell_class: 'ticket-list-sort-column', cell_style: 'cursor: pointer;', cell_onclick: 'sortTicketsBy(\'priority\');'},
                    {cid: 'subject', title: 'Subject', display: 1},
                    {cid: 'operator', title: 'Operator', display: 1},
                    {cid: 'name', title: 'Name', display: 1},
                    {cid: 'email', title: 'Email', display: 1},
                    {cid: 'company', title: 'Company', display: 1},
                    {cid: 'group', title: 'Group', display: 1},
                    {cid: 'phone', title: 'Phone', display: 1},
                    {cid: 'hash', title: 'Hash', display: 1},
                    {cid: 'callback', title: 'Callback', display: 1},
                    {cid: 'ip_address', title: 'IP address', display: 1}];

            }
        } else if (table == 'visitor' && columnArray instanceof Array) {
            if (columnArray instanceof Array && columnArray.length == 0) {
                newColumnArray = [{cid: 'online', title: 'Online', display: 1}, // t('Online')
                    {cid: 'last_active', title: 'Last Activity', display: 1}, // t('Last Activity')
                    {cid: 'name', title: 'Name', display: 1}, {cid: 'country', title: 'Country', display: 1}, // t('Name'), t('Country')
                    {cid: 'language', title: 'Language', display: 1}, {cid: 'region', title: 'Region', display: 1}, // t('Language'), t('Region')
                    {cid: 'city', title: 'City', display: 1}, {cid: 'page', title: 'Page', display: 1}, // t('City'), t('Page')
                    {cid: 'search_string', title: 'Search string', display: 1}, {cid: 'host', title: 'Host', display: 1}, // t('Search string'), t('Host')
                    {cid: 'ip', title: 'IP address', display: 1}, {cid: 'email', title: 'Email', display: 1}, // t('IP address'), t('Email')
                    {cid: 'company', title: 'Company', display: 1}, {cid: 'browser', title: 'Browser', display: 1}, // t('Company'), t('Browser')
                    {cid: 'resolution', title: 'Resolution', display: 1}, {cid: 'os', title: 'Operating system', display: 1}, // t('Resolution'), t('Operating system')
                    {cid: 'last_visit', title: 'Last Visit', display: 1}, {cid: 'isp', title: 'ISP', display: 1}]; // t('Last Visit'), t('ISP')
            }
        } else if (table == 'archive' && columnArray instanceof Array) {
            if (columnArray instanceof Array && columnArray.length == 0) {
                newColumnArray = [
                    {index: 0, cid: 'date', title: 'Date', display: 1},
                    {index: 1, cid: 'chat_id', title: 'Chat ID', display: 1},
                    {index: 2, cid: 'name', title: 'Name', display: 1},
                    {index: 3, cid: 'operator', title: 'Operator', display: 1},
                    {index: 4, cid: 'group', title: 'Group', display: 1},
                    {index: 5, cid: 'email', title: 'Email', display: 1},
                    {index: 6, cid: 'company', title: 'Company', display: 1},
                    {index: 7, cid: 'question', title: 'Question', display: 1},
                    {index: 8, cid: 'language', title: 'Language', display: 1}, // t('Company'), t('Language')
                    {index: 9, cid: 'country', title: 'Country', display: 1},
                    {index: 10, cid: 'ip', title: 'IP', display: 1}, // t('Country'), t('IP')
                    {index: 11, cid: 'host', title: 'Host', display: 1},
                    {index: 12, cid: 'duration', title: 'Duration', display: 1}, // t('Host'), t('Duration')
                    {index: 13, cid: 'area_code', title: 'Area Code', display: 1},
                    {index: 14, cid: 'page_url', title: 'Url', display: 1},
                    {index: 15, cid: 'waiting_time', title: 'Waiting Time', display: 1}, // t('Area Code'), t('Url'), t('Waiting Time')
                    {index: 16, cid: 'result', title: 'Result', display: 1},
                    {index: 17, cid: 'ended_by', title: 'Ended By', display: 1}, // t('Result'), t('Ended By')
                    {index: 18, cid: 'callback', title: 'Callback', display: 1},
                    {index: 19, cid: 'phone', title: 'Phone', display: 1}]; // t('Callback'), t('Phone')
            }
        }
        else if (table == 'allchats' && columnArray instanceof Array)
        {
            if (columnArray instanceof Array && columnArray.length == 0) {
                newColumnArray = [
                    {cid: 'waiting_time', title: 'Waiting Time', display: 1},
                    {cid: 'status', title: 'Status', display: 1},
                    {cid: 'chat_id', title: 'Chat ID', display: 1, sort: 1, cell_style:'width:75px;padding-right:20px;'},
                    {cid: 'start_time', title: 'Start Time', display: 1, cell_style:'width:75px;'},
                    {cid: 'duration', title: 'Duration', display: 1, cell_style:'width:75px;'},
                    {cid: 'question', title: 'Question', display: 1, cell_style:'min-width:300px;white-space:normal;word-wrap:normal;', contenttitle: true},
                    {cid: 'operators', title: 'Operator', display: 1},
                    {cid: 'group', title: 'Group', display: 1},
                    {cid: 'name', title: 'Name', display: 1},
                    {cid: 'email', title: 'Email', display: 1},
                    {cid: 'company', title: 'Company', display: 1},
                    {cid: 'priority', title: 'Priority', display: 1},
                    {cid: 'previous_chats', title: 'Previous Chats', display: 1},
                    {cid: 'type', title: 'Type', display: 1}];
            }
        }
        else
        {
            newColumnArray = (type == 'general') ? lzm_chatDisplay.mainTableColumns[table] : lzm_chatDisplay.mainTableColumns[table + '_custom'];
            var configColumnArray = [];
            if(Object.keys(columnArray).length == newColumnArray.length)
            {
                for (key in columnArray)
                    for (i=0; i<newColumnArray.length; i++)
                        if(key == newColumnArray[i].cid){
                            newColumnArray[i].display = columnArray[key];
                            configColumnArray.push(newColumnArray[i]);
                        }
                newColumnArray = configColumnArray;
            }
        }
        lzm_chatDisplay.mainTableColumns[table] = newColumnArray;
    }
    else
    {
        if (!(columnArray instanceof Array)) {
            for (var key in columnArray) {
                if (columnArray.hasOwnProperty(key)) {
                    newColumnArray.push({cid: key, display: columnArray[key]});
                }
            }
        }
        lzm_chatDisplay.mainTableColumns[table + '_custom'] = newColumnArray;
        for (i=0; i<newColumnArray.length; i++) {
            if (lzm_chatServerEvaluation.inputList.getCustomInput(newColumnArray[i].cid) != null) {
                var columnIsVisible = (newColumnArray[i].display == 1);
                lzm_chatServerEvaluation.inputList.setDisplay(newColumnArray[i].cid, table, columnIsVisible);
            }
        }
    }

};

ChatDisplayHelperClass.prototype.createGeotrackingFootline = function() {
    //var normalMapButtonCss = (lzm_chatGeoTrackingMap.selectedMapType == 'SMARTMAP') ? {'background-color': '#5197ff','margin-left': '3px','margin-right': '3px'} : {};
    //var satelliteMapButtonCss = (lzm_chatGeoTrackingMap.selectedMapType == 'SATELLITE') ? {'background-color': '#5197ff'} : {};
    var disabledClass = ' ui-disabled', visitorId = '';
    if (lzm_chatGeoTrackingMap.selectedVisitor != null) {
        var visitor = lzm_chatServerEvaluation.visitors.getVisitor(lzm_chatGeoTrackingMap.selectedVisitor);
        if (visitor != null) {
            disabledClass = '';
            visitorId = visitor.id;
        }
    }
    var gtFootlineHtml = '<span style="float: left;">' +
        lzm_inputControls.createButton('smartmap-map', 'map-button map-type-button', 'setMapType(\'SMARTMAP\')', t('Normal'), '', 'lr', {'margin-left': '4px','margin-right': '3px'}, t('Normal map'), 12) +
        lzm_inputControls.createButton('satellite-map', 'map-button map-type-button', 'setMapType(\'SATELLITE\')', t('Satellite'), '', 'lr', {}, t('Satellite map'), 12) +
        lzm_inputControls.createButton('map-visitor-info', 'map-button' + disabledClass, 'selectView(\'external\');showVisitorInfo(\'' + visitorId + '\');', '', '<i class="fa fa-info"></i>', 'lr', {'margin-left': '3px','margin-right': '3px'}, t('Show visitor information')) +
        '</span><span style="float: right;">' +
        lzm_inputControls.createButton('map-zoom-in', 'map-button', 'zoomMap(1)', '', '<i class="fa fa-search-plus"></i>', 'lr', {}, t('Zoom in')) +
        lzm_inputControls.createButton('map-zoom-out', 'map-button', 'zoomMap(-1)', '', '<i class="fa fa-search-minus"></i>', 'lr',{'margin-left': '3px','margin-right': '4px'}, t('Zoom out')) +
        '</span>';

    return gtFootlineHtml;
};

ChatDisplayHelperClass.prototype.getChatPartner = function(chatPartner) {
    var chatPartnerName = '', chatPartnerUserId = '', i;
    if (typeof chatPartner != 'undefined' && chatPartner != '') {
        if (chatPartner.indexOf('~') != -1) {
            var visitor = lzm_chatServerEvaluation.visitors.getVisitor(chatPartner.split('~')[0]);
            if (visitor != null) {
                for (var j=0; j<visitor.b.length; j++) {
                    if (chatPartner.split('~')[1] == visitor.b[j].id) {
                        chatPartnerName = (visitor.b[j].cname != '') ?
                            visitor.b[j].cname : visitor.unique_name;
                    }
                }
            }
        } else {
            if (chatPartner == 'everyoneintern') {
                chatPartnerName = t('All operators');
                chatPartnerUserId = chatPartner;
            } else {
                var operator = lzm_chatServerEvaluation.operators.getOperator(chatPartner);
                var group = lzm_chatServerEvaluation.groups.getGroup(chatPartner);
                chatPartnerName = (operator != null) ? operator.name : (group != null) ? group.name : '';
                chatPartnerUserId = (operator != null) ? operator.userid : (group != null) ? group.id : '';
            }
        }
    } else {
        chatPartner = '';
    }
    if (chatPartnerName.length > 13) {
        chatPartnerName = chatPartnerName.substr(0,10) + '...';
    }

    return {name: chatPartnerName, userid: chatPartnerUserId};
};

/**************************************** Some general helper functions ****************************************/

ChatDisplayHelperClass.prototype.createTabControl = function(replaceElement, tabList, selectedTab, placeHolderWidth) {
    lzm_inputControls.createTabControl(replaceElement, tabList, selectedTab, placeHolderWidth);
};

ChatDisplayHelperClass.prototype.updateTabControl = function(replaceElement, oldTabList) {
    lzm_inputControls.updateTabControl(replaceElement, oldTabList);
};

ChatDisplayHelperClass.prototype.addTabControlEventHandler = function(replaceElement, tabList, firstVisibleTab, lastVisibleTab,
                                                                      thisTabWidth, leftTabWidth, rightTabWidth,
                                                                      visibleTabsWidth, placeHolderWidth, closedTabColor) {
    lzm_inputControls.addTabControlEventHandler(replaceElement, tabList, firstVisibleTab, lastVisibleTab, thisTabWidth, leftTabWidth,
        rightTabWidth, visibleTabsWidth, placeHolderWidth, closedTabColor);
};

ChatDisplayHelperClass.prototype.addBrowserSpecificGradient = function(imageString, color) {
    var a, b;
    switch (color) {
        case 'darkorange':
            a = '#FDB867';
            b = '#EDA148';
            break;
        case 'orange':
            a = '#FFCC73';
            b = '#FDB867';
            break;
        case 'darkgray':
            a = '#F6F6F6';
            b = '#E0E0E0';
            break;
        case 'blue':
            a = '#5197ff';
            b = '#6facd5';
            break;
        case 'background':
            a = '#e9e9e9';
            b = '#dddddd';
            break;
        case 'darkViewSelect':
            a = '#999999';
            b = '#797979';
            break;
        case 'selectedViewSelect':
            a = '#6facd5';
            b = '#5197ff';
            break;
        case 'tabs':
            a = '#d9d9d9';
            b = '#898989';
            break;
        default:
            a = '#FFFFFF';
            b = '#F1F1F1';
            break;
    }
    var gradientString = imageString;
    var cssTag = '';
    switch (this.browserName) {
        case 'ie':
            cssTag = '-ms-linear-gradient';
            break;
        case 'safari':
            cssTag = '-webkit-linear-gradient';
            break;
        case 'chrome':
            if (this.browserVersion >= 25)
                cssTag = 'linear-gradient';
            else
                cssTag = '-webkit-linear-gradient';
            break;
        case 'opera':
            cssTag = '-o-linear-gradient';
            break;
        case 'mozilla':
            cssTag = '-moz-linear-gradient';
            break;
        default:
            cssTag = 'linear-gradient';
            break;
    }
    if ((this.browserName == 'ie' && this.browserVersion >= 10) ||
        (this.browserName == 'chrome' && this.browserVersion >= 18) ||
        (this.browserName == 'safari' && this.browserVersion >= 5) ||
        (this.browserName == 'opera' && this.browserVersion >= 12) ||
        (this.browserName == 'mozilla' && this.browserVersion >= 10)){
        switch (imageString) {
            case '':
                gradientString = cssTag + '(' + a + ',' + b + ')';
                break;
            case 'text':
                gradientString = 'background-image: ' + cssTag + '(' + a + ',' + b + ')';
                break;
            default:
                gradientString += ', ' + cssTag + '(' + a + ',' + b + ')';
                break;
        }
    }
    return gradientString
};

ChatDisplayHelperClass.prototype.getScrollBarWidth = function() {
    var htmlString = '<div id="get-scrollbar-width-div" style="position: absolute; left: 0px; top: -9999px;' +
        'width: 100px; height:100px; overflow-y:scroll;"></div>';
    $('body').append(htmlString).trigger('create');
    var getScrollbarWidthDiv = $('#get-scrollbar-width-div');
    var scrollbarWidth = getScrollbarWidthDiv[0].offsetWidth - getScrollbarWidthDiv[0].clientWidth;
    getScrollbarWidthDiv.remove();

    return scrollbarWidth;
};

ChatDisplayHelperClass.prototype.getScrollBarHeight = function() {
    var htmlString = '<div id="get-scrollbar-height-div" style="position: absolute; left: 0px; top: -9999px;' +
        'width: 100px; height:100px; overflow-x:scroll;"></div>';
    $('body').append(htmlString).trigger('create');
    var getScrollbarHeightDiv = $('#get-scrollbar-height-div');
    var scrollbarHeight = getScrollbarHeightDiv[0].offsetHeight - getScrollbarHeightDiv[0].clientHeight;
    getScrollbarHeightDiv.remove();

    return scrollbarHeight;
};

ChatDisplayHelperClass.prototype.checkIfScrollbarVisible = function(id, position) {
    position = (typeof position != 'undefined') ? position : 'vertical';
    var myElement = $('#' + id);
    var padding;
    if (position == 'vertical') {
        padding = parseInt($(myElement).css('padding-top')) + parseInt($(myElement).css('padding-bottom'));
    } else {
        padding = parseInt($(myElement).css('padding-right')) + parseInt($(myElement).css('padding-left'));
    }
    try {
        if (position == 'vertical') {
            return (myElement[0].scrollHeight > (myElement.height() + padding));
        } else {
            return (myElement[0].scrollWidth > (myElement.width() + padding));
        }
    } catch(e) {
        return false;
    }
};

ChatDisplayHelperClass.prototype.replaceSmileys = function(text) {
    var previousSigns = [{pt: ' ', rp: ' '}, {pt: '>', rp: '>'}, {pt: '&nbsp;', rp: '&nbsp;'}, {pt: '^', rp: ''}];
    var shorts = [':-)','::smile',':)',':-(','::sad',':(',':-]','::lol',';-)','::wink',';)',
        ':\'-(','::cry',':-O','::shocked',':-\\\\','::sick',':-p','::tongue',':-P',':?','::question','8-)',
        '::cool','zzZZ','::sleep',':-|','::neutral'];
    var images = ["smile","smile","smile","sad","sad","sad","lol","lol","wink","wink","wink","cry","cry",
        "shocked","shocked","sick","sick","tongue","tongue","tongue","question","question","cool","cool","sleep",
        "sleep","neutral","neutral"];
    for (var i=0; i<previousSigns.length; i++) {
        for (var j=0; j<shorts.length; j++) {
            var myRegExp = new RegExp(previousSigns[i].pt + RegExp.escape(shorts[j]), 'g');
            var rplString = previousSigns[i].rp + '<span style="padding:3px 10px 2px 10px;' +
                ' background: url(\'../images/smilies/' + images[j] + '.gif\'); background-position: center;' +
                ' background-repeat: no-repeat;">&nbsp;</span>';
            text = text.replace(myRegExp, rplString);
        }
    }
    return text;
};

ChatDisplayHelperClass.prototype.matchSearch = function(searchFor,value){
    if(!d(value)||!d(searchFor))
        return false;
    if(value==''||searchFor=='')
        return false;
    return (value.toLowerCase().indexOf(searchFor.toLowerCase()) !== -1);
}

ChatDisplayHelperClass.prototype.showBrowserNotification = function(params) {
    var thisClass = this;
    params = (typeof  params != 'undefined') ? params : {};
    if (lzm_chatTimeStamp.getServerTimeString(null, false, 1) - this.showBrowserNotificationTime > 10000) {
        this.showBrowserNotificationTime = lzm_chatTimeStamp.getServerTimeString(null, false, 1);

        var text = (typeof params.text != 'undefined') ? params.text : '';
        text = (text.length > 110) ? text.substr(0, 110) + '...' : text;

        var sender = (typeof params.sender != 'undefined') ? params.sender : '';
        sender = (sender.length > 71) ? sender.substr(0, 68) + '...' : sender;

        var subject = (typeof params.subject != 'undefined') ? params.subject : '';
        var onclickAction = (typeof params.action != 'undefined' && params.action != '') ?
            ' onclick="' + params.action + '; ' + this.getMyObjectName() + '.removeBrowserNotification();"' : '';
        var notificationHtml = '<div id="browser-notification" class="lzm-notification"' + onclickAction + '>' +
            '<div id="browser-notification-body" class="lzm-notification-body">' +
            '<div style="top:5px;font-weight: bold;font-size:14px;color:#666;">' + lzm_commonTools.htmlEntities(subject) + '</div>' +
            '<div style="top:29px;">' + lzm_commonTools.htmlEntities(sender) + '</div>' +
            '<div style="top:50px;font-style:italic;">' + lzm_commonTools.htmlEntities(text) + '</div>' +
            '</div>' +

            '<i class="lzm-notification-close-bg" onclick="' + this.getMyObjectName() + '.removeBrowserNotification(event);"></i>' +
            '<i id="close-notification" onclick="' + this.getMyObjectName() + '.removeBrowserNotification(event);" class="lzm-notification-close fa fa-remove"></i>' +

            ((typeof params.icon != 'undefined') ? '<i class="lzm-notification-bg-logo fa '+params.icon+'"></i>' : '') +

            '</div>';
        $('body').append(notificationHtml);

        if (typeof params.timeout == 'number' && params.timeout > 0) {
            setTimeout(function() {thisClass.removeBrowserNotification();}, params.timeout * 1000);
        }
    }
};

ChatDisplayHelperClass.prototype.removeBrowserNotification = function(e) {
    if (typeof e != 'undefined' && e != null) {
        e.stopPropagation();
    }
    $('#browser-notification').remove();
};

ChatDisplayHelperClass.prototype.blockUi = function(params) {
    var that = this;
    if ($('#lzm-alert-dialog-container').length == 0) {
        this.unblockUi();
        var rd = Math.floor(Math.random() * 9999);
        params.message = (typeof params.message != 'undefined') ? params.message : '';
        var myHeight = $(window).height();
        var myWidth = $(window).width();
        var messageWidth = Math.min(500, Math.floor(0.9 * myWidth)) - 80;

        var blockHtml = '<div class="lzm-block" id="lzm-block-' + rd + '"' +
            ' style="position: absolute; top: 0px; left: 0px; width: ' + myWidth + 'px; height: ' + myHeight + 'px;' +
            ' z-index: 2147483647; background-color: rgba(0,0,0,0.7); overflow-y: auto;">';
        if (params.message != null) {
            blockHtml += '<div class="lzm-block-message" id="lzm-block-message-' + rd + '"' +
                ' style="background-color: #f1f1f1; position: absolute; padding: 20px; border: 5px solid #aaa;' +
                ' border-radius: 4px; width: ' + messageWidth + 'px; overflow: hidden;">' + params.message +
                '</div>';
        }
        blockHtml += '</div>';
        $('body').append(blockHtml);

        if (params.message != null) {
            var messageHeight = $('#lzm-block-message-' + rd).height();
            var messageLeft = Math.max(20, Math.floor((myWidth - messageWidth - 50) / 2));
            var messageTop = Math.max(20, Math.floor((myHeight - messageHeight - 50) / 2));
            $('#lzm-block-message-' + rd).css({left: messageLeft+'px', top: messageTop+'px'});
        }
    } else {
        setTimeout(function() {
            that.blockUi(params);
        }, 500);
    }

};

ChatDisplayHelperClass.prototype.unblockUi = function() {
    $('.lzm-block').remove();
};

ChatDisplayHelperClass.prototype.createInputMenu = function(replaceElement, inputId, inputClass, width, placeHolder, value, selectList, scrollParent, selectmenuTopCorrection) {
    lzm_inputControls.createInputMenu(replaceElement, inputId, inputClass, width, placeHolder, value, selectList, scrollParent, selectmenuTopCorrection);
};

ChatDisplayHelperClass.prototype.createInput = function(myId, myClass, myText, myLabel, myIcon, myType, myLayoutType) {
    return lzm_inputControls.createInput(myId, myClass, myText, myLabel, myIcon, myType, myLayoutType);
};
