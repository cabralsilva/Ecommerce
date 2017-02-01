/****************************************************************************************
 * LiveZilla ChatVisitorClass.js
 *
 * Copyright 2016 LiveZilla GmbH
 * All rights reserved.
 * LiveZilla is a registered trademark.
 *
 ***************************************************************************************/

function ChatVisitorClass() {
    this.lastVisitorTimestampUpdate = 0;
}

ChatVisitorClass.prototype.updateVisitorList = function () {
    var that = this;
    if (!lzm_chatDisplay.VisitorListCreated) {
        that.createVisitorList();
    } else {
        if (lzm_chatTimeStamp.getServerTimeString(null, false, 1) - lzm_chatDisplay.visitorListIsScrolling > 2000) {
            lzm_chatDisplay.activeVisitorNumber = 0;
            var thisVisitorList = $('#visitor-list');
            var visitorListWidth = thisVisitorList.width();
            var visitors = lzm_chatServerEvaluation.visitors.getVisitorList();
            var i = 0, visitorIdList = [];
            for (i=visitors.length-1; i>=0; i--) {
                if (visitors[i].b.length == 0) {
                    visitors[i].is_active = false;
                }
                var existingLine = '';
                try {
                    existingLine = $('#visitor-list-row-' + visitors[i].id).html();
                } catch(ex) {}
                var lineIsExisting = (typeof existingLine != 'undefined') ? true : false;
                var htmlString, thisLine, cssObject;
                if (visitors[i].is_active) {
                    lzm_chatDisplay.activeVisitorNumber++;
                    visitorIdList.push(visitors[i].id);
                }
                if (visitors[i].is_active && lineIsExisting &&
                    (visitors[i].md5 != $('#visitor-list-row-' + visitors[i].id).data('md5') ||
                        $.inArray(visitors[i].id, lzm_chatServerEvaluation.globalTypingChanges) != -1)) {
                    thisLine = that.createVisitorListLine(visitors[i], visitorListWidth, false);
                    htmlString = thisLine[0];
                    cssObject = thisLine[1];
                    if (existingLine != htmlString) {
                        try {
                            $('#visitor-list-row-' + visitors[i].id).html(htmlString).css(cssObject);
                            if (typeof $('#visitor-list-row-' + visitors[i].id).attr('onclick') != 'undefined')
                                $('#visitor-list-row-' + visitors[i].id).attr('onclick', thisLine[2]);
                            if (typeof $('#visitor-list-row-' + visitors[i].id).attr('ondblclick') != 'undefined')
                                $('#visitor-list-row-' + visitors[i].id).attr('ondblclick', thisLine[3]);
                            if (typeof $('#visitor-list-row-' + visitors[i].id).attr('oncontextmenu') != 'undefined')
                                $('#visitor-list-row-' + visitors[i].id).attr('oncontextmenu', thisLine[4]);
                        } catch(ex) {}
                    }
                } else if (visitors[i].is_active && !lineIsExisting) {
                    htmlString = that.createVisitorListLine(visitors[i], visitorListWidth, true)[0];
                    var nextLine = 'visitor-list-row-ERROR';
                    try {
                        nextLine = that.getVisitorListLinePosition(visitors[i]);
                        if ($('#' + nextLine).length > 0) {
                            $('#' + nextLine).after(htmlString);
                        } else {
                            $('#visitor-list-body').prepend(htmlString);
                        }
                    } catch(e) {}
                } else if (!visitors[i].is_active && lineIsExisting) {
                    $('#visitor-list-row-' + visitors[i].id).remove();
                }
            }
            var now = lzm_chatTimeStamp.getServerTimeString(null, false, 1000);
            that.lastVisitorTimestampUpdate = now;
            $('.visitor-list-line').each(function() {
                var userId = $(this).data('user-id');
                if ($.inArray(userId, visitorIdList) == -1) {
                    $('#visitor-list-row-' + userId).remove();
                }
                var myVisitor = lzm_chatServerEvaluation.visitors.getVisitor(userId);
                if (myVisitor != null) {
                    var timeColumns = that.getVisitorOnlineTimes(myVisitor);
                    $('#visitor-online-' + userId).html(timeColumns['online']);
                    $('#visitor-active-' + userId).html(timeColumns['active']);
                }
            });
            lzm_chatServerEvaluation.globalTypingChanges = [];

            var headline2String = '<span class="lzm-dialog-hl2-info">' +
                t('Visitors online: <!--visitor_number-->',[['<!--visitor_number-->', lzm_chatDisplay.activeVisitorNumber]]) + '</span>';
            $('#visitor-list-headline2').html(headline2String);
            lzm_displayLayout.resizeVisitorList();

            lzm_chatDisplay.visitorListScrollingWasBlocked = false;
        } else {
            blockVisitorListUpdate();
        }
    }
};

ChatVisitorClass.prototype.updateVisitorTimestampCells = function(elementId) {
    var that = this, i = 0, visitorIdList = [];
    var now = lzm_chatTimeStamp.getServerTimeString(null, false, 1000);
    if (now - that.lastVisitorTimestampUpdate > 20) {
        that.lastVisitorTimestampUpdate = now;
        if (lzm_chatDisplay.selected_view == 'external' && $('#visitor-list-table').length > 0) {
            var visitors = lzm_chatServerEvaluation.visitors.getVisitorList();
            for (i=visitors.length-1; i>=0; i--) {
                if (visitors[i].b.length == 0) {
                    visitors[i].is_active = false;
                }
                if (visitors[i].is_active) {
                    lzm_chatDisplay.activeVisitorNumber++;
                    visitorIdList.push(visitors[i].id);
                }
                $('.visitor-list-line').each(function() {
                    var userId = $(this).data('user-id');
                    var myVisitor = lzm_chatServerEvaluation.visitors.getVisitor(userId);
                    if (myVisitor != null) {
                        var timeColumns = that.getVisitorOnlineTimes(myVisitor);
                        $('#visitor-online-' + userId).html(timeColumns['online']);
                        $('#visitor-active-' + userId).html(timeColumns['active']);
                    }
                });
            }
        }
        var infoUser = $('#visitor-details-'+elementId+'-list').data('visitor');
        if (typeof infoUser != 'undefined' && infoUser != null && $('#visitor-information').length > 0) {
            var tmpDate = that.calculateTimeDifference(infoUser, 'lastOnline', true);
            $('#visitor-online-since').html(tmpDate[0]);
            if (typeof (infoUser.b != 'undefined')) {
                for (i=0; i<infoUser.b.length; i++) {
                    if (infoUser.b[i].is_active) {
                        var lastH = infoUser.b[i].h2.length - 1;
                        if (lastH >= 0) {
                            var lastBeginTimestamp = infoUser.b[i].h2[lastH].time;
                            var beginTime = lzm_chatTimeStamp.getLocalTimeObject(lastBeginTimestamp * 1000, true);
                            var endTime = lzm_chatTimeStamp.getLocalTimeObject();
                            var timeSpan = that.calculateTimeSpan(beginTime, endTime);
                            var beginTimeHuman = lzm_commonTools.getHumanDate(beginTime, 'shorttime', lzm_chatDisplay.userLanguage);
                            var endTimeHuman = lzm_commonTools.getHumanDate(endTime, 'shorttime', lzm_chatDisplay.userLanguage);

                            $('#visitor-history-last-'+elementId+'-timespan-b' + i).html(timeSpan);
                            $('#visitor-history-last-'+elementId+'-time-b' + i).html(beginTimeHuman + ' - ' + endTimeHuman);
                        }
                    }
                }
            }

        }
    }
};

ChatVisitorClass.prototype.createVisitorList = function () {
    lzm_chatDisplay.VisitorListCreated = true;
    var i = 0, that = this, thisVisitorList = $('#visitor-list');
    var visitorListWidth = thisVisitorList.width();
    var visitors = lzm_chatServerEvaluation.visitors.getVisitorList();

    var extUserHtmlString = '<div id="visitor-list-headline" class="lzm-dialog-headline"><h3>' + t('Visitors') + '</h3>' +
        '</div><div id="visitor-list-headline2" class="lzm-dialog-headline2"></div>' +
        '<div id="visitor-list-table-div" class="lzm-dialog-body">' +
        '<table id="visitor-list-table" class="visible-list-table alternating-rows-table lzm-unselectable" style="width: 100%;"><thead><tr>';
    extUserHtmlString += '<th>&nbsp;&nbsp;&nbsp;</th>';
    extUserHtmlString += '<th>&nbsp;&nbsp;&nbsp;</th>';
    extUserHtmlString += '<th>&nbsp;&nbsp;&nbsp;</th>';
    for (i=0; i<lzm_chatDisplay.mainTableColumns.visitor.length; i++)
        if (lzm_chatDisplay.mainTableColumns.visitor[i].display == 1) {
            extUserHtmlString += '<th style="white-space: nowrap">' + t(lzm_chatDisplay.mainTableColumns.visitor[i].title) ;
            if(lzm_chatDisplay.mainTableColumns.visitor[i].cid=='online')
                extUserHtmlString += '&nbsp;&nbsp;&nbsp;<span style="position: absolute; right: 4px;"><i class="fa fa-caret-up"></i></span>';
            extUserHtmlString += '</th>';
        }

    for (i=0; i<lzm_chatServerEvaluation.inputList.idList.length; i++) {
        var customInput = lzm_chatServerEvaluation.inputList.getCustomInput(lzm_chatServerEvaluation.inputList.idList[i]);
        if (parseInt(customInput.id) < 111 && customInput.active == 1 && customInput.display.visitor)
            extUserHtmlString += '<th style="white-space: nowrap">' + customInput.name + '</th>';
    }
    extUserHtmlString += '</tr></thead><tbody id="visitor-list-body">';

    lzm_chatDisplay.activeVisitorNumber = 0;
    for (i = 0; i < visitors.length; i++) {
        if (visitors[i].b.length == 0)
            visitors[i].is_active = false;

        if (visitors[i].is_active) {
            lzm_chatDisplay.activeVisitorNumber++;
            extUserHtmlString += that.createVisitorListLine(visitors[i], visitorListWidth, true)[0];
        }
    }
    extUserHtmlString += '</tbody></table></div>';

    thisVisitorList.html(extUserHtmlString).trigger('create');
    var headline2String = '<span class="lzm-dialog-hl2-info">' +
        t('Visitors online: <!--visitor_number-->',[['<!--visitor_number-->', lzm_chatDisplay.activeVisitorNumber]]) + '</div>';
    $('#visitor-list-headline2').html(headline2String);
    lzm_displayLayout.resizeVisitorList();
    $('#visitor-list-table-div').on("scrollstart", function() {
        lzm_chatDisplay.visitorListScrollingWasBlocked = true;
        lzm_chatDisplay.visitorListIsScrolling = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
    });
};

ChatVisitorClass.prototype.createVisitorListLine = function(aUser, visitorListWidth, newLine) {
    var extUserHtmlString = '', i = 0, j = 0, userStyle, userStyleObject, that = this;
    aUser.r.sort(that.chatInvitationSortFunction);
    if (lzm_chatDisplay.isApp) {
        userStyle = ' style="cursor: pointer; line-height: 22px !important;"';
        userStyleObject = {'cursor': 'pointer', 'font-weight': 'normal', 'line-height': '22px !important'};
    } else {
        userStyle = ' style="cursor: pointer;"';
        userStyleObject = {'cursor': 'pointer', 'font-weight': 'normal'};
    }

    var tableRowTitle = '';
    var visitorName = lzm_chatServerEvaluation.inputList.getInputValueFromVisitor(111,aUser,32);
    var visitorEmail = lzm_chatServerEvaluation.inputList.getInputValueFromVisitor(112,aUser,32);
    var visitorCity = (typeof aUser.city != 'undefined' && aUser.city.length > 32) ? aUser.city.substring(0, 32) + '...' : (aUser.city.length == 0) ? '-' : aUser.city;
    var visitorPage = that.createVisitorPageString(aUser);
    var visitorRegion = (typeof aUser.region != 'undefined' && aUser.region.length > 32) ? aUser.region.substring(0, 32) + '...' : (aUser.region.length == 0) ? '-' : aUser.region;
    var visitorISP = (typeof aUser.isp != 'undefined' && aUser.isp.length > 32) ? aUser.isp.substring(0, 32) + '...' : aUser.isp;
    var visitorCompany = lzm_chatServerEvaluation.inputList.getInputValueFromVisitor(113,aUser,32)
    var visitorSystem = (aUser.sys.length > 32) ? aUser.sys.substring(0, 32) + '...' : aUser.sys;
    var visitorBrowser = (aUser.bro.length > 32) ? aUser.bro.substring(0, 32) + '...' : aUser.bro;
    var visitorResolution = (aUser.res.length > 32) ? aUser.res.substring(0, 32) + '...' : aUser.res;
    var visitorHost = (aUser.ho.length > 32) ? aUser.ho.substring(0,32) + '...' : aUser.ho;
    var lastVisitedDate = lzm_chatTimeStamp.getLocalTimeObject(aUser.vl * 1000, true);
    var visitorLastVisited = lzm_commonTools.getHumanDate(lastVisitedDate, 'full', lzm_chatDisplay.userLanguage);
    var visitorSearchStrings = (that.createVisitorStrings('ss', aUser).length > 32) ? that.createVisitorStrings('ss', aUser).substring(0, 32) + '...' : that.createVisitorStrings('ss', aUser);
    var visitorOnlineSince = that.calculateTimeDifference(aUser, 'lastOnline', false)[0];
    var visitorLastActivity = that.calculateTimeDifference(aUser, 'lastActive', false)[0];
    var visitorInvitationStatus = '';
    var visitorInvitationLogo = 'img/632-skills_gray.png';
    var visitorInvitationFont = '<i class="fa icon-flip-hor fa-commenting"></i>';

    if (aUser.r.length > 0) {
        if (aUser.r[0].s != '' && aUser.r[0].ca == '' && aUser.r[0].a == 0 && aUser.r[0].de == 0){
            visitorInvitationStatus = 'requested'
            visitorInvitationFont = '<i class="fa fa-commenting icon-flip-hor icon-orange"></i>';
        }
        else if(aUser.r[0].s != '' && aUser.r[0].a == '1') {
            visitorInvitationStatus = 'accepted';
            visitorInvitationFont = '<i class="fa fa-commenting icon-flip-hor icon-green"></i>';
        } else if(aUser.r[0].s != '' && aUser.r[0].ca != '') {
            visitorInvitationStatus = 'revoked';
            visitorInvitationFont = '<i class="fa fa-commenting icon-flip-hor icon-red"></i>';
        } else if(aUser.r[0].s != '' && aUser.r[0].de == '1') {
            visitorInvitationStatus = 'declined';
            visitorInvitationFont = '<i class="fa fa-commenting icon-flip-hor icon-red"></i>';
        }
    }

    var chatQuestion = '';
    if (typeof aUser.b_chat.eq != 'undefined') {
        chatQuestion = aUser.b_chat.eq.substr(0, 32);
        if (aUser.b_chat.eq.length > 32) {
            chatQuestion += '...';
        }
    }

    var visitorIsChatting = false;
    for (var glTypInd=0; glTypInd<lzm_chatServerEvaluation.global_typing.length; glTypInd++) {
        if (lzm_chatServerEvaluation.global_typing[glTypInd].id.indexOf('~') != -1 &&
            lzm_chatServerEvaluation.global_typing[glTypInd].id.split('~')[0] == aUser.id) {
            visitorIsChatting = true;
            break;
        }
    }
    var visitorWasDeclined = true;
    if (visitorIsChatting) {
        for (var bInd=0; bInd<aUser.b.length; bInd++) {
            if (typeof aUser.b[bInd].chat.pn != 'undefined') {
                if (aUser.b[bInd].chat.pn.member.length == 0) {
                    visitorWasDeclined = false;
                }
                for (var mInd=0; mInd<aUser.b[bInd].chat.pn.member.length; mInd++) {
                    if (aUser.b[bInd].chat.pn.member[mInd].dec == 0) {
                        visitorWasDeclined = false;
                    }
                }
            }
        }
    } else {
        visitorWasDeclined = false;
    }

    var onclickAction = '', oncontextmenuAction = '', ondblclickAction = '';
    if (lzm_chatDisplay.isApp || lzm_chatDisplay.isMobile) {
        onclickAction = ' onclick="openVisitorListContextMenu(event, \'' + aUser.id + '\', \'' + visitorIsChatting + '\', \'' +
            visitorWasDeclined + '\', \'' + visitorInvitationStatus + '\', \'' + visitorInvitationLogo + '\');"';
    } else {
        onclickAction = ' onclick="selectVisitor(event, \'' + aUser.id + '\');"';
        oncontextmenuAction = ' oncontextmenu="openVisitorListContextMenu(event, \'' + aUser.id + '\', \'' + visitorIsChatting + '\', \'' +
            visitorWasDeclined + '\', \'' + visitorInvitationStatus + '\');"';
        ondblclickAction = ' ondblclick="showVisitorInfo(\'' + aUser.id + '\');"';
    }
    var langName = (typeof lzm_chatDisplay.availableLanguages[aUser.lang.toLowerCase()] != 'undefined') ?
        lzm_chatDisplay.availableLanguages[aUser.lang.toLowerCase()] :
        (typeof lzm_chatDisplay.availableLanguages[aUser.lang.toLowerCase().split('-')[0]] != 'undefined') ?
        lzm_chatDisplay.availableLanguages[aUser.lang.toLowerCase().split('-')[0]] :
        aUser.lang;
    var columnContents = [{cid: 'online', contents: visitorOnlineSince, cell_id: 'visitor-online-' + aUser.id},
        {cid: 'last_active', contents: visitorLastActivity, cell_id: 'visitor-active-' + aUser.id},
        {cid: 'name', contents: visitorName}, {cid: 'country', contents: lzm_chatDisplay.getCountryName(aUser.ctryi2,false)},
        {cid: 'language', contents: langName}, {cid: 'region', contents: visitorRegion},
        {cid: 'city', contents: visitorCity}, {cid: 'page', contents: visitorPage},
        {cid: 'search_string', contents: visitorSearchStrings}, {cid: 'host', contents: visitorHost},
        {cid: 'ip', contents: aUser.ip}, {cid: 'email', contents: visitorEmail},
        {cid: 'company', contents: visitorCompany}, {cid: 'browser', contents: visitorBrowser},
        {cid: 'resolution', contents: visitorResolution}, {cid: 'os', contents: visitorSystem},
        {cid: 'last_visit', contents: visitorLastVisited}, {cid: 'isp', contents: visitorISP}];
    if (newLine) {
        extUserHtmlString += '<tr' + userStyle + tableRowTitle + ' id="visitor-list-row-' + aUser.id + '" data-md5="' + aUser.md5 + '"' +
            ' data-user-id="' + aUser.id + '" class="visitor-list-line lzm-unselectable"' + onclickAction + oncontextmenuAction + ondblclickAction +'>';
    }

    var numberOfActiveInstances = 0;
    var activeInstanceNumber = 0;
    for (i=0; i<aUser.b.length; i++) {
        if (aUser.b[i].is_active && aUser.b[i].h2.length > 0) {
            numberOfActiveInstances++;
            activeInstanceNumber = i;
        }
    }
    extUserHtmlString += '<td class="icon-column nobg noibg"><div style="margin-top:-1px;background-image: url(\'./php/common/flag.php?cc=' + aUser.ctryi2 + '\');" class="visitor-list-flag"></div></td>';
    if (visitorIsChatting && !visitorWasDeclined) {
        extUserHtmlString += '<td class="icon-column nobg noibg" nowrap style="padding-top: 2px;";>' +
            '<i class="fa fa-comments icon-orange"></i></td>';
    } else {
        extUserHtmlString += '<td class="icon-column nobg noibg" nowrap style="padding-top: 2px;;">' +
            '<i class="fa fa-comments"></i></td>';
    }

    extUserHtmlString += '<td class="icon-column nobg noibg" nowrap>'+visitorInvitationFont+'</td>';
    for (i=0; i<lzm_chatDisplay.mainTableColumns.visitor.length; i++) {
        for (j=0; j<columnContents.length; j++) {
            if (lzm_chatDisplay.mainTableColumns.visitor[i].cid == columnContents[j].cid && lzm_chatDisplay.mainTableColumns.visitor[i].display == 1) {
                var cellId = (typeof columnContents[j].cell_id != 'undefined') ? ' id="' + columnContents[j].cell_id + '"' : '';
                extUserHtmlString += '<td' + cellId + ' style="white-space: nowrap">' + columnContents[j].contents + '</td>';
            }
        }
    }
    for (i=0; i<lzm_chatServerEvaluation.inputList.idList.length; i++) {
        var customInput = lzm_chatServerEvaluation.inputList.getCustomInput(lzm_chatServerEvaluation.inputList.idList[i]);
        if (parseInt(customInput.id) < 111 && customInput.active == 1 && customInput.display.visitor) {
            extUserHtmlString += '<td nowrap>' + that.createCustomInputString(aUser, customInput.id).replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</td>';
        }
    }

    if (newLine)
        extUserHtmlString += '</tr>';

    return [extUserHtmlString, userStyleObject, onclickAction.replace(/^ onclick="/, '').replace(/"$/, ''),
        ondblclickAction.replace(/^ ondblclick="/, '').replace(/"$/, ''), oncontextmenuAction.replace(/^ oncontextmenu="/, '').replace(/"$/, '')];
};

ChatVisitorClass.prototype.updateVisitorInformation = function(thisUser) {
    var that = this;
    if(thisUser != null)
        $(['d','e']).each(function()
        {
            var elementId = $(this)[0].toString() + '-' + thisUser.id;
            if($('#visitor-details-'+elementId+'-list').length){
                $('#visitor-details-'+elementId+'-list').html(that.createVisitorInformation(thisUser,elementId)).trigger('create');
                $('#visitor-history-'+elementId+'-placeholder-content-0').html(that.createBrowserHistory(thisUser,elementId)).trigger('create');
                for (var i=0; i<thisUser.rv.length; i++) {
                    if (thisUser.rv[i].f == 1) {
                        var recentHistoryHtml = that.createBrowserHistory(thisUser, elementId, thisUser.rv[i]);
                        $('#recent-history-'+elementId+'-' + thisUser.rv[i].id).replaceWith(recentHistoryHtml);
                    }
                }
                $('#visitor-comment-'+elementId+'-list').html(that.createVisitorCommentTable(thisUser, elementId)).trigger('create');
                $('#visitor-invitation-'+elementId+'-list').html(that.createVisitorInvitationTable(thisUser, elementId)).trigger('create');
                that.updateCoBrowsingTab(thisUser, elementId);
                var numberOfHistories = thisUser.rv.length + 1;
                var numberOfComments = thisUser.c.length;
                var numberOfInvites = thisUser.r.length;
                $('#visitor-info-'+elementId+'-placeholder-tab-2').html(t('History (<!--number_of_histories-->)', [['<!--number_of_histories-->', numberOfHistories]]));
                $('#visitor-info-'+elementId+'-placeholder-tab-3').html(t('Comments (<!--number_of_comments-->)', [['<!--number_of_comments-->', numberOfComments]]));
                $('#visitor-info-'+elementId+'-placeholder-tab-4').html(t('Chat Invites (<!--number_of_invites-->)', [['<!--number_of_invites-->', numberOfInvites]]));
                $('#visitor-info-'+elementId+'-placeholder-tab-0').removeClass('ui-disabled');
                $('#visitor-info-'+elementId+'-placeholder-tab-1').removeClass('ui-disabled');
                $('#visitor-info-'+elementId+'-placeholder-tab-2').removeClass('ui-disabled');
                $('#visitor-info-'+elementId+'-placeholder-tab-3').removeClass('ui-disabled');
                $('#visitor-info-'+elementId+'-placeholder-tab-4').removeClass('ui-disabled');
                $('#visitor-details-'+elementId+'-list').data('visitor', lzm_commonTools.clone(thisUser));

                that.updateVisitorTimestampCells(elementId);
            }
        });
};

ChatVisitorClass.prototype.getBrowserListHtml = function(visitor,elementId){

    var brwsNo = 1, coBrowseSelBrws = '', coBrowseSelectOptions = '', firstActiveBrowser = '', activeBrowserPresent = false;
    for (var j=0; j<visitor.b.length; j++) {
        if (visitor.b[j].is_active && visitor.b[j].ol == 0) {
            activeBrowserPresent = true;
            firstActiveBrowser = (firstActiveBrowser == '') ? visitor.id + '~' + visitor.b[j].id : firstActiveBrowser;
            var lastH = visitor.b[j].h2[visitor.b[j].h2.length - 1];
            var lastHTime = lzm_chatTimeStamp.getLocalTimeObject(lastH.time * 1000, true);
            var lastHTimeHuman = lzm_commonTools.getHumanDate(lastHTime, 'shorttime', lzm_chatDisplay.userLanguage);
            var selectedString = '';
            if (visitor.id + '~' + visitor.b[j].id == $('#visitor-cobrowse-'+elementId+'-iframe').data('browser'))
            {
                selectedString = ' selected="selected"';
                coBrowseSelBrws = visitor.id + '~' + visitor.b[j].id;
            }
            coBrowseSelectOptions += '<option value="' + visitor.id + '~' + visitor.b[j].id + '"' + selectedString + '>' + t('Browser <!--brws_no-->: <!--brws_url--> (<!--brws_time-->)',[['<!--brws_no-->', brwsNo], ['<!--brws_url-->', lastH.url], ['<!--brws_time-->', lastHTimeHuman]]) + '</option>';
            brwsNo++;
        }
    }

    if(!activeBrowserPresent)
        coBrowseSelectOptions += '<option>' + t('Offline') + '</option>';

    coBrowseSelBrws = (coBrowseSelBrws != '') ? coBrowseSelBrws : firstActiveBrowser;

    return [coBrowseSelectOptions,coBrowseSelBrws,activeBrowserPresent];
};

ChatVisitorClass.prototype.updateCoBrowsingTab = function(thisUser, elementId) {
    var externalIsDisabled = (lzm_chatDisplay.myGroups.length > 0);
    for (var i=0; i<lzm_chatDisplay.myGroups.length; i++) {
        var myGr = lzm_chatServerEvaluation.groups.getGroup(lzm_chatDisplay.myGroups[i]);
        if (myGr != null && myGr.external == '1') {
            externalIsDisabled = false;
        }
    }

    var coBrowseSelectOptions = this.getBrowserListHtml(thisUser,elementId);

    if (!coBrowseSelectOptions[2])
        $('#visitor-cobrowse-'+elementId+'-iframe').data('browser', '');
    else
        $('#visitor-cobrowse-'+elementId+'-iframe').data('browser', coBrowseSelectOptions[1]);

    $('#visitor-cobrowse-'+elementId+'-browser-select').html(coBrowseSelectOptions[0]);
    if (!coBrowseSelectOptions[2])
    {
        $('#visitor-cobrowse-'+elementId+'-browser-select').addClass('ui-disabled');
        //$('#visitor-cobrowse-'+elementId+'-action-select').addClass('ui-disabled');
        $('#visitor-cobrowse-'+elementId+'-language-select').addClass('ui-disabled');
    }
    else
    {
        $('#visitor-cobrowse-'+elementId+'-browser-select').removeClass('ui-disabled');
        //$('#visitor-cobrowse-'+elementId+'-action-select').removeClass('ui-disabled');
        //if ($('#visitor-cobrowse-'+elementId+'-action-select').val() != 0)
          //  $('#visitor-cobrowse-'+elementId+'-language-select').removeClass('ui-disabled');
    }
    /*
    if (externalIsDisabled) {
        $('#visitor-cobrowse-'+elementId+'-action-select').addClass('ui-disabled');
        $('#visitor-cobrowse-'+elementId+'-language-select').addClass('ui-disabled');
        $('#visitor-cobrowse-'+elementId+'-action-select').val(0);
    }
    */
    if ($('#visitor-cobrowse-'+elementId+'-iframe').length && $('#visitor-cobrowse-'+elementId+'-iframe').data('visible') == '1')
    {
        if (thisUser.id == $('#visitor-cobrowse-'+elementId+'-iframe').data('browser').split('~')[0] || !coBrowseSelectOptions[2])
        {
            var vb = lzm_chatServerEvaluation.visitors.getVisitorBrowser($('#visitor-cobrowse-'+elementId+'-iframe').data('browser'));
            if (!coBrowseSelectOptions[2] || vb[1] != null && $('#visitor-cobrowse-'+elementId+'-iframe').data('browser-url') != vb[1].h2[vb[1].h2.length - 1].url)
                loadCoBrowsingContent(elementId, vb, !coBrowseSelectOptions[2]);
        }
    }
};

ChatVisitorClass.prototype.showVisitorInformation = function (thisUser, chatId, activeTab, dialog, highlight) {
    var that = this, i, externalIsDisabled = (lzm_chatDisplay.myGroups.length > 0);
    for (i=0; i<lzm_chatDisplay.myGroups.length; i++) {
        var myGr = lzm_chatServerEvaluation.groups.getGroup(lzm_chatDisplay.myGroups[i]);
        if (myGr != null && myGr.external == '1')
            externalIsDisabled = false;
    }
    //thisUser = (typeof lzm_chatDisplay.infoUser.id != 'undefined' && lzm_chatDisplay.infoUser.id != '') ? lzm_chatDisplay.infoUser : thisUser;
    var now = lzm_chatTimeStamp.getServerTimeString(null, false, 1000);
    var elementId = ((dialog) ? 'd-' : 'e-') + thisUser.id;
    that.lastVisitorTimestampUpdate = now;
    lzm_chatDisplay.ShowVisitorId = thisUser.id;

    var visitorName = (typeof thisUser.name != 'undefined' && thisUser.name != '') ? thisUser.name : thisUser.unique_name;
    var headerString = t('Visitor (<!--visitor_name-->)',[['<!--visitor_name-->', lzm_commonTools.htmlEntities(visitorName)]]);
    var footerString = lzm_inputControls.createButton('cancel-visitorinfo', '', '', t('Close'), '', 'lr',{'margin-left': '4px'},'',30,'d');
    var bodyString = '<div id="visitor-info-'+elementId+'-placeholder" class="dialog-visitor-info" data-visitor-id="'+thisUser.id+'"></div>';
    var dialogData = {'visitor-id': thisUser.id, menu: t('Visitor Information: <!--name-->', [['<!--name-->', lzm_commonTools.htmlEntities(visitorName)]]), 'chat-type': '1', 'reload': ['chats', 'tickets'], ratio: lzm_chatDisplay.DialogBorderRatioFull};

    if(dialog)
    {
        var dialogid = lzm_displayHelper.createDialogWindow(headerString, bodyString, footerString, 'visitor-information', {}, {}, {}, {}, '', dialogData, true, true);
        $('#visitor-information').data('dialog-id', dialogid);
    }

    var detailsHtml = '<div id="visitor-details-'+elementId+'-list" style="overflow-y: auto;" data-role="none">' + that.createVisitorInformation(thisUser, elementId) + '</div>';
    var historyHtml = '<div id="visitor-history-'+elementId+'-list" data-role="none"><div id="visitor-history-'+elementId+'-placeholder"></div></div>';
    var commentsHtml = '<div id="visitor-comment-'+elementId+'-list" data-role="none">' + that.createVisitorCommentTable(thisUser, elementId) + '</div>';
    var invitationsHtml = '<div id="visitor-invitation-'+elementId+'-list" data-role="none">' + that.createVisitorInvitationTable(thisUser, elementId) + '</div>';

    var chatsHtml = '<div style="position:static;margin-top:1px;" class="lzm-dialog-headline2"><span style="float:right;padding-top:5px;margin-right:4px;">' +
        lzm_inputControls.createButton('create-ticket-from-chat-' + elementId, '', '', t('Create Ticket'),'<i class="fa fa-plus"></i>', 'lr', {'margin-left': '4px'}, '', 20) +
        lzm_inputControls.createButton('send-chat-transcript-' + elementId, '', '', t('Send transcript to...'), '<i class="fa fa-mail-forward"></i>', 'lr',{'margin-left': '4px'}) +
        lzm_inputControls.createButton('link-with-ticket-' + elementId, '', '', t('Link with Ticket'),'<i class="fa fa-link"></i>', 'lr', {'margin-left': '4px', 'margin-right': '4px'}) +'</span></div>'
        + lzm_chatDisplay.archiveDisplay.createMatchingChats(chatId,elementId) +
        '<fieldset class="lzm-fieldset" style="margin:0;" data-role="none" id="chat-content-'+elementId+'-inner"></fieldset>';

    var ticketsHtml = lzm_chatDisplay.ticketDisplay.createMatchingTickets(elementId) + '<fieldset class="lzm-fieldset" style="margin:0;" data-role="none" id="ticket-content-'+elementId+'-inner"></fieldset>';
    var brwsNo = 1, coBrowseSelBrws = '', coBrowseHtml = '';
    if (d(thisUser.b)) {
        var myGroup, myself = lzm_chatServerEvaluation.operators.getOperator(lzm_chatDisplay.myId), firstLanguage = '', firstGroup = '';
        var defaultLanguage = '', defaultGroup = '';
        if (myself != null && typeof myself.pm != 'undefined') {
            for (i=0; i<myself.pm.length; i++) {
                if (myself.pm[i].def == 1)
                    defaultLanguage = (defaultLanguage == '') ? myself.pm[i].lang : defaultLanguage;
                if (myself.pm[i].lang == thisUser.lang)
                    firstLanguage = myself.pm[i].lang;
            }
        }
        for (i=0; i<lzm_chatDisplay.myGroups.length; i++) {
            myGroup = lzm_chatServerEvaluation.groups.getGroup(lzm_chatDisplay.myGroups[i]);
            if (firstLanguage == '' && myGroup != null && typeof myGroup.pm != 'undefined' && myGroup.pm.length > 0) {
                for (var j=0; j<myGroup.pm.length; j++) {
                    if (myGroup.pm[j].def == 1) {
                        defaultLanguage = (defaultLanguage == '') ? myGroup.pm[j].lang : defaultLanguage;
                        defaultGroup = myGroup.id;
                    }
                    if (myGroup.pm[j].lang == thisUser.lang) {
                        firstLanguage = myGroup.pm[j].lang;
                        firstGroup = myGroup.id;
                    }
                }
            }
        }
        defaultLanguage = (defaultLanguage != '') ? defaultLanguage : 'en';
        firstLanguage = (firstLanguage != '') ? firstLanguage : defaultLanguage;
        firstGroup = (firstGroup != '') ? firstGroup : defaultGroup;
        var grEncId = (firstGroup != '') ? '~' + lz_global_base64_url_encode(firstGroup) : '';
        coBrowseHtml = '<div class="lzm-fieldset top-space" data-role="none" id="visitor-cobrowse-'+elementId+'"><div id="visitor-cobrowse-'+elementId+'-inner"><div><select id="visitor-cobrowse-'+elementId+'-browser-select" class="lzm-select" data-role="none">';
        for (i=0; i<thisUser.b.length; i++) {
            if (thisUser.b[i].is_active && thisUser.b[i].ol == 0) {
                var lastH = thisUser.b[i].h2[thisUser.b[i].h2.length - 1];
                var lastHTime = lzm_chatTimeStamp.getLocalTimeObject(lastH.time * 1000, true);
                var lastHTimeHuman = lzm_commonTools.getHumanDate(lastHTime, 'shorttime', lzm_chatDisplay.userLanguage);
                coBrowseHtml += '<option value="' + thisUser.id + '~' + thisUser.b[i].id + '">' + t('Browser <!--brws_no-->: <!--brws_url--> (<!--brws_time-->)',[['<!--brws_no-->', brwsNo], ['<!--brws_url-->', lastH.url], ['<!--brws_time-->', lastHTimeHuman]]) + '</option>';
                if  (coBrowseSelBrws == '')
                    coBrowseSelBrws = thisUser.id + '~' + thisUser.b[i].id;
                brwsNo++;
            }
        }
        coBrowseHtml += '</select></div><div class="top-space">';
        if (lzm_chatDisplay.isApp || lzm_chatDisplay.isMobile)
            coBrowseHtml += '<div id="visitor-cobrowse-'+elementId+'-iframe-container">'

        coBrowseHtml += '<iframe id="visitor-cobrowse-'+elementId+'-iframe" class="visitor-cobrowse-iframe" data-browser="' + coBrowseSelBrws + '" data-action="0" data-language="' + firstLanguage + '~group' + grEncId + '"></iframe>';
        if (lzm_chatDisplay.isApp || lzm_chatDisplay.isMobile)
            coBrowseHtml +='</div>';

        coBrowseHtml += '</div></div></div>';
    }
    var numberOfHistories = (typeof thisUser.rv != 'undefined') ? thisUser.rv.length + 1 : 0;
    var numberOfComments = (typeof thisUser.c != 'undefined') ? thisUser.c.length : 0;
    var numberOfInvites = (typeof thisUser.r != 'undefined') ? thisUser.r.length : 0;
    var numberOfChats = '0';
    var numberOfTickets = '0';

   if(thisUser.b_chat != null && thisUser.b_chat.hc != null && thisUser.b_chat.hc.indexOf(';')!==-1 && thisUser.b_chat.hc != '0;0')
   {
        var parts = thisUser.b_chat.hc.split(';');
        if(parts[0]>0)
            numberOfChats = parts[0];
        if(parts[1]>0)
            numberOfTickets = parts[1];
   }

    var tabsArray = [{name: t('Details'), content: detailsHtml},
        {name: t('CoBrowse'), content: coBrowseHtml},
        {name: t('History (<!--number_of_histories-->)', [['<!--number_of_histories-->', numberOfHistories]]), content: historyHtml},
        {name: t('Comments (<!--number_of_comments-->)', [['<!--number_of_comments-->', numberOfComments]]), content: commentsHtml},
        {name: t('Chat Invites (<!--number_of_invites-->)', [['<!--number_of_invites-->', numberOfInvites]]), content: invitationsHtml},
        {name: t('Chats (<!--number_of_chats-->)', [['<!--number_of_chats-->', numberOfChats]]), content: chatsHtml},
        {name: t('Tickets (<!--number_of_tickets-->)', [['<!--number_of_tickets-->', numberOfTickets]]), content: ticketsHtml}];

    try
    {
        lzm_displayHelper.createTabControl('visitor-info-'+elementId+'-placeholder', tabsArray, activeTab);
    }
    catch(e){deblog(e);deblog(elementId);}

    $('#matching-chats-'+elementId+'-inner-div').data('chat-dialog-id', dialogid);
    $('#matching-chats-'+elementId+'-inner-div').data('chat-dialog-window', 'visitor-information');
    $('#matching-chats-'+elementId+'-inner-div').data('chat-dialog-data', dialogData);

    var currentHistory = that.createBrowserHistory(thisUser,elementId);
    var historyTabsArray = [{name: tid('active'), content: currentHistory, hash: md5('Active')}];
    if (typeof thisUser.rv != 'undefined') {
        for (i=0; i<thisUser.rv.length; i++) {
            var date = lzm_chatTimeStamp.getLocalTimeObject(thisUser.rv[i].e * 1000, true);
            var humanDate = lzm_commonTools.getHumanDate(date, 'all', lzm_chatDisplay.userLanguage);
            var recentHistoryHtml = '<div id="recent-history-'+elementId+'-' + thisUser.rv[i].id + '" class="browser-history-container" style="overflow-y: auto;"><div class="lz_anim_loading"></div></div>';
            historyTabsArray.push({name: humanDate, content: recentHistoryHtml, hash: thisUser.rv[i].id});
        }
    }

    var tabControlWidth = ((dialog) ? $('#visitor-information').width() : $('#chat-info-body').width()) - 37;
    lzm_displayHelper.createTabControl('visitor-history-'+elementId+'-placeholder', historyTabsArray, 0, tabControlWidth);
    lzm_displayLayout.resizeVisitorDetails();

    if(numberOfComments > 0)
        $('#visitor-info-'+elementId+'-placeholder-tab-3').addClass('lzm-tabs-message');
    if(numberOfInvites > 0)
        $('#visitor-info-'+elementId+'-placeholder-tab-4').addClass('lzm-tabs-message');

    var selectedChatId = $('#matching-chats-'+elementId+'-table').data('selected-chat-id');
    if (typeof selectedChatId != 'undefined')
        if (selectedChatId == '')
            $('#create-ticket-from-chat-' + elementId).addClass('ui-disabled');

    if (Object.keys(thisUser).length == 2) {
        $('#visitor-info-'+elementId+'-placeholder-tab-0').addClass('ui-disabled');
        $('#visitor-info-'+elementId+'-placeholder-tab-1').addClass('ui-disabled');
        $('#visitor-info-'+elementId+'-placeholder-tab-2').addClass('ui-disabled');
        $('#visitor-info-'+elementId+'-placeholder-tab-3').addClass('ui-disabled');
        $('#visitor-info-'+elementId+'-placeholder-tab-4').addClass('ui-disabled');
    }
    $('#visitor-info-'+elementId+'-placeholder-tab-5').addClass('ui-disabled');
    $('#visitor-info-'+elementId+'-placeholder-tab-6').addClass('ui-disabled');
    if (activeTab == 1)
        $('#visitor-cobrowse-'+elementId+'-iframe').data('visible', '1');
    else
        $('#visitor-cobrowse-'+elementId+'-iframe').data('visible', '0');

    $('.visitor-info-'+elementId+'-placeholder-tab').click(function() {
        lzm_displayLayout.resizeVisitorDetails();
        $(this).removeClass('lzm-tabs-message');
        var tabNo = $(this).data('tab-no');
        if (tabNo == 1) {
            $('#visitor-cobrowse-'+elementId+'-iframe').data('visible', '1');
            loadCoBrowsingContent(elementId);
        } else {
            $('#visitor-cobrowse-'+elementId+'-iframe').data('visible', '0');
        }
    });
    $('.visitor-history-'+elementId+'-placeholder-tab').click(function() {
        var tabNo = $(this).data('tab-no');
        if (tabNo > 0) {
            lzm_chatPollServer.pollServerSpecial({visitorId: thisUser.id,
                recentHistoryId: $(this).data('hash')}, 'download_recent_history');
        }
        if (tabNo == 1) {
            loadCoBrowsingContent(elementId);
        }
    });
    $('#create-ticket-from-chat-' + elementId).click(function() {
        if (lzm_commonPermissions.checkUserPermissions('', 'tickets', 'create_tickets', {})) {
            showTicketDetails('', false, '', $('#matching-chats-'+elementId+'-table').data('selected-chat-id'), dialogid);
        } else {
            showNoPermissionMessage();
        }
    });
    $('#send-chat-transcript-' + elementId).click(function() {
        var chatId = $('#matching-chats-'+elementId+'-table').data('selected-chat-id');
        if(!chatId)
            lzm_commonDialog.createAlertDialog(t('No element selected.'),null);
        else
            sendChatTranscriptTo(chatId, dialogid, 'visitor-information', dialogData);
    });
    $('#link-with-ticket-' + elementId).click(function() {
        var chatId = $('#matching-chats-'+elementId+'-table').data('selected-chat-id');
        if(!chatId)
            lzm_commonDialog.createAlertDialog(t('No element selected.'),null);
        else
            showTicketLinker('', chatId, null, 'chat', true, elementId);
    });
    $('#cancel-visitorinfo').click(function() {
        //lzm_chatPollServer.stopPolling();

        lzm_displayHelper.removeDialogWindow('visitor-information');
        var activeUserChat = lzm_chatServerEvaluation.userChats.getUserChat(lzm_chatDisplay.active_chat_reco);
        if (lzm_chatDisplay.selected_view == 'mychats' && activeUserChat != null) {
            var myText = loadChatInput(lzm_chatDisplay.active_chat_reco);
            initEditor(myText, 'CancelFilterCreation', lzm_chatDisplay.active_chat_reco);
        }

        lzm_chatPollServer.resetVisitorFetchInfo();
        lzm_chatDisplay.ShowVisitorId = '';
    });
    $('#visitor-cobrowse-'+elementId+'-browser-select').change(function() {
        $('#visitor-cobrowse-'+elementId+'-iframe').data('browser', $(this).val());
        loadCoBrowsingContent(elementId);
    });
    $('#visitor-details-'+elementId+'-list').data('visitor', thisUser);
};

ChatVisitorClass.prototype.createVisitorInformation = function(thisUser, elementId) {
    var visitorInfoHtml = '', visitorInfoArray, that = this;
    if (typeof thisUser.id != 'undefined' && thisUser.id != '' && typeof thisUser.b_id != 'undefined') {
        var thisChatQuestion = '';

        if (d(thisUser.b_chat))
            thisChatQuestion = (d(thisUser.b_chat.eq)) ? thisUser.b_chat.eq : '';

        var visitorName = lzm_chatServerEvaluation.inputList.getInputValueFromVisitor(111,thisUser);
        var visitorEmail = lzm_chatServerEvaluation.inputList.getInputValueFromVisitor(112,thisUser);
        var visitorCompany = lzm_chatServerEvaluation.inputList.getInputValueFromVisitor(113,thisUser);
        var visitorPhone = lzm_chatServerEvaluation.inputList.getInputValueFromVisitor(116,thisUser);
        var visitorPage = that.createVisitorPageString(thisUser);
        var visitorSearchString = that.createVisitorStrings('ss', thisUser);
        var lastVisitedDate = lzm_chatTimeStamp.getLocalTimeObject(thisUser.vl * 1000, true);
        var visitorLastVisit = lzm_commonTools.getHumanDate(lastVisitedDate, 'full', lzm_chatDisplay.userLanguage);
        var tmpDate = that.calculateTimeDifference(thisUser, 'lastOnline', true);
        var onlineTime = '<span id="visitor-online-since">' + tmpDate[0] + '</span>';
        tmpDate = lzm_chatTimeStamp.getLocalTimeObject(tmpDate[1]);
        var humanDate = lzm_commonTools.getHumanDate(tmpDate, 'all', lzm_chatDisplay.userLanguage);
        var visitorAreas = that.createVisitorAreaString(thisUser);
        var visitorJavascript = (thisUser.js == '1') ? t('Yes') : t('No');
        var pagesBrowsed = 0;
        for (var l=0; l<thisUser.b.length; l++)
            for (var m=0; m<thisUser.b[l].h2.length; m++)
                pagesBrowsed += 1;

        var visitorStatus = t('<!--status_style_begin-->Online<!--status_style_end-->',[['<!--status_style_begin-->',''],['<!--status_style_end-->','']]);
        if (typeof thisUser.is_active != 'undefined' && thisUser.is_active == false)
            visitorStatus = t('<!--status_style_begin-->Offline<!--status_style_end-->',[['<!--status_style_begin-->',''],['<!--status_style_end-->','']]);
        var visitorIsChatting = false;
        for (var glTypInd=0; glTypInd<lzm_chatServerEvaluation.global_typing.length; glTypInd++) {
            if (lzm_chatServerEvaluation.global_typing[glTypInd].id.indexOf('~') != -1 &&
                lzm_chatServerEvaluation.global_typing[glTypInd].id.split('~')[0] == thisUser.id) {
                visitorIsChatting = true;
                break;
            }
        }
        var visitorWasDeclined = true;
        var chatPartners = [];
        if (visitorIsChatting) {
            for (var bInd=0; bInd<thisUser.b.length; bInd++)
                if (typeof thisUser.b[bInd].chat.pn != 'undefined' && thisUser.b[bInd].chat.status != 'left')
                    for (var mInd=0; mInd<thisUser.b[bInd].chat.pn.member.length; mInd++) {
                        if (thisUser.b[bInd].chat.pn.member[mInd].dec == 0 && thisUser.b[bInd].chat.pn.member[mInd].st != 2) {
                            visitorWasDeclined = false;
                            chatPartners.push({oid:thisUser.b[bInd].chat.pn.member[mInd].id,cid:thisUser.b[bInd].chat.id});
                            break;
                        }
                    }
        }
        else
            visitorWasDeclined = false;

        var langName = (typeof lzm_chatDisplay.availableLanguages[thisUser.lang.toLowerCase()] != 'undefined') ?
            thisUser.lang + ' - ' + lzm_chatDisplay.availableLanguages[thisUser.lang.toLowerCase()] :
            (typeof lzm_chatDisplay.availableLanguages[thisUser.lang.toLowerCase().split('-')[0]] != 'undefined') ?
            thisUser.lang + ' - ' + lzm_chatDisplay.availableLanguages[thisUser.lang.toLowerCase().split('-')[0]] :
            thisUser.lang;

        var countryName = lzm_chatDisplay.getCountryName(thisUser.ctryi2,true);

        visitorInfoArray = {
            details: {title: t('Visitor Details'), rows: [
                {title: t('Status'), content: visitorStatus},
                {title: t('Name'), content: visitorName, editable: true, editkey: '111'},
                {title: t('Email'), content: visitorEmail, editable: true, editkey: '112'},
                {title: t('Company'), content: visitorCompany, editable: true, editkey: '113'},
                {title: t('Phone'), content: visitorPhone, editable: lzm_chatServerEvaluation.inputList.getCustomInput('116').active=='1', editkey: '116'},
                {title: t('Language'), content: langName, editable: false}
            ]},
            location: {title: t('Location'), rows: [
                {title: t('City'), content: thisUser.city, editable: false},
                {title: t('Region'), content: thisUser.region, editable: false},
                {title: t('Country'), content_icon: '<div style="background-image: url(\'./php/common/flag.php?cc=' + thisUser.ctryi2 + '\');display:inline-block;" class="visitor-list-flag"></div>', content:countryName, editable: false},
                {title: t('Time Zone'), content: t('GMT <!--tzo-->', [['<!--tzo-->', thisUser.tzo]]), editable: false}
            ]},
            device: {title: t('Visitor\'s Computer / Device'), rows: [
                {title: t('Resolution'), content: thisUser.res, editable: false},
                {title: t('Operating system'), content: thisUser.sys, editable: false},
                {title: t('Browser'), content: thisUser.bro, editable: false},
                {title: t('Javascript'), content: visitorJavascript, editable: false},
                {title: t('IP address'), content: thisUser.ip, editable: false},
                {title: t('Host'), content: thisUser.ho, editable: false},
                {title: t('ISP'), content: thisUser.isp, editable: false},
                {title: t('User ID'), content: thisUser.id, editable: false}
            ]},
            misc: {title: t('Misc'), rows: [
                {title: t('Date'), content: humanDate, editable: false},
                {title: t('Online Time'), content: onlineTime, editable: false},
                {title: t('Area(s)'), content: visitorAreas, editable: false},
                {title: t('Search string'), content: visitorSearchString, editable: false},
                {title: t('Page'), content: visitorPage, editable: false},
                {title: t('Pages browsed'), content: pagesBrowsed, editable: false},
                {title: t('Visits'), content: thisUser.vts, editable: false},
                {title: t('Last Visit'), content: visitorLastVisit, editable: false}
            ]}
        };
        if (visitorIsChatting && !visitorWasDeclined)
        {
            visitorInfoArray.chat = {title: tid('chat'), rows: []};
            visitorInfoArray.chat.rows.push({title: tid('type'), content: (thisUser.b[0].ol == 1) ? 'On-Site' : 'Off-Site'});
            if(chatPartners.length > 1)
            {
                var cphtml = '';
                for (var i=0; i<chatPartners.length; i++) {
                    var operator = lzm_chatServerEvaluation.operators.getOperator(chatPartners[i].oid);
                    if (operator != null)
                        cphtml += chatPartners[i].cid + ' - ' + operator.name + '<br>';

                }
                visitorInfoArray.chat.rows.push({title: tid('active_chats_button'), content: cphtml, class:'text-info',icon:'warning'});
            }
        }
    }
    else
    {
        visitorStatus = t('<!--status_style_begin-->Offline<!--status_style_end-->',[['<!--status_style_begin-->','<span style="color:#aa0000; font-weight: bold;">'],['<!--status_style_end-->','</span>']]);
        visitorInfoArray = {details: {title: t('Visitor Details'), rows: [{title: t('Status'), content: visitorStatus},{title: t('Name'), content: lzm_commonTools.htmlEntities(thisUser.unique_name)}]}};
    }

    for (var myKey in visitorInfoArray) {
        if (visitorInfoArray.hasOwnProperty(myKey)) {
            visitorInfoHtml += '<table id="visitor-info-table" class="visible-list-table alternating-rows-table"><thead><tr class="split-table-line"><td colspan="4"><b>' + visitorInfoArray[myKey].title + '</b></td></tr></thead><tbody>';
            for (var k=0; k<visitorInfoArray[myKey].rows.length; k++) {
                var contentString = (visitorInfoArray[myKey].rows[k].content != '') ? visitorInfoArray[myKey].rows[k].content : '-';
                var contentIcon = d(visitorInfoArray[myKey].rows[k].content_icon) ? visitorInfoArray[myKey].rows[k].content_icon : '';
                var cssClass = (d(visitorInfoArray[myKey].rows[k].class)) ? ' class="' + visitorInfoArray[myKey].rows[k].class + '"' : '';
                visitorInfoHtml += '<tr>' +
                    '<td'+cssClass+'>' + visitorInfoArray[myKey].rows[k].title + '</td>' +
                    '<td'+cssClass+'>'+contentIcon+'</td>' +
                    '<td'+cssClass+'>' + contentString + '</td>';

                    if(visitorInfoArray[myKey].rows[k].editable)
                        visitorInfoHtml += '<td'+cssClass+'><a href="#" onclick="editVisitorDetails(\''+thisUser.id+'\',\''+visitorInfoArray[myKey].rows[k].editkey+'\',\''+elementId+'\');"><i class="fa fa-edit"></i></a></td></tr>';
                    else if(d(visitorInfoArray[myKey].rows[k].icon))
                        visitorInfoHtml +='<td'+cssClass+'><i class="fa fa-'+visitorInfoArray[myKey].rows[k].icon+' icon-red"></i></td></tr>';
                    else
                        visitorInfoHtml +='<td'+cssClass+'></td></tr>';
            }
            visitorInfoHtml += '</tbody></table>';
        }
    }
    return visitorInfoHtml;
};

ChatVisitorClass.prototype.createBrowserHistory = function (visitor, elementId, rv) {
    var that = this;
    var containerDivId = (typeof rv != 'undefined') ? ' id="recent-history-'+elementId+'-' + rv.id + '"' : '';
    var browserHistoryHtml = '<div' + containerDivId + ' class="browser-history-container" style="overflow-y: auto;height:100%;">' +
        '<table class="browser-history visible-list-table alternating-rows-table lzm-unselectable" style="margin-top:1px;">' +
        '<thead><tr>' +
        '<th style="width: 1px !important;" nowrap></th>' +
        '<th nowrap>' + t('Time') + '</th>' +
        '<th nowrap>' + t('Time span') + '</th>' +
        '<th nowrap>' + t('Area') + '</th>' +
        '<th nowrap>' + t('Title') + '</th>' +
        '<th nowrap>' + t('Url') + '</th>' +
        '<th nowrap>' + t('Referrer') + '</th>' +
        '</tr></thead><tbody>';
    var lineCounter = 0;
    var browserCounter = 1;
    try {

        var myB = (typeof rv != 'undefined') ? lzm_commonTools.clone(rv.b) : lzm_commonTools.clone(visitor.b);
        for (var i = 0; i < myB.length; i++) {
            if (myB[i].id.indexOf('OVL') == -1 && myB[i].h2.length > 0) {

                browserHistoryHtml += '<tr class="split-table-line"><td colspan="7"><b>'+tid('browser') + ' ' + (i+1)+'</b></td></tr>';
                for (var j = 0; j < myB[i].h2.length; j++) {

                    var browserIcon = 'icon-light';
                    var beginTime = lzm_chatTimeStamp.getLocalTimeObject(myB[i].h2[j].time * 1000, true);
                    var beginTimeHuman = lzm_commonTools.getHumanDate(beginTime, 'shorttime', lzm_chatDisplay.userLanguage);
                    var endTime = lzm_chatTimeStamp.getLocalTimeObject();
                    if (typeof myB[i].l != 'undefined')
                        endTime = lzm_chatTimeStamp.getLocalTimeObject(myB[i].l * 1000, true);
                    else if (myB[i].h2.length > j + 1)
                        endTime = lzm_chatTimeStamp.getLocalTimeObject(myB[i].h2[j + 1].time * 1000, true);
                    else if (typeof myB[i].h2[j].time2 != 'undefined')
                        endTime = lzm_chatTimeStamp.getLocalTimeObject(myB[i].h2[j].time2 * 1000, true);

                    var endTimeHuman = lzm_commonTools.getHumanDate(endTime, 'shorttime', lzm_chatDisplay.userLanguage);
                    var timeSpan = that.calculateTimeSpan(beginTime, endTime);
                    var referer = '';
                    if (i == 0) {
                        referer = myB[i].ref;
                    }
                    if (j > 0) {
                        try {
                            referer = myB[i].h2[j - 1].url
                        } catch(ex) {}
                    }
                    if (typeof rv == 'undefined' && myB[i].is_active && j == myB[i].h2.length - 1)
                        browserIcon = 'icon-green';


                    var externalPageUrl = '';
                    try {
                        externalPageUrl = myB[i].h2[j].url;
                    } catch(ex) {}
                    var refererLink = (referer != '') ? '<a class="lz_chat_link_no_icon" href="#" onclick="openLink(\'' + referer + '\')">' + referer : '';
                    var chatPageString = (myB[i].h2[j].cp == 1) ? ' (' + t('CHAT') + ')' : '';
                    var lastTimeSpanId = (j == myB[i].h2.length - 1) ? ' id="visitor-history-'+elementId+'-last-timespan-b' + i + '"' : '';
                    var lastTimeId = (j == myB[i].h2.length - 1) ? ' id="visitor-history-'+elementId+'-last-time-b' + i + '"' : '';
                    browserHistoryHtml += '<tr class="lzm-unselectable">' +
                        '<td class="icon-column"><span class="fa fa-globe table-icon '+browserIcon+'"></span></td>' +
                        '<td nowrap' + lastTimeId + '>' + beginTimeHuman + ' - ' + endTimeHuman + '</td>' +
                        '<td nowrap' + lastTimeSpanId + '>' + timeSpan + '</td>' +
                        '<td nowrap>' + myB[i].h2[j].code + chatPageString + '</td>' +
                        '<td nowrap>' + myB[i].h2[j].title + '</td>' +
                        '<td nowrap><a class="lz_chat_link_no_icon" href="#" onclick="openLink(\'' + externalPageUrl + '\')">' + externalPageUrl + '</a></td>' +
                        '<td nowrap>' + refererLink + '</a></td>' +
                        '</tr>';
                    lineCounter++;
                }
                browserCounter++;
            }

        }
    } catch(e) {}
    browserHistoryHtml += '</tbody></table></div>';

    return browserHistoryHtml;
};

ChatVisitorClass.prototype.createVisitorCommentTable = function(visitor,elementId) {
    var userName = (typeof visitor.name != 'undefined' && visitor.name != '') ? visitor.name : visitor.unique_name;
    var menuEntry = t('Visitor Information: <!--name-->', [['<!--name-->', userName]]);
    var commentTableHtml = '<div class="lzm-dialog-headline3" style="margin-top:1px;">' + lzm_inputControls.createButton('add-comment', '', 'addVisitorComment(\'' + visitor.id + '\', \'' + menuEntry + '\')', t('Add Comment'), '<i class="fa fa-plus"></i>', 'lr', {'margin-right':'4px',float:'right'}, t('Add Comment'),'','b') + '</div><div id="visitor-comment-'+elementId+'-list-frame" style="overflow-y:auto;"><table class="visible-list-table alternating-rows-table lzm-unselectable" id="visitor-comment-'+elementId+'-table" style="width: 100%;"><tbody>';
    try {
        if(visitor.c)
            for (var i=0; i<visitor.c.length; i++) {
                var operator = lzm_chatServerEvaluation.operators.getOperator(visitor.c[i].o);
                var commentText = visitor.c[i].text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '<br />');
                commentTableHtml += lzm_chatDisplay.createCommentHtml('visitor',i,commentText,operator.name,operator.id,lzm_commonTools.getHumanDate(lzm_chatTimeStamp.getLocalTimeObject(visitor.c[i].c * 1000, true), 'all', lzm_chatDisplay.userLanguage));
            }
    } catch(e) {deblog(e);}
    commentTableHtml += '</tbody></table></div>';
    return commentTableHtml;
};

ChatVisitorClass.prototype.createVisitorInvitationTable = function(visitor,elementId) {
    var operator, that = this;
    var invitationTableHtml = '<table class="visible-list-table alternating-rows-table lzm-unselectable" id="visitor-invitation-'+elementId+'-table" style="margin-top:1px;width: 100%";>' +
        '<thead><tr>' +
        '<th style="width: 8px !important; padding-left: 11px; padding-right: 11px;"></th>' +
        '<th>' + t('Date') + '</th>' +
        '<th>' + tid('sender') + '</th>' +
        '<th>' + t('Event') + '</th>' +
        '<th>' + t('Shown') + '</th>' +
        '<th>' + t('Accepted') + '</th>' +
        '<th>' + t('Declined') + '</th>' +
        '<th>' + t('Canceled') + '</th>' +
        '</tr></thead><tbody>';
    try
    {

        for (var i=0; i<visitor.r.length; i++) 
        {
            var visitorInvitationFont = '<i class="fa icon-flip-hor fa-commenting"></i>';
            if (visitor.r.length > 0)
            {
                if (visitor.r[i].s != '' && visitor.r[i].ca == '' && visitor.r[i].a == 0 && visitor.r[i].de == 0){
                    visitorInvitationFont = '<i class="fa fa-commenting icon-flip-hor icon-orange"></i>';
                }
                else if(visitor.r[i].s != '' && visitor.r[i].a == '1') {
                    visitorInvitationFont = '<i class="fa fa-commenting icon-flip-hor icon-green"></i>';
                } else if(visitor.r[i].s != '' && visitor.r[i].ca != '') {
                    visitorInvitationFont = '<i class="fa fa-commenting icon-flip-hor icon-red"></i>';
                } else if(visitor.r[i].s != '' && visitor.r[i].de == '1') {
                    visitorInvitationFont = '<i class="fa fa-commenting icon-flip-hor icon-red"></i>';
                }
            }

            var tmpDate = lzm_chatTimeStamp.getLocalTimeObject(visitor.r[i].c * 1000, true);
            var timeHuman = lzm_commonTools.getHumanDate(tmpDate, 'all', lzm_chatDisplay.userLanguage);
            var operatorName = '';
            try {
                operator = lzm_chatServerEvaluation.operators.getOperator(visitor.r[i].s);
                operatorName = (operator != null) ? operator.name : '';
            } catch(e) {}
            var myEvent = (visitor.r[i].e != '') ? visitor.r[i].e : '-';
            var isShown = (visitor.r[i].d == "1") ? t('Yes') : t('No');
            var isAccepted = (visitor.r[i].a == "1" && visitor.r[i].ca == "") ? t('Yes') : t('No');
            var isDeclined = (visitor.r[i].de == "1") ? t('Yes') : t('No');
            var isCanceled = (visitor.r[i].ca != "") ? t('Yes (<!--op_name-->)', [['<!--op_name-->', t('Timeout')]]) : t('No');
            try {
                operator = lzm_chatServerEvaluation.operators.getOperator(visitor.r[i].ca);
                isCanceled = (visitor.r[i].ca != "") ? t('Yes (<!--op_name-->)', [['<!--op_name-->', operator.name]]) : t('No');
            } catch(e) {}
            invitationTableHtml += '<tr class="lzm-unselectable">' +
                '<td style="text-align:center;">'+visitorInvitationFont+'</td>' +
                '<td>' + timeHuman + '</td>' +
                '<td>' + operatorName + '</td>' +
                '<td>' + myEvent + '</td>' +
                '<td>' + isShown + '</td>' +
                '<td>' + isAccepted + '</td>' +
                '<td>' + isDeclined + '</td>' +
                '<td>' + isCanceled + '</td>' +
                '</tr>';
        }
    } catch(e) {}
    invitationTableHtml += '</tbody></table>';

    return invitationTableHtml;
};

ChatVisitorClass.prototype.updateShowVisitor = function() {
    var rtValue = false;
    if (typeof lzm_chatDisplay.infoUser.id != 'undefined' && lzm_chatDisplay.infoUser.id != '') {
        var visitor = lzm_chatServerEvaluation.visitors.getVisitor(lzm_chatDisplay.infoUser.id);
        if (visitor != null) {
            lzm_chatDisplay.infoUser = lzm_commonTools.clone(visitor);
            rtValue = true;
        }
    }
    return rtValue;
};

ChatVisitorClass.prototype.addVisitorComment = function(visitorId, menuEntry) {
    var commentControl = lzm_inputControls.createArea('new-comment-field', '', '', tid('comment') + ':','width:300px;height:75px;');
    lzm_commonDialog.createAlertDialog(commentControl, [{id: 'ok', name: tid('ok')},{id: 'cancel', name: tid('cancel')}],false,true,false);
    $('#new-comment-field').select();
    $('#alert-btn-ok').click(function() {
        var commentText = $('#new-comment-field').val();
        lzm_chatUserActions.saveVisitorComment(visitorId, commentText);
        lzm_commonDialog.removeAlertDialog();
    });
    $('#alert-btn-cancel').click(function() {
        lzm_commonDialog.removeAlertDialog();
    });
};

ChatVisitorClass.prototype.editVisitorDetails = function(visitorId,field,elementId){
    var visitor = lzm_chatServerEvaluation.visitors.getVisitor(visitorId);
    var hidden = ['114'], selectedField, value;
    var inputForm = '<fieldset class="lzm-fieldset"><legend>' + tid('edit') + '</legend>', input='',inputss='',inputsc='';
    for (var i=0; i<lzm_chatServerEvaluation.inputList.idList.length; i++) {
        var myCustomInput = lzm_chatServerEvaluation.inputList.getCustomInput(lzm_chatServerEvaluation.inputList.idList[i]);
        if (myCustomInput.active == 1 && $.inArray(myCustomInput.id,hidden) == -1) {
            value = lzm_chatServerEvaluation.inputList.getInputValueFromVisitor(myCustomInput.id,visitor,null,true);
            if(myCustomInput.id==field)
                selectedField = myCustomInput.id;
            input = '<div class="top-space">' + lzm_chatServerEvaluation.inputList.getControlHTML(myCustomInput,'evd-'+elementId+'-' + visitorId + myCustomInput.id, 'evd-'+elementId + '-' + visitorId,value) + '</div>';

            if(myCustomInput.id<111)
                inputsc += input;
            else
                inputss += input;
        }
    }
    inputForm += inputss + inputsc + '</fieldset>';
    lzm_commonDialog.createAlertDialog(inputForm, [{id: 'evd-ok', name: t('Ok')}, {id: 'evd-cancel', name: t('Cancel')}]);
    $('#evd-'+elementId+'-' + visitorId + selectedField).select();
    $('#alert-btn-evd-ok').click(function() {
        var newData = {p_vi_id:visitorId};
        for (var i=0; i<lzm_chatServerEvaluation.inputList.idList.length; i++) {
            var myCustomInput = lzm_chatServerEvaluation.inputList.getCustomInput(lzm_chatServerEvaluation.inputList.idList[i]);
            if (myCustomInput.active == 1 && $.inArray(myCustomInput.id,hidden) == -1) {
                var id = 'evd-'+elementId+'-' + visitorId + myCustomInput.id;
                newData['p_f' + myCustomInput.id] = lz_global_base64_url_encode(lzm_chatServerEvaluation.inputList.getControlValue(myCustomInput,id));
            }
        }
        lzm_chatPollServer.pollServerSpecial(newData, 'set_visitor_details');
        $('#alert-btn-evd-cancel').click();
    });
    $('#alert-btn-evd-cancel').click(function() {
        parent.lzm_commonDialog.removeAlertDialog();
    });
};

ChatVisitorClass.prototype.showVisitorInvitation = function(aVisitor) {
    var that = this;
    if(!lzm_chatDisplay.isApp && !lzm_chatDisplay.isMobile) {
        messageEditor = new ChatEditorClass('invitation-text', lzm_chatDisplay.isMobile, lzm_chatDisplay.isApp, lzm_chatDisplay.isWeb);
    }

    var text = '';
    var footerString = lzm_inputControls.createButton('send-invitation', 'ui-disabled', '', t('Ok'), '', 'lr',{'margin-left': '4px'},'',30,'d') +
        lzm_inputControls.createButton('cancel-invitation', '', '', t('Cancel'), '', 'lr',{'margin-left': '4px'},'',30,'d');

    var dialogData = {
        editors: [{id: 'invitation-text', instanceName: 'messageEditor'}], 'visitor-id': aVisitor.id};
    lzm_displayHelper.createDialogWindow(t('Chat Invitation'), that.createVisitorInvitation(aVisitor), footerString, 'chat-invitation', {}, {}, {}, {}, '', dialogData);


    $('#invitation-text-inner').addClass('lzm-text-input-inner');
    $('#invitation-text').css({border:0});

    if (!lzm_chatDisplay.isMobile && !lzm_chatDisplay.isApp)
        $('#invitation-text-controls').addClass('lzm-text-input-controls');
    else
        $('#invitation-text-controls').addClass('lzm-text-input-controls-mobile');

    if (!lzm_chatDisplay.isMobile && !lzm_chatDisplay.isApp) {
        $('#invitation-text-body').addClass('lzm-text-input-body');
    }

    try
    {
        text = lzm_chatUserActions.getChatPM(aVisitor.id, $('#browser-selection').val(), 'invm', $('#language-selection').val().split('---')[0],$('#group-selection').val())['invm'];
    } catch (e) {
        text = '';
    }
    if (!lzm_chatDisplay.isMobile && !lzm_chatDisplay.isApp)
        messageEditor.init(text, 'showVisitorInvitation');
    else
        $('#invitation-text').html(text);


    $('#language-selection').change(function() {
        var selLanguage = $('#language-selection').val().split('---')[0];
        var selGroup = '';
        if ($('#language-selection').val().split('---')[1] == 'group') {
            selGroup = $('#group-selection').val();
        }
        try {
            text = lzm_chatUserActions.getChatPM(aVisitor.id, $('#browser-selection').val(), 'invm', selLanguage, selGroup)['invm'];
        } catch(e) {
            text = '';
        }
        if (!lzm_chatDisplay.isMobile && !lzm_chatDisplay.isApp) {
            messageEditor.setHtml(text);
        } else {
            $('#invitation-text').html(text);
        }
    });
    $('#group-selection').change(function() {
        var selLanguage = $('#language-selection').val().split('---')[0];
        var selGroup = '';
        if ($('#language-selection').val().split('---')[1] == 'group') {
            selGroup = $('#group-selection').val();
        }
        try {
            text = lzm_chatUserActions.getChatPM(aVisitor.id, $('#browser-selection').val(), 'invm', selLanguage, selGroup)['invm'];
        } catch (e) {
            text = '';
        }
        if (!lzm_chatDisplay.isMobile && !lzm_chatDisplay.isApp) {
            messageEditor.setHtml(text);
        } else {
            $('#invitation-text').html(text);
        }
    });
    if ($('#browser-selection').val() != -1)
        $('#send-invitation').removeClass('ui-disabled');

    $('#browser-selection').change(function() {
        if ($('#browser-selection').val() != -1)
            $('#send-invitation').removeClass('ui-disabled');
    });
    $('#withdraw-invitation').click(function() {
        if (!lzm_chatDisplay.isMobile && !lzm_chatDisplay.isApp) {
            delete messageEditor;
        }
        cancelInvitation(aVisitor.id);
        lzm_displayHelper.removeDialogWindow('chat-invitation');

    });
    $('#cancel-invitation').click(function() {
        if (!lzm_chatDisplay.isMobile && !lzm_chatDisplay.isApp) {
            delete messageEditor;
        }
        lzm_displayHelper.removeDialogWindow('chat-invitation');
    });
    $('#send-invitation').click(function() {
        var thisGroup = lzm_chatServerEvaluation.groups.getGroup($('#group-selection').val());
        if (thisGroup == null || thisGroup.oh == '1') {
            if (!lzm_chatDisplay.isMobile && !lzm_chatDisplay.isApp) {
                text = messageEditor.grabHtml();
                delete messageEditor;
            } else {
                text = $('#invitation-text').val()
            }

            if(lzm_chatPollServer.user_status != 0)
                setUserStatus(0, null);

            inviteExternalUser(aVisitor.id, $('#browser-selection').val(), text);
            lzm_displayHelper.removeDialogWindow('chat-invitation');
        } else {
            showOutsideOpeningMessage(thisGroup.name);
        }
    });

    lzm_displayLayout.resizeVisitorInvitation();

    $('#browser-selection').focus();


};

ChatVisitorClass.prototype.createVisitorInvitation = function(visitor) {
    var pmLanguages = lzm_chatUserActions.getPmLanguages('');
    var myGroups = lzm_chatDisplay.myGroups, i = 0, browsers = [], labrowser={la:0,bid:''};
    try {
        for (i=0; i<visitor.b.length; i++) {
            var historyLength = visitor.b[i].h2.length;
            var browserType = (historyLength > 0) ? visitor.b[i].h2[historyLength - 1].cp : 1;
            if (browserType != 1 && visitor.b[i].id.indexOf('_OVL') == -1 && visitor.b[i].is_active) {
                var thisBrowser = lzm_commonTools.clone(visitor.b[i]);
                var historyLastEntry = thisBrowser.h2.length - 1;
                thisBrowser.url = thisBrowser.h2[historyLastEntry].url;
                var tmpDate = lzm_chatTimeStamp.getLocalTimeObject(thisBrowser.h2[historyLastEntry].time * 1000, true);
                thisBrowser.time = lzm_commonTools.getHumanDate(tmpDate, 'time', lzm_chatDisplay.userLanguage);
                browsers.push(thisBrowser);
                if(labrowser.la < thisBrowser.h2[historyLastEntry].time)
                    labrowser = {la:thisBrowser.h2[historyLastEntry].time,bid:visitor.b[i].id};
            }
        }
    } catch(ex) {}
    var visitorLangString = visitor.lang.toUpperCase().substr(0,2);
    var languageSelectHtml = '<label for="language-selection">' + t('Language:') + '</label><select id="language-selection" data-role="none">';
    visitorLangString = ($.inArray(visitorLangString, pmLanguages.group) != -1) ? visitorLangString : pmLanguages['default'][1];
    var defaultDefinedBy = pmLanguages['default'][0], langName;
    for (i=0; i<pmLanguages.group.length; i++) {
        langName = (typeof lzm_chatDisplay.availableLanguages[pmLanguages.group[i].toLowerCase().split('-')[0]] != 'undefined') ? pmLanguages.group[i] + ' - ' + lzm_chatDisplay.availableLanguages[pmLanguages.group[i].toLowerCase().split('-')[0]] : pmLanguages.group[i];
        if (defaultDefinedBy == 'group' && visitorLangString == pmLanguages.group[i])
            languageSelectHtml += '<option selected="selected" value="' + pmLanguages.group[i] + '---group">' + langName + ' (' + t('Group') + ')</option>';
        else
            languageSelectHtml += '<option value="' + pmLanguages.group[i] + '---group">' + langName + ' (' + t('Group') + ')</option>';
    }
    for (i=0; i<pmLanguages.user.length; i++) {
        langName = (typeof lzm_chatDisplay.availableLanguages[pmLanguages.user[i].toLowerCase()] != 'undefined') ?
            pmLanguages.user[i] + ' - ' + lzm_chatDisplay.availableLanguages[pmLanguages.user[i].toLowerCase()] :
            (typeof lzm_chatDisplay.availableLanguages[pmLanguages.user[i].toLowerCase().split('-')[0]] != 'undefined') ? pmLanguages.user[i] + ' - ' + lzm_chatDisplay.availableLanguages[pmLanguages.user[i].toLowerCase().split('-')[0]] :
                pmLanguages.user[i];
        if (defaultDefinedBy == 'user' && visitorLangString == pmLanguages.user[i])
            languageSelectHtml += '<option selected="selected" value="' + pmLanguages.user[i] + '---user">' + langName + ' (' + tid('operator') + ')</option>';
        else
            languageSelectHtml += '<option value="' + pmLanguages.user[i] + '---user">' + langName + ' (' + tid('operator') + ')</option>';

    }
    languageSelectHtml += '</select>';
    var groupSelectHtml = '<label for="group-selection">' + t('Group:') + '</label><select id="group-selection" data-role="none">';
    for (i=0; i<myGroups.length; i++) {
        var thisGroup = lzm_chatServerEvaluation.groups.getGroup(myGroups[i]);
        if (thisGroup != null && typeof thisGroup.oh != 'undefined')
            groupSelectHtml += '<option value="' + myGroups[i] + '">' + lzm_chatServerEvaluation.groups.getGroup(myGroups[i]).name + '</option>';
    }
    groupSelectHtml += '</select>';
    var browserSelectHtml = '<label for="browser-selection" class="top-space">' + tidc('browser') + '</label><select id="browser-selection" class="lzm-multiselect" size="3" data-role="none">';
    if (browsers.length != 0)
        for (i=browsers.length-1; i>=0; i--)
            browserSelectHtml += '<option value="' + browsers[i].id + '"'+(browsers[i].id==labrowser.bid ? ' selected' : '')+'>Browser ' + (i + 1) + ': ' + browsers[i].url + ' (' + browsers[i].time + ')</option>';
    else
        browserSelectHtml += '<option value="-1">' + t('No active browser') + '</option>';

    browserSelectHtml += '</select>';
    var textInputHtml = '<label for="invitation-text" class="top-space">' + tidc('invitation_text') + '</label>' +
        '<div id="invitation-text-inner">' +
        '<div id="invitation-text-controls">' +
        lzm_inputControls.createInputControlPanel('basic').replace(/lzm_chatInputEditor/g,'messageEditor') +
        '</div><div id="invitation-text-body"><textarea id="invitation-text" style="padding: 4px;"></textarea></div></div>';

    return '<fieldset id="user-invite-form" class="lzm-fieldset" data-role="none">' +
        '<legend>' + t('Chat Invitation') + '</legend><div id="user-invite-form-inner">' +
        '<table style="width: 100%;"><tr><td style="width:50%;">' + languageSelectHtml + '</td><td style="width:50%;">' + groupSelectHtml + '</td></tr>' +
        '<tr><td colspan="2">' + browserSelectHtml + '</td></tr><tr><td colspan="2">' + textInputHtml + '</td></tr></table></div></fieldset>';
};

ChatVisitorClass.prototype.showTranslateOptions = function(visitorChat, language) {
    var headerString = t('Auto Translation Setup'), that = this;
    var footerString =  lzm_inputControls.createButton('save-translate-options', '', '', t('Ok'), '', 'lr',{'margin-left': '4px'},'',30,'d') +
        lzm_inputControls.createButton('cancel-translate-options', '', '', t('Cancel'), '', 'lr',{'margin-left': '4px'},'',30,'d');
    var dialogData = {};
    var translateOptions = that.createTranslateOptions(visitorChat, language);
    var bodyString = translateOptions[0] + translateOptions[1];
    lzm_displayHelper.createDialogWindow(headerString, bodyString, footerString, 'translate-options', {}, {}, {}, {}, '', dialogData, false, false);
    lzm_displayLayout.resizeTranslateOptions();
    if (lzm_chatDisplay.translationServiceError != null)
    {
        lzm_commonDialog.createAlertDialog(t('An error occured while fetching the languages from the Google Translate server.'), [{id: 'ok', name: t('Ok')}]);
        $('#alert-btn-ok').click(function() {
            lzm_commonDialog.removeAlertDialog();
            lzm_chatUserActions.getTranslationLanguages();
        });
    }
    $('#tmm-checkbox').change(function() {
        if ($('#tmm-checkbox').prop('checked')) {
            $('#tmm-select-div').removeClass('ui-disabled');
        } else {
            $('#tmm-select-div').addClass('ui-disabled');
        }
    });
    $('#tvm-checkbox').change(function() {
        if ($('#tvm-checkbox').prop('checked')) {
            $('#tvm-select-div').removeClass('ui-disabled');
        } else {
            $('#tvm-select-div').addClass('ui-disabled');
        }
    });
    $('#save-translate-options').click(function() {
        var tmm = {translate: $('#tmm-checkbox').prop('checked'), sourceLanguage: $('#tmm-source').val(), targetLanguage: $('#tmm-target').val()};
        var tvm = {translate: $('#tvm-checkbox').prop('checked'), sourceLanguage: $('#tvm-source').val(), targetLanguage: $('#tvm-target').val()};
        lzm_chatUserActions.saveTranslationSettings(visitorChat, tmm, tvm);
        $('#cancel-translate-options').click();
    });
    $('#cancel-translate-options').click(function() {
        lzm_displayHelper.removeDialogWindow('translate-options');
        var activeUserChat = lzm_chatServerEvaluation.userChats.getUserChat(lzm_chatDisplay.active_chat_reco);
        if (lzm_chatDisplay.selected_view == 'mychats' && activeUserChat != null) {
            var chatText = loadChatInput(lzm_chatDisplay.active_chat_reco);
            initEditor(chatText, 'minimzeDialogWindow', lzm_chatDisplay.active_chat_reco);
        }
    });
};

ChatVisitorClass.prototype.createTranslateOptions = function(visitorChat,language){
    var translateOptions = ['', ''], selectedString = '', i;
    var sourceLanguage = (typeof lzm_chatDisplay.chatTranslations[visitorChat] != 'undefined' && lzm_chatDisplay.chatTranslations[visitorChat].tmm != null) ? lzm_chatDisplay.chatTranslations[visitorChat].tmm.sourceLanguage : lzm_chatUserActions.gTranslateLanguage;
    var targetLanguage = (typeof lzm_chatDisplay.chatTranslations[visitorChat] != 'undefined' && lzm_chatDisplay.chatTranslations[visitorChat].tmm != null) ? lzm_chatDisplay.chatTranslations[visitorChat].tmm.targetLanguage : language;

    var translate = (typeof lzm_chatDisplay.chatTranslations[visitorChat] != 'undefined' && lzm_chatDisplay.chatTranslations[visitorChat].tmm != null) ? lzm_chatDisplay.chatTranslations[visitorChat].tmm.translate : false;
    var checkedString = (translate) ? ' checked="checked"' : '';
    var disabledString = (!translate) ? ' ui-disabled' : '';
    translateOptions[0] = '<fieldset data-role="none" class="lzm-fieldset" id="translate-my-messages"><legend>' +
        t('My messages') + '</legend>' +
        '<input' + checkedString + ' type="checkbox" data-role="none" class="checkbox-custom" id="tmm-checkbox" style="vertical-align: middle;" />' +
        '<label for="tmm-checkbox" class="checkbox-custom-label">' + t('Translate my messages') + '</label><div id="tmm-select-div" class="top-space left-space-child' + disabledString + '"><label for="tmm-source">' + t('Translate from:') + '</label>' +
        '<select data-role="none" class="lzm-select translation-language-select" id="tmm-source">';
    for (i=0; i<lzm_chatDisplay.translationLanguages.length; i++) {
        selectedString = (lzm_chatDisplay.translationLanguages[i].language.toLowerCase() == sourceLanguage.toLowerCase()) ? ' selected="selected"' : '';
        translateOptions[0] += '<option' + selectedString + ' value="' + lzm_chatDisplay.translationLanguages[i].language + '">' +
            lzm_chatDisplay.translationLanguages[i].name + ' - ' + lzm_chatDisplay.translationLanguages[i].language.toUpperCase() + '</option>';
    }
    translateOptions[0] +='</select><br /><br />' +
        '<label for="tmm-target">' + t('Translate into:') + '</label>' +
        '<select data-role="none" class="lzm-select translation-language-select" id="tmm-target">';
    for (i=0; i<lzm_chatDisplay.translationLanguages.length; i++) {
        selectedString = (lzm_chatDisplay.translationLanguages[i].language.toLowerCase() == targetLanguage.toLowerCase()) ? ' selected="selected"' : '';
        translateOptions[0] += '<option' + selectedString + ' value="' + lzm_chatDisplay.translationLanguages[i].language + '">' +
            lzm_chatDisplay.translationLanguages[i].name + ' - ' + lzm_chatDisplay.translationLanguages[i].language.toUpperCase() + '</option>';
    }
    translateOptions[0] +='</select></div></fieldset>';

    sourceLanguage = (typeof lzm_chatDisplay.chatTranslations[visitorChat] != 'undefined' && lzm_chatDisplay.chatTranslations[visitorChat].tvm != null) ? lzm_chatDisplay.chatTranslations[visitorChat].tvm.sourceLanguage : language;
    targetLanguage = (typeof lzm_chatDisplay.chatTranslations[visitorChat] != 'undefined' && lzm_chatDisplay.chatTranslations[visitorChat].tvm != null) ? lzm_chatDisplay.chatTranslations[visitorChat].tvm.targetLanguage : lzm_chatUserActions.gTranslateLanguage;

    translate = (typeof lzm_chatDisplay.chatTranslations[visitorChat] != 'undefined' && lzm_chatDisplay.chatTranslations[visitorChat].tvm != null) ? lzm_chatDisplay.chatTranslations[visitorChat].tvm.translate : false;
    checkedString = (translate) ? ' checked="checked"' : '';
    disabledString = (!translate) ? ' ui-disabled' : '';
    translateOptions[1] = '<fieldset data-role="none" class="lzm-fieldset" id="translate-visitor-messages"><legend>' +
        t('Visitor\'s messages') + '</legend>' +
        '<input' + checkedString + ' type="checkbox" data-role="none" class="checkbox-custom" id="tvm-checkbox" style="vertical-align: middle;" />' +
        '<label for="tvm-checkbox" class="checkbox-custom-label">' + t('Translate visitor\'s messages') + '</label>' +
        '<div id="tvm-select-div" class="top-space left-space-child' + disabledString + ' "><label for="tvm-source">' + t('Translate from:') + '</label>' +
        '<select data-role="none" class="lzm-select translation-language-select" id="tvm-source">';
    for (i=0; i<lzm_chatDisplay.translationLanguages.length; i++) {
        selectedString = (lzm_chatDisplay.translationLanguages[i].language.toLowerCase() == sourceLanguage.toLowerCase()) ? ' selected="selected"' : '';
        translateOptions[1] += '<option' + selectedString + ' value="' + lzm_chatDisplay.translationLanguages[i].language + '">' +
            lzm_chatDisplay.translationLanguages[i].name + ' - ' + lzm_chatDisplay.translationLanguages[i].language.toUpperCase() + '</option>';
    }
    translateOptions[1] +='</select><br /><br />' +
        '<label for="tvm-target">' + t('Translate into:') + '</label>' +
        '<select data-role="none" class="lzm-select translation-language-select" id="tvm-target">';

    for (i=0; i<lzm_chatDisplay.translationLanguages.length; i++)
    {
        selectedString = (lzm_chatDisplay.translationLanguages[i].language.toLowerCase() == targetLanguage.toLowerCase()) ? ' selected="selected"' : '';
        translateOptions[1] += '<option' + selectedString + ' value="' + lzm_chatDisplay.translationLanguages[i].language + '">' +
            lzm_chatDisplay.translationLanguages[i].name + ' - ' + lzm_chatDisplay.translationLanguages[i].language.toUpperCase() + '</option>';
    }
    translateOptions[1] +='</select></div></fieldset>';
    return translateOptions;
};

ChatVisitorClass.prototype.createVisitorStrings = function(type, aUser) {
    var returnListString = '-', visitorStringList = [], that = this;
    if (type.indexOf('.') != -1) {
        type = type.split('.');
    } else {
        type = [type];
    }
    if (aUser.b.length > 0) {
        for (var i=0; i<aUser.b.length; i++) {
            if (type.length == 1) {
                if (typeof aUser.b[i][type[0]] != 'undefined' && aUser.b[i][type[0]] != '' &&
                    $.inArray(aUser.b[i][type[0]], visitorStringList) == -1) {
                    visitorStringList.push(lzm_commonTools.htmlEntities(aUser.b[i][type[0]]));
                }
            } else {
                if (typeof aUser.b[i][type[0]][type[1]] != 'undefined' && aUser.b[i][type[0]][type[1]] != '' &&
                    $.inArray(aUser.b[i][type[0]][type[1]], visitorStringList) == -1) {
                    visitorStringList.push(lzm_commonTools.htmlEntities(aUser.b[i][type[0]][type[1]]));
                }
            }
        }
    }
    if (typeof visitorStringList != undefined && visitorStringList instanceof Array && visitorStringList.length > 0) {
        returnListString = visitorStringList.join(', ');
    }
    return returnListString;
};

ChatVisitorClass.prototype.createVisitorPageString = function(aUser) {
    var activeBrowserCounter = 0, activeBrowserUrl = '', that = this;
    try {
        for (var i=0; i< aUser.b.length; i++) {
            if (aUser.b[i].id.indexOf('OVL') == -1 && aUser.b[i].is_active) {
                activeBrowserCounter++;
                var historyLength = aUser.b[i].h2.length;
                var url = aUser.b[i].h2[historyLength - 1].url;
                var text = (url.length > 128) ? url.substring(0,124) : url;
                activeBrowserUrl = '<a href="#" class="lz_chat_link_no_icon" data-role="none" onclick="openLink(\'' + url + '\');">' + text + '</a>';
            }
        }
    } catch(ex) {}
    if (activeBrowserCounter > 1) {
        activeBrowserUrl = t('<!--number_of_browsers--> Browsers', [['<!--number_of_browsers-->', activeBrowserCounter]]);
    }
    return activeBrowserUrl;
};

ChatVisitorClass.prototype.createVisitorAreaString = function(aUser) {
    var areaStringArray = [], areaCodeArray = [], that = this;
    for (var i=0; i<aUser.b.length; i++) {
        for (var j=0; j<aUser.b[i].h2.length; j++) {
            if (aUser.b[i].h2[j].code != '' && $.inArray(aUser.b[i].h2[j].code, areaCodeArray) == -1) {
                var chatPageString = (aUser.b[i].h2[j].cp == 1) ? ' (' + t('CHAT') + ')' : '';
                areaCodeArray.push(aUser.b[i].h2[j].code);
                areaStringArray.push(aUser.b[i].h2[j].code + chatPageString);
            }
        }
    }

    return areaStringArray.join(', ');
};

ChatVisitorClass.prototype.chatInvitationSortFunction = function(a, b) {
    var rtValue = 0, that = this;
    if (a.c > b.c) {
        rtValue = -1;
    } else if (a.c < b.c) {
        rtValue = 1;
    }
    return rtValue;
};

ChatVisitorClass.prototype.calculateTimeDifference = function(aUser, type, includeSeconds) {
    var tmpBegin, tmpTimeDifference, tmpDiffSeconds, tmpDiffMinutes, tmpDiffHours, tmpDiffDays, tmpRest, returnString = '';
    var i, foo, that = this;
    if (type=='lastOnline') {
        tmpBegin = lzm_chatTimeStamp.getServerTimeString(null, true, 1);
        for (i=0; i<aUser.b.length; i++) {
            if (aUser.b[i].h2.length > 0) {
                tmpBegin = Math.min(aUser.b[i].h2[0].time * 1000, tmpBegin);
                foo = lzm_chatTimeStamp.getLocalTimeObject(tmpBegin, true);
            }
        }
    } else if (type=='lastActive') {
        tmpBegin = 0;
        for (i=0; i<aUser.b.length; i++) {
            if (aUser.b[i].h2.length > 0) {
                var newestH = aUser.b[i].h2.length - 1;
                tmpBegin = Math.max(aUser.b[i].h2[newestH].time * 1000, tmpBegin);
                foo = lzm_chatTimeStamp.getLocalTimeObject(tmpBegin, true);
            }
        }
    }
    if (tmpBegin == 0) {
        tmpBegin = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
    }
    tmpTimeDifference = Math.floor(lzm_chatTimeStamp.getServerTimeString(null, false, 1) - tmpBegin) / 1000;
    tmpDiffSeconds = Math.max(0, tmpTimeDifference % 60);
    tmpRest = Math.floor(tmpTimeDifference / 60);
    tmpDiffMinutes = Math.max(0, tmpRest % 60);
    tmpRest = Math.floor(tmpRest / 60);
    tmpDiffHours = Math.max(0, tmpRest % 24);
    tmpDiffDays = Math.max(0, Math.floor(tmpRest / 24));

    if (tmpDiffDays > 0) {
        returnString += tmpDiffDays + ' ';
    }
    returnString += '<!-- ' + tmpBegin + ' -->' + lzm_commonTools.pad(tmpDiffHours, 2) + ':' + lzm_commonTools.pad(tmpDiffMinutes, 2);
    if (typeof includeSeconds != 'undefined' && includeSeconds) {
        returnString += ':' + lzm_commonTools.pad(Math.round(tmpDiffSeconds), 2);
    }
    return [returnString, tmpBegin];
};

ChatVisitorClass.prototype.createCustomInputString = function(visitor, inputId) {
    return lzm_chatServerEvaluation.inputList.getInputValueFromVisitor(inputId,visitor);
};

ChatVisitorClass.prototype.getVisitorOnlineTimes = function(visitor) {
    var rtObject = {}, that = this;
    rtObject['online'] = that.calculateTimeDifference(visitor, 'lastOnline', false)[0].replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;');
    rtObject['active'] = that.calculateTimeDifference(visitor, 'lastActive', false)[0].replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;');
    return rtObject;
};

ChatVisitorClass.prototype.getVisitorListLinePosition = function(visitor) {
    var nextLine = 'visitor-list-row-NONE', that = this;
    var aUserTimestamp = that.getVisitorOnlineTimestamp(visitor);
    var tmpTimestamp = 4294967295;
    var visitors = lzm_chatServerEvaluation.visitors.getVisitorList();
    for (var i=0; i<visitors.length; i++) {
        var thisUserTimestamp = that.getVisitorOnlineTimestamp(visitors[i]);
        if (thisUserTimestamp >= aUserTimestamp && visitors[i].id != visitor.id && thisUserTimestamp <= tmpTimestamp) {
            nextLine = 'visitor-list-row-' + visitors[i].id;
            tmpTimestamp = thisUserTimestamp;
        }
    }
    return nextLine;
};

ChatVisitorClass.prototype.getVisitorOnlineTimestamp = function(aUser) {
    var selectedUserOnlineBeginn = 4294967295, that = this;
    for (var i=0; i<aUser.b.length; i++) {
        if (typeof aUser.b[i].h2 != 'undefined') {
            for (var j=0; j<aUser.b[i].h2.length; j++) {
                selectedUserOnlineBeginn = (aUser.b[i].h2[j].time < selectedUserOnlineBeginn) ? aUser.b[i].h2[j].time : selectedUserOnlineBeginn;
            }
        }
    }
    return selectedUserOnlineBeginn;
};

ChatVisitorClass.prototype.calculateTimeSpan = function(beginTime, endTime) {
    var that = this;
    var secondsSpent = endTime.getSeconds() - beginTime.getSeconds();
    var minutesSpent = endTime.getMinutes() - beginTime.getMinutes();
    var hoursSpent = endTime.getHours() - beginTime.getHours();
    var daysSpent = endTime.getDate() - beginTime.getDate();
    if (daysSpent < 0) {
        var currentMonth = endTime.getMonth();
        var monthLength = 31;
        if ($.inArray(currentMonth, [3,5,8,10]) != -1) {
            monthLength = 30;
        }
        if (currentMonth == 1) {
            monthLength = 28;
        }
        daysSpent = (monthLength - beginTime.getDate()) + endTime.getDate();
    }
    if (secondsSpent < 0) {
        secondsSpent += 60;
        minutesSpent -= 1;
    }
    if (minutesSpent < 0) {
        minutesSpent += 60;
        hoursSpent -= 1;
    }
    if (hoursSpent < 0) {
        hoursSpent += 24;
        daysSpent -= 1;
    }
    var timeSpan = lzm_commonTools.pad(hoursSpent, 2) + ':' + lzm_commonTools.pad(minutesSpent, 2) + ':' +
        lzm_commonTools.pad(secondsSpent, 2);
    if (daysSpent > 0) {
        timeSpan = daysSpent + '.' + timeSpan;
    }
    return timeSpan;
};

ChatVisitorClass.prototype.createVisitorListContextMenu = function(myObject) {
    var externalIsDisabled = (lzm_chatDisplay.myGroups.length > 0), i = 0;
    for (i=0; i<lzm_chatDisplay.myGroups.length; i++) {
        var myGr = lzm_chatServerEvaluation.groups.getGroup(lzm_chatDisplay.myGroups[i]);
        if (myGr != null && myGr.external == '1')
            externalIsDisabled = false;
    }
    var contextMenuHtml = '';
    contextMenuHtml += '<div onclick="showVisitorInfo(\'' + myObject.visitor.id + '\');removeVisitorListContextMenu();"><span id="show-this-visitor-details" class="cm-line cm-click">' + t('Details') + '</span></div><hr />';
    var disabledClass = (externalIsDisabled || (myObject.chatting == 'true' && myObject.declined == 'false')) ? ' class="ui-disabled"' : '';
    var invText = (myObject.status != 'requested') ? t('Chat Invitation') : t('Cancel invitation(s)');
    var onclickAction = (myObject.status != 'requested') ? 'showVisitorInvitation(\'' + myObject.visitor.id + '\');removeVisitorListContextMenu();' : 'cancelInvitation(\'' + myObject.visitor.id + '\');removeVisitorListContextMenu();';
    contextMenuHtml += '<div' + disabledClass + ' onclick="' + onclickAction + '"><span id="invite-this-visitor" class="cm-line cm-click">' + invText + '</span></div>';
    var usesOlcChat = false;
    for (i=0; i<myObject.visitor.b.length; i++)
        if (myObject.visitor.b[i].is_active && myObject.visitor.b[i].olc == 1)
            usesOlcChat = true;

    disabledClass = (!usesOlcChat || externalIsDisabled || (myObject.chatting == 'true' && myObject.declined == 'false') || myObject.status == 'requested') ? ' class="ui-disabled"' : '';
    onclickAction = 'startVisitorChat(\'' + myObject.visitor.id + '\');removeVisitorListContextMenu();';
    contextMenuHtml += '<div' + disabledClass + ' onclick="' + onclickAction + '">' + '<span id="start-chat-this-visitor" class="cm-line cm-click">' + t('Start Chat') + '</span></div><hr />';
    disabledClass = (externalIsDisabled) ? ' class="ui-disabled"' : '';
    contextMenuHtml += '<div' + disabledClass + ' onclick="showFilterCreation(\'visitor\',\'' + myObject.visitor.id + '\'); removeVisitorListContextMenu();"><span class="cm-line cm-click">' + t('Ban (add filter)') + '</span></div>';
    contextMenuHtml += '<div' + disabledClass + ' onclick="initWebsitePush(\'' + myObject.visitor.id + '\'); removeVisitorListContextMenu();"><span class="cm-line cm-click">' + tid('website_push') + '</span></div>';
    return contextMenuHtml;
};