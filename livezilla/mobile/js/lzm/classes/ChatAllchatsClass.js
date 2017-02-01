/****************************************************************************************
 * LiveZilla ChatAllchatsClass.js
 *
 * Copyright 2016 LiveZilla GmbH
 * All rights reserved.
 * LiveZilla is a registered trademark.
 *
 ***************************************************************************************/
function ChatAllchatsClass() {
    this.dataHash = '';
    this.allChats = {};
    this.missedChats = [];
    this.chatCounter = {a: 0, q: 0};
    this.columnCount = 0;
    this.showMissedChats = true;
}

ChatAllchatsClass.prototype.createAllchats = function() {
    this.showMissedChats = lzm_commonStorage.loadValue('show_missed_chats_' + lzm_chatServerEvaluation.myId) != '0';
    var that = this, chats = that.getAllchatsList();
    var bodyHtml = that.createAllchatsHtml(chats[0].data,chats[1].data);
    $('#chat-allchats').html('<div id="all-chats-body"></div>').trigger('create');
    $('#all-chats-body').html(bodyHtml);
};

ChatAllchatsClass.prototype.updateAllChats = function() {
    var that = this;
    if ($('#all-chats-list').length == 0)
        that.createAllchats();
    else
    {
        var allChats = that.getAllchatsList();
        if (lzm_chatDisplay.selected_view == 'mychats' && (lzm_chatUserActions.active_chat_reco == '' || lzm_chatUserActions.active_chat_reco == 'LIST')) {
            var selectedLine =  (typeof $('#all-chats-list').data('selected-line') != 'undefined') ? $('#all-chats-list').data('selected-line') : '';
            if (allChats[0].hash != that.dataHash)
            {
                that.dataHash = allChats[0].hash;
                var counterHtml = t('Active Chats: <!--number_active--> (<!--number_queue--> in queue)',[['<!--number_active-->', that.chatCounter.a], ['<!--number_queue-->', that.chatCounter.q]]);
                $('#allchats-counter').html(counterHtml);
                $('#all-chats-list').children('tbody').html(this.createAllchatsListLines(allChats[0].data,allChats[1].data));

            }
            that.updateTimeFields(allChats[0].data);
            if (selectedLine != '')
                $('#allchats-line-' + selectedLine).addClass('selected-table-line');
        }
    }
    lzm_chatDisplay.playQueueSound(that.chatCounter);
};

ChatAllchatsClass.prototype.createAllchatsHtml = function(allChats,missedChats) {
    var i;
    var bodyHtml = '<table id="all-chats-list" class="lzm-unselectable visible-list-table">' +
        '<thead><tr>' +
        '<th style="width: 20px !important;"></th>';

    this.columnCount = 2;
    for (i=0; i<lzm_chatDisplay.mainTableColumns.allchats.length; i++) {
        var thisAllchatsColumn = lzm_chatDisplay.mainTableColumns.allchats[i];
        if (thisAllchatsColumn.display == 1) {
            this.columnCount++;
            var cellId = (typeof thisAllchatsColumn.cell_id != 'undefined') ? ' id="' + thisAllchatsColumn.cell_id + '"' : '';
            var cellClass = (typeof thisAllchatsColumn.cell_class != 'undefined') ? ' class="' + thisAllchatsColumn.cell_class + '"' : '';
            var cellStyle = (typeof thisAllchatsColumn.cell_style != 'undefined') ? ' style="white-space: nowrap; ' + thisAllchatsColumn.cell_style + '"' : ' style="white-space: nowrap;"';
            var cellOnclick = (typeof thisAllchatsColumn.cell_onclick != 'undefined') ? ' onclick="' + thisAllchatsColumn.cell_onclick + '"' : '';
            bodyHtml += '<th id="'+thisAllchatsColumn.cid+'" ' + cellId + cellClass + cellStyle + cellOnclick + '>' + t(thisAllchatsColumn.title) +'';
            if(typeof thisAllchatsColumn.sort != 'undefined')
                bodyHtml += '<span style="position:absolute;right:4px;"><i class="fa fa-caret-down"></i></span>';
            bodyHtml += '</th>';
        }
    }

    for (i=0; i<lzm_chatServerEvaluation.inputList.idList.length; i++) {
        var myCustomInput = lzm_chatServerEvaluation.inputList.getCustomInput(lzm_chatServerEvaluation.inputList.idList[i]);
        if (myCustomInput.active == 1 && parseInt(myCustomInput.id) < 111 && myCustomInput.display.allchats)
        {
            bodyHtml += '<th>' + myCustomInput.name + '</th>';
            this.columnCount++;
        }
    }

    bodyHtml += '</tr></thead><tbody>';
    bodyHtml += this.createAllchatsListLines(allChats,missedChats);
    return bodyHtml + '</tbody></table>';
};

ChatAllchatsClass.prototype.clearMissedChats = function(){
    this.missedChats = [];
    this.createAllchats();
};

ChatAllchatsClass.prototype.hideMissedChats = function(){
    lzm_commonStorage.saveValue('show_missed_chats_' + lzm_chatServerEvaluation.myId, '0');
    this.createAllchats();
};

ChatAllchatsClass.prototype.createAllchatsListLines = function(allChats,missedChats){
    var linesHtml = '',linesMy='',linesActive='',linesWaiting='',linesMissed='',activeCount= 0, myCount= 0, i,lsa='',lsm='',lsmy='';
    var emptyLine = '<tr><td colspan="'+(this.columnCount)+'" style="background:#fff;" class="unselectable text-center text-gray">'+tid('none')+'</td></tr>';

    for (i=0; i<allChats.length; i++)
    {
        for (var l=0; l<allChats[i].browser.chat.pn.member.length; l++)
        {
            if(allChats[i].browser.chat.pn.member[l].dec != '1' && allChats[i].browser.chat.pn.member[l].id == lzm_chatServerEvaluation.myId)
            {
                linesMy += this.createAllchatsListLine(allChats[i],false,true);
                myCount++;
            }
        }
        if(allChats[i].browser.chat.pn.acc == 0)
            linesWaiting += this.createAllchatsListLine(allChats[i]);
        else
        {
            activeCount++;
            linesActive += this.createAllchatsListLine(allChats[i]);

        }
    }

    if(linesWaiting=='')
        linesWaiting += emptyLine;
    else
        lsa = '<br>';

    if(linesActive=='')
        linesActive += emptyLine;
    else
        lsm = '<br>';

    linesHtml += '<tr class="lzm-unselectable split-table-line"><td colspan="'+(this.columnCount-1)+'"><b>'+tid('my_chats')+' ('+(myCount).toString()+')</b></td></tr>';
    linesHtml += linesMy;

    if(linesMy=='')
        linesHtml += emptyLine;
    else
        lsmy = '<br>';

    linesHtml += '<tr class="lzm-unselectable split-table-line"><td colspan="'+(this.columnCount-1)+'">'+lsmy+'<b>'+tid('waiting')+' ('+(allChats.length-activeCount).toString()+')</b></td></tr>';
    linesHtml += linesWaiting;
    linesHtml += '<tr class="lzm-unselectable split-table-line"><td colspan="'+(this.columnCount-1)+'">'+lsa+'<b>'+tid('active')+' ('+activeCount.toString()+')</b></td></tr>';
    linesHtml += linesActive;

    if(this.showMissedChats)
    {
        linesHtml += '<tr class="lzm-unselectable split-table-line"><td colspan="'+(this.columnCount-2)+'">'+lsm+'<b>'+tid('missed')+' ('+missedChats.length.toString()+')</b></td><td style="text-align: right;vertical-align: bottom;" class="icon-column"><i class="fa fa-trash icon-light cm-click" onclick="emptyMissedChats();"></i>&nbsp;&nbsp;<i class="fa fa-times-circle icon-light cm-click" onclick="hideMissedChats();"></i></td></tr>';
            for (i=0; i<missedChats.length; i++)
                linesMissed += this.createAllchatsListLine(missedChats[i],true);
        if(linesMissed=='')
            linesMissed += emptyLine;
        linesHtml += linesMissed;
    }

    return linesHtml;
}

ChatAllchatsClass.prototype.createAllchatsListLine = function(chat,missed,myChat) {
    missed = (d(missed)) ? missed : false;
    var idsuffix = (myChat) ? '-my' : '';
    var that = this,i;
    var chatStatus = (chat.browser.chat.pn.acc == 1) ? tid('ticket_status_1') : (chat.browser.chat.q == 1) ? tid('queue') : t('Waiting for operator');
    var chatType = (chat.browser.ol == 1) ? 'On-Site' : 'Off-Site';
    var startTimeObject = lzm_chatTimeStamp.getLocalTimeObject(chat.browser.chat.f * 1000, true);
    var startTime = lzm_commonTools.getHumanDate(startTimeObject, 'time', lzm_chatDisplay.userLanguage);
    var endTime = (typeof chat.end_time != 'undefined') ? chat.end_time : lzm_chatTimeStamp.getServerTimeString(null, true, 1000);
    var duration = that.getTimeDifference(chat.browser.chat.f, endTime);
    var waitingTime = (chat.browser.chat.at == 0) ? that.getTimeDifference(chat.browser.chat.f, endTime) : that.getTimeDifference(chat.browser.chat.f, chat.browser.chat.at);
    var previousChats = '',group = lzm_chatServerEvaluation.groups.getGroup(chat.browser.chat.gr);
    var groupName = (group != null) ? group.id : chat.browser.chat.gr;
    var operators = that.getOperatorNameList(chat.browser.chat.pn.member, chat.browser.chat.dcp);
    var active_chat_name = lzm_chatServerEvaluation.visitors.getVisitorName(chat.visitor);
    var isBotChat = 0;

    if (chat.browser.chat.pn.member.length == 1) {
        var operator = lzm_chatServerEvaluation.operators.getOperator(chat.browser.chat.pn.member[0].id);
        if (operator != null && operator.isbot == 1)
            isBotChat = 1;
    }

    var onclickAction = ' onclick="' + ((!lzm_chatDisplay.isApp && !lzm_chatDisplay.isMobile) ? 'selectChatLine(\'' + chat.browser.chat.id +idsuffix+ '\');' : 'openChatLineContextMenu(\'' + chat.browser.chat.id +idsuffix+ '\', ' + isBotChat + ', event, '+(missed?'true':'false')+');')+'"';
    var ondblclickAction = (that.allchatsFilter != 'active') ? '' : ' ondblclick="takeChat(\'' + chat.visitor.id + '\', \'' + chat.browser.id + '\', \'' + chat.browser.chat.id + '\', \'' + chat.browser.chat.gr + '\', true);"';
    var activeUserChat = lzm_chatServerEvaluation.userChats.getUserChat(chat.visitor.id + '~' + chat.browser.id);
    var pgid = lzm_chatServerEvaluation.userChats.isInPublicGroupChat(activeUserChat);
    var wgid = lzm_chatServerEvaluation.userChats.wasInPublicGroupChat(chat.browser.id);

    if(pgid || wgid)
    {
        groupName = (pgid) ? lzm_chatServerEvaluation.groups.getGroup(pgid[0]).id : '-';
        operators = '-';
        if(pgid)
            ondblclickAction = ' ondblclick="chatInternalWith(\'' + pgid + '\', \'' + pgid + '\', \'\', true);"';
    }

    if(myChat)
        ondblclickAction = ' ondblclick="openChatTab(\'' + chat.visitor.id + '\',\'' + chat.browser.id + '\',\'' + chat.browser.chat.id + '\');"';

    ondblclickAction = (!lzm_chatDisplay.isApp && !lzm_chatDisplay.isMobile) ? ondblclickAction : '';
    var oncontextmenuAction = (!lzm_chatDisplay.isApp && !lzm_chatDisplay.isMobile) ? ' oncontextmenu="openChatLineContextMenu(\'' + chat.browser.chat.id +idsuffix+ '\', ' + isBotChat + ', event, '+(missed?'true':'false')+');"' : '';
    var columnContents = [{cid: 'status', contents: chatStatus}, {cid: 'chat_id', contents: chat.browser.chat.id},
        {cid: 'type', contents: chatType}, {cid: 'duration', contents: duration[0], cell_id: 'allchats-duration-' + chat.browser.chat.id},
        {cid: 'start_time', contents: startTime}, {cid: 'waiting_time', contents: waitingTime[0], cell_id: 'allchats-waitingtime-' + chat.browser.chat.id},
        {cid: 'name', contents: active_chat_name}, {cid: 'question', contents: lzm_commonTools.htmlEntities(chat.browser.chat.eq)},
        {cid: 'previous_chats', contents: previousChats}, {cid: 'priority', contents: tid('priority_' + chat.browser.chat.p.toString())},
        {cid: 'group', contents: groupName}, {cid: 'operators', contents: operators},
        {cid: 'email', contents: lzm_commonTools.htmlEntities(chat.browser.cemail)}, {cid: 'company', contents: lzm_commonTools.htmlEntities(chat.browser.ccompany)}];

    var missedClass = (missed) ? ' allchats-missed-line' : '';

    var lineHtml = '<tr class="allchats-line'+missedClass+'" id="allchats-line-' + chat.browser.chat.id + idsuffix + '"' + onclickAction + ondblclickAction + oncontextmenuAction + ' style="cursor: pointer;">' + that.getIconField(chat,missed);
    for (i=0; i<lzm_chatDisplay.mainTableColumns.allchats.length; i++) {
        for (var j=0; j<columnContents.length; j++) {
            if(lzm_chatDisplay.mainTableColumns.allchats[i].cid == columnContents[j].cid && lzm_chatDisplay.mainTableColumns.allchats[i].display == 1)
            {
                var cellId = (typeof columnContents[j].cell_id != 'undefined') ? ' id="' + columnContents[j].cell_id + '"' : '';
                var cellstyle = (d(lzm_chatDisplay.mainTableColumns.allchats[i].cell_style)) ? ' style="' + lzm_chatDisplay.mainTableColumns.allchats[i].cell_style + '"' : '';
                var celltitle = (d(lzm_chatDisplay.mainTableColumns.allchats[i].contenttitle)) ? ' title="' + columnContents[j].contents + '"' : '';
                if(lzm_chatDisplay.mainTableColumns.allchats[i].cid == 'waiting_time')
                    lineHtml += that.getWaitingTimeField(chat,missed);
                else
                    lineHtml += '<td' + cellId + cellstyle + celltitle + '>' + lzm_commonTools.SubStr(columnContents[j].contents,100,true) + '</td>';
            }
        }
    }

    for (i=0; i<lzm_chatServerEvaluation.inputList.idList.length; i++) {
        var myCustomInput = lzm_chatServerEvaluation.inputList.getCustomInput(lzm_chatServerEvaluation.inputList.idList[i]);
        if (myCustomInput.active == 1 && parseInt(myCustomInput.id) < 111 && myCustomInput.display.allchats) {
            var inputText = '';
            if (d(chat.browser['cf'+i]))
                inputText = (myCustomInput.type != 'CheckBox') ? lzm_commonTools.htmlEntities(chat.browser['cf'+i]) : (chat.browser['cf'+i] == 1) ? t('Yes') : t('No');
            inputText = (inputText != '') ? inputText : '-';
            lineHtml += '<td>' + inputText + '</td>';
        }
    }
    return lineHtml + '</tr>';
};

ChatAllchatsClass.prototype.getWaitingTimeField = function(chat,missed) {
    missed = (d(missed)) ? missed : false;
    var waitingTime = (chat.browser.chat.at == 0) ? this.getTimeDifference(chat.browser.chat.f) : this.getTimeDifference(chat.browser.chat.f, chat.browser.chat.at);
    var bgcolor = (waitingTime[1] <= 120) ? 'bg-green' : (waitingTime[1] <= 300) ? 'bg-orange' : 'bg-red';
    var forcolor = (waitingTime[1] <= 120) ? ' text-green' : (waitingTime[1] <= 300) ? ' text-orange' : ' text-red';

    if(missed)
        bgcolor = forcolor = '';
    else
        bgcolor += ' ';

    return '<td id="allchats-waitingtime-' + chat.browser.chat.id + '" class="'+bgcolor+forcolor+' text-center text-bold nobg" style="padding-top:5px;">'+waitingTime[0]+'</td>';
}

ChatAllchatsClass.prototype.getIconField = function(chat,missed) {
    missed = (d(missed)) ? missed : false;
    var j,inv=false,waitingTime = (chat.browser.chat.at == 0) ? this.getTimeDifference(chat.browser.chat.f) : this.getTimeDifference(chat.browser.chat.f, chat.browser.chat.at);
    var bgcolor = (missed) ? '#fafafa' : (waitingTime[1] <= 120) ? '#f5fff5' : (waitingTime[1] <= 300) ? '#fffbf5' : '#fff5f5';
    var forcolor = (waitingTime[1] <= 120) ? '#5f991d' : (waitingTime[1] <= 300) ? '#ff7800' : '#d40000';
    var style = ' style="background:'+bgcolor+' !important;text-align:center;padding-top:5px;"';
    var clss = (missed && false) ? '' : ' class="icon-column noibg nobg"';

    for (j=0; j<chat.browser.chat.pn.member.length; j++)
        if (chat.browser.chat.pn.member[j].id == lzm_chatServerEvaluation.myId && chat.browser.chat.pn.member[j].st == 2)
        {
            inv = true;
            forcolor = '#3399ff';
        }

    var color = (missed) ? '' : ' style="color:'+forcolor+' !important;"';
    var icon = (missed) ? 'warning' : ((chat.browser.chat.q == 1) ? 'clock-o' : (chat.browser.chat.pn.acc == 0) ? 'bell-o' : (inv) ? 'eye' : 'comments');
    return '<td id="allchats-icon-' + chat.browser.chat.id + '"'+clss+style+'><i class="fa fa-'+icon+'"'+color+'></i></td>';
}

ChatAllchatsClass.prototype.updateTimeFields = function(allChats) {
    for (var i=0; i<allChats.length; i++) {
        var chat = allChats[i];
        $('#allchats-icon-' + chat.browser.chat.id).replaceWith(this.getIconField(chat));
        $('#allchats-waitingtime-' + chat.browser.chat.id).replaceWith(this.getWaitingTimeField(chat));
    }
};

/********** Helper functions **********/
ChatAllchatsClass.prototype.getAllchatsList = function() {
    var that = this, allChats = [], allChatsObject = [], visitors = lzm_chatServerEvaluation.visitors.getVisitorList();
    var chatCounter = {a: 0, q: 0, ql: []};
    for (var i=0; i<visitors.length; i++) {
        for (var j=0; j<visitors[i].b.length; j++) {
            var userChat = lzm_chatServerEvaluation.userChats.getUserChat(visitors[i].id + '~' + visitors[i].b[j].id);
            if (visitors[i].b[j].chat.id != '' && userChat != null && userChat.status != 'left')
            {
                var visitorIsChatting = true;
                var visitorWasDeclined = true;
                try {
                    if (visitorIsChatting) {
                        if (visitors[i].b[j].chat.pn.member.length == 0) {
                            visitorWasDeclined = false;
                        }
                        for (var l=0; l<visitors[i].b[j].chat.pn.member.length; l++)
                        {
                            if (visitors[i].b[j].chat.pn.member[l].dec == 0)
                                visitorWasDeclined = false;
                        }
                    }
                    else
                        visitorWasDeclined = false;
                } catch(ex) {}


                if (!visitorWasDeclined)
                {
                    allChats.push({visitor: visitors[i], browser: visitors[i].b[j], chatid: visitors[i].b[j].chat.id});
                    allChatsObject.push({cid:visitors[i].b[j].chat.id.toString(),obj:{visitor: visitors[i], browser: visitors[i].b[j], chatid: visitors[i].b[j].chat.id}});


                    if (visitors[i].b[j].chat.q == 0)
                        chatCounter.a++;
                    else
                    {
                        chatCounter.q++;
                        chatCounter.ql.push(parseInt(visitors[i].b[j].chat.id));
                        chatCounter.ql.sort(function(a, b){return b > a;});
                    }
                }
            }
        }
    }

    var numberOfRunningChats = allChats.length;

    allChats.sort(function(a, b){return b.chatid > a.chatid;});

    this.allChats = allChatsObject;
    this.chatCounter = chatCounter;

    if (lzm_chatDisplay.numberOfRunningChats != numberOfRunningChats) {
        lzm_chatDisplay.numberOfRunningChats = numberOfRunningChats;
        lzm_chatDisplay.createViewSelectPanel(lzm_chatDisplay.firstVisibleView);
    }
    var missedChats = that.getMissedChatsList(allChats);
    missedChats.sort(function(a, b){return b.chatid > a.chatid;});

    return [
        {data: lzm_commonTools.clone(allChats), hash: md5(JSON.stringify(allChats))},
        {data: lzm_commonTools.clone(missedChats), hash: md5(JSON.stringify(missedChats))}
        ];
};

ChatAllchatsClass.prototype.getMissedChatsList = function(allChats) {
    var that = this, missedChats = [], thisChat = null, alobj, key,i;
    for (i=0; i<allChats.length; i++)
    {
        thisChat = lzm_commonTools.clone(allChats[i]);
        alobj = lzm_commonTools.GetElementByProperty(that.missedChats,'cid',thisChat.browser.chat.id);
        if (thisChat.browser.chat.pn.acc == 1 && alobj.length)
        {
            lzm_commonTools.RemoveElementByProperty(that.missedChats,'cid',thisChat.browser.chat.id);

        }
        else if (thisChat.browser.chat.pn.acc == 0)
        {
            thisChat.missed = false;
            lzm_commonTools.RemoveElementByProperty(that.missedChats,'cid',thisChat.browser.chat.id);
            that.missedChats.push({cid:thisChat.browser.chat.id,obj:thisChat});
        }
    }
    for (key in that.missedChats)
    {
        thisChat = that.missedChats[key].obj;
        var chatId = that.missedChats[key].cid;

        var visitorBrowser = lzm_chatServerEvaluation.visitors.getVisitorBrowser(thisChat.visitor.id, thisChat.browser.id);
        var chatWasDeclined = false, chatWasForwarded = false, chatWasAccepted = false;
        if (visitorBrowser[1] != null && d(visitorBrowser[1].chat.pn))
        {
            var tmpChat = visitorBrowser[1].chat;

            if(tmpChat.pn.acc != 0)
                chatWasAccepted = true;

            for (var j=0; j<tmpChat.pn.member.length; j++)
                if (tmpChat.pn.member[j].dec != 0)
                    chatWasDeclined = true;
        }



        alobj = lzm_commonTools.GetElementByProperty(that.allChats,'cid',chatId);
        if (!alobj.length && !chatWasDeclined && !chatWasAccepted)
        {
            that.missedChats[key].obj.missed = true;
            if (d(that.missedChats[key].obj.end_time))
                that.missedChats[key].obj.end_time = lzm_chatTimeStamp.getServerTimeString(null, true, 1000);
            missedChats.push(that.missedChats[key].obj);

        }

        for(i=0; i<lzm_chatServerEvaluation.external_forwards.length;i++)
            if(lzm_chatServerEvaluation.external_forwards[i].c == chatId)
            {
                chatWasForwarded = true;
                break;
            }

        if (chatWasDeclined || chatWasForwarded || chatWasAccepted)
            lzm_commonTools.RemoveElementByProperty(that.missedChats,'cid',chatId);
    }

    return missedChats;
};

ChatAllchatsClass.prototype.getOperatorNameList = function(members, dcp) {
    var opList = [];
    for (var i=0; i<members.length; i++) {
        var operator = lzm_chatServerEvaluation.operators.getOperator(members[i].id);
        if (operator != null && members[i].st != 2 && members[i].dec != 1)
            opList.push(operator.name);
    }
    var dcpName = (lzm_chatServerEvaluation.operators.getOperator(dcp) != null) ? lzm_chatServerEvaluation.operators.getOperator(dcp).name : '';
    var nameString = (opList.length > 0) ? opList.join(', ') : (dcpName != '') ? '(' + dcpName + ')' : '';
    return nameString;
};

ChatAllchatsClass.prototype.getTimeDifference = function(intervallStart, intervallEnd) {
    intervallEnd = (typeof intervallEnd != 'undefined') ? intervallEnd : lzm_chatTimeStamp.getServerTimeString(null, true, 1000);
    var duration = intervallEnd - intervallStart;
    var hours = Math.floor(duration / 3600);
    var minutes = Math.floor((duration - hours * 3600)  / 60);
    var seconds = duration - hours * 3600 - minutes * 60;
    return [lzm_commonTools.pad(hours, 2) + ':' + lzm_commonTools.pad(minutes, 2) + ':' + lzm_commonTools.pad(seconds, 2), duration];
};

ChatAllchatsClass.prototype.createAllChatsListContextMenu = function(myObject) {
    var disabledClass, onclickAction, contextMenuHtml = '', myChat = $.inArray(lzm_chatDisplay.myId, myObject.browser.chat.pn.memberIdList) != -1;

    disabledClass = (!myChat) ? ' class="ui-disabled"' : '';
    onclickAction = 'openChatTab(\'' + myObject.visitor.id + '\', \'' + myObject.browser.id + '\', \'' + myObject.browser.chat.id + '\', 0);';
    contextMenuHtml += '<div' + disabledClass + ' onclick="' + onclickAction + 'removeChatLineContextMenu();"><span class="cm-line">' + tid('open') + '</span></div><hr />';

    disabledClass = (myObject.missed) ? ' class="ui-disabled"' : '';
    onclickAction = 'showVisitorInfo(\'' + myObject.visitor.id + '\', \'' + myObject.visitor.name + '\', \'' + myObject.browser.chat.id + '\', 0);';
    contextMenuHtml += '<div' + disabledClass + ' onclick="' + onclickAction + 'removeChatLineContextMenu();"><span id="show-allchats-details" class="cm-line">' + t('Details') + '</span></div><hr />';

    disabledClass = (myObject.missed || myObject.browser.chat.pn.acc == 0 || $.inArray(lzm_chatDisplay.myId, myObject.browser.chat.pn.memberIdList) != -1) ? ' class="ui-disabled"' : '';
    onclickAction = 'joinChat(\'' + myObject.visitor.id + '\', \'' + myObject.browser.id + '\', \'' + myObject.browser.chat.id + '\', false);';
    contextMenuHtml += '<div' + disabledClass + ' onclick="' + onclickAction + 'removeChatLineContextMenu();">' + '<span id="join-allchats" class="cm-line cm-click">' + t('Join') + '</span></div>';
    disabledClass = (myObject.missed || myObject.browser.chat.pn.acc == 0 || $.inArray(lzm_chatDisplay.myId, myObject.browser.chat.pn.memberIdList) != -1) ? ' class="ui-disabled"' : '';
    onclickAction = 'joinChat(\'' + myObject.visitor.id + '\', \'' + myObject.browser.id + '\', \'' + myObject.browser.chat.id + '\', true);';
    contextMenuHtml += '<div' + disabledClass + ' onclick="' + onclickAction + 'removeChatLineContextMenu();"><span id="join-allchats-invisible" class="cm-line">' + t('Join (invisible)') + '</span></div><hr />';

    var activeUserChat = lzm_chatServerEvaluation.userChats.getUserChat(myObject.visitor.id + '~' + myObject.browser.id);
    var pgid = lzm_chatServerEvaluation.userChats.isInPublicGroupChat(activeUserChat);

    disabledClass = (myObject.missed || pgid || myChat) ? ' class="ui-disabled"' : '';
    onclickAction = 'takeChat(\'' + myObject.visitor.id + '\', \'' + myObject.browser.id + '\', \'' + myObject.browser.chat.id + '\', \'' + myObject.browser.chat.gr + '\');';
    contextMenuHtml += '<div' + disabledClass + ' onclick="' + onclickAction + 'removeChatLineContextMenu();"><span id="take-allchats" class="cm-line cm-click">' + tid('take') + '</span></div><hr />';

    disabledClass = (myObject.missed || myObject.browser.chat.pn.acc == 0 || !myChat) ? ' class="ui-disabled"' : '';
    onclickAction = 'leaveChat(\'' + myObject.browser.chat.id + '\');';
    contextMenuHtml += '<div' + disabledClass + ' onclick="' + onclickAction + 'removeChatLineContextMenu();"><span id="leave-allchats" class="cm-line cm-click">' + t('Leave') + '</span></div>';

    disabledClass = (myObject.missed) ? ' class="ui-disabled"' : '';
    onclickAction = 'forwardChat(\'' + myObject.browser.chat.id + '\');';
    contextMenuHtml += '<div' + disabledClass + ' onclick="' + onclickAction + 'removeChatLineContextMenu();"><span id="forward-allchats" class="cm-line cm-click">' + t('Forward') + '</span></div>';
    disabledClass = (myObject.missed) ? ' class="ui-disabled"' : '';
    onclickAction = 'forwardChat(\'' + myObject.browser.chat.id + '\', \'invite\');';
    contextMenuHtml += '<div' + disabledClass + ' onclick="' + onclickAction + 'removeChatLineContextMenu();"><span id="invite-allchats" class="cm-line cm-click">' + t('Invite Operator') + '</span></div><hr />';
    disabledClass = '';
    onclickAction = 'showVisitorInfo(\'' + myObject.visitor.id + '\', \'' + myObject.visitor.name + '\', \'' + myObject.browser.chat.id + '\', 5);';
    contextMenuHtml += '<div' + disabledClass + ' onclick="' + onclickAction + 'removeChatLineContextMenu();"><span id="show-allchats-archive" class="cm-line cm-click">' + t('Archive') + '</span></div><hr />';
    disabledClass = '';
    onclickAction = 'showFilterCreation(\'visitor\',\'\', \'' + myObject.browser.chat.id + '\');';
    contextMenuHtml += '<div' + disabledClass + ' onclick="' + onclickAction + 'removeChatLineContextMenu();"><span id="ban-allchats" class="cm-line cm-click">' + t('Ban (add filter)') + '</span></div>';
    return contextMenuHtml;
};