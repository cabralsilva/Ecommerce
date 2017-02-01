/****************************************************************************************
 * LiveZilla ChatPollServerClass.js
 *
 * Copyright 2013 LiveZilla GmbH
 * All rights reserved.
 * LiveZilla is a registered trademark.
 *
 ***************************************************************************************/

function ChatPollServerClass(lzm_commonConfig, lzm_commonTools, lzm_chatDisplay, lzm_chatServerEvaluation,
                             lzm_commonStorage, chosenProfile, userStatus, web, app, mobile, multiServerId) {

    this.lzm_commonConfig = lzm_commonConfig;
    this.lzm_commonTools = lzm_commonTools;
    this.lzm_chatDisplay = lzm_chatDisplay;
    this.lzm_chatServerEvaluation = lzm_chatServerEvaluation;
    this.lzm_commonStorage = lzm_commonStorage;
    this.chosenProfile = chosenProfile;
    this.user_status = userStatus;
    this.isWeb = web;
    this.isApp = app;
    this.appBackground = 0;
    this.slowDownPolling = false;
    this.slowDownPolling1 = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
    this.slowDownPolling2 = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
    this.isMobile = mobile;
    this.multiServerId = multiServerId;
    this.pollIntervall = 0;
    this.errorCount = 0;
    this.lastCorrectServerAnswer = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
    this.maxTimeSinceLastCorrectAnswer = 100000;
    this.serverSentLogoutResponse = false;
    this.fallbackDeviceId = md5('' + Math.random());
    this.validationErrorReceived = false;
    this.location = {latitude: null, longitude: null};
    this.qrdRequestTime = 0;
    this.ticketSort = 'update';
    this.ticketSortDir = 'DESC';
    this.ticketPage = 1;
    this.ticketQuery = '';
    this.ticketQueryUser = false;
    this.ticketMaxRead = 0;
    this.ticketReadArrayLoaded = false;
    this.ticketFilterStatus = '012';
    this.ticketFilterChannel = '01234567';
    this.ticketFilterSubChannels = null;
    this.ticketFilterPersonal = false;
    this.ticketFilterGroup = false;
    this.ticketFilterSubStatus = null;
    this.ticketFilterGroups = null;
    this.ticketLimit = 20;
    this.ticketUpdateTimestamp = 0;
    this.resetTickets = false;
    this.emailAmount = 20;
    this.emailUpdateTimestamp = 0;
    this.resetEmails = false;
    this.chatUpdateTimestamp = 0;
    this.chatArchivePage = 1;
    this.chatArchiveQuery = '';
    this.chatArchiveFilter = '012';
    this.chatArchiveLimit = 20;
    this.chatArchiveFilterGroup = '';
    this.chatArchiveFilterInternal = '';
    this.chatArchiveFilterExternal = '';
    this.resetChats = false;
    this.eventUpdateTimestamp = 0;
    this.resetEvents = false;
    this.resetReports = false;
    this.reportPage = 1;
    this.reportFilter = 'day';
    this.reportUpdateTimestamp = 0;
    this.filterUpdateTimeStamp = 0;
    this.lastPollTime = 0;
    this.didSaveServerVersion = false;
    this.fileUploadClient = null;
    this.customFilters = [];
    this.uploadTickets = [];


    if (typeof chosenProfile.login_id == 'undefined' || chosenProfile.login_id == '') {
        var randomHex = String(md5(String(Math.random())));
        this.loginId = randomHex.toUpperCase().substr(0,2);
        for (var i=1; i<6; i++) {
            this.loginId += '-' + randomHex.toUpperCase().substr(2*i,2);
        }
        chosenProfile.login_id = this.loginId;
    } else {
        this.loginId = chosenProfile.login_id;
    }
    window.name = this.loginId;

    // control variables for this class
    this.poll_regularly = 0;
    this.pollCounter = 0;
    this.dataObject = {};
    this.thisUser = { id: '', b_id: '', b_chat: { id: '' } };
    this.number_of_poll = 0;
    this.pollIsActive = false;
    this.shoutIsActive = false;
    this.lastUserAction = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
    this.userDefinedStatus = userStatus;
    this.autoSleep = false;
    this.outboundQueue = {};
    this.sendQueue = {};
    this.typingPollCounter = 0;
    this.typingChatPartner = '';
}

ChatPollServerClass.prototype.resetWebApp = function() {
    //this.outboundQueue = {};
    //this.sendQueue = {};

    this.ticketUpdateTimestamp = 0;
    this.emailUpdateTimestamp = 0;
    this.chatUpdateTimestamp = 0;
    this.addPropertyToDataObject('p_gl_a', 'N');
    this.addPropertyToDataObject('p_gl_c', 'N');
    this.addPropertyToDataObject('p_int_d', 'N');
    this.addPropertyToDataObject('p_int_r', 'N');
    this.addPropertyToDataObject('p_gl_t', 'N');
    this.addPropertyToDataObject('p_ext_u', 'N');
    this.addPropertyToDataObject('p_ext_f', 'N');
    this.addPropertyToDataObject('p_gl_e', 'N');
    this.addPropertyToDataObject('p_int_wp', 'N');
};

ChatPollServerClass.prototype.addToOutboundQueue = function (myKey, myValue, type) {
    if (type != 'nonumber') {
        if (typeof this.outboundQueue[myKey] == 'undefined') {
            this.outboundQueue[myKey] = [];
        }
        this.outboundQueue[myKey].push(myValue);
    } else {
        this.outboundQueue[myKey] = myValue;
    }
};

ChatPollServerClass.prototype.createDataFromOutboundQueue = function (dataObject) {
    var newDataObject = this.lzm_commonTools.clone(dataObject);
    this.sendQueue = lzm_commonTools.clone(this.outboundQueue);
    for (var myKey in this.sendQueue) {
        if (this.sendQueue.hasOwnProperty(myKey)) {
            if (typeof this.sendQueue[myKey] == 'object' && this.sendQueue[myKey] instanceof Array) {
                for (var i = 0; i < this.sendQueue[myKey].length; i++) {
                    if (typeof this.sendQueue[myKey][i] == 'string') {
                        newDataObject[myKey + i] = this.sendQueue[myKey][i];
                    } else if (typeof this.sendQueue[myKey][i] == 'object') {
                        for (var objKey in this.sendQueue[myKey][i]) {
                            if(this.sendQueue[myKey][i].hasOwnProperty(objKey))
                                newDataObject[myKey + objKey + i] = this.sendQueue[myKey][i][objKey];
                        }
                    }
                }
            } else if (typeof this.sendQueue != 'undefined') {
                newDataObject[myKey] = this.sendQueue[myKey];
            }
        }
    }
    return newDataObject;
};

ChatPollServerClass.prototype.cleanOutboundQueue = function (type) {
    if (typeof type != 'undefined' && (type == 'shout' || type == 'shout2')) {
        var myKey, i;
        for (myKey in this.sendQueue) {
            if (this.sendQueue.hasOwnProperty(myKey)) {
                if (typeof this.sendQueue[myKey] != 'string') {
                    if (typeof this.sendQueue[myKey] != 'undefined' && this.sendQueue[myKey].length > 0) {
                        for (i = 0; i < this.sendQueue[myKey].length; i++) {
                            if (typeof this.sendQueue[myKey][i] == 'string') {
                                this.removePropertyFromDataObject(myKey + i);
                            } else if (typeof this.sendQueue[myKey][i] == 'object') {
                                for (var objKey in this.sendQueue[myKey][i]) {
                                    this.removePropertyFromDataObject(myKey + objKey + i);
                                }
                            }
                        }
                    }
                } else {
                    this.removePropertyFromDataObject(myKey);
                }
            }
        }

        var tmpOutboundQueue = {};
        var outboundObjectOld = true;
        for (myKey in this.outboundQueue) {
            if (this.outboundQueue.hasOwnProperty(myKey)) {
                tmpOutboundQueue[myKey] = (typeof this.outboundQueue[myKey] == 'string') ? '' : [];
                if (typeof this.outboundQueue[myKey] != 'string') {
                    if (typeof this.outboundQueue[myKey] != 'undefined' && this.outboundQueue[myKey].length > 0) {
                        for (i = 0; i < this.outboundQueue[myKey].length; i++) {
                            if (typeof this.sendQueue[myKey] != 'undefined') {
                                if (typeof this.outboundQueue[myKey][i] == 'object') {
                                    outboundObjectOld = true;
                                    for (objKey in this.outboundQueue[myKey][i]) {
                                        if (this.outboundQueue[myKey][i].hasOwnProperty(objKey)) {
                                            if (typeof this.sendQueue[myKey][i] == 'undefined' || this.outboundQueue[myKey][i][objKey] != this.sendQueue[myKey][i][objKey]) {
                                                outboundObjectOld = false;
                                            }
                                        }
                                    }
                                    if (!outboundObjectOld) {
                                        tmpOutboundQueue[myKey].push(this.outboundQueue[myKey][i]);
                                    }
                                } else {
                                    if ($.inArray(this.outboundQueue[myKey][i], this.sendQueue[myKey]) == -1) {
                                        tmpOutboundQueue[myKey].push(this.outboundQueue[myKey][i])
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if (typeof this.sendQueue[myKey] != 'undefined' && this.outboundQueue[myKey] != this.sendQueue[myKey]) {
                        tmpOutboundQueue[myKey] = this.outboundQueue[myKey];
                    }
                }
            }
        }

        if (typeof tmpOutboundQueue != 'string') {
            for (myKey in tmpOutboundQueue) {
                if (tmpOutboundQueue.hasOwnProperty(myKey)) {
                    if ((typeof tmpOutboundQueue[myKey] == 'string' && tmpOutboundQueue[myKey] == '') ||
                        (typeof tmpOutboundQueue[myKey] == 'object' && tmpOutboundQueue[myKey] instanceof Array && tmpOutboundQueue[myKey].length == 0)) {
                        delete tmpOutboundQueue[myKey];
                    }
                }
            }
        }

        this.outboundQueue = this.lzm_commonTools.clone(tmpOutboundQueue);
        this.sendQueue = {};
        this.pollIsActive = false;
        this.startPolling(true);
    } else {
        this.pollIsActive = false;

    }
};

ChatPollServerClass.prototype.startPolling = function (noFirstPoll) {
    noFirstPoll = (typeof noFirstPoll != 'undefined') ? noFirstPoll : false;
    var thisClass = this;
    var pollIntervall = (thisClass.lzm_chatServerEvaluation.pollFrequency != 0) ?  (thisClass.lzm_chatServerEvaluation.pollFrequency * 1000) : thisClass.lzm_commonConfig.lz_reload_interval;
    //this.pollIntervall = pollIntervall;
    if (lzm_chatTimeStamp.getServerTimeString(null, false, 1) - thisClass.lastCorrectServerAnswer > 180000)
        resetWebApp();

    // poll once manually, then the setInterval function will fall in
    if (!noFirstPoll)
        thisClass.pollServer(thisClass.fillDataObject(), 'regularly');

    if (thisClass.poll_regularly)
        thisClass.stopPolling();

    if ((thisClass.appBackground == 1 || thisClass.slowDownPolling) && lzm_chatDisplay.saveConnections == 1)
        pollIntervall = 30000;

    thisClass.poll_regularly = setInterval(function () {
        thisClass.pollServer(thisClass.fillDataObject(), 'regularly') }, pollIntervall);
};

ChatPollServerClass.prototype.stopPolling = function () {
    clearInterval(this.poll_regularly);
    this.poll_regularly = false;
};

ChatPollServerClass.prototype.logout = function () {
    this.stopPolling();
    this.user_status = 2;
    this.lzm_chatDisplay.user_status = 2;
    this.addToOutboundQueue('p_user_status', '2', 'nonumber');
    this.pollServer(this.fillDataObject(), 'logout');
};

ChatPollServerClass.prototype.pollServerResource = function(resource) {
    var thisClass = this;
    if (!thisClass.pollIsActive)
    {
        thisClass.pollIsActive = true;
        var acid = lzm_commonTools.pad(Math.floor(Math.random() * 1048575).toString(16), 5);
        var dataObject = {
            p_acid: lzm_commonTools.pad(Math.floor(Math.random() * 99999).toString(10), 5),
            p_user: lzm_chatPollServer.chosenProfile.login_name,
            p_request: 'intern',
            p_action: 'send_resources',
            p_get_management: 1,
            p_loginid: lzm_chatPollServer.chosenProfile.login_id
        };
        if (lzm_chatServerEvaluation.token != null)
            dataObject.p_token = sha256(lzm_chatServerEvaluation.token);
        else
            dataObject.p_pass = this.chosenProfile.login_passwd;

        dataObject['p_process_resources_va_0'] = resource.rid;
        dataObject['p_process_resources_vb_0'] = lz_global_base64_encode(resource.text);
        dataObject['p_process_resources_vc_0'] = resource.ty;
        dataObject['p_process_resources_vd_0'] = lz_global_base64_encode(resource.ti);
        dataObject['p_process_resources_ve_0'] = resource.di;
        dataObject['p_process_resources_vf_0'] = resource.pid;
        dataObject['p_process_resources_vg_0'] = resource.ra;
        dataObject['p_process_resources_vh_0'] = resource.si;
        dataObject['p_process_resources_vi_0'] = resource.t;
        dataObject['p_process_resources_vj_0'] = resource.languages;
        dataObject['p_process_resources_vk_0'] = resource.isPublic;
        dataObject['p_process_resources_vl_0'] = resource.fullTextSearch;
        dataObject['p_process_resources_vm_0'] = resource.shortcutWord;
        dataObject['p_process_resources_vn_0'] = resource.allowBotAccess;
        dataObject['p_process_resources_vp_0'] = resource.g;

        dataObject['p_process_resources_vq_0'] = (d(resource.oid)) ? resource.oid : '';

        if(typeof resource.new_id != 'undefined' && resource.new_id.length > 5 && resource.new_id != resource.rid)
            dataObject['p_process_resources_vo_0'] = resource.new_id;

        var postUrl = lzm_chatPollServer.chosenProfile.server_protocol + lzm_chatPollServer.chosenProfile.server_url +
            '/server.php?acid=' + acid;

        $.ajax({
            type: "POST",
            url: postUrl,
            data: dataObject,
            timeout: thisClass.lzm_commonConfig.pollTimeout,
            dataType: 'text'
        }).done(function(data) {
            //thisClass.pollIsActive = false;
            thisClass.evaluateServerResponse(data, null, dataObject);
            thisClass.startPolling(true);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            setTimeout(function() {
                thisClass.pollIsActive = false;
                thisClass.pollServerResource(resource);
            }, 500);
        });
    } else {
        setTimeout(function() {
            thisClass.pollServerResource(resource);
        }, 500);
    }
};

ChatPollServerClass.prototype.pollServerTicket = function(tickets, emails, type, chat) {
    var thisClass = this, i = 0, message = '', vdCount = 0, key = '', k = 0;
    thisClass.resetDutTickets(true);
    chat = (d(chat)) ? chat : {cid: ''};

    if (!thisClass.pollIsActive) {
        thisClass.stopPolling();
        thisClass.pollIsActive = true;
        var acid = lzm_commonTools.pad(Math.floor(Math.random() * 1048575).toString(16), 5);
        var ticketDataObject = lzm_commonTools.clone(thisClass.fillDataObject());
        ticketDataObject['p_dut_t'] = 0;
        var count=0;

        for (key in tickets)
        {
            var ticket = tickets[key];
            if (type == 'save-details')
            {
                ticketDataObject['p_ta_' + count + '_vc'] = 'SetTicketStatus';
                ticketDataObject['p_ta_' + count + '_va'] = ticket.id;
                ticketDataObject['p_ta_' + count + '_vb'] = ticket.ne;
                ticketDataObject['p_ta_' + count + '_vd_0'] = ticket.ns;
                ticketDataObject['p_ta_' + count + '_vd_1'] = ticket.ng;
                ticketDataObject['p_ta_' + count + '_vd_2'] = ticket.os;
                ticketDataObject['p_ta_' + count + '_vd_3'] = ticket.oe;
                ticketDataObject['p_ta_' + count + '_vd_4'] = ticket.og;
                ticketDataObject['p_ta_' + count + '_vt'] = ticket.nch;
                ticketDataObject['p_ta_' + count + '_vs'] = ticket.ss;
                ticketDataObject['p_ta_' + count + '_vu'] = ticket.sc;
                ticketDataObject['p_ta_' + count + '_vv'] = ticket.vv;
                ticketDataObject['p_ta_' + count + '_vw'] = ticket.vw;
                ticketDataObject['p_ta_' + (count+1) + '_vc'] = 'SetTicketLanguage';
                ticketDataObject['p_ta_' + (count+1) + '_vd_0'] = ticket.id;
                ticketDataObject['p_ta_' + (count+1) + '_vd_1'] = ticket.nl;
                ticketDataObject['p_ta_' + (count+1) + '_vd_2'] = ticket.ol;
                if (ticket.mc != '')
                {
                    ticketDataObject['p_ta_' + (count+2) + '_vc'] = 'EditMessage';
                    ticketDataObject['p_ta_' + (count+2) + '_vd_0'] = ticket.mc.mid;
                    ticketDataObject['p_ta_' + (count+2) + '_vd_1'] = ticket.mc.tid;
                    ticketDataObject['p_ta_' + (count+2) + '_vd_2'] = ticket.mc.n;
                    ticketDataObject['p_ta_' + (count+2) + '_vd_3'] = ticket.mc.e;
                    ticketDataObject['p_ta_' + (count+2) + '_vd_4'] = ticket.mc.c;
                    ticketDataObject['p_ta_' + (count+2) + '_vd_5'] = ticket.mc.p;
                    ticketDataObject['p_ta_' + (count+2) + '_vd_6'] = ticket.mc.s;
                    ticketDataObject['p_ta_' + (count+2) + '_vd_7'] = ticket.mc.t;
                    for (i=0; i<10; i++)
                        ticketDataObject['p_ta_' + (count+2) + '_vd_' + (8 + i)] = '';
                    for (i=0; i<ticket.mc.custom.length; i++)
                        ticketDataObject['p_ta_' + (count+2) + '_vd_' + (8 + i)] = '[cf' + ticket.mc.custom[i].id + ']' + lz_global_base64_encode(ticket.mc.custom[i].value.toString());
                }
            }
            else if (type == 'send-message')
            {
                var receiver = (ticket.bcc != '') ? ticket.re + ',' + ticket.bcc : ticket.re;
                message = ticket.me.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '\r\n');
                ticketDataObject['p_ta_' + count + '_va'] = ticket.id;
                ticketDataObject['p_ta_' + count + '_vb'] = ticket.ed;
                ticketDataObject['p_ta_' + count + '_vc'] = 'AddTicketEditorReply';
                ticketDataObject['p_ta_' + count + '_vd_0'] = message;
                ticketDataObject['p_ta_' + count + '_vd_1'] = '';
                ticketDataObject['p_ta_' + count + '_vd_2'] = receiver.replace(/, +/g, ',');
                ticketDataObject['p_ta_' + count + '_vd_3'] = ticket.lg;
                ticketDataObject['p_ta_' + count + '_vd_4'] = ticket.gr;
                ticketDataObject['p_ta_' + count + '_vd_5'] = ticket.su;
                ticketDataObject['p_ta_' + count + '_vd_6'] = ticket.pmid;
                ticketDataObject['p_ta_' + count + '_vd_7'] = ticket.mid;
                if (ticket.attachments.length > 0) {
                    for (i=0; i<ticket.attachments.length; i++) {
                        ticketDataObject['p_ta_' + count + '_vd_' + (8 + i)] = ticket.attachments[i].rid;
                    }
                }
                if (ticket.comment != '')
                {
                    count++;
                    ticketDataObject['p_ta_' + count + '_vc'] = 'AddComment';
                    ticketDataObject['p_ta_' + count + '_vd_0'] = ticket.id;
                    ticketDataObject['p_ta_' + count + '_vd_1'] = ticket.mid;
                    ticketDataObject['p_ta_' + count + '_vd_2'] = ticket.comment;
                }
            }
            else if (type == 'new-ticket')
            {
                var tempId = md5(Math.random().toString());
                message = ticket.nm.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '\r\n');
                ticketDataObject['p_ta_' + count + '_vc'] = 'CreateTicket';
                ticketDataObject['p_ta_' + count + '_vd_0'] = ticket.nn;
                ticketDataObject['p_ta_' + count + '_vd_1'] = ticket.nem;
                ticketDataObject['p_ta_' + count + '_vd_2'] = message;
                ticketDataObject['p_ta_' + count + '_vd_3'] = ticket.nch;
                ticketDataObject['p_ta_' + count + '_vd_4'] = md5(Math.random().toString());
                ticketDataObject['p_ta_' + count + '_vd_5'] = md5(Math.random().toString());
                ticketDataObject['p_ta_' + count + '_vd_6'] = ticket.ng;
                ticketDataObject['p_ta_' + count + '_vd_7'] = ticket.nc;
                ticketDataObject['p_ta_' + count + '_vd_8'] = ticket.np;
                ticketDataObject['p_ta_' + count + '_vd_9'] = 4;
                ticketDataObject['p_ta_' + count + '_vd_10'] = ticket.nl;
                ticketDataObject['p_ta_' + count + '_vd_11'] = tempId;
                ticketDataObject['p_ta_' + count + '_vd_12'] = ticket.ns;
                ticketDataObject['p_ta_' + count + '_vd_13'] = ticket.ne;
                ticketDataObject['p_ta_' + count + '_vd_14'] = ticket.ng;
                ticketDataObject['p_ta_' + count + '_vd_15'] = ticket.sub;
                ticketDataObject['p_ta_' + count + '_vd_16'] = '';
                ticketDataObject['p_ta_' + count + '_vd_17'] = '';
                ticketDataObject['p_ta_' + count + '_vd_18'] = '';
                ticketDataObject['p_ta_' + count + '_vd_19'] = '';
                ticketDataObject['p_ta_' + count + '_vd_20'] = '';
                ticketDataObject['p_ta_' + count + '_vd_21'] = '';
                ticketDataObject['p_ta_' + count + '_vd_22'] = '';
                ticketDataObject['p_ta_' + count + '_vd_23'] = '';
                ticketDataObject['p_ta_' + count + '_vd_24'] = '';
                ticketDataObject['p_ta_' + count + '_vd_25'] = '';
                ticketDataObject['p_ta_' + count + '_vt'] = ticket.nch;
                ticketDataObject['p_ta_' + count + '_vs'] = ticket.ss;
                ticketDataObject['p_ta_' + count + '_vu'] = ticket.sc;
                ticketDataObject['p_ta_' + count + '_vx'] = ticket.vx;
                vdCount = 26;
                if (typeof ticket.at != 'undefined') {
                    for (i=0; i<ticket.at.length; i++) {
                        ticketDataObject['p_ta_' + count + '_vd_' + vdCount] = '[att]' + lz_global_base64_encode(ticket.at[i].rid);
                        vdCount++;
                    }
                }
                if (typeof ticket.co != 'undefined')
                    for (i=0; i<ticket.co.length; i++) {
                        ticketDataObject['p_ta_' + count + '_vd_' + vdCount] = '[com]' + lz_global_base64_encode(ticket.co[i].text);
                        vdCount++;
                    }

                if (typeof ticket.cf != 'undefined')
                    for (key in ticket.cf)
                        if (ticket.cf.hasOwnProperty(key) && parseInt(key) < 111)
                            ticketDataObject['p_ta_' + count + '_vd_' + (16 + parseInt(key))] = '[cf' + key + ']' + lz_global_base64_encode(ticket.cf[key]);

                if (chat.cid != '') {
                    count++;
                    ticketDataObject['p_ta_' + count + '_vc'] = 'LinkChat';
                    ticketDataObject['p_ta_' + count + '_vd_0'] = tempId;
                    ticketDataObject['p_ta_' + count + '_vd_1'] = chat.cid;

                }
            } else if (type == 'add-comment') {
                var comment = ticket.text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '\r\n');
                ticketDataObject['p_ta_' + count + '_vc'] = 'AddComment';
                ticketDataObject['p_ta_' + count + '_vd_0'] = ticket.id;
                ticketDataObject['p_ta_' + count + '_vd_1'] = ticket.mid;
                ticketDataObject['p_ta_' + count + '_vd_2'] = comment;
            } else if (type == 'forward-to') {
                message = ticket.text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '\r\n');
                ticketDataObject['p_ta_' + count + '_vc'] = 'ForwardMessage';
                ticketDataObject['p_ta_' + count + '_vd_0'] = ticket.mid;
                ticketDataObject['p_ta_' + count + '_vd_1'] = ticket.gr;
                ticketDataObject['p_ta_' + count + '_vd_2'] = ticket.em.replace(/, +/g, ',');
                ticketDataObject['p_ta_' + count + '_vd_3'] = ticket.su;
                ticketDataObject['p_ta_' + count + '_vd_4'] = message;
                ticketDataObject['p_ta_' + count + '_vd_5'] = ticket.id;
            } else if (type == 'move-message') {
                ticketDataObject['p_ta_' + count + '_vc'] = 'MoveMessageIntoTicket';
                ticketDataObject['p_ta_' + count + '_vd_0'] = ticket.id;
                ticketDataObject['p_ta_' + count + '_vd_1'] = ticket.mid;
                ticketDataObject['p_ta_' + count + '_vd_2'] = '';
            } else if (type == 'delete-ticket') {
                ticketDataObject['p_ta_' + count + '_vc'] = 'DeleteTicketFromServer';
                ticketDataObject['p_ta_' + count + '_vd_0'] = ticket.id;
            } else if (type == 'add-to-watch-list') {
                ticketDataObject['p_ta_' + count + '_vc'] = 'AddToWatchList';
                ticketDataObject['p_ta_' + count + '_vd_0'] = ticket.id;
                ticketDataObject['p_ta_' + count + '_vd_1'] = ticket.operatorId;
            } else if (type == 'remove-from-watch-list') {
                ticketDataObject['p_ta_' + count + '_vc'] = 'RemoveFromWatchList';
                ticketDataObject['p_ta_' + count + '_vd_0'] = ticket.id;
            }
            else if (type == 'set-priority') {
                ticketDataObject['p_ta_' + count + '_vc'] = 'SetPriority';
                ticketDataObject['p_ta_' + count + '_vd_0'] = ticket.id;
                ticketDataObject['p_ta_' + count + '_vd_1'] = ticket.priority;

            }
            count++;
        }
        if (emails.length > 0) {
            for (i=0; i<emails[0].length; i++) {
                ticketDataObject['p_ta_' + count + '_vc'] = 'SetEmailStatus';
                ticketDataObject['p_ta_' + count + '_vd_0'] = emails[0][i].id;
                ticketDataObject['p_ta_' + count + '_vd_1'] = emails[0][i].status;
                ticketDataObject['p_ta_' + count + '_vd_2'] = emails[0][i].editor;
                count++;
            }
            var ticketsHaveChanged = false;
            for (var j=0; j<emails[1].length; j++) {
                message = emails[1][j].text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '\r\n');
                ticketDataObject['p_ta_' + count + '_vc'] = 'CreateTicket';
                ticketDataObject['p_ta_' + count + '_vd_0'] = emails[1][j].name;
                ticketDataObject['p_ta_' + count + '_vd_1'] = emails[1][j].email;
                ticketDataObject['p_ta_' + count + '_vd_2'] = message;
                ticketDataObject['p_ta_' + count + '_vd_3'] = emails[1][j].channel;
                ticketDataObject['p_ta_' + count + '_vd_4'] = emails[1][j].cid;
                ticketDataObject['p_ta_' + count + '_vd_5'] = md5(Math.random().toString());
                ticketDataObject['p_ta_' + count + '_vd_6'] = emails[1][j].group;
                ticketDataObject['p_ta_' + count + '_vd_7'] = emails[1][j].company;
                ticketDataObject['p_ta_' + count + '_vd_8'] = emails[1][j].phone;
                ticketDataObject['p_ta_' + count + '_vd_9'] = 4;
                ticketDataObject['p_ta_' + count + '_vd_10'] = emails[1][j].language;
                ticketDataObject['p_ta_' + count + '_vd_11'] = md5(Math.random().toString());
                ticketDataObject['p_ta_' + count + '_vd_12'] = emails[1][j].status;
                ticketDataObject['p_ta_' + count + '_vd_13'] = emails[1][j].editor;
                ticketDataObject['p_ta_' + count + '_vd_14'] = emails[1][j].group;
                ticketDataObject['p_ta_' + count + '_vd_15'] = emails[1][j].subject;
                ticketDataObject['p_ta_' + count + '_vd_16'] = '';
                ticketDataObject['p_ta_' + count + '_vd_17'] = '';
                ticketDataObject['p_ta_' + count + '_vd_18'] = '';
                ticketDataObject['p_ta_' + count + '_vd_19'] = '';
                ticketDataObject['p_ta_' + count + '_vd_20'] = '';
                ticketDataObject['p_ta_' + count + '_vd_21'] = '';
                ticketDataObject['p_ta_' + count + '_vd_22'] = '';
                ticketDataObject['p_ta_' + count + '_vd_23'] = '';
                ticketDataObject['p_ta_' + count + '_vd_24'] = '';
                ticketDataObject['p_ta_' + count + '_vd_25'] = '';
                vdCount = 26;
                for (k=0; k<emails[1][j].attachment.length; k++) {
                    ticketDataObject['p_ta_' + count + '_vd_' + vdCount] = '[att]' +
                        lz_global_base64_encode(emails[1][j].attachment[k].id);
                    vdCount++;
                }
                for (k=0; k<emails[1][j].comment.length; k++) {
                    ticketDataObject['p_ta_' + count + '_vd_' + vdCount] = '[com]' +
                        lz_global_base64_encode(emails[1][j].comment[k].text);
                    vdCount++;
                }
                for (key in emails[1][j].custom) {
                    if (emails[1][j].custom.hasOwnProperty(key) && parseInt(key) < 111) {
                        ticketDataObject['p_ta_' + count + '_vd_' + (16 + parseInt(key))] = '[cf' + key + ']' + lz_global_base64_encode(emails[1][j].custom[key]);
                    }
                }
                count++;
                ticketsHaveChanged = true;
            }
            thisClass.resetEmails = true;
        }

        var postUrl = thisClass.chosenProfile.server_protocol + thisClass.chosenProfile.server_url +
            '/server.php?acid=' + acid;

        $.ajax({
            type: "POST",
            url: postUrl,
            data: ticketDataObject,
            timeout: thisClass.lzm_commonConfig.pollTimeout,
            success: function (data) {
                //thisClass.pollIsActive = false;
                thisClass.evaluateServerResponse(data, null, ticketDataObject);
                thisClass.startPolling(true);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                setTimeout(function() {
                    thisClass.pollIsActive = false;
                    thisClass.pollServerTicket(tickets, emails, type);
                }, 500);
            },
            dataType: 'text'
        });

    }
    else
        setTimeout(function() {thisClass.pollServerTicket(tickets, emails, type, chat);}, 500);
};

ChatPollServerClass.prototype.resetDutTickets = function(now) {
    if(now)
        lzm_chatDisplay.ticketGlobalValues['dut']=0;
    else
        thisClass.resetTickets = true;
};

ChatPollServerClass.prototype.pollServerSpecial = function(myObject, type) {
    var thisClass = this;
    if (!thisClass.pollIsActive) {
        thisClass.pollIsActive = true;
        var acid = lzm_commonTools.pad(Math.floor(Math.random() * 1048575).toString(16), 5);
        var myDataObject = lzm_commonTools.clone(thisClass.fillDataObject());
        myDataObject['p_shout'] = 1;
        var count=0;

        switch (type) {
            case 'visitor-comment':
                myDataObject['p_ca_' + count + '_va'] = 1;
                myDataObject['p_ca_' + count + '_vb'] = 1;
                myDataObject['p_ca_' + count + '_vc'] = 1;
                myDataObject['p_ca_' + count + '_vd'] = 'AddVisitorComment';
                myDataObject['p_ca_' + count + '_ve_0'] = myObject.id;
                myDataObject['p_ca_' + count + '_ve_1'] = myObject.t;
                break;
            case 'set_visitor_details':
                myDataObject['p_ca_' + count + '_va'] = 1;
                myDataObject['p_ca_' + count + '_vd'] = 'SetVisitorDetails';
                for(var key in myObject)
                    myDataObject[key] = myObject[key];
                break;
            case 'visitor-filter':
                myDataObject['p_filters_va'] = myObject.creator;
                myDataObject['p_filters_vb'] = lzm_chatTimeStamp.getServerTimeString(null, true);
                myDataObject['p_filters_vc'] = myObject.editor;
                myDataObject['p_filters_vd'] = myObject.vip;
                myDataObject['p_filters_ve'] = myObject.expires;
                myDataObject['p_filters_vf'] = myObject.vid;
                myDataObject['p_filters_vg'] = myObject.fname;
                myDataObject['p_filters_vh'] = myObject.freason;
                myDataObject['p_filters_vi'] = myObject.fid;
                myDataObject['p_filters_vj'] = myObject.state;
                myDataObject['p_filters_vk'] = myObject.type;
                myDataObject['p_filters_vl'] = myObject.exertion;
                myDataObject['p_filters_vm'] = myObject.lang;
                myDataObject['p_filters_vp'] = myObject.countries;
                myDataObject['p_filters_vq'] = myObject.allow_chats;
                myDataObject['p_filters_vr'] = myObject.allow_tickets;
                myDataObject['p_filters_vs'] = myObject.allow_monitoring;
                myDataObject['p_filters_vt'] = myObject.filterType;
                myDataObject['p_filters_vu'] = myObject.email;
                myDataObject['p_filters_vv'] = myObject.subject;
                break;
            case 'dynamic-group-create':
                myDataObject['p_ca_' + count + '_va'] = myObject.myUserId;
                myDataObject['p_ca_' + count + '_vb'] = '';
                myDataObject['p_ca_' + count + '_vc'] = '';
                myDataObject['p_ca_' + count + '_vd'] = 'CreatePublicGroup';
                myDataObject['p_ca_' + count + '_ve_0'] = myObject.groupId;
                myDataObject['p_ca_' + count + '_ve_1'] = myObject.groupName;
                myDataObject['p_ca_' + count + '_ve_2'] = myObject.myId;
                break;
            case 'dynamic-group-create-add':
                myDataObject['p_ca_' + count + '_va'] = myObject.myUserId;
                myDataObject['p_ca_' + count + '_vb'] = '';
                myDataObject['p_ca_' + count + '_vc'] = '';
                myDataObject['p_ca_' + count + '_vd'] = 'CreatePublicGroup';
                myDataObject['p_ca_' + count + '_ve_0'] = myObject.groupId;
                myDataObject['p_ca_' + count + '_ve_1'] = myObject.groupName;
                myDataObject['p_ca_' + count + '_ve_2'] = myObject.myId;
                count++;
                myDataObject['p_ca_' + count + '_va'] = myObject.operatorUserId;
                myDataObject['p_ca_' + count + '_vb'] = myObject.browserId;
                myDataObject['p_ca_' + count + '_vc'] = myObject.chatId;
                myDataObject['p_ca_' + count + '_vd'] = 'JoinPublicGroup';
                myDataObject['p_ca_' + count + '_ve_0'] = myObject.groupId;
                myDataObject['p_ca_' + count + '_ve_1'] = '';
                myDataObject['p_ca_' + count + '_ve_2'] = myObject.operatorId;
                myDataObject['p_ca_' + count + '_ve_3'] = myObject.isPersistent;
                break;
            case 'dynamic-group-delete':
                myDataObject['p_ca_' + count + '_va'] = myObject.myUserId;
                myDataObject['p_ca_' + count + '_vb'] = '';
                myDataObject['p_ca_' + count + '_vc'] = '';
                myDataObject['p_ca_' + count + '_vd'] = 'DeletePublicGroup';
                myDataObject['p_ca_' + count + '_ve_0'] = myObject.groupId;
                myDataObject['p_ca_' + count + '_ve_1'] = myObject.myId;
                break;
            case 'dynamic-group-add':
                myDataObject['p_ca_' + count + '_va'] = myObject.operatorUserId;
                myDataObject['p_ca_' + count + '_vb'] = myObject.browserId;
                myDataObject['p_ca_' + count + '_vc'] = myObject.chatId;
                myDataObject['p_ca_' + count + '_vd'] = 'JoinPublicGroup';
                myDataObject['p_ca_' + count + '_ve_0'] = myObject.groupId;
                myDataObject['p_ca_' + count + '_ve_1'] = '';
                myDataObject['p_ca_' + count + '_ve_2'] = myObject.operatorId;
                myDataObject['p_ca_' + count + '_ve_3'] = myObject.isPersistent;
                break;
            case 'dynamic-group-remove':
                myDataObject['p_ca_' + count + '_va'] = myObject.operatorUserId;
                myDataObject['p_ca_' + count + '_vb'] = '';
                myDataObject['p_ca_' + count + '_vc'] = '';
                myDataObject['p_ca_' + count + '_vd'] = 'QuitPublicGroup';
                myDataObject['p_ca_' + count + '_ve_0'] = myObject.groupId;
                myDataObject['p_ca_' + count + '_ve_1'] = myObject.operatorId;
                break;
            case 'start_overlay':
                myDataObject['p_ca_' + count + '_va'] = myObject.visitorId;
                myDataObject['p_ca_' + count + '_vb'] = myObject.browserId;
                myDataObject['p_ca_' + count + '_vc'] = '';
                myDataObject['p_ca_' + count + '_vd'] = 'StartOverlayChat';
                break;
            case 'download_recent_history':
                myDataObject['p_ca_' + count + '_va'] = 1;
                myDataObject['p_ca_' + count + '_vb'] = 1;
                myDataObject['p_ca_' + count + '_vc'] = 1;
                myDataObject['p_ca_' + count + '_vd'] = 'DownloadRecentHistory';
                myDataObject['p_ca_' + count + '_ve_0'] = myObject.visitorId;
                myDataObject['p_ca_' + count + '_ve_1'] = myObject.recentHistoryId;
                break;
            case 'set-translation':
                myDataObject['p_ca_' + count + '_va'] = myObject.visitorId;
                myDataObject['p_ca_' + count + '_vb'] = myObject.browserId;
                myDataObject['p_ca_' + count + '_vc'] = myObject.chatId;
                myDataObject['p_ca_' + count + '_vd'] = 'SetTranslation';
                myDataObject['p_ca_' + count + '_ve_0'] = myObject.chatId;
                myDataObject['p_ca_' + count + '_ve_1'] = lzm_commonTools.pad(Math.floor(Math.random()*999), 3, '0', 'l') +
                    ',' + myObject.sourceLanguage.toUpperCase() + ',' + myObject.targetLanguage.toUpperCase();
                break;
            case 'recalculate-report':
                myDataObject = {
                    p_upd_rep_va_0: myObject.year + '_' + myObject.month + '_' + myObject.day,
                    p_upd_rep_vb_0: 0,
                    p_upd_rep_type: 0,
                    p_st_r: myObject.time + '_' + myObject.mtime,
                    p_acid: lzm_commonTools.pad(Math.floor(Math.random() * 99999).toString(10), 5),
                    p_user: lzm_chatPollServer.chosenProfile.login_name,
                    p_request: 'intern',
                    p_action: 'reports',
                    p_get_management: 1,
                    p_loginid: lzm_chatPollServer.chosenProfile.login_id
                };
                if (lzm_chatServerEvaluation.token != null) {
                    myDataObject.p_token = sha256(lzm_chatServerEvaluation.token);
                } else {
                    myDataObject.p_pass = this.chosenProfile.login_passwd;
                }
                break;
            case 'save-translation':
                myDataObject = {
                    p_acid: lzm_commonTools.pad(Math.floor(Math.random() * 99999).toString(10), 5),
                    p_user: lzm_chatPollServer.chosenProfile.login_name,
                    p_pass: this.chosenProfile.login_passwd,
                    p_request: 'intern',
                    p_action: 'upload_translation',
                    p_get_management: 1,
                    p_loginid: lzm_chatPollServer.chosenProfile.login_id
                };
                for (var langKey in myObject) {
                    if (myObject.hasOwnProperty(langKey)) {
                        myDataObject['p_trl_' + count + '_0'] = myObject[langKey].i;
                        myDataObject['p_trl_' + count + '_1'] = myObject[langKey].c;
                        myDataObject['p_trl_' + count + '_2'] = myObject[langKey].m;
                        myDataObject['p_trl_' + count + '_3'] = myObject[langKey].d;
                        count++
                    }
                }
                break;
            case 'change-password':
                myDataObject['p_pass'] = this.chosenProfile.login_passwd;
                delete myDataObject['p_token'];
                myDataObject['p_authentications_va'] = myObject.i;
                myDataObject['p_authentications_vb'] = md5(myObject.p);
                break;
            case 'load-translation':
                myDataObject = {
                    p_acid: lzm_commonTools.pad(Math.floor(Math.random() * 99999).toString(10), 5),
                    p_user: lzm_chatPollServer.chosenProfile.login_name,
                    p_pass: this.chosenProfile.login_passwd,
                    p_request: 'intern',
                    p_action: 'download_translation',
                    p_get_management: 1,
                    p_loginid: lzm_chatPollServer.chosenProfile.login_id,
                    p_int_trans_m: myObject.m,
                    p_int_trans_mo: myObject.o,
                    p_int_trans_iso: myObject.l
                };
                break;
            case 'take-chat':
                if (typeof myObject.takeover != 'undefined' && myObject.takeover) {
                    myDataObject['p_forwards_va_' + count] = myObject.c;
                    myDataObject['p_forwards_vb_' + count] = lzm_chatDisplay.myId;
                    myDataObject['p_forwards_vc_' + count] = '';
                    myDataObject['p_forwards_vd_' + count] = myObject.o;
                    myDataObject['p_forwards_ve_' + count] = lzm_chatDisplay.myGroups[0];
                    myDataObject['p_forwards_vf_' + count] = myObject.v;
                    myDataObject['p_forwards_vg_' + count] = myObject.b;
                    myDataObject['p_forwards_vh_' + count] = '0';
                } else {
                    myDataObject['p_ca_' + count + '_va'] = myObject.v;
                    myDataObject['p_ca_' + count + '_vb'] = myObject.b;
                    myDataObject['p_ca_' + count + '_vc'] = myObject.c;
                    myDataObject['p_ca_' + count + '_vd'] = 'TakeChat';
                    myDataObject['p_ca_' + count + '_ve_0'] = myObject.g;
                }
                break;
            case 'join-chat':
                myDataObject['p_ca_' + count + '_va'] = myObject.v;
                myDataObject['p_ca_' + count + '_vb'] = myObject.b;
                myDataObject['p_ca_' + count + '_vc'] = myObject.c;
                myDataObject['p_ca_' + count + '_vd'] = 'JoinChat';
                myDataObject['p_ca_' + count + '_ve_0'] = 1;
                break;
            case 'join-chat-invisible':
                myDataObject['p_ca_' + count + '_va'] = myObject.v;
                myDataObject['p_ca_' + count + '_vb'] = myObject.b;
                myDataObject['p_ca_' + count + '_vc'] = myObject.c;
                myDataObject['p_ca_' + count + '_vd'] = 'JoinChatInvisible';
                myDataObject['p_ca_' + count + '_ve_0'] = 1;
                break;
            case 'leave-chat':
                myDataObject['p_ca_' + count + '_va'] = myObject.v;
                myDataObject['p_ca_' + count + '_vb'] = myObject.b;
                myDataObject['p_ca_' + count + '_vc'] = myObject.c;
                myDataObject['p_ca_' + count + '_vd'] = 'LeaveChat';
                break;
            case 'send-chat-transcript':
                myDataObject['p_ca_' + count + '_va'] = 1;
                myDataObject['p_ca_' + count + '_vb'] = 1;
                myDataObject['p_ca_' + count + '_vc'] = 1;
                myDataObject['p_ca_' + count + '_vd'] = 'SendChatTranscriptTo';
                myDataObject['p_ca_' + count + '_ve_0'] = myObject.em.replace(/, +/g, ',');
                myDataObject['p_ca_' + count + '_ve_1'] = myObject.cid;
                break;
            case 'website-push':
                myDataObject['p_guides_va'] = myObject.vid;
                myDataObject['p_guides_vb'] = myObject.ask;
                myDataObject['p_guides_vc'] = myObject.url;
                myDataObject['p_guides_vd'] = myObject.bid;
                myDataObject['p_guides_ve'] = myObject.text;
                myDataObject['p_guides_vf'] = myObject.gr;
                break;
            case 'link-ticket':
                myDataObject['p_ta_0_vc'] = (myObject.fo == 'ticket' && myObject.so == 'ticket') ? 'LinkTicket' : 'LinkChat';
                myDataObject['p_ta_0_vd_0'] = myObject.fid;
                myDataObject['p_ta_0_vd_1'] = myObject.sid;
                break;
            case 'operator-sign-off':
                myDataObject['p_ca_' + count + '_va'] = myObject.ouid;
                myDataObject['p_ca_' + count + '_vb'] = '';
                myDataObject['p_ca_' + count + '_vc'] = '';
                myDataObject['p_ca_' + count + '_vd'] = 'OperatorSignOff';
                myDataObject['p_ca_' + count + '_ve_0'] = myObject.oid;
                break;
            case 'event':
                myDataObject = $.extend(myObject,myDataObject);
                break;
        }

        var postUrl = thisClass.chosenProfile.server_protocol + thisClass.chosenProfile.server_url + '/server.php?acid=' + acid;

        $.ajax({
            type: "POST",
            url: postUrl,
            data: myDataObject,
            timeout: thisClass.lzm_commonConfig.pollTimeout,
            dataType: 'text'
        }).done(function(data) {
            thisClass.evaluateServerResponse(data, null, myDataObject);
            thisClass.startPolling();
        }).fail(function(jqXHR, textStatus, errorThrown) {
            setTimeout(function() {
                thisClass.pollIsActive = false;
                thisClass.pollServerSpecial(myObject, type);
            }, 500);
        });

    } else {
        setTimeout(function() {thisClass.pollServerSpecial(myObject, type);}, 500);
    }
};

ChatPollServerClass.prototype.pollServerDiscrete = function(type,data,administrate) {
    var thisClass = this;
    var acid = lzm_commonTools.pad(Math.floor(Math.random() * 1048575).toString(16), 5);
    var myDataObject = lzm_commonTools.clone(thisClass.fillDataObject());
    if(typeof data != 'undefined' && data != null)
        myDataObject = $.extend(myDataObject,data);
    myDataObject['p_action'] = type;
    myDataObject['p_loginid'] = lzm_chatPollServer.chosenProfile.login_id;
    myDataObject['p_request'] = 'intern';
    myDataObject['p_user'] = lzm_chatPollServer.chosenProfile.login_name;
    myDataObject['p_token'] = sha256(lzm_chatServerEvaluation.token);
    myDataObject['p_acid'] = lzm_commonTools.pad(Math.floor(Math.random() * 99999).toString(10), 5);

    if(typeof administrate != 'undefined' && administrate)
    {
        myDataObject['p_user'] = lzm_chatPollServer.chosenProfile.login_name;
        myDataObject['p_pass'] = this.chosenProfile.login_passwd;
        myDataObject['p_administrate'] = '1';
    }

    var postUrl = thisClass.chosenProfile.server_protocol + thisClass.chosenProfile.server_url + '/server.php?acid=' + acid;
    return $.ajax({
        type: "POST",
        url: postUrl,
        data: myDataObject,
        timeout: thisClass.lzm_commonConfig.pollTimeout,
        dataType: 'text'
    });
};

ChatPollServerClass.prototype.uploadFile = function(file, fileType, parentId, rank, toAttachment, sendToChat, toKb) {
    var thisClass = this;
    sendToChat = (typeof sendToChat != 'undefined') ? sendToChat : null;
    toAttachment = (typeof toAttachment != 'undefined') ? toAttachment : null;
    toKb = (typeof toKb != 'undefined') ? toKb : null;
    if (!thisClass.pollIsActive) {
        thisClass.pollIsActive = true;
        try {
            var acid = this.lzm_commonTools.pad(Math.floor(Math.random() * 1048575).toString(16), 5);
            var myUserName = lz_global_base64_encode(this.chosenProfile.login_name);
            var myToken = lz_global_base64_encode(sha256(lzm_chatServerEvaluation.token));
            var myRequestType = lz_global_base64_encode('intern');
            var myAction = lz_global_base64_encode('send_file');
            var myLoginId = lz_global_base64_encode(thisClass.loginId);
            var myFileType = lz_global_base64_encode(fileType); // 'user_file' bei Ressourcen

            var postUrl = thisClass.chosenProfile.server_protocol + thisClass.chosenProfile.server_url +
                '/server.php?a=' + acid +
                '&iau=' + myUserName +
                '&iat=' + myToken +
                '&r=' + myRequestType +
                '&isa=' + myAction +
                '&ift=' + myFileType +
                '&li=' + myLoginId;


            if (parentId != null)
                postUrl += '&QRD_PARENT_ID=' + parentId;

            if (toKb != null)
                postUrl += '&QRD_TRESID=' + lz_global_base64_encode(toKb.uploadImageId);

            var formData = new FormData();
            this.fileUploadClient = new XMLHttpRequest();

            var prog = $('#file-upload-progress');
            prog.val(0);
            prog.attr('max', 100);
            formData.append("file", file);
            formData.append("p_user", thisClass.chosenProfile.login_name);
            formData.append("p_token", sha256(lzm_chatServerEvaluation.token));
            formData.append("p_filetype", fileType);
            formData.append("p_request", 'intern');
            formData.append("p_action", 'send_file');
            formData.append("p_loginid", thisClass.loginId);

            this.fileUploadClient.onerror = function(e) {
                thisClass.pollIsActive = false;
                $('#cancel-new-qrd').removeClass('ui-disabled');
                $('#save-new-qrd').removeClass('ui-disabled');
                var errorMessage = t('An error occured while uploading the file.');
                $('#file-upload-error').html(errorMessage);
            };
            this.fileUploadClient.onload = function(e) {
                try
                {
                    thisClass.pollIsActive = false;
                    $('#file-upload-numeric').html('100%');
                    prog.val(prog.attr('max'));

                    try{
                        var response = $.parseXML(thisClass.fileUploadClient.responseText);
                    }
                    catch(ex)
                    {
                        deblog(ex);
                        alert(ex);
                    }
                    var resource = {ti: file.name};
                    $(response).find('response').each(function() {
                        resource['rid'] = lz_global_base64_decode($(this).text());
                        $(this).children('value').each(function() {
                            resource['id'] = lz_global_base64_decode($(this).attr('id'));
                        });
                    });
                    if (toAttachment) {
                        lzm_displayHelper.removeDialogWindow('ticket-details');
                        lzm_displayHelper.maximizeDialogWindow(toAttachment);
                        var resources1 = $('#reply-placeholder-content-1').data('selected-resources');
                        var resources2 = $('#ticket-details-placeholder-content-1').data('selected-resources');
                        var resources = (typeof resources1 != 'undefined') ? resources1 : (typeof resources2 != 'undefined') ? resources2: [];
                        resources.push(resource);
                        $('#reply-placeholder-content-1').data('selected-resources', resources);
                        $('#ticket-details-placeholder-content-1').data('selected-resources', resources);
                        thisClass.lzm_chatDisplay.ticketDisplay.updateAttachmentList();
                    } else if(sendToChat != null) {
                        var userChat = lzm_chatServerEvaluation.userChats.getUserChat(sendToChat.chat_partner);
                        if (userChat != null) {
                            try {
                                var downloadUrl = getQrdDownloadUrl(resource);
                                var chatMessage = '<a class=lz_chat_file href="' + downloadUrl + '" target=_blank>' + resource.ti + '</a>&nbsp;';
                                sendChat(chatMessage, sendToChat.chat_partner);
                            } catch(ex) {}
                        }
                        if (typeof lzm_chatDisplay.StoredDialogs[sendToChat.dialog_id] != 'undefined') {
                            lzm_displayHelper.maximizeDialogWindow(sendToChat.dialog_id);
                        }
                        lzm_displayHelper.removeDialogWindow('qrd-add');
                        var activeUserChat = lzm_chatServerEvaluation.userChats.getUserChat(lzm_chatDisplay.active_chat_reco);
                        if (lzm_chatDisplay.selected_view == 'mychats' && activeUserChat != null) {
                            var chatText = loadChatInput(lzm_chatDisplay.active_chat_reco);
                            initEditor(chatText, 'minimzeDialogWindow', lzm_chatDisplay.active_chat_reco);
                        }
                    }
                    else if(toKb)
                        toKb.placeImage();
                    else
                        lzm_displayHelper.removeDialogWindow('qrd-add');
                }
                catch(ex)
                {
                    deblog(ex);
                }
            };

            this.fileUploadClient.upload.onprogress = function(e) {
                var p = Math.round(100 / e.total * e.loaded);
                $('#file-upload-progress').val(p);
                $('#file-upload-numeric').html(p + '%');
            };
            this.fileUploadClient.onabort = function(e) {
                thisClass.pollIsActive = false;
                var abortMessage = t('Uploading the file has been canceled.');
                $('#cancel-new-qrd').removeClass('ui-disabled');
                $('#save-new-qrd').removeClass('ui-disabled');
                $('#file-upload-error').html(abortMessage);
            };
            this.fileUploadClient.open("POST", postUrl);
            this.fileUploadClient.send(formData);

        } catch(e) {
            $('#cancel-new-qrd').removeClass('ui-disabled');
        }
    } else {
        setTimeout(function() {
            thisClass.uploadFile(file, fileType, parentId, rank, toAttachment, sendToChat);
        }, 500);
    }
};

ChatPollServerClass.prototype.pollServerlogin = function (serverProtocol, serverUrl, logoutOtherInstance) {
    var thisClass = this;

    logoutOtherInstance = (typeof logoutOtherInstance != 'undefined') ? logoutOtherInstance : false;
    thisClass.pollIsActive = true;
    var p_acid = this.lzm_commonTools.pad(Math.floor(Math.random() * 99999).toString(10), 5);
    var acid = this.lzm_commonTools.pad(Math.floor(Math.random() * 1048575).toString(16), 5);
    var mobile = (thisClass.isMobile) ? 1 : 0;

    var loginDataObject = {
        p_user_status: thisClass.user_status,
        p_user: thisClass.chosenProfile.login_name,
        p_pass: thisClass.chosenProfile.login_passwd,
        p_acid: p_acid,
        p_request: 'intern',
        p_action: 'login',
        p_get_management: 1,
        p_version: thisClass.lzm_commonConfig.lz_version,
        p_clienttime: lzm_chatTimeStamp.getServerTimeString(),
        p_web: 1,
        p_mobile: mobile,
        p_app: thisClass.isApp,
        p_app_device_id: '',
        p_loginid: thisClass.loginId
    };

    if(thisClass.chosenProfile.ldap==1)
        loginDataObject.p_ldap = 1;

    if (thisClass.isApp == 1) {
        loginDataObject.p_app_os = appOs;
        loginDataObject.p_app_device_id = 'LOGIN';
        loginDataObject.p_app_language = lzm_t.language;
        loginDataObject.p_app_background = 0;
    }

    if (logoutOtherInstance)
        loginDataObject.p_iso = 1;

    var postUrl = serverProtocol + serverUrl + '/server.php?acid=' + acid;
    if (multiServerId != '') {
        postUrl += '&ws=' + multiServerId;
    }
    if (typeof lzm_deviceInterface != 'undefined') {
        try {
            lzm_deviceInterface.setOperatorStatus(parseInt(thisClass.user_status));
        } catch(e) {}
    }
    if (cookieCredentialsAreSet) {
        $.ajax({
            type: "POST",
            url: postUrl,
            //crossDomain: true,
            data: loginDataObject,
            timeout: thisClass.lzm_commonConfig.pollTimeout,
            success: function (data) {
                thisClass.lzm_chatServerEvaluation.chosen_profile = thisClass.chosenProfile;
                thisClass.lzm_chatServerEvaluation.myUserId = thisClass.chosenProfile.login_name;
                thisClass.lzm_chatDisplay.user_status = thisClass.user_status;
                thisClass.lzm_chatDisplay.myLoginId = thisClass.chosenProfile.login_name;
                thisClass.lzm_chatDisplay.lzm_chatTimeStamp = thisClass.lzm_chatServerEvaluation.lzm_chatTimeStamp;
                thisClass.evaluateServerResponse(data, 'login', loginDataObject);
                var waitForFirstListenPoll = 0;
                setTimeout(function() {thisClass.startPolling()}, waitForFirstListenPoll);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.statusText == 'timeout') {
                    thisClass.pollServerlogin(serverProtocol, serverUrl)
                } else {
                    try {
                        deblog(postUrl);
                        deblog(loginDataObject);
                        deblog(jqXHR);
                    } catch(e) {}
                    thisClass.finishLogout('error', jqXHR);
                }
            },
            dataType: 'text'
        });
    } else {
        var alertMessage = t('Your login data could not be stored correctly in the cookie.');
        lzm_commonDialog.createAlertDialog(alertMessage, [{id: 'ok', name: t('Ok')}]);
        $('#alert-btn-ok').click(function() {
            lzm_commonDialog.removeAlertDialog();
            lzm_chatDisplay.askBeforeUnload = false;
            if (thisClass.isApp == 1) {
                try {
                    lzm_deviceInterface.openLoginView();
                } catch(ex)
                {
                    deblog('Opening login view failed.');
                }
            } else {
                var loginPage = 'index.php?LOGOUT';
                if (multiServerId != '') {
                    var decodedMultiServerId = lz_global_base64_decode(multiServerId);
                    loginPage += '#' + decodedMultiServerId;
                }
                window.location.href = loginPage;
            }
        });
    }
};

ChatPollServerClass.prototype.pollServer = function (dataObject, type) {


    var thisClass = this;

    if(!d(dataObject))
        dataObject = this.fillDataObject();

    if(!d(type))
        type = 'shout';

    if (typeof dataObject.p_de_s != 'undefined') {
        dataObject.p_de_a = thisClass.emailAmount;
    }
    var thisTimeout = (typeof thisClass.lzm_chatServerEvaluation.timeoutClients != 'undefined' && thisClass.lzm_chatServerEvaluation.timeoutClients != 0) ?
        thisClass.lzm_chatServerEvaluation.timeoutClients * 1000 : thisClass.lzm_commonConfig.noAnswerTimeBeforeLogout;



    if (!thisClass.pollIsActive) {
        thisClass.pollIsActive = true;
        thisClass.pollCounter++;
        thisClass.doPoll(dataObject, type, thisTimeout);

    } else if (type == 'shout' || type == 'logout') {
        setTimeout(function () {
            thisClass.pollServer(dataObject, type)
        }, 1000);

    }
    else

    lzm_commonStorage.autoBackup(thisClass.lzm_chatServerEvaluation.myId);
};

ChatPollServerClass.prototype.doPoll = function(dataObject, type, serverTimeout) {
    var thisClass = this;
    //this.maxErrorCount = (typeof serverTimeout != 'undefined' && serverTimeout != 0) ? Math.ceil(serverTimeout / 5000) : 20;
    this.maxTimeSinceLastCorrectAnswer = (typeof serverTimeout != 'undefined' && serverTimeout != 0) ? serverTimeout  : 600000;
    if (type == 'shout' || type == 'logout') {
        dataObject = thisClass.createDataFromOutboundQueue(dataObject);
    }
    var intervall = thisClass.lzm_chatDisplay.awayAfterTime * 60 * 1000;
    if (thisClass.lzm_chatDisplay.awayAfterTime != 0 && lzm_chatTimeStamp.getServerTimeString(null, false, 1) - this.lastUserAction >= intervall && !thisClass.autoSleep) {
        thisClass.autoSleep = true;
        thisClass.userDefinedStatus = this.user_status;
        thisClass.user_status = 3;
        thisClass.lzm_chatDisplay.user_status = 3;
    }

    var postUrl = thisClass.chosenProfile.server_protocol + thisClass.chosenProfile.server_url + '/server.php?acid=' +
        this.lzm_commonTools.pad(Math.floor(Math.random() * 1048575).toString(16), 5);

    if (thisClass.resetTickets || thisClass.resetEmails || thisClass.resetChats || thisClass.resetEvents || thisClass.resetReports) {
        dataObject.p_gl_a = 'N';
    }
    if (thisClass.resetTickets) {
        thisClass.resetTickets = false;
        dataObject.p_dut_t = 0;
    }
    if (thisClass.resetEmails) {
        thisClass.resetEmails = false;
        dataObject.p_dut_e = 0;
    }
    if (thisClass.resetChats) {
        thisClass.resetChats = false;
        dataObject.p_dut_c = 0;
    }
    if (thisClass.resetEvents) {
        thisClass.resetEvents = false;
        dataObject.p_dut_ev = 0;
    }
    if (thisClass.resetReports) {
        thisClass.resetReports = false;
        dataObject.p_dut_r = 0;
    }
    if (!this.validationErrorReceived) {

        $.ajax({
            type: "POST",
            url: postUrl,
            //crossDomain: true,
            data: dataObject,
            timeout: thisClass.lzm_commonConfig.pollTimeout,
            success: function (data) {
                if (type == 'logout' || type == 'logout2') {
                    thisClass.serverSentLogoutResponse = true;
                    thisClass.errorCount = 0;
                    thisClass.lastCorrectServerAnswer = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
                    thisClass.finishLogout();
                } else {
                    thisClass.evaluateServerResponse(data, type, dataObject);
                    thisClass.number_of_poll++;
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.statusText == 'timeout') {
                    if (type == 'shout' || type == 'logout') {
                        if (lzm_chatTimeStamp.getServerTimeString(null, false, 1) - thisClass.lastCorrectServerAnswer >= thisClass.maxTimeSinceLastCorrectAnswer) {
                            thisClass.finishLogout('server timeout', jqXHR, postUrl);
                        } else {
                            setTimeout(function () {
                                thisClass.doPoll(dataObject, type, serverTimeout);
                            }, 500);
                        }
                    } else {
                        if (lzm_chatTimeStamp.getServerTimeString(null, false, 1) - thisClass.lastCorrectServerAnswer >= thisClass.maxTimeSinceLastCorrectAnswer) {
                            thisClass.finishLogout('server timeout', jqXHR, postUrl);
                        } else {
                            thisClass.stopPolling();
                            thisClass.pollIsActive = false;
                            setTimeout(function () {
                                thisClass.startPolling(true);
                            }, 5000);
                        }
                    }
                } else {
                    if (type == 'shout' || type == 'logout') {
                        if (lzm_chatTimeStamp.getServerTimeString(null, false, 1) - thisClass.lastCorrectServerAnswer >= thisClass.maxTimeSinceLastCorrectAnswer) {
                            thisClass.finishLogout('error', jqXHR, postUrl);
                        } else {
                            setTimeout(function () {
                                thisClass.doPoll(dataObject, type, serverTimeout);
                            }, 500);
                        }
                    } else {
                        if (lzm_chatTimeStamp.getServerTimeString(null, false, 1) - thisClass.lastCorrectServerAnswer >= thisClass.maxTimeSinceLastCorrectAnswer) {
                            thisClass.finishLogout('error', jqXHR, postUrl);
                        } else {
                            thisClass.stopPolling();
                            thisClass.pollIsActive = false;
                            setTimeout(function () {
                                thisClass.startPolling(true);
                            }, 5000);
                            thisClass.errorCount++;
                        }
                    }
                }
            },
            dataType: 'text'
        });
    }
};

ChatPollServerClass.prototype.wakeupFromAutoSleep = function() {
    this.lastUserAction = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
    if (this.autoSleep) {
        this.autoSleep = false;
        this.user_status = this.userDefinedStatus;
        this.lzm_chatDisplay.user_status = this.userDefinedStatus;
        /*this.lzm_chatDisplay.createUserControlPanel(this.user_status, this.lzm_chatServerEvaluation.myName,
            this.lzm_chatServerEvaluation.myUserId);*/
    }
};

ChatPollServerClass.prototype.fillDataObject = function () {

    var i = 0;
    if (this.isApp == 1 && deviceId == 0) {
        deviceId = lzm_deviceInterface.loadDeviceId();
    }
    if (this.typingPollCounter >= 2) {
        this.typingChatPartner = '';
    } else {
        this.typingPollCounter++;
    }

    if (this.lzm_chatDisplay.user_status != this.user_status) {
        this.user_status = this.lzm_chatDisplay.user_status;
        this.userDefinedStatus = this.lzm_chatDisplay.user_status;
    }
    var mobile = (this.isMobile) ? 1 : 0;
    this.dataObject.p_user_status = this.user_status;
    delete this.dataObject['p_groups_status'];
    while (typeof this.dataObject['p_groups_status_' + i] != 'undefined') {
        delete this.dataObject['p_groups_status_' + i];
        i++;
    }
    if (lzm_chatDisplay.newGroupsAway != null) {
        this.dataObject.p_groups_status = '1';
        for (i=0; i<lzm_chatDisplay.newGroupsAway.length; i++)
            this.dataObject['p_groups_status_' + i] = lzm_chatDisplay.newGroupsAway[i];
        lzm_chatDisplay.newGroupsAway = null;
    }
    this.dataObject.p_user = this.chosenProfile.login_name;
    if (lzm_chatServerEvaluation.token != null) {
        this.dataObject.p_token = sha256(lzm_chatServerEvaluation.token);
    } else {
        this.dataObject.p_pass = this.chosenProfile.login_passwd;
    }
    this.dataObject.p_acid = this.lzm_commonTools.pad(Math.floor(Math.random() * 99999).toString(10), 5);
    this.dataObject.p_request = 'intern';
    this.dataObject.p_action = 'listen';
    this.dataObject.p_get_management = 1;
    this.dataObject.p_version = this.lzm_commonConfig.lz_version;
    this.dataObject.p_clienttime = lzm_chatTimeStamp.getServerTimeString();
    this.dataObject.p_web = 1;
    this.dataObject.p_mobile = mobile;
    this.dataObject.p_app = this.isApp;
    if (this.isApp == 1) {
        this.dataObject.p_app_os = appOs;
        this.dataObject.p_app_language = lzm_t.language;
        if (deviceId != 0) {
            this.dataObject.p_app_device_id = deviceId;
        } else if (appOs == 'blackberry') {
            this.dataObject.p_app_device_id = 'bb_' + this.fallbackDeviceId;
        } else {
            this.dataObject.p_app_device_id = '';
        }
        if (appOs == 'windows' && deviceId == "NONE") {
            this.dataObject.p_app_device_id = '';
        }
        this.dataObject.p_app_background = this.appBackground;
    }

    var filterParams = {};
    if(this.customFilters.length > 0){
        filterParams = this.customFilters[0];
        this.customFilters = [];
    }
    else
    {
        filterParams.chatArchivePage = this.chatArchivePage;
        filterParams.chatArchiveLimit = this.chatArchiveLimit;
        filterParams.chatArchiveQuery = this.chatArchiveQuery;
        filterParams.chatArchiveFilter = this.chatArchiveFilter;
        filterParams.chatArchiveFilterExternal = '';
        filterParams.chatArchiveFilterInternal = '';
        filterParams.chatArchiveFilterGroup = '';
        filterParams.ticketPage = this.ticketPage;
        filterParams.ticketLimit = this.ticketLimit;
        filterParams.ticketQuery = this.ticketQuery;
        filterParams.ticketQueryUser = false;
        filterParams.ticketFilterStatus = this.ticketFilterStatus;
        filterParams.ticketFilterSubStatus = this.ticketFilterSubStatus;
        filterParams.ticketFilterChannel = this.ticketFilterChannel;
        filterParams.ticketFilterSubChannels = this.ticketFilterSubChannels;
        filterParams.ticketFilterGroups = this.ticketFilterGroups;
        filterParams.ticketSort = this.ticketSort;
        filterParams.ticketSortDir = this.ticketSortDir;
        filterParams.customDemandToken = 0;
    }

    this.dataObject.p_ext_rse = this.qrdRequestTime;
    this.dataObject.p_dt_s = filterParams.ticketSort;
    this.dataObject.p_dt_s_d = filterParams.ticketSortDir;
    this.dataObject.p_dt_p = filterParams.ticketPage;
    this.dataObject.p_dt_q = filterParams.ticketQuery;

    if(filterParams.ticketQueryUser)
        this.dataObject.p_dt_q_u = 1;
    else
        this.removePropertyFromDataObject('p_dt_q_u');

    this.dataObject.p_dt_mr = this.ticketMaxRead;
    this.dataObject.p_dt_f = filterParams.ticketFilterStatus;
    this.dataObject.p_dt_fc = filterParams.ticketFilterChannel;
    this.dataObject.p_cdt = filterParams.customDemandToken;

    if (this.ticketFilterPersonal)
        this.dataObject.p_dt_fp = 1;
    else
        this.removePropertyFromDataObject('p_dt_fp');

    if (this.ticketFilterGroup)
        this.dataObject.p_dt_fg = 1;
    else
        this.removePropertyFromDataObject('p_dt_fg');

    if (this.ticketFilterWatchList)
        this.dataObject.p_dt_fwl = 1;
    else
        this.removePropertyFromDataObject('p_dt_fwl');

    if (filterParams.ticketFilterSubStatus != null)
        this.dataObject.p_dt_fss = filterParams.ticketFilterSubStatus;
    else
        this.removePropertyFromDataObject('p_dt_fss');

    if (filterParams.ticketFilterSubChannels != null)
        this.dataObject.p_dt_fsc = filterParams.ticketFilterSubChannels;
    else
        this.removePropertyFromDataObject('p_dt_fsc');

    if (filterParams.ticketFilterGroups != null)
        this.dataObject.p_dt_fgl = filterParams.ticketFilterGroups;
    else
        this.removePropertyFromDataObject('p_dt_fgl');

    this.dataObject.p_dt_l = filterParams.ticketLimit;
    this.dataObject.p_dc_p = filterParams.chatArchivePage;
    this.dataObject.p_dc_q = filterParams.chatArchiveQuery;
    this.dataObject.p_dc_f = filterParams.chatArchiveFilter;
    this.dataObject.p_dc_l = filterParams.chatArchiveLimit;

    this.dataObject.p_dc_fg = filterParams.chatArchiveFilterGroup;
    this.dataObject.p_dc_fe = filterParams.chatArchiveFilterExternal;
    this.dataObject.p_dc_fi = filterParams.chatArchiveFilterInternal;

    this.dataObject.p_dr_p = this.reportPage;
    this.dataObject.p_dr_t = this.reportFilter;
    this.dataObject.p_dut_ev = this.eventUpdateTimestamp;
    this.dataObject.p_dut_t = this.ticketUpdateTimestamp;
    this.dataObject.p_dut_e = this.emailUpdateTimestamp;
    this.dataObject.p_dut_c = this.chatUpdateTimestamp;
    this.dataObject.p_dut_r = this.reportUpdateTimestamp;
    this.dataObject.p_dut_fi = this.filterUpdateTimeStamp;
    this.dataObject.p_dut_f = this.feedbacksUpdateTimestamp;
    this.dataObject.p_loginid = this.loginId;
    this.dataObject.p_typing = this.typingChatPartner;

    this.dataObject.p_fb_l = lzm_chatServerEvaluation.feedbacksPage;
    if(lzm_chatDisplay.FeedbacksViewer != null)
        this.dataObject.p_fb_p = lzm_chatDisplay.FeedbacksViewer.m_Page;

    if (this.lzm_chatServerEvaluation.rec_posts.length > 0) {
        this.dataObject.p_rec_posts = this.lzm_chatServerEvaluation.rec_posts.join('><');
        this.lzm_chatServerEvaluation.rec_posts = [];
    } else {
        delete this.dataObject.p_rec_posts;
    }
    if (this.location.latitude != null && this.location.longitude != null) {
        this.dataObject.p_op_lat = this.location.latitude;
        this.dataObject.p_op_lon = this.location.longitude;
    }

    return this.dataObject;
};

ChatPollServerClass.prototype.evaluateServerResponse = function (xmlString, type, pollObject) {

    this.lastPollTime = lzm_chatTimeStamp.getServerTimeString(null, true, 1000);
    if (parseInt(lzm_chatTimeStamp.getServerTimeString(null, false, 1)) - parseInt(lzm_chatDisplay.lastBlinkingTime) > 4000) {
        lzm_chatDisplay.startBlinkingIcons();
    }
    startBackgroundTask();
    var i = 0, j = 0;

    var thisClass = this;
    if (thisClass.lzm_chatServerEvaluation.login_data.timediff * 1000 != thisClass.lzm_chatServerEvaluation.lzm_chatTimeStamp.timeDifference)
        thisClass.lzm_chatServerEvaluation.lzm_chatTimeStamp.setTimeDifference(thisClass.lzm_chatServerEvaluation.login_data.timediff);

    try {
        if (xmlString != '') {
            xmlString = xmlString.replace(/\r/g, '').replace(/\n/g, '');
            var xmlDoc = $.parseXML(xmlString);
            var xmlIsLiveZillaXml = false;
            $(xmlDoc).find('livezilla_xml').each(function() {
                xmlIsLiveZillaXml = true;
            });
            if (xmlIsLiveZillaXml) {
                var customDemandToken = (pollObject != null && pollObject.p_cdt != 0) ? pollObject.p_cdt : false;
                thisClass.errorCount = 0;
                thisClass.lastCorrectServerAnswer = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
                var disabled;
                $(xmlDoc).find('listen').each(function () {
                    var listen = $(this);
                    thisClass.dataObject.p_gl_a = lz_global_base64_url_decode(listen.attr('h'));
                    disabled = lz_global_base64_url_decode(listen.attr('disabled'));
                });
                if(disabled == 1)
                    lzm_chatDisplay.serverIsDisabled = true;
                else
                    lzm_chatDisplay.serverIsDisabled = false;

                var validationError = thisClass.lzm_chatServerEvaluation.getValidationError(xmlDoc);
                if ($.inArray(validationError, ['-1', '1', '11']) == -1) {
                    thisClass.validationErrorReceived = true;
                    thisClass.stopPolling();
                    thisClass.lzm_chatDisplay.logoutOnValidationError(validationError, (thisClass.isWeb == 1), (thisClass.isApp == 1));
                }
                lzm_chatServerEvaluation.getLogin(xmlDoc);
                if (lzm_chatDisplay.myId == '')
                    lzm_chatDisplay.myId = lzm_chatServerEvaluation.myId;

                if (lzm_chatDisplay.myName == '') {
                    lzm_chatDisplay.myName = lzm_chatServerEvaluation.myName;
                    $('#main-menu-panel-settings-text').html(lzm_chatDisplay.myName);
                }
                if (lzm_chatDisplay.myEmail == '')
                    lzm_chatDisplay.myEmail = lzm_chatServerEvaluation.myEmail;

                var p_gl_c = thisClass.lzm_chatServerEvaluation.getGlobalConfiguration(xmlDoc);
                validationError = lzm_chatServerEvaluation.getCrC3(lzm_chatServerEvaluation.global_configuration);
                if (validationError != -1) {
                    thisClass.validationErrorReceived = true;
                    thisClass.stopPolling();
                    lzm_chatDisplay.logoutOnValidationError(validationError, (thisClass.isWeb == 1), (thisClass.isApp == 1));
                }
                var serverVersion = lzm_chatServerEvaluation.getServerVersion(xmlDoc);
                if (serverVersion != '' && !thisClass.didSaveServerVersion) {
                    thisClass.didSaveServerVersion = true;
                    lzm_commonConfig.lz_version = serverVersion;
                }
                lzm_chatServerEvaluation.getTranslationStrings(xmlDoc);
                if (p_gl_c != '')
                    thisClass.addPropertyToDataObject('p_gl_c', p_gl_c);
                var p_int_d = thisClass.lzm_chatServerEvaluation.getDepartments(xmlDoc);

                if (p_int_d != '')
                    thisClass.addPropertyToDataObject('p_int_d', p_int_d);
                var p_int_r = thisClass.lzm_chatServerEvaluation.getInternalUsers(xmlDoc);
                if (p_int_r != '')
                    thisClass.addPropertyToDataObject('p_int_r', p_int_r);
                var p_gl_t = thisClass.lzm_chatServerEvaluation.getGlobalTyping(xmlDoc);
                if (p_gl_t != '')
                    thisClass.addPropertyToDataObject('p_gl_t', p_gl_t);

                var isTypingNow = [];
                for (var glTypInd=0; glTypInd<thisClass.lzm_chatServerEvaluation.global_typing.length; glTypInd++)
                    if (thisClass.lzm_chatServerEvaluation.global_typing[glTypInd].tp == 1)
                        isTypingNow.push(thisClass.lzm_chatServerEvaluation.global_typing[glTypInd].id);

                var p_ext_u = thisClass.lzm_chatServerEvaluation.getExternalUsers(xmlDoc);
                if (p_ext_u != '')
                    thisClass.addPropertyToDataObject('p_ext_u', p_ext_u);

                var p_ext_f = thisClass.lzm_chatServerEvaluation.getExternalForward(xmlDoc);
                if (p_ext_f != '')
                    thisClass.addPropertyToDataObject('p_ext_f', p_ext_f);

                var p_gl_e = thisClass.lzm_chatServerEvaluation.getGlobalErrors(xmlDoc);
                if (p_gl_e != '')
                    thisClass.addPropertyToDataObject('p_gl_e', p_gl_e);

                var p_int_wp = thisClass.lzm_chatServerEvaluation.getIntWp(xmlDoc);
                if (p_int_wp != '')
                    thisClass.addPropertyToDataObject('p_int_wp', p_int_wp);


                var eventReturn = thisClass.lzm_chatServerEvaluation.getEvents(xmlDoc);
                if (eventReturn['event-dut'] != '')
                    thisClass.eventUpdateTimestamp = eventReturn['event-dut'];

                var feedbacksReturn = thisClass.lzm_chatServerEvaluation.getFeedbacks(xmlDoc);
                if (feedbacksReturn['feedbacks-dut'] != ''){

                    thisClass.feedbacksUpdateTimestamp = feedbacksReturn['feedbacks-dut'];
                    if(lzm_chatDisplay.FeedbacksViewer != null)
                        lzm_chatDisplay.FeedbacksViewer.updateViewer();
                    else if(thisClass.lzm_chatServerEvaluation.feedbacksList.length){
                        var lastFeedback = thisClass.lzm_commonStorage.loadValue('last_fb' + thisClass.lzm_chatServerEvaluation.myId);

                        if(lastFeedback < thisClass.lzm_chatServerEvaluation.feedbacksMaxCreated){
                            $('#main-menu-panel-tools-feedbacks').addClass('main-menu-panel-tool-highlight');

                                if(lzm_commonStorage.loadValue('not_feedbacks_' + lzm_chatServerEvaluation.myId,1)!=0){
                                    var text='',fb = thisClass.lzm_chatServerEvaluation.feedbacksList[0];
                                    for(key in fb.Criteria)
                                        if(fb.Criteria[key].Value.length>1)
                                            text = fb.Criteria[key].Value;
                                    lzm_displayHelper.showBrowserNotification({text: text,sender: fb.UserData.f111,subject: tid('new_feedback'),action: 'initFeedbacksConfiguration();',timeout: 10,icon: 'fa-star-o'});
                                }
                        }
                    }
                }

                var ticketReturn = lzm_chatServerEvaluation.getTickets(xmlDoc, this.ticketMaxRead, customDemandToken);
                var filterReturn = lzm_chatServerEvaluation.getFilters(xmlDoc);

                if(lzm_chatServerEvaluation.eventList.length)
                    lzm_chatServerEvaluation.processActions(xmlDoc);

                var p_dt_h = ticketReturn['hash'];
                var p_dut_t = ticketReturn['ticket-dut'];
                var p_dut_e = ticketReturn['email-dut'];
                var p_dut_r = lzm_chatServerEvaluation.getReports(xmlDoc);
                var p_dut_fi = filterReturn.dut;

                if (p_dt_h != '')
                    thisClass.addPropertyToDataObject('p_dt_h', p_dt_h);
                if (p_dut_t != '')
                    thisClass.ticketUpdateTimestamp = p_dut_t;
                if (p_dut_e != '')
                    thisClass.emailUpdateTimestamp = p_dut_e;
                if (p_dut_r != '')
                    thisClass.reportUpdateTimestamp = p_dut_r;
                if (p_dut_fi != '')
                    thisClass.filterUpdateTimeStamp = p_dut_fi;


                thisClass.lzm_chatServerEvaluation.getUsrP(xmlDoc);

                var chatArchiveReturn = thisClass.lzm_chatServerEvaluation.getChats(xmlDoc, customDemandToken);
                if (typeof chatArchiveReturn['dut'] != 'undefined' && chatArchiveReturn['dut'] != '')
                    thisClass.chatUpdateTimestamp = chatArchiveReturn['dut'];

                if (thisClass.lzm_chatServerEvaluation.myId != '') {
                    if (thisClass.qrdRequestTime == 0) {
                        thisClass.qrdRequestTime = 1;

                        var requestTime = thisClass.lzm_commonStorage.loadValue('qrd_request_time_' + thisClass.lzm_chatServerEvaluation.myId);
                        thisClass.qrdRequestTime = (requestTime != null && requestTime !== '' && JSON.parse(requestTime) != 0) ? JSON.parse(requestTime) : thisClass.qrdRequestTime;
                        thisClass.lzm_chatServerEvaluation.resourceLastEdited = thisClass.qrdRequestTime;

                        var resources = thisClass.lzm_commonStorage.loadValue('qrd_' + thisClass.lzm_chatServerEvaluation.myId);
                        thisClass.lzm_chatServerEvaluation.resources = (resources != null && resources !== '') ? JSON.parse(resources) : thisClass.lzm_chatServerEvaluation.resources;

                        var resourceIdList = thisClass.lzm_commonStorage.loadValue('qrd_id_list_' + thisClass.lzm_chatServerEvaluation.myId);
                        thisClass.lzm_chatServerEvaluation.resourceIdList = (resourceIdList != null && resourceIdList !== '') ?
                            JSON.parse(resourceIdList) : thisClass.lzm_chatServerEvaluation.resourceIdList;

                        var saveConnections = lzm_commonStorage.loadValue('save_connections_' + lzm_chatServerEvaluation.myId);
                        thisClass.lzm_chatDisplay.saveConnections = (saveConnections != null && saveConnections != '') ?
                            JSON.parse(saveConnections) : thisClass.lzm_chatDisplay.saveConnections;
                        var autoAcceptChat = lzm_commonStorage.loadValue('auto_accept_chat_' + thisClass.lzm_chatServerEvaluation.myId);
                        thisClass.lzm_chatDisplay.autoAcceptChecked = (autoAcceptChat != null && autoAcceptChat != '') ?
                            JSON.parse(autoAcceptChat) : thisClass.lzm_chatDisplay.autoAcceptChecked;
                        var vibrateNotifications = lzm_commonStorage.loadValue('vibrate_notifications_' + thisClass.lzm_chatServerEvaluation.myId);
                        thisClass.lzm_chatDisplay.vibrateNotifications = (vibrateNotifications != null && vibrateNotifications != '') ?
                            JSON.parse(vibrateNotifications) : thisClass.lzm_chatDisplay.vibrateNotifications;
                        var qrdAutoSearch = lzm_commonStorage.loadValue('qrd_auto_search_' + thisClass.lzm_chatServerEvaluation.myId);
                        lzm_chatDisplay.qrdAutoSearch = (qrdAutoSearch != null && qrdAutoSearch != '') ?
                            JSON.parse(qrdAutoSearch) : lzm_chatDisplay.qrdAutoSearch;
                        var alertNewFilter = lzm_commonStorage.loadValue('alert_new_filter_' + thisClass.lzm_chatServerEvaluation.myId);
                        lzm_chatDisplay.alertNewFilter = (alertNewFilter != null && alertNewFilter != '') ?
                            JSON.parse(alertNewFilter) : lzm_chatDisplay.alertNewFilter;
                        var ticketsRead = lzm_commonStorage.loadValue('tickets_read_' + thisClass.lzm_chatServerEvaluation.myId);
                        lzm_chatDisplay.ticketReadStatusChecked = (ticketsRead != null && ticketsRead != '') ?
                            JSON.parse(ticketsRead) : lzm_chatDisplay.ticketReadStatusChecked;
                        var showOfflineOps = lzm_commonStorage.loadValue('show_offline_operators_' + lzm_chatServerEvaluation.myId);
                        lzm_chatDisplay.showOfflineOperators = (showOfflineOps != null && showOfflineOps != '') ?
                            JSON.parse(showOfflineOps) : lzm_chatDisplay.showOfflineOperators;
                        var lastPhoneProtocol = lzm_commonStorage.loadValue('last_phone_protocol_' + lzm_chatServerEvaluation.myId);
                        lzm_chatDisplay.ticketDisplay.lastPhoneProtocol = (lastPhoneProtocol != null && lastPhoneProtocol != '') ?
                            JSON.parse(lastPhoneProtocol) : lzm_chatDisplay.ticketDisplay.lastPhoneProtocol;
                        if (typeof lzm_deviceInterface != 'undefined') {
                            try {
                                lzm_deviceInterface.setVibrateOnNotifications(lzm_chatDisplay.vibrateNotifications);
                            } catch(e) {}
                        }

                        var showViewSelectPanel = lzm_commonStorage.loadValue('show_view_select_panel_' + thisClass.lzm_chatServerEvaluation.myId);
                        var viewSelectArray = lzm_commonStorage.loadValue('view_select_array_' + thisClass.lzm_chatServerEvaluation.myId);
                        if (viewSelectArray != null && viewSelectArray != '' && showViewSelectPanel != null && showViewSelectPanel != '') {
                            try {
                            viewSelectArray = JSON.parse(viewSelectArray);
                                showViewSelectPanel = JSON.parse(showViewSelectPanel);
                            var keys = Object.keys(lzm_chatDisplay.allViewSelectEntries);
                            for (j=keys.length - 1; j>=0; j--) {
                                var viewSelectEntryDoesExist = false;
                                for (i=0; i<viewSelectArray.length; i++) {
                                    if (typeof viewSelectArray[i].icon == 'undefined') {
                                        viewSelectArray[i].icon = '';
                                    }
                                    viewSelectEntryDoesExist = (viewSelectArray[i].id == keys[j]) ? true : viewSelectEntryDoesExist;
                                }
                                var newViewSelectEntry = {id: keys[j], name: t(lzm_chatDisplay.allViewSelectEntries[keys[j]].title),
                                    icon: lzm_chatDisplay.allViewSelectEntries[keys[j]].icon};
                                if (!viewSelectEntryDoesExist && lzm_chatDisplay.allViewSelectEntries[keys[j]].pos == 0) {
                                    viewSelectArray.unshift(newViewSelectEntry);
                                } else if (!viewSelectEntryDoesExist && lzm_chatDisplay.allViewSelectEntries[keys[j]].pos == 1) {
                                    viewSelectArray.push(newViewSelectEntry);
                                }
                                if (typeof showViewSelectPanel[keys[j]] == 'undefined') {
                                    showViewSelectPanel[keys[j]] = 1;
                                }
                            }
                            // Workarround: set names of saved view select array entries
                            for (j=0; j<viewSelectArray.length; j++) {
                                switch(viewSelectArray[j].id) {
                                    case 'home':
                                        viewSelectArray[j].name = t('Startpage');
                                        break;
                                    case 'world':
                                        viewSelectArray[j].name = t('Map');
                                        break;
                                    case 'mychats':
                                        viewSelectArray[j].name = t('Chats');
                                        break;
                                    case 'tickets':
                                        viewSelectArray[j].name = t('Tickets');
                                        break;
                                    case 'external':
                                        viewSelectArray[j].name = t('Visitors');
                                        break;
                                    case 'archive':
                                        viewSelectArray[j].name = t('Chat Archive');
                                        break;
                                    case 'internal':
                                        viewSelectArray[j].name = t('Operators');
                                        break;
                                    case 'qrd':
                                        viewSelectArray[j].name = t('Knowledgebase');
                                        break;
                                    case 'reports':
                                        viewSelectArray[j].name = t('Reports');
                                        break;
                                }
                            }

                            thisClass.lzm_chatDisplay.viewSelectArray = viewSelectArray;
                            thisClass.lzm_chatDisplay.showViewSelectPanel = showViewSelectPanel;
                            } catch(e) {}
                        }
                        if ((lzm_chatDisplay.showViewSelectPanel[lzm_chatDisplay.firstVisibleView] == 0) ||
                            (lzm_chatDisplay.firstVisibleView == 'world' && lzm_chatServerEvaluation != null && lzm_chatServerEvaluation.crc3[2] == -2)) {
                            for (i=0; i<lzm_chatDisplay.viewSelectArray.length; i++) {
                                if (lzm_chatDisplay.viewSelectArray[i].id != 'world' && lzm_chatDisplay.showViewSelectPanel[lzm_chatDisplay.viewSelectArray[i].id] != 0) {
                                    lzm_chatDisplay.firstVisibleView = lzm_chatDisplay.viewSelectArray[i].id;
                                    break;
                                }
                            }

                        }

                        lzm_chatDisplay.selected_view = thisClass.lzm_chatDisplay.firstVisibleView;


                        for(var key in lzm_chatDisplay.settingsDisplay.tableIds){
                            var tableId = lzm_chatDisplay.settingsDisplay.tableIds[key];

                            var columnTable = lzm_commonStorage.loadValue(tableId + '_column_table_' + lzm_chatServerEvaluation.myId);
                            var customColumnTable = lzm_commonStorage.loadValue('custom_'+tableId+'_column_table_' + lzm_chatServerEvaluation.myId);

                            if (columnTable != null && columnTable != '')
                                lzm_displayHelper.fillColumnArray(tableId, 'general', JSON.parse(columnTable));

                            if (customColumnTable != null && customColumnTable != '')
                                lzm_displayHelper.fillColumnArray(tableId, 'custom', JSON.parse(customColumnTable));
                        }

                        for (i=0; i<lzm_chatServerEvaluation.resources.length; i++)
                            lzm_chatServerEvaluation.cannedResources.setResource(lzm_chatServerEvaluation.resources[i]);

                        lzm_chatDisplay.createViewSelectPanel(thisClass.lzm_chatDisplay.firstVisibleView);
                        lzm_chatDisplay.toggleVisibility();
                    }
                    var thisQrdRequestTime = thisClass.lzm_chatServerEvaluation.getResources(xmlDoc);
                    thisClass.qrdRequestTime = Math.max(thisClass.qrdRequestTime, thisQrdRequestTime);

                    if (thisClass.ticketMaxRead == 0) {
                        var ticketMaxRead = thisClass.lzm_commonStorage.loadValue('ticket_max_read_time_' + thisClass.lzm_chatServerEvaluation.myId);
                        ticketMaxRead = (ticketMaxRead != null && ticketMaxRead != '') ? JSON.parse(ticketMaxRead) : thisClass.ticketMaxRead;
                        thisClass.ticketMaxRead = Math.max(lzm_chatTimeStamp.getServerTimeString(null, true) - 1209600, ticketMaxRead);
                    }
                }

                thisClass.lzm_chatDisplay.setBlinkingIconsArray(isTypingNow);

                if (lzm_chatServerEvaluation.new_qrd)
                    lzm_chatDisplay.resourcesDisplay.updateResources();

                if ((thisClass.lzm_chatServerEvaluation.new_dt || thisClass.lzm_chatServerEvaluation.new_de || customDemandToken) && !thisClass.lzm_chatServerEvaluation.ticketGlobalValues['no_update'])
                    thisClass.lzm_chatDisplay.ticketDisplay.updateTicketList(thisClass.lzm_chatServerEvaluation.tickets,thisClass.lzm_chatServerEvaluation.ticketGlobalValues,thisClass.ticketPage, thisClass.ticketSort, thisClass.ticketSortDir, thisClass.ticketQuery, thisClass.ticketFilterStatus, false, pollObject);

                if (thisClass.lzm_chatServerEvaluation.new_de && $('#email-list-container').length > 0)
                    thisClass.lzm_chatDisplay.ticketDisplay.updateEmailList();

                if (lzm_chatServerEvaluation.new_dr)
                    lzm_chatDisplay.reportsDisplay.createReportList();

                if (!this.ticketReadArrayLoaded)
                {
                    var curSelCat = lzm_commonStorage.loadValue('show_ticket_cat_' + lzm_chatServerEvaluation.myId);
                    if(curSelCat != null)
                        handleTicketTreeClickEvent(curSelCat,null,null,false);

                    var readArray =  thisClass.lzm_commonStorage.loadValue('ticket_read_array_' + thisClass.lzm_chatServerEvaluation.myId);
                    var unReadArray =  thisClass.lzm_commonStorage.loadValue('ticket_unread_array_' + thisClass.lzm_chatServerEvaluation.myId);
                    var filterChannel = thisClass.lzm_commonStorage.loadValue('ticket_filter_channel_' + thisClass.lzm_chatServerEvaluation.myId);
                    var filterGroups = thisClass.lzm_commonStorage.loadValue('ticket_filter_groups_' + thisClass.lzm_chatServerEvaluation.myId);
                    var filterSubChannels = thisClass.lzm_commonStorage.loadValue('ticket_filter_sub_channels_' + thisClass.lzm_chatServerEvaluation.myId);
                    var sort = thisClass.lzm_commonStorage.loadValue('ticket_sort_' + thisClass.lzm_chatServerEvaluation.myId);
                    var sortDir = thisClass.lzm_commonStorage.loadValue('ticket_sort_dir_' + thisClass.lzm_chatServerEvaluation.myId);
                    var emailReadArray = thisClass.lzm_commonStorage.loadValue('email_read_array_' + thisClass.lzm_chatServerEvaluation.myId);
                    var acceptedChats = thisClass.lzm_commonStorage.loadValue('accepted_chats_' + lzm_chatServerEvaluation.myId);
                    var ticketFilterPersonal = thisClass.lzm_commonStorage.loadValue('ticket_filter_personal_' + lzm_chatServerEvaluation.myId);
                    var ticketFilterGroup = thisClass.lzm_commonStorage.loadValue('ticket_filter_group_' + lzm_chatServerEvaluation.myId);

                    var qrdSearchCategories = lzm_commonStorage.loadValue('qrd_search_categories_' + lzm_chatServerEvaluation.myId);
                    var qrdRecentlyUsed = lzm_commonStorage.loadValue('qrd_recently_used_' + lzm_chatServerEvaluation.myId);
                    if (qrdRecentlyUsed == null || qrdRecentlyUsed == '') {
                        qrdRecentlyUsed = lzm_commonStorage.loadValue('qrd_recently_used' + lzm_chatServerEvaluation.myId);
                    }
                    var qrdSelectedTab = lzm_commonStorage.loadValue('qrd_selected_tab_' + lzm_chatServerEvaluation.myId);
                    var archiveFilter = lzm_commonStorage.loadValue('archive_filter_' + lzm_chatServerEvaluation.myId);
                    thisClass.ticketFilterPersonal = (ticketFilterPersonal != null && ticketFilterPersonal != '') ? JSON.parse(ticketFilterPersonal) : false;
                    thisClass.ticketFilterGroup = (ticketFilterGroup != null && ticketFilterGroup != '') ? JSON.parse(ticketFilterGroup) : false;
                    thisClass.lzm_chatDisplay.ticketReadArray = (readArray != null && readArray != '') ? JSON.parse(readArray) : [];
                    thisClass.lzm_chatDisplay.ticketUnreadArray = (unReadArray != null && unReadArray != '') ? JSON.parse(unReadArray) : [];
                    thisClass.lzm_chatDisplay.emailReadArray = (emailReadArray != null && emailReadArray != '') ? JSON.parse(emailReadArray) : [];
                    thisClass.ticketFilterChannel = (filterChannel != null && filterChannel != '' && JSON.parse(filterChannel) != '') ? JSON.parse(filterChannel) : '01234567';
                    thisClass.ticketFilterSubChannels = filterSubChannels;

                    if(filterGroups != null)
                        thisClass.ticketFilterGroups = lz_global_base64_decode(filterGroups);

                    thisClass.ticketSort = (sort != null && sort != '') ? JSON.parse(sort) : 'update';
                    thisClass.ticketSortDir = (sortDir != null && sortDir != '') ? JSON.parse(sortDir) : 'DESC';
                    lzm_chatUserActions.acceptedChatCounter = (acceptedChats != null && acceptedChats != '') ? acceptedChats : 0;
                    lzm_chatDisplay.resourcesDisplay.qrdSearchCategories = (qrdSearchCategories != null && qrdSearchCategories != '' && JSON.parse(qrdSearchCategories) != '') ?
                        JSON.parse(qrdSearchCategories) : ['ti', 't'];
                    lzm_chatDisplay.recentlyUsedResources = (qrdRecentlyUsed != null && qrdRecentlyUsed != '' && JSON.parse(qrdRecentlyUsed) != '') ?
                        JSON.parse(qrdRecentlyUsed) : [];
                    lzm_chatDisplay.resourcesDisplay.selectedResourceTab = (qrdSelectedTab != null && qrdSelectedTab != '' && JSON.parse(qrdSelectedTab) != '') ?
                        JSON.parse(qrdSelectedTab) : 0;
                    thisClass.chatArchiveFilter = (archiveFilter != null && archiveFilter != '' && JSON.parse(archiveFilter) != '') ? JSON.parse(archiveFilter) : '012';
                    this.ticketReadArrayLoaded = true;
                    for (j=0; j<lzm_chatDisplay.recentlyUsedResources.length; j++) {
                        lzm_chatServerEvaluation.cannedResources.riseUsageCounter(lzm_chatDisplay.recentlyUsedResources[j]);
                    }
                }

                var updateDisplayMyChats = false;
                if (thisClass.lzm_chatServerEvaluation.new_ext_u) {

                    var userUpdated = lzm_chatDisplay.visitorDisplay.updateShowVisitor();
                    if (userUpdated)
                        lzm_chatDisplay.visitorDisplay.updateVisitorInformation(lzm_chatDisplay.infoUser);

                    $('#chat-info-elements div').each(function(){
                       var vid = $(this).attr('data-visitor-id');
                        lzm_chatDisplay.visitorDisplay.updateVisitorInformation(lzm_chatServerEvaluation.visitors.getVisitor(vid));
                    });
                }
                if (thisClass.lzm_chatServerEvaluation.new_ext_f || thisClass.lzm_chatServerEvaluation.new_ext_u || thisClass.lzm_chatServerEvaluation.new_glt) {
                    if (thisClass.lzm_chatDisplay.selected_view == 'external' && $('.dialog-window-container').length == 0) {
                            lzm_chatDisplay.visitorDisplay.updateVisitorList();
                    }
                }
                if (thisClass.lzm_chatServerEvaluation.new_usr_p || thisClass.lzm_chatServerEvaluation.new_ext_f ||
                    thisClass.lzm_chatServerEvaluation.new_ext_u || thisClass.lzm_chatServerEvaluation.new_int_u ||
                    thisClass.lzm_chatServerEvaluation.new_int_d) {
                    if (lzm_chatDisplay.selected_view == 'internal' && $('#operator-list-context').length == 0)
                        lzm_chatDisplay.createOperatorList();
                    if (thisClass.lzm_chatDisplay.selected_view == 'mychats')
                        updateDisplayMyChats = true;
                    if($('#operator-forward-selection-body').length)
                        lzm_chatDisplay.ChatForwardInvite.updateForwardOperators();
                }
                if (thisClass.lzm_chatServerEvaluation.new_usr_p || thisClass.lzm_chatServerEvaluation.new_ext_f ||
                    thisClass.lzm_chatServerEvaluation.new_ext_u || thisClass.lzm_chatServerEvaluation.new_int_u ||
                    thisClass.lzm_chatServerEvaluation.new_int_d) {
                    if (thisClass.lzm_chatDisplay.selected_view == 'mychats')
                        updateDisplayMyChats = true;

                    var updateVisitorListAsWell = (thisClass.lzm_chatDisplay.selected_view == 'external' && $('.dialog-window-container').length == 0) ? true : false;
                    thisClass.lzm_chatDisplay.createActiveChatPanel(updateVisitorListAsWell, false, true);
                    //openLastActiveChat();
                }

                if(updateDisplayMyChats)
                    thisClass.lzm_chatDisplay.createChatHtml(lzm_chatDisplay.thisUser);

                if (lzm_chatServerEvaluation.new_ext_b && lzm_chatDisplay.FilterConfiguration != null)
                    lzm_chatDisplay.FilterConfiguration.updateFilterList();

                if (lzm_chatServerEvaluation.new_ev && lzm_chatDisplay.EventConfiguration != null)
                    lzm_chatDisplay.EventConfiguration.updateEventList();

                if (thisClass.lzm_chatServerEvaluation.new_dc || customDemandToken) {
                    if ($('#chat-archive-table').length == 0)
                        lzm_chatDisplay.archiveDisplay.createArchive();
                    else
                        lzm_chatDisplay.archiveDisplay.updateArchive(pollObject);
                }
                if (lzm_chatServerEvaluation.new_startpage.lz || lzm_chatServerEvaluation.new_startpage.ca.length > 0 ||
                    lzm_chatServerEvaluation.new_startpage.cr.length > 0) {
                    var spCounter = 0;
                    var createStartPage = function() {
                        if ($(window).width() != 0 || spCounter >= 100) {
                            lzm_chatDisplay.startpageDisplay.createStartPage(lzm_chatServerEvaluation.new_startpage.lz,
                                lzm_chatServerEvaluation.new_startpage.ca, lzm_chatServerEvaluation.new_startpage.cr);
                            lzm_chatDisplay.startPageExists = true;
                            lzm_chatServerEvaluation.new_startpage = {lz: false, ca: [], cr: []};
                            spCounter = 100;
                        } else {
                            spCounter ++;
                            setTimeout(function() {
                                createStartPage();
                            }, 10);
                        }
                    };
                    createStartPage();
                }
                lzm_chatDisplay.createGeoTracking();
                if (lzm_chatServerEvaluation.new_trl) {
                    lzm_chatDisplay.translationEditor.loadTranslationStrings(lzm_chatServerEvaluation.translationStrings.key);
                }

                thisClass.lzm_chatDisplay.createChatWindowLayout(false, false);
                thisClass.lzm_chatServerEvaluation.new_ext_u = false;
                thisClass.lzm_chatServerEvaluation.new_usr_p = false;
                thisClass.lzm_chatServerEvaluation.new_ext_f = false;
                thisClass.lzm_chatServerEvaluation.new_int_u = false;
                thisClass.lzm_chatServerEvaluation.new_int_d = false;
                thisClass.lzm_chatServerEvaluation.new_glt = false;
                thisClass.lzm_chatServerEvaluation.new_ev = false;
                thisClass.lzm_chatServerEvaluation.new_dt = false;
                thisClass.lzm_chatServerEvaluation.new_de = false;
                thisClass.lzm_chatServerEvaluation.new_dc = false;
                thisClass.lzm_chatServerEvaluation.new_dr = false;
                thisClass.lzm_chatServerEvaluation.new_qrd = false;
                thisClass.lzm_chatServerEvaluation.new_gl_e = false;
                thisClass.lzm_chatServerEvaluation.new_ext_b = false;
                lzm_chatServerEvaluation.new_trl = false;

                lzm_chatDisplay.allMyGroupsAreOffline = true;
                for (i=0; i<lzm_chatDisplay.myGroups.length; i++) {
                    var thisGroup = lzm_chatServerEvaluation.groups.getGroup(lzm_chatDisplay.myGroups[i]);
                    if (thisGroup != null && typeof thisGroup.oh != 'undefined' && thisGroup.oh == '1') {
                        lzm_chatDisplay.allMyGroupsAreOffline = false;
                    }
                }
            } else {
                if (lzm_chatTimeStamp.getServerTimeString(null, false, 1) - thisClass.lastCorrectServerAnswer >= thisClass.maxTimeSinceLastCorrectAnswer) {
                    thisClass.stopPolling();
                    thisClass.finishLogout('parseError');
                } else {
                    thisClass.errorCount++;
                }
            }



            if (thisClass.ticketLimit != lzm_chatServerEvaluation.ticketGlobalValues.p) {
                thisClass.resetTickets = true;
            }
            if (thisClass.chatArchiveLimit != lzm_chatServerEvaluation.chatArchive.p) {
                thisClass.resetChats = true;
            }
        } else {
            thisClass.lastCorrectServerAnswer = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
            if(lzm_chatDisplay.resourcesDisplay.IsLoading){
                lzm_chatDisplay.resourcesDisplay.IsLoading = false;
                lzm_chatDisplay.resourcesDisplay.updateKBInfo(0);
                if(lzm_chatDisplay.selected_view == 'qrd')
                    selectView('qrd',true);
            }

        }
        thisClass.cleanOutboundQueue(type);
        thisClass.lzm_chatDisplay.showDisabledWarning();

        lzm_chatDisplay.allchatsDisplay.updateAllChats();
    } catch(ex) {
        deblog(ex);
        thisClass.stopPolling();
        if (lzm_chatTimeStamp.getServerTimeString(null, false, 1) - thisClass.lastCorrectServerAnswer >= thisClass.maxTimeSinceLastCorrectAnswer) {
            thisClass.stopPolling();
            thisClass.finishLogout('parseError');
        } else {
            thisClass.errorCount++;
            thisClass.pollIsActive = false;
            setTimeout(function() {
                thisClass.startPolling(true);
            }, 4000);
        }
    }
    try {
        //lzm_chatDisplay.visitorDisplay.updateVisitorTimestampCells();
    } catch(ex) {deblog(ex);}

    try {
        lzm_displayHelper.unblockUi();
    } catch(e) {deblog(ex);

    }
};

ChatPollServerClass.prototype.initVisitorFetchInfo = function(userId){
    lzm_chatServerEvaluation.expectArchiveChanges = true;
    lzm_chatServerEvaluation.expectTicketChanges = true;

    var customFilter = {};
    customFilter.chatArchivePage = 1;
    customFilter.chatArchiveLimit = 1000;
    customFilter.chatArchiveQuery = '';
    customFilter.chatArchiveFilter = '';
    customFilter.chatArchiveFilterExternal = userId;
    customFilter.ticketPage = 1;
    customFilter.ticketLimit = 1000;
    customFilter.ticketQuery = userId;
    customFilter.ticketQueryUser = true;
    customFilter.ticketFilterStatus = '0123';
    customFilter.ticketFilterSubStatus = null;
    customFilter.ticketFilterChannel = '01234567';
    customFilter.ticketFilterSubChannels = null;
    customFilter.ticketFilterGroups = null;
    customFilter.ticketSort = '';
    customFilter.ticketSortDir = 'DESC';
    customFilter.customDemandToken = userId;

    this.customFilters.push(customFilter);
    this.resetTickets = true;
    this.resetChats = true;

    this.pollServer(this.fillDataObject(), 'shout');

};

ChatPollServerClass.prototype.resetVisitorFetchInfo = function(){


}

ChatPollServerClass.prototype.addPropertyToDataObject = function (propertyName, propertyValue) {
    this.dataObject[propertyName] = propertyValue;
};

ChatPollServerClass.prototype.removePropertyFromDataObject = function (propertyName) {
    delete this.dataObject[propertyName];
};

ChatPollServerClass.prototype.finishLogout = function(cause, jqXHR, postUrl) {
    var thisClass = this;
    this.lzm_chatDisplay.askBeforeUnload = false;
    postUrl = (typeof postUrl != 'undefined') ? postUrl : '';
    var errorMessage = '';
    if (typeof cause != 'undefined' && cause == 'server timeout') {
        errorMessage = t('Cannot connect to the LiveZilla Server.') +
            '\n\n' + t('You are signed off.') +
            '\n\n' + t('Further information:') +
            '\n' + t('Server timeout');
    } else if (typeof cause != 'undefined' && cause == 'error') {
        if (jqXHR.status == 0) {
            errorMessage = t('Cannot connect to the LiveZilla Server.') +
                '\n\n' + t('You are signed off.') +
                '\n\n' + t('Further information:') +
                '\n' + t('Your network is down.');
        } else {
            errorMessage = t('Cannot connect to the LiveZilla Server.') +
                '\n\n' + t('You are signed off.') +
                '\n\n' + t('Further information:');
            var errorDetailsMessage = (thisClass.chosenProfile.server_url != ':') ?
                '\n' + t('The remote server has returned an error: (<!--http_error-->) <!--http_error_text-->',
                [['<!--http_error-->',jqXHR.status],['<!--http_error_text-->',jqXHR.statusText]]) :
                '\n' + t('An error within the application has occured.');
            errorMessage += errorDetailsMessage;
        }
    } else if (typeof cause != 'undefined' && cause == 'parseError') {
        errorMessage = t('Cannot connect to the LiveZilla Server.') +
            '\n\n' + t('You are signed off.') +
            '\n\n' + t('Further information:') +
            '\n' + t('The server response had an invalid structure.') +
            '\n' + t('Either the server URL is wrong (presumably) or the server is not working properly.');
    }
    var doLogout = function() {
        lzm_displayHelper.blockUi({message: null});
        if (thisClass.isApp == 1) {
            try {
                lzm_deviceInterface.openLoginView();
            } catch(ex) {
                deblog('Opening login view failed.');
            }
        } else {
            var loginPage = 'index.php?LOGOUT';
            if (multiServerId != '') {
                var decodedMultiServerId = lz_global_base64_decode(multiServerId);
                loginPage += '#' + decodedMultiServerId;
            }
            window.location.href = loginPage;
        }
    };
    if (errorMessage != '') {
        lzm_displayHelper.unblockUi();
        lzm_commonDialog.createAlertDialog(errorMessage.replace(/\n/g, '<br />'), [{id: 'ok', name: t('Ok')}]);
        $('#alert-btn-ok').click(function() {
            doLogout();
        });
    } else {
        doLogout();
    }
};
