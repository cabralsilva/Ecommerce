/****************************************************************************************
 * LiveZilla ChatArchiveClass.js
 *
 * Copyright 2014 LiveZilla GmbH
 * All rights reserved.
 * LiveZilla is a registered trademark.
 *
 ***************************************************************************************/
function ChatArchiveClass() {

}

ChatArchiveClass.prototype.createArchive = function() {
    var that = this;
    var chatArchive = lzm_chatServerEvaluation.chatArchive;
    $('#archive-headline').html('<h3>' + t('Chat Archive') + '</h3>');
    $('#archive-headline2').html(that.createArchiveHeaderControls(lzm_chatPollServer.chatArchivePage, chatArchive.q, chatArchive.p, chatArchive.t,lzm_chatPollServer.chatArchiveFilter, lzm_chatPollServer.chatArchiveQuery)).trigger('create');
    $('#archive-body').html(that.createArchiveHtml(chatArchive.chats));
    $('#archive-footline').html(that.createArchivePagingHtml(lzm_chatPollServer.chatArchivePage, chatArchive.q, chatArchive.p));
    if (lzm_chatPollServer.chatArchiveQuery != '') {
        that.styleArchiveClearBtn();
    }

    if (lzm_chatPollServer.chatArchiveQuery != '')
        $('#archive-filter').addClass('ui-disabled');
    else
        $('#archive-filter').removeClass('ui-disabled');

    $('#search-archive').keyup(function(e) {
        lzm_chatDisplay.searchButtonUp('archive', chatArchive.chats, e);
    });
    $('#search-archive').keydown(function(e) {
        lzm_chatDisplay.searchButtonChange('archive');
    });
    $('#search-archive').keydown();

    $('#search-archive-icon').click(function() {
        $('#search-archive').val('');
        $('#search-archive').keyup();
    });

    lzm_displayLayout.resizeArchive();
};

ChatArchiveClass.prototype.updateArchive = function(pollObject) {

    pollObject = (typeof pollObject != 'undefined') ? pollObject : null;
    var customDemandToken = (pollObject != null && pollObject.p_cdt != 0) ? pollObject.p_cdt : false;
    var chatArchive = lzm_chatServerEvaluation.chatArchive.chats, that = this, selectedChatId = '';

    if(customDemandToken)
        chatArchive = lzm_chatDisplay.archiveControlChats[customDemandToken];

    if(!d(chatArchive))
        chatArchive = [];

    if (customDemandToken && $('#matching-chats-d-'+customDemandToken+'-inner').length) {
        selectedChatId = $('#matching-chats-d-'+customDemandToken+'-table').data('selected-chat-id');
        selectedChatId = (selectedChatId != '') ? selectedChatId : (chatArchive.length > 0) ? chatArchive[0].cid : '';
        $('#matching-chats-d-'+customDemandToken+'-inner').html(that.createArchiveHtml(chatArchive, selectedChatId, true, 'd-'+customDemandToken));
        selectArchivedChat(selectedChatId, true, 'd-'+customDemandToken);
    }
    else if (customDemandToken && $('#matching-chats-e-'+customDemandToken+'-inner').length) {
        selectedChatId = $('#matching-chats-e-'+customDemandToken+'-table').data('selected-chat-id');
        selectedChatId = (selectedChatId != '') ? selectedChatId : (d(chatArchive) && chatArchive.length > 0) ? chatArchive[0].cid : '';
        $('#matching-chats-e-'+customDemandToken+'-inner').html(that.createArchiveHtml(chatArchive, selectedChatId, true, 'e-'+customDemandToken));
        selectArchivedChat(selectedChatId, true, 'e-'+customDemandToken);
    }
    else {

        $('#archive-body').html(that.createArchiveHtml(chatArchive));
        $('#archive-footline').html(that.createArchivePagingHtml(lzm_chatPollServer.chatArchivePage, lzm_chatServerEvaluation.chatArchive.q, lzm_chatServerEvaluation.chatArchive.p));
        lzm_displayLayout.resizeArchive();
        selectArchivedChat();
    }

    var numberOfChats = chatArchive.length;
    if (customDemandToken && $('#visitor-info-d-'+customDemandToken+'-placeholder').length > 0) {
        $('#visitor-info-d-'+customDemandToken+'-placeholder-tab-5').html(t('Chats (<!--number_of_chats-->)', [['<!--number_of_chats-->', numberOfChats]]));
        if(numberOfChats>0){
            $('#visitor-info-d-'+customDemandToken+'-placeholder-tab-5').removeClass('ui-disabled');
            $('#visitor-info-d-'+customDemandToken+'-placeholder-tab-5').addClass('lzm-tabs-message');
        }
    }
    if (customDemandToken && $('#visitor-info-e-'+customDemandToken+'-placeholder').length > 0) {
        $('#visitor-info-e-'+customDemandToken+'-placeholder-tab-5').html(t('Chats (<!--number_of_chats-->)', [['<!--number_of_chats-->', numberOfChats]]));
        if(numberOfChats>0){
            $('#visitor-info-e-'+customDemandToken+'-placeholder-tab-5').removeClass('ui-disabled');
            $('#visitor-info-e-'+customDemandToken+'-placeholder-tab-5').addClass('lzm-tabs-message');
        }
    }

    if ($('#ticket-linker-first').length > 0) {
        var position = $('#ticket-linker-first').data('search').split('~')[0];
        var linkerType = $('#ticket-linker-first').data('search').split('~')[1];
        var inputChangeId = $('#ticket-linker-first').data('input');
        if (linkerType == 'chat')
            that.fillLinkData(position, $('#' + inputChangeId).val(), false);
    }
};

ChatArchiveClass.prototype.styleArchiveClearBtn = function() {
    var ctsBtnWidth = $('#clear-archive-search').width(), that = this;
    var ctsBtnHeight =  $('#clear-archive-search').height();
    var ctsBtnPadding = Math.floor((18-ctsBtnHeight)/2)+'px ' +  Math.floor((18-ctsBtnWidth)/2)+'px ' + Math.ceil((18-ctsBtnHeight)/2)+'px ' +  Math.ceil((18-ctsBtnWidth)/2)+'px';
    $('#clear-archive-search').css({padding: ctsBtnPadding});
};

ChatArchiveClass.prototype.showArchivedChat = function(cpId, cpName, chatId, chatType, elementId) {

    var that = this;
    var menuEntry = t('Matching Chats: <!--cp_name-->', [['<!--cp_name-->', cpName]]);
    var headerString = t('Matching Chats');
    var footerString = lzm_inputControls.createButton('cancel-matching-'+elementId+'-chats', '', '', t('Close'), '', 'lr',{'margin-left': '4px'},'',30,'d');
    var bodyString = '<div id="matching-chats-'+elementId+'-placeholder"></div>';

    var tableString = '<div class="lzm-dialog-headline3">' +
        lzm_inputControls.createButton('link-with-'+elementId+'-ticket', '', '', t('Link with Ticket'),'<i class="fa fa-link"></i>', 'lr', {float:'right','margin-left': '4px','margin-right': '4px'});

    tableString += '</div>' + that.createMatchingChats(chatId,elementId) + '<fieldset class="lzm-fieldset" style="margin:0;" data-role="none" id="chat-content-'+elementId+'-inner"><span>' + t('Text') + '</span></fieldset>';
    var dialogData = {'cp-id': cpId, 'cp-name': cpName, 'chat-type': chatType, menu: menuEntry, reload: ['chats']};
    var dialogid = lzm_displayHelper.createDialogWindow(headerString, bodyString, footerString, 'matching-chats', {}, {}, {}, {}, '', dialogData, true, true);
    lzm_displayHelper.createTabControl('matching-chats-'+elementId+'-placeholder', [{name: headerString, content: tableString}]);
    lzm_displayLayout.resizeArchivedChat(elementId);

    $('#matching-chats-'+elementId+'-inner-div').data('chat-dialog-id', dialogid);
    $('#matching-chats-'+elementId+'-inner-div').data('chat-dialog-window', 'matching-chats');
    $('#matching-chats-'+elementId+'-inner-div').data('chat-dialog-data', dialogData);
    $('#send-chat-'+elementId+'-transcript').click(function() {
        var chatId = $('#matching-chats-'+elementId+'-table').data('selected-chat-id');
        sendChatTranscriptTo(chatId, dialogid, 'matching-chats', dialogData);
    });
    $('#link-with-'+elementId+'-ticket').click(function() {
        var chatId = $('#matching-chats-'+elementId+'-table').data('selected-chat-id');
        showTicketLinker('', chatId, null, 'chat', true);
    });
    $('#cancel-matching-'+elementId+'-chats').click(function() {
        lzm_displayHelper.removeDialogWindow('matching-chats');
    })
};

ChatArchiveClass.prototype.createArchiveHtml = function(chatArchive, chatId, inDialog, elementId) {
    chatArchive = (d(chatArchive)) ? chatArchive : [];
    chatId = (typeof chatId != 'undefined' && chatId != '') ? chatId : (chatArchive.length > 0) ? chatArchive[0].cid : '';
    elementId = (typeof elementId != 'undefined') ? elementId : '';
    inDialog = (typeof inDialog != 'undefined') ? inDialog : false;

    var i, that = this, archiveHtml = '';
    var tableId = (inDialog) ? 'matching-chats-'+elementId+'-table' : 'chat-archive-table';
    var style = (inDialog) ? ' style="margin-top:1px;"' : '';

    if(!inDialog)
        archiveHtml += '<div id="archive-list-left">';

    archiveHtml += '<table id="' + tableId + '" class="visible-list-table alternating-rows-table lzm-unselectable"' + ' data-selected-chat-id="' + chatId + '"'+style+'><thead><tr>';
    for (i=0; i<lzm_chatDisplay.mainTableColumns.archive.length; i++) {
        if (lzm_chatDisplay.mainTableColumns.archive[i].display == 1) {
            archiveHtml += '<th style="white-space: nowrap;">' + t(lzm_chatDisplay.mainTableColumns.archive[i].title) + '</th>';
        }
    }
    for (i=0; i<lzm_chatServerEvaluation.inputList.idList.length; i++) {
        var myCustomInput = lzm_chatServerEvaluation.inputList.getCustomInput(lzm_chatServerEvaluation.inputList.idList[i]);
        if (myCustomInput.active == 1 && parseInt(myCustomInput.id) < 111 && myCustomInput.display.archive) {
            archiveHtml += '<th>' + myCustomInput.name + '</th>';
        }
    }
    archiveHtml += '</tr></thead><tbody>';
    for (i=0; i<chatArchive.length; i++)
        archiveHtml += that.createArchiveListLine(chatArchive[i], chatId, inDialog, elementId);

    archiveHtml += '</tbody></table>';

    if(!inDialog)
        archiveHtml += '</div><div id="archive-list-right" class="archive-list" style="display: block;"></div>';

    return archiveHtml;
};

ChatArchiveClass.prototype.createArchiveListLine = function(aChat, selectedChatId, inDialog, elementId) {
    var name = '', operatorName = '-', groupName = '-', searchClass = '';
    var date = lzm_commonTools.getHumanDate(lzm_chatTimeStamp.getLocalTimeObject(aChat.ts * 1000, true), '', lzm_chatDisplay.userLanguage);
    var opId, cpId, qId;
    if (aChat.t == 0) {
        var opList = aChat.iid.split('-');
        var myPosition = $.inArray(lzm_chatDisplay.myId, opList);
        if (myPosition != -1) {
            opId = opList[myPosition];
            cpId = opList[1 - myPosition];
        } else {
            opId = opList[0];
            cpId = opList[1];
        }
        qId = aChat.iid;
    } else {
        opId = aChat.iid;
        cpId = (aChat.eid != '') ? aChat.eid : aChat.gid;
        qId = cpId;
    }
    try {
        name = (aChat.t == 0) ? lzm_chatServerEvaluation.operators.getOperator(cpId).name : (aChat.t == 1) ?
            lzm_commonTools.htmlEntities(aChat.en) : (aChat.gid == 'everyoneintern') ? t('All operators') : capitalize(aChat.gid);
    } catch (e) {}
    try {
        var operator = lzm_chatServerEvaluation.operators.getOperator(opId);
        operatorName = (operator != null) ? operator.name : '-';
    } catch (e) {}
    try {
        groupName = (aChat.gid != '') ? (aChat.gid != 'everyoneintern') ? lzm_chatServerEvaluation.groups.getGroup(aChat.gid).name : t('All operators') : '-';
    } catch (e) {groupName = aChat.gid;}
    var area = (aChat.ac != '') ? aChat.ac : '-';
    var waitingTime = (aChat.t == 1) ? lzm_commonTools.getHumanTimeSpan(parseInt(aChat.wt)) : '-';
	var duration = (aChat.t == 1) ? lzm_commonTools.getHumanTimeSpan(parseInt(aChat.dt)) : '-';
    var result = (aChat.t == 1) ? (aChat.sr == 0) ? t('Missed') : (aChat.sr == 1) ? t('Accepted') : t('Declined') : '-';
    var endedBy = (aChat.t == 1) ? (aChat.er == 0) ? t('User') : tid('operator') : '-';
    var callBack = (aChat.t == 1) ? (aChat.cmb != 0) ? t('Yes') : t('No') : '-';
    var email = (aChat.em != '') ? lzm_commonTools.htmlEntities(aChat.em) : '-';
    var company = (aChat.co != '') ? lzm_commonTools.htmlEntities(aChat.co) : '-';
    var language = (aChat.il != '') ? aChat.il : '-';
    var langName = (typeof lzm_chatDisplay.availableLanguages[language.toLowerCase()] != 'undefined') ? lzm_chatDisplay.availableLanguages[language.toLowerCase()] : (typeof lzm_chatDisplay.availableLanguages[language.toLowerCase().split('-')[0]] != 'undefined') ?lzm_chatDisplay.availableLanguages[language.toLowerCase().split('-')[0]] :language;
    var country = (aChat.ic != '') ? aChat.ic : '-';
    var ipAddress = (aChat.ip != '') ? aChat.ip : '-';
    var host = (aChat.ho != '') ? aChat.ho : '-';
    var phone = (aChat.cp != '') ? lzm_commonTools.htmlEntities(aChat.cp) : '-';
    var question = (aChat.q != '') ? lzm_commonTools.htmlEntities(aChat.q) : '-';
    var action = ' onclick="selectArchivedChat(\'' + aChat.cid + '\', true,\''+elementId+'\');"';
    if (!inDialog) {
        var onclickAction = (!lzm_chatDisplay.isApp && !lzm_chatDisplay.isMobile) ? ' onclick="selectArchivedChat(\'' + aChat.cid + '\', false,\''+elementId+'\');"' : ' onclick="openArchiveListContextMenu(event, \'' + aChat.cid + '\',\''+elementId+'\');"';
        var ondblclickAction = (!lzm_chatDisplay.isApp && !lzm_chatDisplay.isMobile) ? ' ondblclick="showArchivedChat(\'' + qId + '\', \'' + name + '\', \'' + aChat.cid + '\', \'' + aChat.t + '\');"' : '';
        var oncontextmenuAction = (!lzm_chatDisplay.isApp && !lzm_chatDisplay.isMobile) ? ' oncontextmenu="openArchiveListContextMenu(event, \'' + aChat.cid + '\',\''+elementId+'\');"' : '';
        action = onclickAction + ondblclickAction + oncontextmenuAction;
    }
    var pageUrl = (typeof aChat.u != 'undefined' && aChat.u != '') ? aChat.u : '-';
    var columnContents = [{cid: 'date', contents: date}, {cid: 'chat_id', contents: aChat.cid},
        {cid: 'name', contents: name}, {cid: 'operator', contents: operatorName}, {cid: 'group', contents: groupName},
        {cid: 'email', contents: email}, {cid: 'company', contents: company}, {cid: 'language', contents: langName},
        {cid: 'country', contents: country}, {cid: 'ip', contents: ipAddress}, {cid: 'host', contents: host},
        {cid: 'duration', contents: duration}, {cid: 'area_code', contents: area}, {cid: 'page_url', contents: pageUrl},
        {cid: 'waiting_time', contents: waitingTime},
        {cid: 'result', contents: result}, {cid: 'ended_by', contents: endedBy}, {cid: 'callback', contents: callBack},
        {cid: 'phone', contents: phone},
        {cid: 'question', contents: question}];
    var selectedClass = (aChat.cid == selectedChatId) ? ' selected-table-line' : '';
    var lineAttributes = (inDialog) ?
        ' data-chat-id="' + aChat.cid + '" id="dialog-archive-list-'+elementId+'-line-' + aChat.cid + '" class="archive-list-'+elementId+'-line' + selectedClass + '"' :
        ' id="archive-list-line-' + aChat.cid + '" class="archive-list-line' + selectedClass + '"';

    var searchFor = $('#search-archive').val();
    var archiveLineHtml = '<tr' + action + lineAttributes + '>';
    for (i=0; i<lzm_chatDisplay.mainTableColumns.archive.length; i++) {
        for (j=0; j<columnContents.length; j++) {
            if (lzm_chatDisplay.mainTableColumns.archive[i].cid == columnContents[j].cid && lzm_chatDisplay.mainTableColumns.archive[i].display == 1) {

                searchClass = (lzm_displayHelper.matchSearch(searchFor,columnContents[j].contents)) ? ' class="search-match"' : '';
                archiveLineHtml += '<td style="white-space: nowrap"'+searchClass+'>' + columnContents[j].contents + '</td>';
            }
        }
    }
    for (var i=0; i<lzm_chatServerEvaluation.inputList.idList.length; i++) {
        var myCustomInput = lzm_chatServerEvaluation.inputList.getCustomInput(lzm_chatServerEvaluation.inputList.idList[i]);
        if (myCustomInput.active == 1 && parseInt(myCustomInput.id) < 111 && myCustomInput.display.archive) {
            var inputText = '';
            for (var j=0; j<aChat.cc.length; j++) {
                if (aChat.cc[j].cuid == myCustomInput.name)
                    inputText = (myCustomInput.type != 'CheckBox') ? lzm_commonTools.htmlEntities(aChat.cc[j].text) : (aChat.cc[j].text == 1) ? t('Yes') : t('No');
            }
            inputText = (inputText != '') ? inputText : '-';
            archiveLineHtml += '<td>' + inputText + '</td>';
        }
    }
    archiveLineHtml += '</tr>';
    return archiveLineHtml;
};

ChatArchiveClass.prototype.createArchivePagingHtml = function(page, amount, amountPerPage) {
    var numberOfPages = Math.max(1, Math.ceil(amount / amountPerPage));
    var pagingHtml = '<span id="archive-paging">';
    var leftDisabled = (page == 1) ? ' ui-disabled' : '';
    var rightDisabled = (page == numberOfPages) ? ' ui-disabled' : '';
    if (!isNaN(numberOfPages)) {
        pagingHtml += lzm_inputControls.createButton('archive-page-all-backward', 'archive-list-page-button' + leftDisabled, 'pageArchiveList(1);', '', '<i class="fa fa-fast-backward"></i>', 'l',
            {'border-right-width': '1px'}) +
            lzm_inputControls.createButton('archive-page-one-backward', 'archive-list-page-button' + leftDisabled, 'pageArchiveList(' + (page - 1) + ');', '', '<i class="fa fa-backward"></i>', 'r',
                {'border-left-width': '1px'}) +
            '<span style="padding: 0px 15px;">' + t('Page <!--this_page--> of <!--total_pages-->',[['<!--this_page-->', page], ['<!--total_pages-->', numberOfPages]]) + '</span>' +
            lzm_inputControls.createButton('archive-page-one-forward', 'archive-list-page-button' + rightDisabled, 'pageArchiveList(' + (page + 1) + ');', '', '<i class="fa fa-forward"></i>', 'l',
                {'border-right-width': '1px'}) +
            lzm_inputControls.createButton('archive-page-all-forward', 'archive-list-page-button' + rightDisabled, 'pageArchiveList(' + numberOfPages + ');', '', '<i class="fa fa-fast-forward"></i>', 'r',
                {'border-left-width': '1px'});
    }
    pagingHtml += '</span>';
    return pagingHtml;
};

ChatArchiveClass.prototype.createArchiveHeaderControls = function(page, amount, amountPerPage, totalAmount, filter, query) {
    var controlHtml = '';
    if ($(window).width() > 500) {
        controlHtml += '<span class="lzm-dialog-hl2-info">';
        if (query != '' || filter != '012') {
            controlHtml += t('<!--total_amount--> total entries, <!--amount--> matching filter', [['<!--total_amount-->', totalAmount], ['<!--amount-->', amount]]);
        } else {
            controlHtml += t('<!--total_amount--> total entries, no filter selected', [['<!--total_amount-->', totalAmount]]);
        }
        controlHtml += '</span>';
    }

    controlHtml += '<span style="float: right; margin-right: 129px; padding-top: 4px;">' +
        lzm_inputControls.createButton('archive-filter', '', 'openArchiveFilterMenu(event, \'' + filter + '\')', t('Filter'), '<i class="fa fa-filter"></i>', 'lr', {'margin-right': '8px'}, '', 10) + '</span>' +
        lzm_inputControls.createInput('search-archive','', query, t('Search'), '<i class="fa fa-remove"></i>', 'text', 'b');

    return controlHtml;
};

ChatArchiveClass.prototype.createMatchingChats = function(chatId, elementId) {
    elementId = (typeof elementId != 'undefined') ? elementId : '';
    var that = this;
    var matchingChatsHtml = '<div id="matching-chats-'+elementId+'-inner-div"><div data-role="none" id="matching-chats-'+elementId+'-inner">' + that.createArchiveHtml([], chatId, true,elementId) + '</div></div>';
    return matchingChatsHtml;
};

ChatArchiveClass.prototype.sendChatTranscriptTo = function(chatId, dialogId, windowId, dialogData) {
    var receiverList = lzm_inputControls.createInput('send-transcript-to-email','', '', t('Email addresses: (separate by comma)'), '<i class="fa fa-envelope"></i>', 'text','a');
    lzm_commonDialog.createAlertDialog(receiverList, [{id: 'ok', name: tid('ok')},{id: 'cancel', name: tid('cancel')}],false,true,false);
    $('#alert-btn-ok').click(function() {
        lzm_chatPollServer.pollServerSpecial({em: $('#send-transcript-to-email').val(), cid: chatId}, 'send-chat-transcript');
        $('#alert-btn-cancel').click();
    });
    $('#alert-btn-cancel').click(function() {
        lzm_commonDialog.removeAlertDialog();
    });
};

ChatArchiveClass.prototype.fillLinkData = function(chatId, onlyReturnHtml) {
    onlyReturnHtml = (typeof onlyReturnHtml != 'undefined') ? onlyReturnHtml : false;
    var myChat = null, tableString = '';
    for (i=0; i<lzm_chatServerEvaluation.chatArchive.chats.length; i++) {
        if (lzm_chatServerEvaluation.chatArchive.chats[i].cid == chatId) {
            myChat = lzm_commonTools.clone(lzm_chatServerEvaluation.chatArchive.chats[i]);
        }
    }
    if (myChat != null) {
        var chatDate = lzm_chatTimeStamp.getLocalTimeObject(myChat.ts * 1000, true);
        var chatDateHuman = lzm_commonTools.getHumanDate(chatDate, 'full', lzm_chatDisplay.userLanguage);
        var op = (myChat.iid.indexOf('-') != -1) ? lzm_chatServerEvaluation.operators.getOperator(myChat.iid.split('-')[1]) : null;
        var gr = lzm_chatServerEvaluation.groups.getGroup(myChat.gid);
        var cpName = (myChat.eid != '') ? lzm_commonTools.escapeHtml(myChat.en) : (op != null) ? op.name : (gr != null) ? gr.name :
            (myChat.gid == 'everyoneintern') ? t('All operators') : '';
        tableString = '<table>' +
            '<tr><th rowspan="6"><i class="fa fa-comments icon-blue icon-xl"></i></th><th>' + t('Name:') + '</th><td>' + cpName + '</td></tr>' +
            '<tr><th>' + t('Email:') + '</th><td>' + lzm_commonTools.escapeHtml(myChat.em) + '</td></tr>' +
            '<tr><th>' + t('Company:') + '</th><td>' + lzm_commonTools.escapeHtml(myChat.co) + '</td></tr>' +
            '<tr><th>' + t('Phone:') + '</th><td>' + lzm_commonTools.escapeHtml(myChat.cp) + '</td></tr>' +
            '<tr><th>' + t('Date:') + '</th><td>' + chatDateHuman + '</td></tr>' +
            '<tr><th>' + t('Visitor ID:') + '</th><td>' + myChat.eid + '</td></tr>' +
            '</table>';
        if (!onlyReturnHtml)
            $('#second-link-div').css({'visibility': 'visible'});
    } else {
        if (!onlyReturnHtml)
            $('#second-link-div').css({'visibility': 'hidden'});
    }
    if (!onlyReturnHtml)
        $('#second-link-div').html(tableString);
    return tableString;
};

ChatArchiveClass.prototype.createArchiveFilterMenu = function(myObject) {
    var filterList = [], contextMenuHtml = '';
    filterList = myObject.filter.split('');
    for (var i=0; i<4; i++) {
        if ($.inArray(i.toString(), filterList) != -1) {
            lzm_chatDisplay.archiveFilterChecked[i] = 'visible';
        } else {
            lzm_chatDisplay.archiveFilterChecked[i] = 'hidden';
        }
    }
    contextMenuHtml += '<div onclick="toggleArchiveFilter(0, event)"><span id="toggle-archive-open" class="cm-line cm-click" style="padding-left: 0px;">' +t('<!--checked--> Operators', [['<!--checked-->', '<span style="visibility: ' + lzm_chatDisplay.archiveFilterChecked[0] + ';">&#10003;</span>']]) + '</span></div>';
    contextMenuHtml += '<div onclick="toggleArchiveFilter(1, event)"><span id="toggle-archive-progress" class="cm-line cm-click" style="padding-left: 0px;">' +t('<!--checked--> Visitors', [['<!--checked-->', '<span style="visibility: ' + lzm_chatDisplay.archiveFilterChecked[1] + ';">&#10003;</span>']]) + '</span></div>';
    contextMenuHtml += '<div onclick="toggleArchiveFilter(2, event)"><span id="toggle-archive-closed" class="cm-line cm-click" style="padding-left: 0px;">' +t('<!--checked--> Groups', [['<!--checked-->', '<span style="visibility: ' + lzm_chatDisplay.archiveFilterChecked[2] + ';">&#10003;</span>']]) + '</span></div>';
    return contextMenuHtml;
};

ChatArchiveClass.prototype.createArchiveContextMenu = function(myObject) {
    var name = '', cpId = '', qId = '', contextMenuHtml = '', disabledClass = '';
    if (myObject.t == 0) {
        var opList = myObject.iid.split('-');
        var myPosition = $.inArray(lzm_chatDisplay.myId, opList);
        if (myPosition != -1) {
            cpId = opList[1 - myPosition];
        } else {
            cpId = opList[1];
        }
        qId = myObject.iid;
    } else {
        cpId = (myObject.eid != '') ? myObject.eid : myObject.gid;
        qId = cpId;
    }
    try {
        name = (myObject.t == 0) ? lzm_chatServerEvaluation.operators.getOperator(cpId).name : (myObject.t == 1) ?
            lzm_commonTools.htmlEntities(myObject.en) : (myObject.gid == 'everyoneintern') ? t('All operators') : capitalize(myObject.gid);
    } catch (e) {}
    contextMenuHtml += '<div onclick="sendChatTranscriptTo(\'' + myObject.cid + '\');">' +
        '<span id="archive-send-transcript" class="cm-line cm-click">' +
        t('Send transcript to...') + '</span></div><hr />';
    contextMenuHtml += '<div onclick="showTicketLinker(\'\', \'' + myObject.cid + '\', \'ticket\', \'chat\');">' +
        '<i class="fa fa-link"></i>' +
        '<span id="archive-link-with-ticket" class="cm-line cm-click cm-line-icon-left">' +
        t('Link with Ticket') + '</span></div>';
    disabledClass = (myObject.t == 0 || myObject.t == 2) ? ' class="ui-disabled"' : '';
    contextMenuHtml += '<div' + disabledClass + ' onclick="showTicketDetails(\'\', false, \'\', \'' + myObject.cid + '\');"><span id="archive-create-ticket" class="cm-line cm-click">' + t('Create Ticket') + '</span></div>';
    contextMenuHtml += '<div onclick="showArchivedChat(\'' + qId + '\', \'' + name + '\', \'' + myObject.cid + '\', \'' + myObject.t + '\');">' + '<span id="archive-show-chats" class="cm-line cm-click">' +t('All Chats of this User') + '</span></div><hr />';
    contextMenuHtml += '<div onclick="printArchivedChat(\'' + myObject.cid + '\');"><i class="fa fa-print"></i><span id="archive-print-chat" class="cm-line cm-click cm-line-icon-left">' +t('Print Chat') + '</span></div>';
    return contextMenuHtml;
};
