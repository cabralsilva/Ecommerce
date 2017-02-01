/****************************************************************************************
 * LiveZilla ChatDisplayClass.js
 *
 * Copyright 2016 LiveZilla GmbH
 * All rights reserved.
 * LiveZilla is a registered trademark.
 *
 ***************************************************************************************/

function ChatDisplayClass(now, lzm_commonConfig, lzm_commonTools, lzm_chatInputEditor, web, app, mobile, messageTemplates,
                          userConfigData, multiServerId) {
    this.debuggingDisplayMode = 'none';
    this.debuggingDisplayWidth = 0;
    this.minWidthChatVisitorInfo = 1100;

    this.m_OperatorsListLineCounter = 0;
    this.m_OperatorsListSelectedLine = 0;

    this.myLoginId = '';
    this.myId = '';
    this.myName = '';
    this.myEmail = '';
    this.myGroups = [];
    this.myGroupsAway = null;
    this.newGroupsAway = null;
    this.allMyGroupsAreOffline = false;
    this.active_chat = 'LIST';
    this.active_chat_reco = 'LIST';
    this.user_status = 0;
    this.selected_view = 'mychats';
    this.lastActiveChat = 'LIST';
    this.lastChatSendingNotification = '';
    this.infoUser = {};
    this.thisUser = {id: ''};
    this.chatActivity = false;
    this.soundPlayed = [];
    this.isRinging = {};
    this.ringSenderList = [];
    this.VisitorListCreated = false;
    this.ShowVisitorId = '';
    this.userLanguage = 'en';
    this.closedChats = [];
    this.joinedChats = [];
    this.publicGroupChats = [];
    this.selectedResource = '';
    this.tabSelectedResources = ['1', '1', '1'];
    this.queueSoundCircleActive = false;
    this.queueSoundsPlayed = [];
    this.queueSoundsTimer = null;
    this.serverIsDisabled = false;
    this.lastDiabledWarningTime = 0;
    this.askBeforeUnload = true;

    this.startPages = {show_lz: '0', others: []};
    this.startPageTabControlDoesExist = false;
    this.startPageExists = false;
    this.awayAfterTime = userConfigData['awayAfter'];
    this.volume = userConfigData['userVolume'];
    this.playNewMessageSound = userConfigData['playIncomingMessageSound'];
    this.playNewChatSound = userConfigData['playIncomingChatSound'];
    this.repeatNewChatSound = userConfigData['repeatIncomingChatSound'];
    this.playNewTicketSound = userConfigData['playIncomingTicketSound'];

    this.vibrateNotifications = 1;
    this.ticketReadStatusChecked = 1;
    this.qrdAutoSearch = 1;
    this.alertNewFilter = 1;
    this.backgroundModeChecked = userConfigData['backgroundMode'];
    this.saveConnections = 0;
    if (app && typeof lzm_deviceInterface != 'undefined' && typeof lzm_deviceInterface.keepActiveInBackgroundMode != 'undefined') {
        lzm_deviceInterface.keepActiveInBackgroundMode(this.backgroundModeChecked == 1);
    }
    this.autoAcceptChecked = false;
    this.allViewSelectEntries = {home: {pos: 0, title: 'Startpage', icon: 'img/home-white.png'},
        world: {pos: 0, title: 'Map', icon: ''},
        mychats: {pos: 0, title: 'Chats', icon: ''}, tickets: {pos: 0, title: 'Tickets', icon: ''},
        external: {pos: 0, title: 'Visitors', icon: ''}, archive: {pos: 0, title: 'Chat Archive', icon: ''},
        internal: {pos: 0, title: 'Operators', icon: ''}, qrd: {pos: 0, title: 'Resources', icon: ''},
        reports: {pos: 1, title: 'Reports', icon: ''}};

    this.showViewSelectPanel = {home: 1, world: 1, mychats: 1, tickets: 1, external: 1, archive: 1, internal: 1, qrd: 1, report: 1};
    this.viewSelectArray = [];
    this.firstVisibleView = 'home';
    this.myChatsCounter = 0;
    this.mainTableColumns = {visitor: [], visitor_custom: [], ticket: [], ticket_custom: [], archive: [], archive_custom: [], allchats: [], allchats_custom: []};
    this.availableLanguages = {'aa':'Afar','ab':'Abkhazian','af':'Afrikaans','am':'Amharic','ar':'Arabic','as':'Assamese','ay':'Aymara','az':'Azerbaijani','ba':'Bashkir',
        'be':'Byelorussian','bg':'Bulgarian','bh':'Bihari','bi':'Bislama','bn':'Bengali','bo':'Tibetan','br':'Breton','ca':'Catalan','co':'Corsican','cs':'Czech','cy':'Welsh',
        'da':'Danish','de':'German','dz':'Bhutani','el':'Greek','en':'English','en-gb':'English (Great Britain)','en-us':'English (United States)','eo':'Esperanto','es':'Spanish',
        'et':'Estonian','eu':'Basque','fa':'Persian','fi':'Finnish','fj':'Fiji','fo':'Faeroese','fr':'French','fy':'Frisian','ga':'Irish','gd':'Gaelic','gl':'Galician','gn':'Guarani',
        'gu':'Gujarati','ha':'Hausa','he':'Hebrew','hi':'Hindi','hr':'Croatian','hu':'Hungarian','hy':'Armenian','ia':'Interlingua','id':'Indonesian','ie':'Interlingue','ik':'Inupiak',
        'is':'Icelandic','it':'Italian','ja':'Japanese','ji':'Yiddish','jw':'Javanese','ka':'Georgian','kk':'Kazakh','kl':'Greenlandic','km':'Cambodian','kn':'Kannada','ko':'Korean',
        'ks':'Kashmiri','ku':'Kurdish','ky':'Kirghiz','la':'Latin','ln':'Lingala','lo':'Laothian','lt':'Lithuanian','lv':'Latvian','mg':'Malagasy','mi':'Maori','mk':'Macedonian',
        'ml':'Malayalam','mn':'Mongolian','mo':'Moldavian','mr':'Marathi','ms':'Malay','mt':'Maltese','my':'Burmese','na':'Nauru','nb':'Norwegian (Bokmal)','ne':'Nepali','nl':'Dutch',
        'nn':'Norwegian (Nynorsk)','oc':'Occitan','om':'Oromo','or':'Oriya','pa':'Punjabi','pl':'Polish','ps':'Pashto','pt':'Portuguese','pt-br':'Portuguese (Brazil)','qu':'Quechua',
        'rm':'Rhaeto-Romance','rn':'Kirundi','ro':'Romanian','ru':'Russian','rw':'Kinyarwanda','sa':'Sanskrit','sd':'Sindhi','sg':'Sangro','sh':'Serbo-Croatian','si':'Singhalese',
        'sk':'Slovak','sl':'Slovenian','sm':'Samoan','sn':'Shona','so':'Somali','sq':'Albanian','sr':'Serbian','ss':'Siswati','st':'Sesotho','su':'Sudanese','sv':'Swedish','sw':'Swahili',
        'ta':'Tamil','te':'Tegulu','tg':'Tajik','th':'Thai','ti':'Tigrinya','tk':'Turkmen','tl':'Tagalog','tn':'Setswana','to':'Tonga','tr':'Turkish','ts':'Tsonga','tt':'Tatar','tw':'Twi',
        'uk':'Ukrainian','ur':'Urdu','uz':'Uzbek','vi':'Vietnamese','vo':'Volapuk','wo':'Wolof','xh':'Xhosa','yo':'Yoruba','zh':'Chinese','zh-cn':'Chinese (Simplified)',
        'zh-tw':'Chinese (Traditional)','zu':'Zulu'};


    this.searchButtonUpSet = {};
    this.storedSuperMenu = null;
    this.StoredDialogs = {};
    this.StoredDialogIds = [];
    this.dialogData = {};

    this.visitorListIsScrolling = 0;
    this.visitorListScrollingWasBlocked = false;

    this.ticketListTickets = [];
    this.ticketControlTickets = [];
    this.archiveControlChats = [];

    this.ticket = {};
    this.showTicketContextMenu = false;
    this.showTicketMessageContextMenu = false;
    this.ticketDialogId = {};
    this.ticketResourceText = {};
    this.ticketReadArray = [];
    this.ticketUnreadArray = [];
    this.ticketGlobalValues = {t: -1, r: -1, mr: 0, updating: false};
    this.ticketFilterPersonal = 'hidden';
    this.ticketFilterGroup = 'hidden';
    this.selectedTicketRow = '';
    this.selectedTicketRowNo = 0;
    this.numberOfUnreadTickets = -1;
    this.emailReadArray = [];
    this.emailDeletedArray = [];
    this.ticketsFromEmails = [];
    this.emailsToTickets = [];
    this.numberOfRunningChats = 0;
    this.recentlyUsedResources = [];
    this.showArchiveFilterMenu = false;
    this.showArchiveListContextMenu = false;
    this.archiveFilterChecked = ['visible', 'visible', 'visible'];
    this.showReportFilterMenu = false;
    this.showReportContextMenu = false;
    this.minimizedMemberLists = [];
    this.chatTranslations = {};
    this.translatedPosts = [];
    this.translationLanguages = [];
    this.translationLangCodes = [];
    this.translationServiceError = 'No translations fetched';
    this.lastPhoneProtocol = 'callto:';
    this.doNotUpdateOpList = false;
    this.newDynGroupHash = '';
    this.showUserstatusHtml = false;
    this.showUsersettingsHtml = false;
    this.showMinifiedDialogsHtml = false;
    this.settingsDialogue = false;
    this.windowWidth = 0;
    this.windowHeight = 0;
    this.initialWindowHeight = 0;
    this.chatPanelHeight = 0;
    this.activeVisitorNumber = 0;
    this.blankButtonWidth = 0;
    this.userControlPanelHeight = 40;
    this.userControlPanelPosition = {top: 10, left: 15};
    this.userControlPanelWidth = 0;
    this.showChatActionsMenu = false;
    this.showOpInviteDialog = false;
    this.translationEditor = new ChatTranslationEditorClass();
    this.reportsDisplay = new ChatReportsClass();
    this.settingsDisplay = new ChatSettingsClass();
    this.startpageDisplay = new ChatStartpageClass();
    this.resourcesDisplay = new ChatResourcesClass();
    this.archiveDisplay = new ChatArchiveClass();
    this.visitorDisplay = new ChatVisitorClass();
    this.ticketDisplay = new ChatTicketClass();
    this.allchatsDisplay = new ChatAllchatsClass();

    this.LinkGenerator = null;
    this.ServerConfigurationClass = null;
    this.EventConfiguration = null;
    this.FilterConfiguration = null;
    this.ChatForwardInvite = null;
    this.FeedbacksViewer = null;

    this.hiddenChats = [];
    this.validationErrorCount = 0;
    this.alertDialogIsVisible = false;
    this.blinkingIconsInterval = false;
    this.blinkingIconsArray = [];
    this.blinkingIconsStatus = 0;
    this.lastBlinkingTime = 0;

    this.memberListWidth = 150;

    this.now = now;
    this.lzm_commonConfig = lzm_commonConfig;
    this.lzm_commonTools = lzm_commonTools;
    this.lzm_chatInputEditor = lzm_chatInputEditor;

    this.lzm_chatTimeStamp = {};
    this.isApp = app;
    this.isWeb = web;
    this.isMobile = mobile;
    this.messageTemplates = messageTemplates;
    this.multiServerId = multiServerId;

    this.chatPanelLineHeight = 23;
    this.activeChatPanelHeight = this.chatPanelLineHeight;
    this.dialogWindowWidth = 0;
    this.dialogWindowHeight = 0;
    this.FullscreenDialogWindowWidth = 0;
    this.FullscreenDialogWindowHeight = 0;
    this.dialogWindowLeft = 0;
    this.dialogWindowTop = 0;
    this.FullscreenDialogWindowLeft = 0;
    this.FullscreenDialogWindowTop = 0;
    this.dialogWindowContainerCss = {};
    this.dialogWindowCss = {};
    this.dialogWindowHeadlineCss = {};
    this.dialogWindowBodyCss = {};
    this.dialogWindowFootlineCss = {};
    this.FullscreenDialogWindowCss = {};
    this.FullscreenDialogWindowHeadlineCss = {};
    this.FullscreenDialogWindowBodyCss = {};
    this.FullscreenDialogWindowFootlineCss = {};

    this.DialogBorderRatioFull = 0.95;
    this.DialogBorderRatioHalf = 0.65;
    this.DialogBorderRatioInput = 0.35;

    this.openChats = [];

    this.browserName = 'other';
    if ($.browser.chrome)
        this.browserName = 'chrome';
    else if ($.browser.mozilla)
        this.browserName = 'mozilla';
    else if ($.browser.msie)
        this.browserName = 'ie';
    else if ($.browser.safari)
        this.browserName = 'safari';
    else if ($.browser.opera)
        this.browserName = 'opera';
    if ($.browser.version.indexOf('.') != -1) {
        this.browserVersion = $.browser.version.split('.')[0];
        this.browserMinorVersion = $.browser.version.split('.')[1];
    } else {
        this.browserVersion = $.browser.version;
        this.browserMinorVersion = 0;
    }

    if (this.browserName == 'mozilla' && this.browserVersion == 11)
        this.browserName = 'ie';

    this.startBlinkingIcons();

    lzm_displayHelper.browserName = this.browserName;
    lzm_displayHelper.browserVersion = this.browserVersion;
    lzm_displayHelper.browserMinorVersion = this.browserMinorVersion;
}

ChatDisplayClass.prototype.resetWebApp = function() {
    this.validationErrorCount = 0;
    this.blinkingIconsArray = [];
    this.blinkingIconsStatus = 1;//0;
    this.stopRinging([]);
};

ChatDisplayClass.prototype.getActiveChatRealname = function(){
    if(this.active_chat_reco)
    {
        var obj = lzm_chatServerEvaluation.visitors.getVisitor(this.active_chat_reco.split('~')[0]);
        if(obj!=null)
            return lzm_chatServerEvaluation.visitors.getVisitorName(obj);
        else
        {
            obj = lzm_chatServerEvaluation.operators.getOperator(this.active_chat_reco);
            if(obj != null)
                return obj.name;
        }
    }
    return '';
};

ChatDisplayClass.prototype.startBlinkingIcons = function() {
    var that = this;
    if (that.blinkingIconsInterval)
        clearInterval(that.blinkingIconsInterval);
};

ChatDisplayClass.prototype.setBlinkingIconsArray = function(blinkingIconsArray) {
    this.createChatHtml(this.thisUser);
    this.blinkingIconsArray = blinkingIconsArray;
    this.blinkIcons();
};

ChatDisplayClass.prototype.blinkIcons = function() {

    function updateButtonTyping(bId,isTyping){
        var typingClass = 'lzm-tabs-typing';
        if(isTyping)
            $(bId).addClass(typingClass);
        else
            $(bId).removeClass(typingClass);
    }

    this.lastBlinkingTime = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
    var userChat, group, operator, chatIsNew = false, buttonId;
    var messageClass = 'lzm-tabs-message', typingIndicator = false;
    var isMessage = false, isTyping = false;
    var logo = '';
    for (var i=0; i<this.blinkingIconsArray.length; i++) {
        try {
            isMessage = false;
            isTyping = false;
            userChat = lzm_chatServerEvaluation.userChats.getUserChat(this.blinkingIconsArray[i]);
            chatIsNew = (userChat != null && (userChat.status == 'new' || (typeof userChat.fupr != 'undefined' && (typeof userChat.fuprDone == 'undefined' || userChat.fuprDone != userChat.fupr.id))));
            if (this.blinkingIconsStatus == 1 && (userChat.b_id == '' || userChat.my_chat)) {
                if (userChat.member_status != 2)
                {
                    if (!chatIsNew) {
                        isTyping = true;
                        typingIndicator = (this.active_chat_reco == userChat.id || this.active_chat_reco == userChat.id + '~' + userChat.b_id);
                    } else
                        isMessage = true;

                } else
                {
                    logo = 'img/lz_hidden.png';
                    isMessage = false;
                }
            }
            else
            {
                group = lzm_chatServerEvaluation.groups.getGroup(this.blinkingIconsArray[i]);
                operator = lzm_chatServerEvaluation.operators.getOperator(this.blinkingIconsArray[i]);
                if (this.blinkingIconsArray[i] == 'everyoneintern' || (group != null && typeof group.members == 'undefined')) {
                    logo = '';
                    isMessage = false;
                } else if (group != null && typeof group.members != 'undefined' && group.is_active && (userChat == null || userChat.status != 'left')) {
                    logo = '';
                    isMessage = false;
                } else if (group != null && typeof group.members != 'undefined' && !group.is_active) {
                    logo = '';
                    isMessage = false;
                } else if (operator != null) {
                    logo = operator.status_logo;
                    isMessage = false;

                } else {
                    if (userChat != null && !userChat.group_chat) {
                        if ((userChat.status == 'read' || userChat.status == 'new') && (userChat.b_id == '' || userChat.my_chat)) {
                            if (userChat.member_status != 2) {
                                logo = 'img/lz_online.png?1';
                                isMessage = false;
                            }
                            else
                            {
                                logo = 'img/lz_hidden.png';
                                isMessage = false;
                            }
                        } else {
                            logo = 'img/lz_offline.png';
                            isMessage = false;
                        }
                    }
                }
            }
            buttonId = '#chat-button-' + this.blinkingIconsArray[i].replace(/~/,'_');
            if(logo != '')
                $(buttonId).children('span').css({'background-image': "url('" + logo + "')", 'background-size': '14px 14px'});

            if(isMessage)
                $(buttonId).addClass(messageClass);
            else
                $(buttonId).removeClass(messageClass);

            updateButtonTyping(buttonId,isTyping);

        } catch(ex) {}
    }
    var userChats = lzm_chatServerEvaluation.userChats.getUserChatList();
    for (var key in userChats) {
        try
        {
            isMessage = false;
            isTyping = false;
            if(userChats.hasOwnProperty(key)) {
                group = lzm_chatServerEvaluation.groups.getGroup(key);
                userChat = lzm_chatServerEvaluation.userChats.getUserChat(key);
                logo = '';
                operator = lzm_chatServerEvaluation.operators.getOperator(key);
                if ($.inArray(key, this.blinkingIconsArray) == -1) {
                    chatIsNew = (userChat['status'] == 'new' ||
                    (typeof userChat.fupr != 'undefined' &&
                    (typeof userChat.fuprDone == 'undefined' ||
                        userChat.fuprDone != userChat.fupr.id)));
                    if (chatIsNew && this.blinkingIconsStatus == 1 && (userChat.b_id == '' || userChat.my_chat)) {
                        if (userChat.member_status != 2) {
                            isMessage = true;
                        } else
                        {
                            logo = 'img/lz_hidden.png';
                            isMessage = false;
                        }
                    } else {
                        if (key == 'everyoneintern' || (group != null && typeof group.members == 'undefined')) {
                            logo = '';
                            isMessage = false;
                        } else if (group != null && typeof group.members != 'undefined' && group.is_active && (userChat == null || userChat.status != 'left')) {
                            logo = '';
                            isMessage = false;
                        } else if (operator != null) {
                            logo = operator.status_logo;
                            isMessage = false;
                        } else {
                            if (typeof userChat != 'undefined' && !userChat.group_chat) {

                                if ((userChat.status == 'read' || userChat.status == 'new') && (userChat.b_id == '' || userChat.my_chat)) {
                                    if (userChat.member_status != 2) {
                                        logo = 'img/lz_online.png?3';
                                        isMessage = false;
                                    }
                                    else
                                    {
                                        logo = 'img/lz_hidden.png';
                                        isMessage = false;
                                    }
                                } else {
                                    logo = 'img/lz_offline.png?';
                                    isMessage = false;
                                }
                            }
                        }
                    }
                    buttonId = '#chat-button-' + key.replace(/~/,'_');
                    if ($(buttonId).length != 0) {
                        var existingLogo = $(buttonId).children('span').css('background-image').replace(/url\((.*?)\)/, '$1').split('/');
                        existingLogo = 'img/' + existingLogo[existingLogo.length - 1];
                        if (logo != existingLogo && logo != '')
                            $(buttonId).children('span').css({'background-image': "url('" + logo + "')", 'background-size': '14px 14px'});


                        if(isMessage)
                            $(buttonId).addClass(messageClass);
                        else
                            $(buttonId).removeClass(messageClass);

                        updateButtonTyping(buttonId,isTyping);
                    }
                }
            }
        } catch(ex) {deblog(ex);}
    }
    this.blinkingIconsStatus = 1;
};

ChatDisplayClass.prototype.createChatWindowLayout = function (recreate, createChatPanel, ratio) {
    createChatPanel = (typeof createChatPanel != 'undefined') ? createChatPanel :  true;
    ratio = (typeof ratio != 'undefined') ? ratio :  this.DialogBorderRatioFull;

    var windowHeight = $(window).height();
    if (windowHeight >= this.initialWindowHeight) {
        this.initialWindowHeight = windowHeight;
    }
    var chatPageHeight = windowHeight;
    if (this.isApp && windowHeight < 390) {
        chatPageHeight = Math.min(390, this.initialWindowHeight);
    }

    if (recreate || lzm_displayLayout.windowWidth != this.windowWidth || windowHeight != this.windowHeight ||
        this.activeChatPanelHeight < (this.chatPanelHeight - 5) ||
        this.activeChatPanelHeight > (this.chatPanelHeight + 5)) {
        this.chatPanelHeight = this.activeChatPanelHeight;

        var userControlPanelPosition = this.userControlPanelPosition;
        var userControlPanelHeight = this.userControlPanelHeight;
        this.userControlPanelWidth = lzm_displayLayout.windowWidth - 32;
        var userControlPanelWidth = this.userControlPanelWidth;
        var viewSelectPanelHeight = 31;
        var chatWindowWidth = userControlPanelWidth - 5;
        var chatWindowHeight = chatPageHeight - (userControlPanelPosition.top + userControlPanelHeight) - 20 - viewSelectPanelHeight;
        var chatWindowTop = userControlPanelPosition.top + userControlPanelHeight + 13 + viewSelectPanelHeight;

        if((lzm_displayLayout.windowWidth <= 1000 || windowHeight <= 600) && ratio == this.DialogBorderRatioInput)
            ratio = this.DialogBorderRatioHalf;

        this.FullscreenDialogWindowWidth = (lzm_displayLayout.windowWidth <= 600 || windowHeight <= 500) ? lzm_displayLayout.windowWidth : Math.floor(ratio * lzm_displayLayout.windowWidth) - 40;
        this.FullscreenDialogWindowHeight = (lzm_displayLayout.windowWidth <= 600 || windowHeight <= 500) ? windowHeight : Math.floor(ratio * windowHeight) - 40;

        if (this.FullscreenDialogWindowWidth <= 600 || this.FullscreenDialogWindowHeight <= 500) {
            this.dialogWindowWidth = this.FullscreenDialogWindowWidth;
            this.dialogWindowHeight = this.FullscreenDialogWindowHeight;
        } else {
            this.dialogWindowWidth = 600;
            this.dialogWindowHeight = 500;
        }

        this.dialogWindowLeft = (this.dialogWindowWidth < lzm_displayLayout.windowWidth) ? Math.floor((lzm_displayLayout.windowWidth - this.dialogWindowWidth) / 2) : 0;
        this.FullscreenDialogWindowLeft = (this.FullscreenDialogWindowWidth < lzm_displayLayout.windowWidth) ? Math.floor((lzm_displayLayout.windowWidth - this.FullscreenDialogWindowWidth) / 2) : 0;
        this.dialogWindowTop = (this.dialogWindowHeight < windowHeight) ? Math.floor((windowHeight - this.dialogWindowHeight) / 2) : 0;
        this.FullscreenDialogWindowTop = (this.FullscreenDialogWindowHeight < windowHeight) ? Math.floor((windowHeight - this.FullscreenDialogWindowHeight) / 2) : 0;

        var thisChatPageCss;

        this.dialogWindowContainerCss = {
            position: 'absolute', left: '0px', bottom: '0px', width: lzm_displayLayout.windowWidth+'px', height: windowHeight+'px',
            'background-color': 'rgba(0,0,0,0.75)', 'background-image': 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.02) 35px, rgba(255,255,255,.02) 70px)', 'z-index': '1001', overflow: 'hidden'
        };
        this.dialogWindowCss = {
            position: 'absolute', left: this.dialogWindowLeft+'px', bottom: this.dialogWindowTop+'px',
            width: this.dialogWindowWidth+'px', height: this.dialogWindowHeight+'px',
            'z-index': '1002'
        };
        this.dialogWindowHeadlineCss = {
            position: 'absolute', left: '0px', top: '0px',
            width: (this.dialogWindowWidth - 5)+'px', height: '20px'};
        this.dialogWindowBodyCss = {
            position: 'absolute', left: '0px', top: '27px',
            width: '100%'/*(this.dialogWindowWidth - 10)+'px'*/, height: (this.dialogWindowHeight - 65)+'px',
            padding: '0', 'text-shadow': 'none',
            'background-color': '#FFFFFF', 'overflow-y': 'auto', 'overflow-x': 'hidden'
        };
        this.dialogWindowFootlineCss = {
            position: 'absolute', left: '0px', top: (this.dialogWindowHeight - 38)+'px', 'border-top': '1px solid #ccc',
            width: (this.dialogWindowWidth - 6)+'px', height: '27px', 'text-align': 'right',
            padding: '10px 6px 0px 0px', 'background-color': '#f5f5f5'
        };

        this.FullscreenDialogWindowCss = {
            position: 'absolute', left: this.FullscreenDialogWindowLeft+'px', bottom: this.FullscreenDialogWindowTop+'px',
            width: this.FullscreenDialogWindowWidth+'px', height: this.FullscreenDialogWindowHeight+'px',
            'z-index': '1002'
        };
        this.FullscreenDialogWindowHeadlineCss = {
            position: 'absolute', left: '0px', top: '0px',
            width: (this.FullscreenDialogWindowWidth - 5)+'px', height: '20px'};
        this.FullscreenDialogWindowBodyCss = {
            position: 'absolute', left: '0px', top: '27px',
            width: '100%', height: (this.FullscreenDialogWindowHeight - 65)+'px',
            padding: '0',
            'background-color': '#FFFFFF', 'overflow-y': 'auto', 'overflow-x': 'hidden'
        };
        this.FullscreenDialogWindowFootlineCss = {
            position: 'absolute', left: '0px', top: (this.FullscreenDialogWindowHeight - 38)+'px', 'border-top': '1px solid #ccc',
            width: (this.FullscreenDialogWindowWidth - 6)+'px', height: '27px', 'text-align': 'right',
            padding: '10px 6px 0px 0px', 'background-color': '#f5f5f5'
        };


        $('.dialog-window-container').css(this.dialogWindowContainerCss);
        $('.dialog-window').css(this.dialogWindowCss);
        $('.dialog-window-headline').css(this.dialogWindowHeadlineCss);
        $('.dialog-window-body').css(this.dialogWindowBodyCss);
        $('.dialog-window-footline').css(this.dialogWindowFootlineCss);
        $('.dialog-window-fullscreen').css(this.FullscreenDialogWindowCss);
        $('.dialog-window-headline-fullscreen').css(this.FullscreenDialogWindowHeadlineCss);
        $('.dialog-window-body-fullscreen').css(this.FullscreenDialogWindowBodyCss);
        $('.dialog-window-footline-fullscreen').css(this.FullscreenDialogWindowFootlineCss);

        $('#debugging-messages').css({
            position: 'absolute',
            top: Math.floor(0.3 * $(window).height())+'px',
            left: Math.floor(0.3 * lzm_displayLayout.windowWidth)+'px',
            width: Math.floor(0.4 * lzm_displayLayout.windowWidth)+'px',
            height: Math.floor(0.4 * $(window).height())+'px',
            padding: '10px',
            'background-color': '#ffffc6',
            opacity: '0.9',
            display: this.debuggingDisplayMode,
            'z-index': 1000
        });

        this.windowWidth = lzm_displayLayout.windowWidth;
        this.windowHeight = windowHeight;
    }

    lzm_displayLayout.resizeAll();

    this.toggleVisibility('resize');
    if (this.selected_view == 'home' && this.startPageExists) {
        this.startpageDisplay.createStartPage(false, [], []);
    } else if (this.selected_view == 'mychats' && createChatPanel) {
        this.createActiveChatPanel(false, false, false);
    }
};

ChatDisplayClass.prototype.toggleVisibility = function (foo) {
    var that = this;
    var setCssDisplay = function(elt, displayMode) {
        if (typeof elt != 'undefined' && elt.length > 0 && elt.css('display') != displayMode) {
            elt.css({display: displayMode});
        }
    };
    var removeVisitorList = function() {
        if ($('#visitor-list-table').length > 0) {
            $('#visitor-list-table').remove();
        }
        that.VisitorListCreated = false;
    };
    var thisOperatorList = $('#operator-list');
    var thisTicketList = $('#ticket-list');
    var thisArchive = $('#archive');
    var thisStartPage = $('#startpage');
    var thisGeoTracking = $('#geotracking');
    var thisChat = $('#chat');
    var thisChatContainer = $('#chat-container');
    var thisErrors = $('#errors');
    var thisChatTable = $('#chat-table');
    var thisActiveChatPanel = $('#active-chat-panel');
    var thisVisitorList = $('#visitor-list');
    var thisQrdTree = $('#qrd-tree');
    var thisFilter = $('#filter');
    var thisAllChats = $('#all-chats');
    var thisReportList = $('#report-list');

    setCssDisplay(thisStartPage, 'none');
    setCssDisplay(thisGeoTracking, 'none');
    setCssDisplay(thisOperatorList, 'none');
    setCssDisplay(thisTicketList, 'none');
    setCssDisplay(thisArchive, 'none');
    setCssDisplay(thisErrors, 'none');
    setCssDisplay(thisVisitorList, 'none');
    setCssDisplay(thisQrdTree, 'none');
    setCssDisplay(thisFilter, 'none');
    setCssDisplay(thisReportList, 'none');
    if (that.selected_view != 'mychats') {
        setCssDisplay($('#chat-progress'), 'none');
        setCssDisplay($('#chat-qrd-preview'), 'none');
        setCssDisplay($('#chat-action'), 'none');
        setCssDisplay($('#chat-buttons'), 'none');
        setCssDisplay(thisChatContainer, 'none');
        setCssDisplay(thisChatTable, 'none');
        setCssDisplay(thisActiveChatPanel, 'none');
        setCssDisplay(thisChat, 'block');
        setCssDisplay(thisAllChats, 'none');
    }
    switch (this.selected_view) {
        case 'mychats':
            setCssDisplay(thisChat, 'block');
            setCssDisplay(thisChatContainer, 'block');
            setCssDisplay(thisChatTable, 'block');
            setCssDisplay(thisAllChats, 'none');
            setCssDisplay($('#chat-progress'), 'block');
            if (typeof this.thisUser.id != 'undefined' && this.thisUser.id != '') {
                setCssDisplay($('#chat-qrd-preview'), 'block');
                setCssDisplay($('#chat-action'), 'block');
                setCssDisplay($('#chat-buttons'), 'block');
            } else {
                setCssDisplay($('#chat-qrd-preview'), 'none');
                setCssDisplay($('#chat-action'), 'none');
                setCssDisplay($('#chat-buttons'), 'none');
            }
            removeVisitorList();
            setCssDisplay(thisActiveChatPanel, 'block');
            break;
        case 'internal':
            setCssDisplay(thisOperatorList, 'block');
            removeVisitorList();
            break;
        case 'external':
            setCssDisplay(thisVisitorList, 'block');
            break;
        case 'qrd':
            removeVisitorList();
            setCssDisplay(thisQrdTree, 'block');
            break;
        case 'tickets':
            removeVisitorList();
            setCssDisplay(thisTicketList, 'block');
            break;
        case 'archive':
            setCssDisplay(thisArchive, 'block');
            removeVisitorList();
            break;
        case 'home':
            setCssDisplay(thisStartPage, 'block');
            removeVisitorList();
            break;
        case 'world':
            setCssDisplay(thisGeoTracking, 'block');
            removeVisitorList();
            break;
        case 'reports':
            setCssDisplay(thisReportList, 'block');
            removeVisitorList();
            break;
    }
};

ChatDisplayClass.prototype.logoutOnValidationError = function (validationError, isWeb, isApp) {
    var loginPage, decodedMultiServerId, that = this,  alertString = '';
    if (this.validationErrorCount == 0 && $.inArray(validationError, ['3', '101']) == -1) {
        tryNewLogin(false);
        this.validationErrorCount++;
    } else if (validationError == '3') {
        if (!this.alertDialogIsVisible) {
            alertString = t('You\'ve been logged off by another operator!');
            lzm_commonDialog.createAlertDialog(alertString, [{id: 'ok', name: t('Ok')}]);
            this.alertDialogIsVisible = true;
            $('#alert-btn-ok').click(function() {
                lzm_commonDialog.removeAlertDialog();
                that.stopRinging([]);
                that.askBeforeUnload = false;
                if (!isApp) {
                    loginPage = 'index.php?LOGOUT';
                    if (multiServerId != '') {
                        decodedMultiServerId = lz_global_base64_url_decode(multiServerId);
                        loginPage += '#' + decodedMultiServerId;
                    }
                    window.location.href = loginPage;
                } else {
                    try {
                        lzm_deviceInterface.openLoginView();
                    } catch(ex) {
                        deblog('Opening the login view failed.');
                    }
                }
                that.validationErrorCount++;
                that.alertDialogIsVisible = false;
            });
        }
    } else if (validationError == '101') {
        if (!this.alertDialogIsVisible) {
            var alertString1 = tid(lz_global_base64_decode('b3BlcmF0b3JfbGltaXQx'));
            var alertString2 = tid(lz_global_base64_decode('b3BlcmF0b3JfbGltaXQy'));
            var alertString3 = tid(lz_global_base64_decode('b3BlcmF0b3JfbGltaXQz'));
            var alertString4 = tid(lz_global_base64_decode('b3BlcmF0b3JfbGltaXQ0'));
            alertString = t('<!--limit1--> <!--limit2--> <!--limit3--> <!--limit4-->',[['<!--limit1-->', alertString1], ['<!--limit2-->', alertString2], ['<!--limit3-->', alertString3], ['<!--limit4-->', alertString4]]);
            lzm_commonDialog.createAlertDialog(alertString, [{id: 'ok', name: t('Ok')},{id: 'bx', name: tid(lz_global_base64_decode('YnV5X2xpY2Vuc2U='))}]);
            this.alertDialogIsVisible = true;
            $('#alert-btn-ok').click(function() {
                that.stopRinging([]);
                that.askBeforeUnload = false;
                if (!isApp) {
                    loginPage = 'index.php?LOGOUT';
                    if (multiServerId != '') {
                        decodedMultiServerId = lz_global_base64_url_decode(multiServerId);
                        loginPage += '#' + decodedMultiServerId;
                    }
                    window.location.href = loginPage;
                } else {
                    try {
                        lzm_deviceInterface.openLoginView();
                    } catch(ex) {
                        deblog('Opening the login view failed.');
                    }
                }
                that.validationErrorCount++;
                that.alertDialogIsVisible = false;
            });
            $('#alert-btn-bx').click(function() {
                openLink(lz_global_base64_decode('aHR0cHM6Ly93d3cubGl2ZXppbGxhLm5ldC9zaG9wLw=='));
            });
        }
    } else if (this.validationErrorCount == 1) {
        this.askBeforeUnload = false;
        var noLogout = false;
        if (!this.alertDialogIsVisible) {
            switch (validationError) {
                case '0':
                    alertString = t('Wrong username or password.');
                    break;
                case '2':
                    alertString = t('The operator <!--op_login_name--> is already logged in.',[['<!--op_login_name-->', this.myLoginId]]);
                    break;
                case '3':
                    alertString = t('You\'ve been logged off by another operator!');
                    break;
                case "4":
                    alertString = t('Session timed out.');
                    break;
                case "5":
                    alertString = t('Your password has expired. Please enter a new password.');
                    break;
                case "9":
                    alertString = t('You are not an administrator.');
                    break;
                case "10":
                    alertString = tid('server_deactivated') + '\n' +
                        tid('server_deactivated_undo');
                    break;
                case "13":
                    alertString = t('There are problems with the database connection.');
                    break;
                case "14":
                    alertString = t('This server requires secure connection (SSL). Please activate HTTPS in the server profile and try again.');
                    break;
                case "15":
                    alertString = t('Your account has been deactivated by an administrator.');
                    break;
                case "19":
                    alertString = t('No mobile access permitted.');
                    break;
                default:
                    alertString = 'Validation Error : ' + validationError;
                    break;
            }
            lzm_commonDialog.createAlertDialog(alertString.replace(/\n/g, '<br />'), [{id: 'ok', name: t('Ok')}]);
            this.alertDialogIsVisible = true;
            $('#alert-btn-ok').click(function() {
                if (!noLogout) {
                    that.stopRinging([]);
                    that.askBeforeUnload = false;
                    if (!isApp) {
                        loginPage = 'index.php?LOGOUT';
                        if (multiServerId != '') {
                            decodedMultiServerId = lz_global_base64_url_decode(multiServerId);
                            loginPage += '#' + decodedMultiServerId;
                        }
                        window.location.href = loginPage;
                    } else {
                        try {
                            lzm_deviceInterface.openLoginView();
                        } catch(ex) {
                            deblog('Opening the login view failed.');
                        }
                    }
                } else {
                    that.validationErrorCount = 0;
                }
                that.validationErrorCount++;
                that.alertDialogIsVisible = false;
            });
        }
    }
};

ChatDisplayClass.prototype.createGeoTracking = function() {
    $('#geotracking-headline').html('<h3>' + t('Geotracking') + '</h3>');
    if ($('#geotracking-iframe').length == 0) {
        $('#geotracking-body').html('<iframe id="geotracking-iframe" src=""></iframe>');
        $('#geotracking-body').data('src', '');
        $('#geotracking-footline').html(lzm_displayHelper.createGeotrackingFootline());
    }
};

ChatDisplayClass.prototype.createErrorHtml = function (global_errors) {
    var errorHtmlString = '';
    for (var errorIndex = 0; errorIndex < global_errors.length; errorIndex++) {
        errorHtmlString += '<p>' + global_errors[errorIndex] + '</p>';
        try {
            deblog(global_errors[errorIndex]);
        } catch(e) {}
    }
    $('#errors').html(errorHtmlString);
};

ChatDisplayClass.prototype.createOperatorList = function () {

    var that=this,onlineOnly = lzm_commonStorage.loadValue('op_list_onlonl_' + lzm_chatServerEvaluation.myId)=='1',showElements = lzm_commonStorage.loadValue('op_list_elements_' + lzm_chatServerEvaluation.myId)=='1';

    this.m_OperatorsListLineCounter = 0;
    if (!this.doNotUpdateOpList) {
        var operators = null, selectedLine = '';
         var internalChatsAreDisabled = (this.myGroups.length > 0);
        for (i=0; i<this.myGroups.length; i++) {
            var myGr = lzm_chatServerEvaluation.groups.getGroup(this.myGroups[i]);
            if (myGr != null && (typeof myGr.internal == 'undefined' || myGr.internal == '1'))
                internalChatsAreDisabled = false;
        }

        var intUserHtmlString = '<div class="lzm-dialog-headline2" style="top:0;"><span style="float:right;"><table class="tight vtight"><tr>' +
            '<td>' +  lzm_inputControls.createCheckbox('operator-list-display',tid('by_groups'),!showElements) + '</td>' +
            '<td>' +  lzm_inputControls.createCheckbox('operator-list-offline',tid('show_offline'),!onlineOnly) +'</td>' +
            '<td style="padding-top:5px !important;">' + lzm_inputControls.createButton('create-dynamic-group', '', 'createDynamicGroup()', tid('dyn_group'), '<i class="fa fa-plus"></i>', 'lr',{},tid('dyn_group_create'),30,'b') + '</td>' +
            '</tr></table></span></div><div id="operator-list-body"><table id="operator-list-table">';


        intUserHtmlString += this.createOperatorListLine('group',{id:'everyoneintern',name:t('All operators')},showElements);
        this.m_OperatorsListLineCounter++;

        var groups = lzm_chatServerEvaluation.groups.getGroupList('name', false, true);

        for (var i=0; i<groups.length; i++) {
            operators = lzm_chatServerEvaluation.operators.getOperatorList('name', groups[i].id, true);
            var showThisGroup = !internalChatsAreDisabled;
            if ($.inArray(groups[i].id, this.myGroups) != -1)
                showThisGroup = true;

            if (showThisGroup &&  (operators.length > 0 || (d(groups[i].o) && groups[i].o == this.myId))) {

                intUserHtmlString += this.createOperatorListLine('group',groups[i],showElements);
                this.m_OperatorsListLineCounter++;

                if(!showElements)
                {
                    if (d(groups[i].members)) {
                        for (var k=0; k<groups[i].members.length; k++)
                            if (groups[i].members[k].i.indexOf('~') != -1) {
                                var visitorId = groups[i].members[k].i.split('~')[0];
                                var visitor = lzm_chatServerEvaluation.visitors.getVisitor(visitorId);
                                if (visitor != null && d(visitor.b))
                                {
                                    intUserHtmlString += this.createOperatorListLine('visitor',{uid:groups[i].members[k].i.replace('~','-'),id:groups[i].id,name:lzm_chatServerEvaluation.visitors.getVisitorName(visitor)},showElements);
                                    this.m_OperatorsListLineCounter++;
                                }
                            }
                    }
                    intUserHtmlString += this.createUsersList(groups[i],operators,internalChatsAreDisabled,onlineOnly,this.m_OperatorsListSelectedLine);
                }
            }
        }

        if(showElements){
            intUserHtmlString += '<tr><td colspan="5"></td></tr>';
            operators = lzm_chatServerEvaluation.operators.getOperatorList('name', '', true);
            intUserHtmlString += this.createUsersList({id:''},operators,internalChatsAreDisabled,onlineOnly,this.m_OperatorsListSelectedLine);
        }
        intUserHtmlString += '</table></div>';
        $('#operator-list').html(intUserHtmlString);
        lzm_displayLayout.resizeOperatorList();

        $('#operator-list-display').change(function(){
            lzm_commonStorage.saveValue('op_list_elements_' + lzm_chatServerEvaluation.myId,$('#operator-list-display').prop('checked')?'0':'1');
            that.createOperatorList();
        });
        $('#operator-list-offline').change(function(){
            lzm_commonStorage.saveValue('op_list_onlonl_' + lzm_chatServerEvaluation.myId,$('#operator-list-offline').prop('checked')?'0':'1');
            that.createOperatorList();
        });
    }
};

ChatDisplayClass.prototype.createOperatorListLine = function(type,obj,showElements) {
    var onclickAction='',oncontextmenuAction,selectedLine='',gtitle,ginfo,lineId='',gticon,gbg;
    if(type == 'group')
    {
        lineId = 'operator-list-line-'+obj.id + '_' + this.m_OperatorsListLineCounter;
        onclickAction = (this.isApp || this.isMobile) ? ' onclick="openOperatorListContextMenu(event, \'group\', \'' + obj.id + '\',\'' + lineId + '\', \'\', \'' + this.m_OperatorsListLineCounter + '\');"' : ' onclick="selectOperatorLine(\'' + lineId + '\', \'' + this.m_OperatorsListLineCounter + '\',\'' + obj.id + '\',\'' + obj.id + '\',\'' + lz_global_base64_url_encode(obj.name) + '\', true);"';
        oncontextmenuAction = (!this.isApp && !this.isMobile) ? ' oncontextmenu="openOperatorListContextMenu(event, \'group\', \'' + obj.id + '\',\'' + lineId + '\', \'everyoneintern\', \'' + this.m_OperatorsListLineCounter + '\');"' : '';
        selectedLine = (parseInt(this.m_OperatorsListSelectedLine)==parseInt(this.m_OperatorsListLineCounter)) ? ' selected-table-line' : '';
        gtitle = obj.name;
        ginfo = (!d(obj.i) || $('#operator-list').width() < 500) ? '' : '<span>' + tid('dyn_group') + '</span>';
        gticon = (d(obj.i)) ? '<i class="fa fa-comments-o icon-light icon-large"></i>' : '';
        gbg = (d(obj.i)) ? ' operator-list-dynamic' : '';
        return '<tr id="'+lineId+'" class="operator-list-line'+selectedLine+gbg+'" ' + onclickAction + oncontextmenuAction + '><th class="lzm-unselectable" colspan="3"><span>' + gtitle + '</span></th><th>'+ginfo+'</th><th>'+gticon+'</i></th></tr>';

    }
    else if(type == 'visitor')
    {
        lineId = 'operator-list-line-'+obj.uid + '_ex_' + this.m_OperatorsListLineCounter;
        onclickAction = (this.isApp || this.isMobile) ? ' onclick="openOperatorListContextMenu(event, \'visitor\', \'' + obj.uid + '\',\'' + lineId + '\', \'' + obj.id + '\', \'' + this.m_OperatorsListLineCounter + '\');"' : ' onclick="selectOperatorLine(\'' + lineId + '\', \'' + this.m_OperatorsListLineCounter + '\',\'' + obj.id + '\',\'' + obj.id + '\',\'' + lz_global_base64_url_encode(obj.name) + '\', true);"';
        oncontextmenuAction = (!this.isApp && !this.isMobile) ? ' oncontextmenu="openOperatorListContextMenu(event, \'visitor\', \'' + obj.uid + '\',\'' + lineId + '\', \'' + obj.id + '\', \'' + this.m_OperatorsListLineCounter + '\');"' : '';
        selectedLine = (parseInt(this.m_OperatorsListSelectedLine)==parseInt(this.m_OperatorsListLineCounter)) ? ' selected-table-line' : '';
        return '<tr id="' + lineId + '" class="operator-list-line'+selectedLine+'" ' + onclickAction + oncontextmenuAction + '><td class="lzm-unselectable userlist" style=""><i class="fa fa-user icon-light icon-large" style="padding-right:3px;"></i></td><td><div class="avatar-box avatar-box-small avatar-box-blue" style="background-image: url(\'./../picture.php\')"></div></td><td colspan="3"><i>' + obj.name + '</i></td></tr>';
    }
};

ChatDisplayClass.prototype.createUsersList = function (group,operators,internalChatsAreDisabled,onlineOnly,selectedLine,tableId,clickFunc,contFunc,dbcFunc) {
    clickFunc = (d(clickFunc)) ? clickFunc : 'selectOperatorLine';
    contFunc = (d(contFunc)) ? contFunc : 'openOperatorListContextMenu';
    dbcFunc = (d(dbcFunc)) ? dbcFunc : 'chatInternalWith';
    tableId = (d(tableId)) ? tableId : '';
    var onclickAction = '', ondblclickAction = '', ccount, oncontextmenuAction = '', i = 0,intUserHtmlString = '',selectedLine='',lineId ='';
    for (var j=0; j<operators.length; j++)
        if(!onlineOnly || operators[j].status!=2)
            if (!internalChatsAreDisabled || operators[j].id == this.myId) {
                var operatorLogo = operators[j].logo;
                var avcol = (operators[j].status==2) ? '-gray' : (operators[j].status==0) ? '-green' : '-orange';
                if (operators[j].status != 2 && $.inArray(group.id, operators[j].groupsAway) != -1) {
                    operatorLogo = 'img/lz_away.png';
                    avcol = '-orange';
                }

                if(operators[j].isbot)
                    avcol = '-purple';

                lineId = 'operator-'+ tableId +'list-line-'+operators[j].id + '_' + this.m_OperatorsListLineCounter;
                onclickAction = (this.isApp || this.isMobile) ? ' onclick="'+contFunc+'(event, \'operator\', \'' + operators[j].id + '\',\'' + lineId + '\', \'' + group.id + '\', \'' + this.m_OperatorsListLineCounter + '\');"' : ' onclick="'+clickFunc+'(\'' + lineId + '\', \'' + this.m_OperatorsListLineCounter + '\',\'' + operators[j].id + '\',\'' + operators[j].userid + '\',\'' + lz_global_base64_url_encode(operators[j].name) + '\', true);"';
                ondblclickAction = (!this.isApp && !this.isMobile && !internalChatsAreDisabled) ? ' ondblclick="'+dbcFunc+'(\'' + operators[j].id + '\',\'' + operators[j].userid + '\',\'' + operators[j].name + '\', true);"' : '';
                oncontextmenuAction = (!this.isApp && !this.isMobile && contFunc.length) ? ' oncontextmenu="'+contFunc+'(event, \'operator\', \'' + operators[j].id + '\',\'' + lineId + '\', \'' + group.id + '\', \'' + this.m_OperatorsListLineCounter + '\');"' : '';
                selectedLine = (parseInt(selectedLine)==parseInt(this.m_OperatorsListLineCounter)) ? ' selected-table-line' : '';

                intUserHtmlString += '<tr id="operator-'+ tableId +'list-line-' + operators[j].id + '_' + this.m_OperatorsListLineCounter + '" data-id="'+operators[j].id+'" class="operator-'+ tableId +'list-line'+selectedLine+'" ' + onclickAction + oncontextmenuAction + '>' +
                    '<td class="noibg"><span class="operator-list-icon" style="background-image: url(\'' + operatorLogo + '\');"></span></td><td class="noibg"><div class="avatar-box avatar-box-small avatar-box'+avcol+'" style="background-image: url(\'./../picture.php?intid='+lz_global_base64_url_encode(operators[j].id)+'\');"></div></td>';

                ccount = (operators[j].status != '2') ? ' <span class="lzm-info-text">(' + lzm_chatServerEvaluation.operators.getOperatorChats(operators[j].id).length.toString() + ' ' + tid('chats') + ')</span>' : '';

                intUserHtmlString += '<td class="lzm-unselectable">' + operators[j].name + ccount + '</td><td>';

                if(operators[j].status == '2' && $('#operator-list').width() > 500){
                    var laString = '';
                    if(operators[j].la>0)
                        laString = tidc('last_online',': ') + lzm_commonTools.getHumanDate(lzm_chatTimeStamp.getLocalTimeObject(parseInt(operators[j].la * 1000), true), '', lzm_chatDisplay.userLanguage) + ' ';
                    intUserHtmlString += '<span class="text-s">'+laString+'</span>';
                }

                intUserHtmlString += '</td><td>';

                if ((operators[j].mobileAccount && operators[j].status == '2') || (operators[j].clientMobile && operators[j].status != '2'))
                    intUserHtmlString += '<i class="fa fa-tablet icon-light icon-large"></i>';

                if (operators[j].level==1)
                    intUserHtmlString += '<i class="fa fa-star-o icon-light icon-large" title="'+tid('admin')+'"></i>';

                intUserHtmlString += '</td></tr>';
                this.m_OperatorsListLineCounter++;
            }
    return intUserHtmlString;
};

ChatDisplayClass.prototype.createDynamicGroup = function () {
    this.doNotUpdateOpList = true;
    this.newDynGroupHash = md5(String(Math.random())).substr(0, 10);
    var input = '<label>'+tidc('group_name')+'</label><input type="text" id="new-dynamic-group-name" data-role="none" class="lzm-text-input" autofocus />';
    lzm_commonDialog.createAlertDialog(input, [{id: 'ok', name: t('Ok')}, {id: 'cancel', name: t('Cancel')}]);
    $('#new-dynamic-group-name').focus();
    $('#alert-btn-cancel').click(function(e) {
        lzm_commonDialog.removeAlertDialog();
    });
    $('#alert-btn-ok').click(function(e) {
        saveNewDynamicGroup();
        lzm_commonDialog.removeAlertDialog();
    });
};

ChatDisplayClass.prototype.addToDynamicGroup = function (id, browserId, chatId) {
    var headerString = t('Add to Dynamic Group');
    var bodyString = lzm_displayHelper.createAddToDynamicGroupHtml(id, browserId);
    var footerString = lzm_inputControls.createButton('save-dynamic-group', '', '', t('Ok'), '', 'lr',{'margin-left': '4px'},'',30,'d') +
        lzm_inputControls.createButton('cancel-dynamic-group', '', '', t('Close'), '', 'lr',{'margin-left': '4px'},'',30,'d');
    var dialogData = {};
    lzm_displayHelper.createDialogWindow(headerString, bodyString, footerString, 'dynamic-group', {}, {}, {}, {}, '', dialogData, false, false);
    lzm_displayLayout.resizeDynamicGroupDialogs();

    selectDynamicGroup($('#dynamic-group-table').data('selected-group'));
    $('#save-dynamic-group').click(function() {
        if ($('#create-new-group').attr('checked') == 'checked') {
            lzm_chatUserActions.saveDynamicGroup('create-add', '', $('#new-group-name').val(), id,
                {isPersistent: $('#persistent-group-member').attr('checked') == 'checked', browserId: browserId, chatId: chatId});
        } else {
            var group = lzm_chatServerEvaluation.groups.getGroup($('#dynamic-group-table').data('selected-group'));
            if (lzm_commonPermissions.checkUserPermissions(lzm_chatDisplay.myId, 'group', '', group)) {
                var isAlreadyInGroup = false;
                for (var i=0; i<group.members.length; i++) {
                    isAlreadyInGroup = (group.members[i].i == id) ? true : isAlreadyInGroup;
                }
                if (!isAlreadyInGroup) {
                    lzm_chatUserActions.saveDynamicGroup('add', $('#dynamic-group-table').data('selected-group'), '', id,
                        {isPersistent: $('#persistent-group-member').attr('checked') == 'checked', browserId: browserId, chatId: chatId});
                } else {
                    var alertText =  t('A user with this name already exists in this group.');
                    lzm_commonDialog.createAlertDialog(alertText, [{id: 'ok', name: t('Ok')}]);
                    $('#alert-btn-ok').click(function() {
                        lzm_commonDialog.removeAlertDialog();
                    });
                }
            } else {
                showNoPermissionMessage();
            }
        }
        $('#cancel-dynamic-group').click();
    });
    $('#cancel-dynamic-group').click(function() {
        lzm_displayHelper.removeDialogWindow('dynamic-group');
        var activeUserChat = lzm_chatServerEvaluation.userChats.getUserChat(lzm_chatDisplay.active_chat_reco);
        if (lzm_chatDisplay.selected_view == 'mychats' && activeUserChat != null) {
            var myText = loadChatInput(lzm_chatDisplay.active_chat_reco);
            initEditor(myText, 'CancelFilterCreation', lzm_chatDisplay.active_chat_reco);
        }
    });
};

ChatDisplayClass.prototype.createOperatorListContextMenu = function(myObject) {
    var disabledClass, onclickAction, contextMenuHtml = '', checkVisibility = '', thisClass = this;
    var isBot = (d(myObject['chat-partner'].isbot) && myObject['chat-partner'].isbot == 1);
    var browserId = (typeof myObject.browser != 'undefined' && typeof myObject.browser.id != 'undefined') ? myObject.browser.id : '';
    var chatId = (typeof myObject.browser != 'undefined' && typeof myObject.browser.chat != 'undefined') ? myObject.browser.chat.id : '';
    var group = lzm_chatServerEvaluation.groups.getGroup(myObject.groupId);
    var internalChatsAreDisabled = true;
    for (var i=0; i<this.myGroups.length; i++) {
        var myGr = lzm_chatServerEvaluation.groups.getGroup(this.myGroups[i]);
        if (myGr == null || myGr.internal == '1') {
            internalChatsAreDisabled = false;
        }
    }

    var groupIsDynamic = (group != null && typeof group.i != 'undefined');



    disabledClass = (myObject.type == 'operator' && (myObject['chat-partner'].userid == thisClass.myLoginId ||
        (typeof myObject['chat-partner'].isbot != 'undefined' && myObject['chat-partner'].isbot == 1)) ||
        (myObject.type == 'visitor' && lzm_chatServerEvaluation.userChats.getUserChat(myObject['chat-partner'].id + '~' + myObject.browser.id) == null) ||
        internalChatsAreDisabled) ?
        ' class="ui-disabled"' : '';

    var cpUserId = (myObject.type == 'visitor' || myObject.type == 'group') ? myObject['chat-partner'].id : myObject['chat-partner'].userid;
    onclickAction = (myObject.type == 'visitor') ? ((!d(myObject.browser.chat)) ? '' : 'viewUserData(\'' + myObject['chat-partner'].id + '\', \'' + myObject.browser.id + '\', \'' + myObject.browser.chat.id + '\', true);') :
        'chatInternalWith(\'' + myObject['chat-partner'].id + '\', \'' + cpUserId + '\', \'' + myObject['chat-partner'].name + '\');';
    contextMenuHtml += '<div' + disabledClass + ' onclick="' + onclickAction + 'removeOperatorListContextMenu();">' +
        '<span id="chat-with-this-partner" class="cm-line cm-click">' +
        t('Start Chat') + '</span></div><hr />';

    disabledClass = (myObject.type != 'operator' || myObject['chat-partner'].userid == thisClass.myLoginId || isBot || myObject['chat-partner'].status == 2) ?
        ' class="ui-disabled"' : '';
    onclickAction = 'signOffOperator(\'' + myObject['chat-partner'].id + '\');';
    contextMenuHtml += '<div' + disabledClass + ' onclick="' + onclickAction + 'removeOperatorListContextMenu();"><span id="sign-off-this-operator" class="cm-line cm-click">' + t('Sign off...') + '</span></div><hr />';

    disabledClass = (myObject['chat-partner'].id != thisClass.myId) ? ' class="ui-disabled"' : '';
    onclickAction = 'toggleIndividualGroupStatus(\'' + myObject.groupId + '\', \'remove\');';
    checkVisibility = (myObject.type == 'operator' && $.inArray(myObject.groupId, myObject['chat-partner'].groupsAway) == -1) ? 'visible' : 'hidden';
    contextMenuHtml += '<div' + disabledClass + '>' +
        '<span id="change-operator-group-status" class="cm-line cm-click" onclick="' + onclickAction + '">' +
        t('Status: Default') + ' <span style="visibility: ' + checkVisibility + '">&#10003;</span></span></div>';
    onclickAction = 'toggleIndividualGroupStatus(\'' + myObject.groupId + '\', \'add\');';
    checkVisibility = (myObject.type == 'operator' && $.inArray(myObject.groupId, myObject['chat-partner'].groupsAway) != -1) ? 'visible' : 'hidden';
    contextMenuHtml += '<div' + disabledClass + '>' +
        '<span id="change-operator-group-status" class="cm-line cm-click" onclick="' + onclickAction + '">' +
        t('Status: Away') + ' <span style="visibility: ' + checkVisibility + '">&#10003;</span></span></div><hr />';

    disabledClass = (myObject.type != 'operator' || internalChatsAreDisabled || isBot) ? ' class="ui-disabled"' : '';
    contextMenuHtml += '<div' + disabledClass + '>' +
        '<span id="add-to-dynamic-group" class="cm-line cm-click" onclick="addToDynamicGroup(\'' + myObject['chat-partner'].id +
        '\', \'' + browserId + '\', \'' + chatId + '\'); removeOperatorListContextMenu();">' +
        t('Add to Dynamic Group') + '</span></div>';

    disabledClass = ((myObject.type != 'operator' && myObject.type != 'visitor') || !groupIsDynamic || internalChatsAreDisabled) ? ' class="ui-disabled"' : '';
    var cpId = (myObject.type != 'visitor') ? myObject['chat-partner'].id : myObject['chat-partner'].id + '~' + myObject['chat-partner'].b_id;

    contextMenuHtml += '<div' + disabledClass + ' onclick="removeFromDynamicGroup(\'' + cpId +'\', \'' + myObject.groupId + '\'); removeOperatorListContextMenu();">' +
        '<span id="remove-from-dynamic-group" class="cm-line cm-click">' + t('Remove from Dynamic Group') + '</span></div>';

    disabledClass = (myObject.type != 'group' || typeof myObject['chat-partner'].i == 'undefined' || internalChatsAreDisabled) ? ' class="ui-disabled"' : '';
    contextMenuHtml += '<div' + disabledClass + ' onclick="deleteDynamicGroup(\'' + myObject['chat-partner'].id + '\'); removeOperatorListContextMenu();">' +
        '<span id="delete-dynamic-group" class="cm-line cm-click">' + t('Delete Dynamic Group') + '</span></div>';

    disabledClass = (myObject.type != 'group' || typeof myObject['chat-partner'].i == 'undefined' || internalChatsAreDisabled) ? ' class="ui-disabled"' : '';
    contextMenuHtml += '<div' + disabledClass + ' onclick="getDynamicGroupURL(\'' + myObject['chat-partner'].id + '\'); removeOperatorListContextMenu();">' +
        '<span id="delete-dynamic-group" class="cm-line cm-click">' + tid('get_group_url') + '</span></div>';

    return contextMenuHtml;
};

ChatDisplayClass.prototype.createActiveChatPanel = function (updateVisitorListNow, createLayoutNow, openLastActiveNow, type) {

    var thisClass = this;
    updateVisitorListNow = (typeof updateVisitorListNow == 'undefined') ? true : false;
    createLayoutNow = (typeof createLayoutNow != 'undefined') ? createLayoutNow : false;
    openLastActiveNow = (typeof openLastActiveNow != 'undefined') ? openLastActiveNow : true;
    type = (typeof type != 'undefined') ? type : 'new_chat';
    try {
    if (lzm_chatPollServer.dataObject.p_gl_a != 'N') {
        this.myChatsCounter = 0;
        if (updateVisitorListNow && this.selected_view == 'external' && $('.dialog-window-container').length == 0)
            this.visitorDisplay.updateVisitorList();

        var thisActiveChatPanel = $('#active-chat-panel');
        var onclickAction = '', oncontextmenuAction = '', onclickCommand = '', buttonId = '';
        var activeCounter = 0, thisActiveChatPanelWidth = thisActiveChatPanel.width();
        var defaultCss = ' height: 22px; position: absolute; padding: 0px 8px 0px 24px; text-align: center; font-size: 12px; overflow: hidden; cursor: pointer; vertical-align: middle;';
        var closeButton = '<div id="close-active-chat" onclick="closeChatTab();" style="display: none;"><i class="fa fa-remove"></i></div>';
        var activityHtml = closeButton;
        var newIncomingChats = [];

        this.chatActivity = false;
        var thisDivLeft = [2];
        var thisLine = 0;
        var userChats = lzm_chatServerEvaluation.userChats.getUserChatList();
        var cpIsActive = false, cpDoesExist = false;
        var thisButtonCss = defaultCss;
        var buttonCSSClass = '';
        if (this.active_chat_reco == '' || this.active_chat_reco == 'LIST')
            buttonCSSClass = 'lzm-tabs lzm-tabs-selected';
        else
            buttonCSSClass = 'lzm-tabs';

        var ctxtMenu = (!thisClass.isApp && !thisClass.isMobile) ? ' oncontextmenu="preventDefaultContextMenu(event);"' : '';
        var thisButtonHtml = '<div onclick="showAllchatsList(true);"' + ctxtMenu +
            ' class="' + buttonCSSClass + ' lzm-unselectable" id="show-allchats-list" style=\'left: 0px; top: 1px;' + thisButtonCss + ' display: table-cell; line-height: 22px;' +
            ' background-position: left; background-repeat: no-repeat; padding-left: 2px;\'>' +
            '<span style=\'line-height: 22px; padding-left: 4px; padding-top: 4px; padding-bottom: 4px;\'>' + t('All Chats') + '</span></div>';
        var testLengthDiv = $('#test-length-div');
        testLengthDiv.html(thisButtonHtml.replace(/show-allchats-list/, 'test-show-allchats-list')).trigger('create');
        var thisButtonLength = $('#test-show-allchats-list').width() + 9;
        thisDivLeft[thisLine] += thisButtonLength;
        activityHtml += thisButtonHtml;
        testLengthDiv.html('').trigger('create');

        for (var cp in userChats)
        {
            try
            {
                if (userChats.hasOwnProperty(cp)) {
                    var thisUserChat = userChats[cp];

                    if(!this.isVisibleChat(thisUserChat))
                        continue;

                    if (thisUserChat.id != '' && thisUserChat.type == 'external' && thisUserChat.status == 'new' && $.inArray(cp, this.openChats) == -1 && thisUserChat.my_chat)
                        newIncomingChats.push(cp);

                    if (thisUserChat.my_chat || thisUserChat.my_chat_old || $.inArray(cp, this.openChats) != -1 || $.inArray(cp, this.joinedChats) != -1 || (cp.indexOf('~') == -1 && thisUserChat.status != 'left')/*thisUserChat.id != '' && ((thisUserChat.status != 'left' && thisUserChat.status != 'declined')) && (thisUserChat.my_chat || thisUserChat.my_chat_old || cp.indexOf('~') == -1)*/)
                    {
                        var group = lzm_chatServerEvaluation.groups.getGroup(cp);
                        var operator = lzm_chatServerEvaluation.operators.getOperator(cp);
                        var visitor = lzm_chatServerEvaluation.visitors.getVisitor(cp.split('~')[0]);

                        if (thisUserChat.type == 'external')
                        {
                            onclickCommand = 'viewUserData(\'' + thisUserChat.id + '\', \'' + thisUserChat.b_id + '\', \'' + thisUserChat.chat_id + '\', true);';
                            onclickAction = ' onclick="' + onclickCommand + '"';
                            oncontextmenuAction = (!thisClass.isApp && !thisClass.isMobile) ? ' oncontextmenu="' + onclickCommand + 'showVisitorChatActionContextMenu(\'' + thisUserChat.id + '~' + thisUserChat.b_id + '\', \'panel\', event);"' : '';
                            buttonId = ' id="chat-button-' + thisUserChat.id + '_' + thisUserChat.b_id + '"';
                            cpIsActive = visitor.is_active;
                            cpDoesExist = true;
                        }
                        else
                        {
                            if (operator != null)
                            {
                                onclickCommand = 'chatInternalWith(\'' + operator.id + '\', \'' + operator.userid + '\', \'' + operator.name + '\');';
                                onclickAction = ' onclick="' + onclickCommand + '"';
                                oncontextmenuAction = (!thisClass.isApp && !thisClass.isMobile) ? ' oncontextmenu="' + onclickCommand + 'showVisitorChatActionContextMenu(\'' + operator.id + '\', \'panel\', event);"' : '';
                                buttonId = ' id="chat-button-' + operator.id + '"';
                                cpIsActive = operator.is_active;
                                cpDoesExist = true;
                            }
                            if (group != null)
                            {
                                onclickCommand = 'chatInternalWith(\'' + group.id + '\', \'' + group.id + '\', \'' + group.name + '\');';
                                onclickAction = ' onclick="' + onclickCommand + '"';
                                oncontextmenuAction = (!thisClass.isApp && !thisClass.isMobile) ? ' oncontextmenu="' + onclickCommand + 'showVisitorChatActionContextMenu(\'' + group.id + '\', \'panel\', event);"' : '';
                                buttonId = ' id="chat-button-' + group.id + '"';
                                cpIsActive = group.is_active;
                                cpDoesExist = true;
                            }
                            if (cp == 'everyoneintern')
                            {
                                onclickCommand = 'chatInternalWith(\'' + 'everyoneintern' + '\', \'' + 'everyoneintern' + '\', \'' + t('All operators') + '\');';
                                onclickAction = ' onclick="' + onclickCommand + '"';
                                oncontextmenuAction = (!thisClass.isApp && !thisClass.isMobile) ? ' oncontextmenu="' + onclickCommand + 'showVisitorChatActionContextMenu(\'everyoneintern\', \'panel\', event);"' : '';
                                buttonId = ' id="chat-button-' + 'everyoneintern' + '"';
                                cpIsActive = true;
                                cpDoesExist = true;
                            }
                        }

                        var iconClass = 'lzm-tab-icon-content';
                        var buttonLogo = 'img/lz_offline.png?2';
                        if (cp == 'everyoneintern' || (group != null && typeof group.members == 'undefined' && group.is_active))
                        {
                            buttonLogo = '';
                            iconClass='lzm-tab-content';
                        }
                        else if (group != null && typeof group.members != 'undefined' && group.is_active)
                        {
                            buttonLogo = '';
                            iconClass='lzm-tab-content';
                        }
                        else if (operator != null)
                            buttonLogo = operator.status_logo;
                        else if (visitor != null &&
                            visitor.is_active &&
                            thisUserChat['status'] != 'left' &&
                            thisUserChat['status'] != 'declined' &&
                            thisUserChat['my_chat']) {
                            if (thisUserChat.member_status != 2)
                                buttonLogo = 'img/lz_online.png';
                            else
                                buttonLogo = 'img/lz_hidden.png';
                            this.myChatsCounter++;
                        }

                        var bgGradientColor = '';
                        if (thisUserChat['status'] == 'new' ||
                            (typeof thisUserChat.fupr != 'undefined' &&
                                (typeof thisUserChat.fuprDone == 'undefined' ||
                                    thisUserChat.fuprDone != thisUserChat.fupr.id))) {
                            this.chatActivity = true;
                        }

                        thisButtonCss = defaultCss;

                        if (cp == this.active_chat_reco)
                        {
                            buttonCSSClass = 'lzm-tabs lzm-tabs-selected';
                            bgGradientColor = 'darkViewSelect';
                        }
                        else
                        {
                            buttonCSSClass = 'lzm-tabs';
                            bgGradientColor = '';
                        }

                        if (cpDoesExist)
                        {
                            var thisDivTop = 1 + thisLine * this.chatPanelLineHeight;
                            var displayCpName = (thisUserChat.chat_name.length > 18) ? thisUserChat.chat_name.substring(0, 15) + '...' : thisUserChat.chat_name;
                            displayCpName = displayCpName.replace(/ /g, '&nbsp;');
                            thisButtonHtml = '<div' + onclickAction + oncontextmenuAction + buttonId + ' class="'+buttonCSSClass+' lzm-unselectable" style=\'left:' + thisDivLeft[thisLine]+'px; top: ' + thisDivTop+'px;' + thisButtonCss + ' display: table-cell; line-height: 22px; background-position: left; background-repeat: no-repeat; padding-left: 2px;\'>' + '<span class="'+iconClass+'" style="background-image: url(\'' + buttonLogo + '\');">' + displayCpName + '</span></div>';
                            testLengthDiv = $('#test-length-div');
                            var testButtonId = buttonId.replace(/ id="(.*?)"/, 'test-$1');
                            testLengthDiv.html(thisButtonHtml.replace(/chat-button-/, 'test-chat-button-')).trigger('create');
                            thisButtonLength = $('#' + testButtonId).width() + 11;
                            var thisLineRight = (thisLine == 0) ? 26 : 2;
                            if ((thisDivLeft[thisLine] + thisButtonLength) >= (thisActiveChatPanelWidth - thisLineRight)) {
                                thisLine++;
                                thisDivTop = 1 + thisLine * this.chatPanelLineHeight;
                                thisDivLeft.push(0);
                                thisButtonHtml = '<div' + onclickAction + oncontextmenuAction + buttonId + ' class="'+buttonCSSClass+' lzm-unselectable" style=\'left:' + thisDivLeft[thisLine] + 'px;' +
                                    ' top: ' + thisDivTop+'px;' + thisButtonCss + ' display: table-cell; line-height: 22px; background-position: left; background-repeat: no-repeat; padding-left: 2px;\'>' +
                                    '<span class="'+iconClass+'" style=\'background-image: url("' + buttonLogo + '");\'>' + displayCpName + '</span></div>';
                            }
                            activeCounter++;
                            thisDivLeft[thisLine] += thisButtonLength;
                            activityHtml += thisButtonHtml;
                            this.activeChatPanelHeight = this.chatPanelLineHeight * (thisLine + 1);
                            testLengthDiv.html('').trigger('create');
                        }
                    }
                }
            } catch(e){deblog(e)}
        }

        if (newIncomingChats.length > 0)
            this.startRinging(newIncomingChats);
        else
            this.stopRinging(newIncomingChats);

        thisActiveChatPanel.html(activityHtml).trigger('create');
        var activeUserChat = lzm_chatServerEvaluation.userChats.getUserChat(this.active_chat_reco);
        if (this.active_chat_reco != '' && activeUserChat != null /*&& (activeUserChat.status != 'new' || !activeUserChat.my_chat)*/) {
            $('#close-active-chat').css({display: 'block'});
            $('#close-active-chat').css({height: ((thisLine+1)*this.chatPanelLineHeight)+'px'});
            $('#close-active-chat i.fa').css({'line-height': ((thisLine+1)*this.chatPanelLineHeight)+'px'});
        }

        if (this.chatActivity && (this.settingsDialogue || this.selected_view != 'mychats'))
            this.createViewSelectPanel(this.firstVisibleView);
        else
            this.createViewSelectPanel(this.firstVisibleView);

        if (createLayoutNow) {
            this.createChatWindowLayout(false);
        }
    } else {
        setTimeout(function() {
            thisClass.createActiveChatPanel(updateVisitorListNow, createLayoutNow, openLastActiveNow);
        }, 200);
    }
    } catch(e) {}

    this.blinkIcons();
};

ChatDisplayClass.prototype.validateActiveChat = function (id,showNext){
    if(!this.isVisibleChat(lzm_chatServerEvaluation.userChats.getUserChat(id))){
        //if(showNext)
            //openLastActiveChat();
        return false;
    }
    return true;
}

ChatDisplayClass.prototype.isVisibleChat = function(chat){
    if(chat == null)
        return false;

    var visitorChat = lzm_chatServerEvaluation.visitors.getChatBrowser(chat.id,chat.b_id);
    if(lzm_chatServerEvaluation.userChats.isInPublicGroupChat(chat)){

        if(d(visitorChat.chat.dgr[0]))
            lzm_chatServerEvaluation.userChats.setUserChat(visitorChat.chat.dgr[0], {});
        return false;
    }
    else if(lzm_chatServerEvaluation.userChats.wasInPublicGroupChat(chat.b_id))
    {
        lzm_chatServerEvaluation.userChats.validatePublicGroupMember(chat.id,chat.b_id,false);
        return false;
    }

    if($.inArray(chat.id+'~'+chat.b_id, lzm_chatDisplay.closedChats) != -1){
        return false;
    }
    return true;
};

ChatDisplayClass.prototype.createChatHtml = function(thisUser) {

    if(this.active_chat_reco.length < 2)
        return;

    if(!this.validateActiveChat(this.active_chat_reco,true))
    {
        showAllchatsList(true);
        return false;
    }

    var myCurrentChat = lzm_chatServerEvaluation.userChats.getUserChat(this.active_chat_reco);
    var chatHtmlString = '',messageText = '';
    var previousMessageSender = '',previousMessageRepost = 1,previousAddMessageStyle = 1;
    var previousMessageTimestamp = 0,avatar = '', addClass = '', aspace = '';
    var tmpDate = lzm_chatTimeStamp.getLocalTimeObject();
    var currentDateObject = {
        day:this.lzm_commonTools.pad(tmpDate.getDate(), 2),
        month:this.lzm_commonTools.pad((tmpDate.getMonth() + 1), 2),
        year:this.lzm_commonTools.pad(tmpDate.getFullYear() ,4)
    };
    if (myCurrentChat != null)
    {
        myCurrentChat.messages = (d(myCurrentChat.messages)) ? myCurrentChat.messages : [];
        for (var i=0; i<myCurrentChat.messages.length; i++)
        {
            addClass = '';
            myCurrentChat.messages[i].text = (typeof myCurrentChat.messages[i].text != 'undefined') ? lzm_commonTools.replaceLinksInChatView(myCurrentChat.messages[i].text) : '';
            var messageTime = myCurrentChat.messages[i].time_human;
            if (d(myCurrentChat.messages[i].dateObject) &&
                (myCurrentChat.messages[i].dateObject.year != currentDateObject.year ||
                    myCurrentChat.messages[i].dateObject.month != currentDateObject.month ||
                    myCurrentChat.messages[i].dateObject.day != currentDateObject.day)) {
                messageTime = myCurrentChat.messages[i].date_human + '&nbsp;' + myCurrentChat.messages[i].time_human;
            }
            var chatText = '<span>' + lzm_displayHelper.replaceSmileys(myCurrentChat.messages[i].text) + '</span>';

            if (typeof myCurrentChat.messages[i].tr != 'undefined' && myCurrentChat.messages[i].tr != '')
                chatText = '<span>' + lzm_displayHelper.replaceSmileys(myCurrentChat.messages[i].tr) + '</span><br /><span class="lz_message_translation">' + lzm_displayHelper.replaceSmileys(myCurrentChat.messages[i].text) + '</span>';
            else if(this.translatedPosts.length)
            {
                var tr = lzm_commonTools.GetElementByProperty(this.translatedPosts,'id',myCurrentChat.messages[i].id);
                if(tr.length)
                {
                    if (d(myCurrentChat.messages[i].info_header))
                        myCurrentChat.messages[i].info_header.question = tr[0].text;
                    else
                        chatText = '<span>' + lzm_displayHelper.replaceSmileys(tr[0].text) + '</span>';
                }
            }

            if (d(myCurrentChat.messages[i].info_header))
            {
                var myMailAddress = (myCurrentChat.messages[i].info_header.mail != '') ? this.lzm_commonTools.htmlEntities(myCurrentChat.messages[i].info_header.mail) : '';
                var targetGroup = lzm_chatServerEvaluation.groups.getGroup(myCurrentChat.messages[i].info_header.group);
                var phoneNumber = (myCurrentChat.messages[i].info_header.phone != '') ? '<span style="color: #5197ff; cursor: pointer; text-decoration: underline;" onclick="showPhoneCallDialog(\'' + this.active_chat_reco + '\', -1, \'chat\');">' + this.lzm_commonTools.htmlEntities(myCurrentChat.messages[i].info_header.phone) + '</span>' : '';
                chatHtmlString = chatHtmlString.replace('header_class_placeholder','TCBOLD');

                var groupName = (targetGroup != null) ? targetGroup.name : myCurrentChat.messages[i].info_header.group;
                var visitorInfoVisible = lzm_commonStorage.loadValue('show_chat_visitor_info_' + lzm_chatServerEvaluation.myId,1)!=0 && $('#chat-container').width() > this.minWidthChatVisitorInfo;
                var addRow = '<tr><td class="TCBHF"><!--label-->:</td><td class="last"><!--value--></td></tr>';
                var addWrapRow = '<tr><td class="TCBHF"><!--label-->:</td><td class="last AP" data-pn="'+myCurrentChat.messages[i].id+'" style="white-space: normal;"><!--value--></td></tr>';
                messageText = this.messageTemplates['system'].replace(/<!--message-->/g,'<span>'+tid('new_chat_request')+'</span>');
                messageText += '<div class="TCBB"><table class="TCB header_class_placeholder"><tr><td class="TCBG" rowspan="100"></td><td class="TCBHF"><!--group_label-->:&nbsp;&nbsp;</td><td class="last" style="white-space: normal;"><b><!--group_name--></b><!--receivers--></td></tr>';
                messageText = messageText.replace(/<!--group_label-->/g,tid('group'));
                messageText = messageText.replace(/<!--group_name-->/g,groupName);
                messageText = messageText.replace(/<!--receivers-->/g,(myCurrentChat.messages[i].info_header.operators.length > 0) ? ' (' + myCurrentChat.messages[i].info_header.operators + ')' : '');

                if(!visitorInfoVisible && myCurrentChat.messages[i].info_header.name.length > 0)
                    messageText += addRow.replace('<!--label-->',t('Name')).replace('<!--value-->',this.lzm_commonTools.htmlEntities(myCurrentChat.messages[i].info_header.name));

                if(!visitorInfoVisible && myMailAddress.length > 0)
                    messageText += addRow.replace('<!--label-->',t('Email')).replace('<!--value-->',myMailAddress).replace(/lz_chat_mail/, 'lz_chat_mail_no_icon');

                if(!visitorInfoVisible && myCurrentChat.messages[i].info_header.company.length > 0)
                    messageText += addRow.replace('<!--label-->',t('Company')).replace('<!--value-->',this.lzm_commonTools.htmlEntities(myCurrentChat.messages[i].info_header.company));

                if(myCurrentChat.cmb == '1' && phoneNumber.length > 0)
                    messageText += addRow.replace('TCBHF','TCBHF TCBHFI').replace('<!--label-->',t('Phone')).replace('<!--value-->',phoneNumber + ' ('+tid('callback')+')');
                else if(!visitorInfoVisible && phoneNumber.length > 0)
                    messageText += addRow.replace('<!--label-->',t('Phone')).replace('<!--value-->',phoneNumber);

                messageText += addRow.replace('<!--label-->',t('Chat ID')).replace('<!--value-->',this.lzm_commonTools.htmlEntities(myCurrentChat.messages[i].info_header.chat_id));

                if(lz_global_trim(myCurrentChat.messages[i].info_header.area_code).length > 0)
                    messageText += addRow.replace('<!--label-->',t('Area(s)')).replace('<!--value-->',this.lzm_commonTools.htmlEntities(myCurrentChat.messages[i].info_header.area_code));

                if(myCurrentChat.messages[i].info_header.url.length > 0)
                    messageText += '<tr><td class="TCBHF">'+t('Url')+'</td><td><a class="lz_chat_link_no_icon" href="#" data-url="'+myCurrentChat.messages[i].info_header.url+'" onclick="openLink(\''+myCurrentChat.messages[i].info_header.url+'\');">'+myCurrentChat.messages[i].info_header.url+'</a></td></tr>';

                messageText += myCurrentChat.messages[i].info_header.cf;

                if(!visitorInfoVisible && thisUser.b_chat != null && thisUser.b_chat.hc != null && thisUser.b_chat.hc.indexOf(';')!==-1 && thisUser.b_chat.hc != '0;0'){
                    var history = '', space = '';
                    var parts = thisUser.b_chat.hc.split(';');
                    if(parts[0]>0)
                        history+= lzm_inputControls.createButton(thisUser.id+'hisc_btn', '', 'showVisitorInfo(\''+thisUser.id+'\',\'\',\'\',5);', tid('chats_number').replace('<!--number_of_chats-->',parts[0]), '', 'lr', {'margin-right':'4px'}, '', '');
                    if(parts[1]>0)
                        history+= lzm_inputControls.createButton(thisUser.id+'hist_btn', '', 'showVisitorInfo(\''+thisUser.id+'\',\'\',\'\',6);', tid('tickets_number').replace('<!--number_of_tickets-->',parts[1]), '', 'lr', {}, '', '');
                    messageText += addRow.replace('<!--label-->',tid('history')).replace('<!--value-->','<div style="padding:4px 0;">' + history + '</div>');
                }

                if(myCurrentChat.messages[i].info_header.question.length > 0)
                    messageText += addWrapRow.replace('<!--label-->',t('Question')).replace('<!--value-->',this.lzm_commonTools.htmlEntities(myCurrentChat.messages[i].info_header.question));

                chatHtmlString += messageText + '</table></div>';
                previousMessageSender = '';
                previousMessageRepost = 1;
                previousAddMessageStyle = 1;
            }
            else
            {

                var senderName = myCurrentChat.messages[i].sender_name;
                if (myCurrentChat.messages[i].rp == 1)
                    addClass = ' RCMT';
                else if (myCurrentChat.messages[i].sen == this.myId)
                    addClass = ' OCMT';
                else
                {
                    var xoperator = lzm_chatServerEvaluation.operators.getOperator(myCurrentChat.messages[i].sen);
                    if(xoperator != null)
                        addClass = ' OOCMT';
                    else{
                        var xvisitor = lzm_chatServerEvaluation.visitors.getVisitor(myCurrentChat.messages[i].sen.split('~')[0]);
                        if(xvisitor != null)
                            senderName = lzm_chatServerEvaluation.visitors.getVisitorName(xvisitor);
                    }
                }

                if (previousMessageSender != myCurrentChat.messages[i].sen || previousMessageRepost != myCurrentChat.messages[i].rp || parseInt(myCurrentChat.messages[i].date) - previousMessageTimestamp > 300) {
                    if (myCurrentChat.messages[i].rp == 1)
                        messageText = this.messageTemplates['repost'].replace(/<!--name-->/g,(senderName));
                    else {

                        if (myCurrentChat.messages[i].sen == this.myId) {
                            messageText = this.messageTemplates['internal'].replace(/<!--name-->/g,(senderName));
                        }
                        else if (myCurrentChat.messages[i].sen == '0000000') {
                            messageText = this.messageTemplates['system'].replace(/<!--name-->/g,(senderName));
                        } else {
                            messageText = this.messageTemplates['external'].replace(/<!--name-->/g,(senderName));
                        }
                    }
                    previousAddMessageStyle = 1;
                }
                else
                {
                    if (myCurrentChat.messages[i].sen == '0000000') {
                        messageText = this.messageTemplates['systemadd'].replace(/<!--name-->/g,lzm_commonTools.escapeHtml(senderName, true));
                    }
                    else if (previousAddMessageStyle == 0) {
                        messageText = this.messageTemplates['add'].replace(/<!--name-->/g,lzm_commonTools.escapeHtml(senderName, true));
                    } else {
                        messageText = this.messageTemplates['addalt'].replace(/<!--name-->/g,lzm_commonTools.escapeHtml(senderName, true));
                    }
                    previousAddMessageStyle = 1 - previousAddMessageStyle;
                }

                if(lzm_commonStorage.loadValue('show_avatars_' + lzm_chatServerEvaluation.myId,1)!=0){
                    aspace = ' style="width:56px;"';
                    avatar = '<div style="background-image: url(\'./../picture.php?intid='+lz_global_base64_url_encode(myCurrentChat.messages[i].sen)+'\');"></div>';
                }

                messageText = messageText.replace(/<!--avatar-->/g, avatar);
                messageText = messageText.replace(/<!--aspace-->/g, aspace);
                messageText = messageText.replace(/<!--t-->/g, addClass);
                messageText = messageText.replace(/<!--pn-->/g, myCurrentChat.messages[i].id);
                messageText = messageText.replace(/<!--time-->/g, messageTime);
                messageText = messageText.replace(/<!--message-->/g, chatText);
                messageText = messageText.replace(/<!--dir-->/g, 'ltr');
                chatHtmlString += messageText;
                previousMessageSender = myCurrentChat.messages[i].sen;
                previousMessageRepost = (myCurrentChat.messages[i].rp == 1) ? 1 : 0;
            }
            previousMessageTimestamp = parseInt(myCurrentChat.messages[i].date);
        }

        this.updateChatElements();
    }
    else if (this.active_chat_reco != 'LIST' && this.selected_view == 'mychats')
        this.lastActiveChat = '';
    else
        showAllchatsList();

    var typing = $.inArray(this.active_chat_reco,this.blinkingIconsArray)!=-1;
    if(typing && d(thisUser.ip))
    {
        senderName = (d(thisUser.d)) ? lzm_chatServerEvaluation.visitors.getVisitorName(thisUser) : thisUser.name;
        addClass = (d(thisUser.d)) ? '' : ' OOCMT';
        messageText = this.messageTemplates['internal'].replace(/<!--name-->/g,(senderName));
        messageText = messageText.replace(/<!--message-->/g, '<div class="lz_saving"><span></span><span></span><span></span></div>');
        messageText = messageText.replace(/<!--t-->/g, addClass);
        messageText = messageText.replace(/<!--aspace-->/g, ' style="width:56px;"');
        messageText = messageText.replace(/<!--avatar-->/g, '<div style="background-image: url(\'./../picture.php?intid='+lz_global_base64_url_encode(thisUser.id)+'\');"></div>');
        chatHtmlString += messageText;
    }

    if(myCurrentChat == null || (myCurrentChat != null && (myCurrentChat.status == 'left' || (/*myCurrentChat.status == 'new' && */!myCurrentChat.my_chat))))
    {
        chatHtmlString = chatHtmlString.replace('header_class_placeholder','TCBOLD');
        chatHtmlString = chatHtmlString.replace(/info_class_placeholder/g,'SCMTOLD');
    }

    var thisChatProgress = $('#chat-progress');
    chatHtmlString = chatHtmlString.replace(/lz_chat_link/g, 'lz_chat_link_no_icon').replace(/lz_chat_mail/g, 'lz_chat_mail_no_icon').replace(/_no_icon_no_icon/g, '_no_icon');
    thisChatProgress.html(chatHtmlString);
    thisChatProgress.scrollTop(thisChatProgress[0].scrollHeight);
    if (lzm_chatDisplay.isApp && appOs == 'windows')
        setTimeout(function() {
            thisChatProgress.scrollTop(thisChatProgress[0].scrollHeight);
        }, 500);

    $('.CMT').contextmenu(function(){
        showChatMsgTranslator(this);
        return false;
    });

    $('.last.AP').contextmenu(function(){
        showChatQuestionTranslator(this);
        return false;
    });

    $('#chat-action').css('visibility', 'visible');
    $('#chat-buttons').css('visibility', 'visible');
    lzm_displayLayout.resizeChatView();
};

ChatDisplayClass.prototype.getUserObjectFromChat = function (chat) {
    var group = lzm_chatServerEvaluation.groups.getGroup(chat.id);
    if(group != null)
        return group;
    var operator = lzm_chatServerEvaluation.operators.getOperator(chat.id);
    if(operator != null)
        return operator;


    if(typeof chat.b_id != 'undefined'){
        var browser = lzm_chatServerEvaluation.visitors.getChatBrowser(chat.id,chat.b_id);
        return browser;
    }

    var visitor = lzm_chatServerEvaluation.visitors.getVisitor(chat.id);
    if(visitor != null)
        return visitor;
    return null;
}

ChatDisplayClass.prototype.createHtmlContent = function (thisUser, active_chat_reco, type) {
    type = (typeof type != 'undefined') ? type : '';


    this.createActiveChatPanel(false, true, true, type);

    // create the visitor and operator lists
    if (this.selected_view == 'internal') {
        this.createOperatorList();
    }
    if (this.selected_view == 'external' && $('.dialog-window-container').length == 0) {
        this.visitorDisplay.updateVisitorList();
    }

    // fill the chat window with content
    if (this.selected_view == 'mychats') {
        if(active_chat_reco != '' && active_chat_reco == this.active_chat_reco)
            this.createChatHtml(thisUser);
    }

    if (this.startPageExists) {
        this.startpageDisplay.createStartPage(false, [], []);
    }
    this.createGeoTracking();
    if (this.selected_view == 'reports') {
        this.reportsDisplay.createReportList();
    }
    this.allchatsDisplay.updateAllChats();
};

ChatDisplayClass.prototype.updateChatElements = function(){
    this.updateChatMembers();
    this.updateChatInfo();
}

ChatDisplayClass.prototype.updateChatInfo = function(){
    var hideInfo = true;
    var addNew = null;
    if(lzm_commonStorage.loadValue('show_chat_visitor_info_' + lzm_chatServerEvaluation.myId,1)!=0 && this.active_chat_reco != 'LIST' && this.active_chat_reco != '')
    {
        var visitor = lzm_chatServerEvaluation.visitors.getVisitor(this.active_chat_reco.split('~')[0]);
        if(visitor != null && visitor.is_active)
        {
            hideInfo = false;
            if($('#visitor-info-e-'+visitor.id+'-placeholder').length>0)
            {
                $('.embedded-visitor-info').css('display','none');
                $('#visitor-info-e-'+visitor.id+'-placeholder').css('display','block');
            }
            else
            {
                addNew = visitor.id;
            }
        }
    }

    $('#chat-info-body').data('hidden', (hideInfo ? '1' : '0'));

    if(!hideInfo)
        $('#chat-info-body').css({display:'block'});

    if(addNew != null)
    {
        $('#chat-info-elements').append('<div id="visitor-info-e-'+visitor.id+'-placeholder" class="embedded-visitor-info" data-visitor-id="'+visitor.id+'"></div>');
        lzm_chatDisplay.visitorDisplay.showVisitorInformation(visitor, '', 0, false, true);
        lzm_chatPollServer.initVisitorFetchInfo(visitor.id);
    }

    $('#chat-info-elements .embedded-visitor-info').each(function(){
        var visitor = lzm_chatServerEvaluation.visitors.getVisitor($(this).attr('data-visitor-id'));
        if(!(visitor != null && visitor.is_active)){
            try{
            $(this).remove();
            lzm_chatDisplay.ticketControlTickets[$(this).attr('data-visitor-id')] = [];
            lzm_chatDisplay.archiveControlChats[$(this).attr('data-visitor-id')] = [];
            }catch(e){deblog(e);}
        }
    });
    lzm_displayLayout.resizeMychats();
};

ChatDisplayClass.prototype.updateChatMembers = function(){
    try{

        var hideMembers = true;

        if(this.active_chat_reco != 'LIST' && this.active_chat_reco != '')
        {
            var userChat = lzm_chatServerEvaluation.userChats.getUserChat(this.active_chat_reco);
            var obj = lzm_chatDisplay.getUserObjectFromChat(userChat);
            var ev_click = '',ev_cm = '', dblc = '', objid = this.active_chat_reco, memberList = [], addedList = [], operator = null, visitor = null, visitorChatBrowser = null, visitorChat = null;
            var chatIsOnline = true, displayMinimized = false;

            if($('#chat-container').width()<500 && $.inArray(objid+"AUTOMIN",this.minimizedMemberLists)==-1){
                this.minimizedMemberLists.push(objid+"AUTOMIN");
                this.minimizedMemberLists.push(objid);
            }

            if($.inArray(objid,this.minimizedMemberLists)>-1)
                displayMinimized = true;

            this.memberListWidth = (displayMinimized) ? 0 : 150;

            try
            {
                if($('#chat-container').width()>260)
                {
                    if('everyoneintern' == this.active_chat_reco)
                        obj = {id:'everyoneintern'};

                    if(obj != null && d(obj.members) && this.active_chat_reco == obj.id)
                        memberList = obj.members;
                    else if(obj != null && d(obj.chat) && d(obj.chat.pn))
                    {
                        chatIsOnline = lzm_commonTools.GetElementByProperty(this.allchatsDisplay.allChats,'cid',obj.chat.id).length>0;
                        var isExtMember = false;
                        for(var k = 0;k<obj.chat.pn.member.length;k++){
                            if($.inArray(obj.chat.pn.member[k].id,addedList) == -1 && obj.chat.pn.member[k].st != 2){
                                addedList.push(obj.chat.pn.member[k].id);
                                memberList.push(obj.chat.pn.member[k]);
                                if(obj.chat.pn.member[k].id == objid)
                                    isExtMember = true;
                            }
                        }
                        if(!isExtMember)
                            memberList.push({id:objid});
                    }
                    else if(d(obj.userid))
                    {
                        // private chat
                        memberList.push({id:obj.id});
                        memberList.push({id:lzm_chatServerEvaluation.myId});
                    }
                    else
                    {
                        // standard group
                        var operators = lzm_chatServerEvaluation.operators.getOperatorList();
                        for (i=0; i<operators.length; i++)
                        {
                            if ($.inArray(this.active_chat_reco, operators[i].groups) != -1 || 'everyoneintern' == this.active_chat_reco)
                            {
                                if(!operators[i].isbot)
                                {
                                    memberList.push({id:operators[i].id});
                                    chatIsOnline = true;
                                }
                            }
                        }
                    }
                }
            }
            catch(e){deblog(e);}

            if(memberList.length > 0 && chatIsOnline)
            {
                hideMembers = false;
                $('#chat-members').css('display','block');
                $('#chat-progress, #chat-action, #chat-buttons').css({left: this.memberListWidth + 'px'});
                $('#chat-qrd-preview').css({left: this.memberListWidth + 'px'});
                var membersHtml = '', operatorsHTML = '';
                var nameWidth = ' style="width:' + (this.memberListWidth) + 'px;"';
                var addedMembers = [];
                for(var i = 0;i<memberList.length;i++){

                    var membId = (typeof memberList[i].i != 'undefined') ? memberList[i].i : memberList[i].id;
                    var hasDeclined = (typeof memberList[i].dec != 'undefined' && memberList[i].dec==1);

                    if($.inArray(membId,addedMembers)===-1){
                        addedMembers.push(membId);
                        operator = lzm_chatServerEvaluation.operators.getOperator(membId);

                        visitor = lzm_chatServerEvaluation.visitors.getVisitor(membId.split('~')[0]);
                        visitorChatBrowser = lzm_chatServerEvaluation.visitors.getChatBrowser(membId.split('~')[0],membId.split('~')[1]);
                        visitorChat = lzm_chatServerEvaluation.userChats.getUserChat(membId);

                        if(operator != null){
                            dblc = ' ondblclick="addressChatMember(\''+objid+'\',\''+lz_global_base64_encode(operator.name)+'\');"';
                            ev_cm = (operator.id != lzm_chatServerEvaluation.myId) ? 'openChatMemberContextMenu(event,this.id,\''+obj.id+'\',\''+operator.id+'\',\'\',\'\');' : 'selectChatMemberLine(this.id,\''+obj.id+'\');return false;';
                            ev_click = (lzm_chatDisplay.isApp) ? ev_cm : 'selectChatMemberLine(this.id,\''+obj.id+'\');';
                            var icon = (hasDeclined) ? '<i class="fa fa-times icon-member-status icon-orange"></i>' : '<span class="operator-list-icon" style="background-image: url(\'' + this.lzm_commonConfig.lz_user_states[operator.status].icon + '\');"></span>';
                            operatorsHTML += '<div '+nameWidth+' id="'+(obj.id+'-'+i)+'" class="lzm-unselectable chat-member-div '+obj.id+'" onclick="'+ev_click+'" oncontextmenu="'+ev_cm+'"'+dblc+'>'+icon+operator.name+'</div>';
                        }
                        else if(visitorChatBrowser != null && visitorChat != null && visitorChat.status != 'left'){
                            var active_chat_name = lzm_chatServerEvaluation.visitors.getVisitorName(visitor);
                            dblc = ' ondblclick="addressChatMember(\''+objid+'\',\''+lz_global_base64_encode(active_chat_name)+'\');"';
                            ev_cm = 'openChatMemberContextMenu(event,this.id,\''+obj.id+'\',\''+membId.split('~')[0]+'\',\''+membId.split('~')[1]+'\',\''+visitorChatBrowser.chat.id+'\');';
                            ev_click = (lzm_chatDisplay.isApp) ? ev_cm : 'selectChatMemberLine(this.id,\''+obj.id+'\');';
                            membersHtml += '<div '+nameWidth+' id="'+(obj.id+'-'+i)+'" class="lzm-unselectable chat-member-div '+obj.id+'" onclick="'+ev_click+'" oncontextmenu="'+ev_cm+'"'+dblc+'><span class="user-list-icon"><i class="fa fa-user icon-light"></i></span>'+active_chat_name+'</div>';
                        }
                    }
                }

                if(operatorsHTML != '')
                    operatorsHTML = '<div class="chat-member-div"><i class="fa fa-caret-down icon-light"></i><b>'+t('Operators')+'</b></div>' + operatorsHTML;

                if(membersHtml != '')
                    membersHtml = '<br><div class="chat-member-div"><i class="fa fa-caret-down icon-light"></i><b>'+t('Visitors')+'</b></div>' + membersHtml;

                $('#chat-members-list').html(operatorsHTML + membersHtml)
                $('#chat-members-list').css({display:(displayMinimized) ? 'none' : 'block'});
                $('#chat-members').css({height:(displayMinimized) ? '81px': '', top: (displayMinimized) ? '' : '1px', width: (displayMinimized) ? '19px' : this.memberListWidth + 'px'});
                $('#chat-members-minimize i').attr('class',(displayMinimized) ? 'fa fa-chevron-right' : 'fa fa-chevron-left');
                $('#chat-members-minimize').css({display:'block'});
                $('#chat-buttons').css({'padding-left': (displayMinimized) ? '20px' : 0});
                lzm_displayLayout.resizeChatView();
            }
            else
                hideMembers = true;
        }

        if(hideMembers)
        {
            $('#chat-members-minimize, #chat-members').css({display:'none'});
            $('#chat-progress, #chat-action, #chat-buttons').css({left: 0});
            $('#chat-buttons').css({'padding-left': 0});
        }

        $('#chat-members-minimize i').attr('class',(displayMinimized) ? 'fa fa-chevron-right' : 'fa fa-chevron-left');

    }
    catch(e){deblog(e);}
};

ChatDisplayClass.prototype.createUserControlPanel = function (user_status, myName, myUserId) {
    var userStatusCSS = {'background-repeat': 'no-repeat', 'background-position': 'center'};
    for (var i = 0; i < this.lzm_commonConfig.lz_user_states.length; i++) {
        if (parseInt(user_status) == this.lzm_commonConfig.lz_user_states[i].index) {
            userStatusCSS['background-image'] = lzm_displayHelper.addBrowserSpecificGradient('url("' + this.lzm_commonConfig.lz_user_states[i].icon + '")');
            break;
        }
    }

    var userSettingsHtml = '<span class="ui-btn-inner">' +
        '<span class="ui-icon ui-icon-arrow-d ui-icon-shadow"> </span><span class="ui-btn-text" style="margin-left: -7px;">';
    if (myName != '') {
        userSettingsHtml += myName + '&nbsp;';
    } else {
        userSettingsHtml += myUserId + '&nbsp;';
    }
    userSettingsHtml += '</span></span>';

    var mainArticleWidth = $('#content_chat').width();
    var thisUserstatusButton = $('#userstatus-button');
    var thisUsersettingsButton = $('#usersettings-button');
    var thisBlankButton = $('#blank-button');
    var thisWishlistButton = $('#wishlist-button');

    var userstatusButtonWidth = 50;
    var usersettingsButtonWidth = 150;
    if (mainArticleWidth > 350) {
        usersettingsButtonWidth = 250;
    } else if (mainArticleWidth > 325) {
        usersettingsButtonWidth = 225;
    } else if (mainArticleWidth > 300) {
        usersettingsButtonWidth = 200;
    } else if (mainArticleWidth > 275) {
        usersettingsButtonWidth = 175;
    }
    var wishlistButtonWidth = 40;
    var blankButtonWidth = mainArticleWidth - userstatusButtonWidth - usersettingsButtonWidth - wishlistButtonWidth - 5;

    thisUserstatusButton.css(userStatusCSS);
    thisUsersettingsButton.html(userSettingsHtml);

    thisUserstatusButton.width(userstatusButtonWidth);
    thisUsersettingsButton.width(usersettingsButtonWidth);
    thisWishlistButton.width(wishlistButtonWidth);
    thisBlankButton.width(blankButtonWidth);
    thisWishlistButton.children('.ui-btn-inner').css({'padding-left': '0px'});

    $('#user-control-panel').trigger('create');
};

ChatDisplayClass.prototype.showUsersettingsMenu = function () {
    $('#userstatus-menu').css('display', 'none');
    $('#minified-dialogs-menu').css('display', 'none');
    this.showUserstatusHtml = false;
    this.showMinifiedDialogsHtml = false;
    var tableWidth = $('#main-menu-panel-settings').width();
    var thisUsersettingsMenu = $('#usersettings-menu');
    var usersettingsMenuHtml = '<table style="min-width: ' + tableWidth + 'px;" class="lzm-unselectable">';
    usersettingsMenuHtml += '<tr><td class="usersettings-menu-spacer"></td></tr>';
    usersettingsMenuHtml += '<tr><td onclick="manageUsersettings(event);">' + t('Options') + '</td></tr>';
    usersettingsMenuHtml += '<tr><td onclick="showFilterList(event);">' + t('Filters') + '</td></tr>';
    usersettingsMenuHtml += '<tr><td onclick="changePassword(event);">' + t('Change Password') + '</td></tr>';
    usersettingsMenuHtml += '<tr><td onclick="personalChatLink();">' + tid('per_c_link') + '</td></tr>';
    usersettingsMenuHtml += '<tr><td class="usersettings-menu-spacer"></td></tr>';
    usersettingsMenuHtml += '<tr><td onclick="showTranslationEditor(event);">' + t('Translation Editor') + '</td></tr>';
    usersettingsMenuHtml += '<tr><td onclick="showUserManagement(event);">' + t('User Management') + '</td></tr>';
    var dc = (lzm_chatServerEvaluation.m_ServerConfigBlocked) ? ' class="ui-disabled' : '';
    usersettingsMenuHtml += '<tr><td'+dc+' onclick="initServerConfiguration(event);">' + tid('server_conf') + '</td></tr>';
    usersettingsMenuHtml += '<tr><td onclick="initLinkGenerator(event);">' + t('Link Generator') + '</td></tr>';
    usersettingsMenuHtml += '<tr><td onclick="initEventConfiguration(event);">' + tid('events') + '</td></tr>';
    usersettingsMenuHtml += '<tr><td onclick="initFeedbacksConfiguration(event);">' + tid('feedbacks') + '</td></tr>';
    usersettingsMenuHtml += '<tr><td class="usersettings-menu-spacer"></td></tr>';
    usersettingsMenuHtml += '<tr><td onclick="logout(true, false, event);">' + t('Log out') + '</td></tr>';
    usersettingsMenuHtml += '</table>';
    thisUsersettingsMenu.html(usersettingsMenuHtml);
    thisUsersettingsMenu.css({display: 'block'});
};

ChatDisplayClass.prototype.createCommentHtml = function(type, line, commentText, operatorName, operatorId, time){
    var commentHtml = '';
    var avatar = '<div style="background-image: url(\'./../picture.php?intid='+lz_global_base64_url_encode(operatorId)+'\');"></div>';
    if(type=='ticket'){
        commentHtml = '<tr id="comment-line-' + line + '" class="comment-line lzm-unselectable" style="cursor:pointer;" onclick="handleTicketCommentClick(' + line + ', \'' + lz_global_base64_encode(commentText) + '\');"><td style="width:50px;" class="CMTP">' + avatar + '</td><td style="vertical-align: top;"><span class="comment-line-date">' + time + '</span><br><span><b>' + operatorName + '</b></span><div>'
        +lzm_commonTools.escapeHtml(commentText) +'</div></td></tr>';
        }
    else{
        commentHtml = '<tr onclick="handleVisitorCommentClick(' + line + ');" style="cursor: pointer;" id="visitor-comment-line-' + line + '" class="comment-line lzm-unselectable" data-comment-no="' + line + '"><td style="width:50px;" class="CMTP">' + avatar + '</td><td style="vertical-align: top;"><span class="comment-line-date">' + time + '</span><br><span><b>' + operatorName + '</b></span><div>'
            +lzm_commonTools.escapeHtml(commentText) +'</div></td></tr>';
        }
    return commentHtml;
}

ChatDisplayClass.prototype.showUserstatusMenu = function (user_status, myName, myUserId) {
    $('#usersettings-menu').css('display', 'none');
    $('#minified-dialogs-menu').css('display', 'none');
    this.showUsersettingsHtml = false;
    this.showMinifiedDialogsHtml = false;

    var tableWidth = $('#main-menu-panel-settings').width();
    var thisUserstatusMenu = $('#userstatus-menu');
    var userstatusMenuHtml = '<table style="min-width: ' + tableWidth + 'px;">';
    for (var statusIndex = 0; statusIndex < this.lzm_commonConfig.lz_user_states.length; statusIndex++) {
        if (this.lzm_commonConfig.lz_user_states[statusIndex].index != 2) {
            userstatusMenuHtml += '<tr><td class="lzm-unselectable" ' +
                'onclick="setUserStatus(' + this.lzm_commonConfig.lz_user_states[statusIndex].index + ', event)">' +
                '&nbsp;<img src="' + this.lzm_commonConfig.lz_user_states[statusIndex].icon + '" width="14px" ' +
                'height="14px">&nbsp;&nbsp;&nbsp;' + t(this.lzm_commonConfig.lz_user_states[statusIndex].text) + '</td></tr>'
        }
    }
    //userstatusMenuHtml += '<tr><td></td></tr>' +
    userstatusMenuHtml += '</table>';
    thisUserstatusMenu.html(userstatusMenuHtml);
    thisUserstatusMenu.css({display: 'block'});
};

ChatDisplayClass.prototype.setUserStatus = function (statusValue) {
    $('#userstatus-menu').css('display', 'none');
    this.showUserstatusHtml = false;
    this.user_status = statusValue;
    var statusIcon = lzm_commonConfig.lz_user_states[2].icon;
    for (var i=0; i<lzm_commonConfig.lz_user_states.length; i++) {
        if (lzm_commonConfig.lz_user_states[i].index == this.user_status) {
            statusIcon = lzm_commonConfig.lz_user_states[i].icon;
        }
    }
    $('#main-menu-panel-status-icon').css({'background-image': 'url(\'' + statusIcon + '\')'});
};

ChatDisplayClass.prototype.finishOperatorInvitation = function () {
    clearEditorContents();
    $('#chat').css('display', 'block');
};

ChatDisplayClass.prototype.finishChatForward = function () {
    clearEditorContents();
    $('#invite-operator').css('display', 'none');
    $('#forward-chat').css('display', 'none');
    $('#leave-chat').css('display', 'none');
    $('#chat-action').css('display', 'none');
    $('#chat-table').css('display', 'block');
    $('#chat-buttons').css('display', 'none');
};

ChatDisplayClass.prototype.finishLeaveChat = function () {
    $('#chat-table').css('display', 'block');
    $('#chat-progress, #chat-qrd-preview').css('display', 'none');
    $('#chat-action').css('display', 'none');
    $('#chat-buttons').css('display', 'none');
};

ChatDisplayClass.prototype.showInternalChat = function (thisUser, enableButtons) {
    var name = '';
    if (typeof thisUser.name != 'undefined') {
        name = thisUser.name;
    } else {
        name = thisUser.userid;
    }
    $('#visitor-info').html('<div id="visitor-info-headline"><h3>' + t('Visitor Information') + '</h3></div>' +
        '<div id="visitor-info-headline2"></div>').trigger('create');

    $('#chat').css('display', 'block');
    $('#errors').css('display', 'none');
    setEditorDisplay('block');

    this.createChatHtml(thisUser);
    this.createActiveChatPanel(false, true, false);

    $('#chat-progress').css('display', 'block');
    $('#chat-qrd-preview').css('display', 'block');
    $('#chat-action').css('display', 'block');
    $('#active-chat-panel').css('display', 'block');

    var thisChatButtons = $('#chat-buttons');
    var disabledClass = (enableButtons) ? '' : ' class="ui-disabled"';
    var chatButtonsHtml = '<div' + disabledClass + ' style="margin: 6px 0px;">';
    chatButtonsHtml += lzm_inputControls.createInputControlPanel();
    chatButtonsHtml += lzm_inputControls.createButton('visitor-chat-actions', '', 'showVisitorChatActionContextMenu(\'' + this.thisUser.id + '\', \'actions\', event);', t('Actions'), '<i class="fa fa-wrench"></i>', 'lr', {'margin-left': '4px'}, '', '','b');
    chatButtonsHtml += '<span style="float:right">'+lzm_inputControls.createButton('send-chat-btn', '', 'sendTranslatedChat(grabEditorContents())', t('Send'), '<i class="fa fa-send"></i>', 'lr', {'padding-left': '10px', 'padding-right': '10px', 'margin-right': '4px'}, t('Send'),'','b');
    chatButtonsHtml += '</span></div>';
    thisChatButtons.html(chatButtonsHtml).trigger('create').css('display', 'block');

    $('.lzm-button').mouseenter(function() {
        $(this).css('background-image', $(this).css('background-image').replace(/linear-gradient\(.*\)/,'linear-gradient(#f6f6f6,#e0e0e0)'));
    });
    $('.lzm-button').mouseleave(function() {
        $(this).css('background-image', $(this).css('background-image').replace(/linear-gradient\(.*\)/,'linear-gradient(#ffffff,#f1f1f1)'));
    });
};

ChatDisplayClass.prototype.showActiveVisitorChat = function (thisUser) {
    var thisUserChat = lzm_chatServerEvaluation.userChats.getUserChat(thisUser.id + '~' + thisUser.b_id);
    var thisChatAction = $('#chat-action');
    var thisChatProgress = $('#chat-progress');
    var thisChatQrdPreview = $('#chat-qrd-preview');
    var thisChatTable = $('#chat-table');
    var thisChatButtons = $('#chat-buttons');

    thisChatTable.css('display', 'block');

    if (thisUserChat == null || thisUserChat.member_status != 2) {
        thisChatAction.css('display', 'block');
        setEditorDisplay('block');
    } else
    {
        thisChatAction.css('display', 'none');
        setEditorDisplay('none');
    }
    thisChatProgress.css('display', 'block');
    thisChatQrdPreview.css('display', 'block');
    $('#active-chat-panel').css({display: 'block'});
    var openChatHtmlString = '';
    if (thisUserChat != null)
    {
        openChatHtmlString += '<div style="margin: 6px 0;">';
        var disabledClass = '';
        if (lzm_chatServerEvaluation.userChats.getUserChat(thisUser.id + '~' + thisUser.b_id).status == 'left' ||
            lzm_chatServerEvaluation.userChats.getUserChat(thisUser.id + '~' + thisUser.b_id).status == 'declined') {
            disabledClass += 'ui-disabled ';
        }
        var hiddenClass = (thisUserChat.member_status != 0) ? 'disabled-chat-button ui-disabled ' : '';
        if (thisUserChat.member_status != 2) {
            openChatHtmlString += lzm_inputControls.createInputControlPanel('', disabledClass);
        }
        var visitorChat = thisUser.id + '~' + thisUser.b_id + '~' + thisUser.b_chat.id;
        var myButtonCss = {'margin-left': '4px'};

        var visitorLanguage = lzm_chatServerEvaluation.userLanguage;
        try {
            visitorLanguage = ($.inArray(thisUser.lang, this.translationLangCodes) != -1) ? thisUser.lang : thisUser.lang.split('-')[0].split('_')[0];
        } catch(e) {}

        if(visitorLanguage.toUpperCase()=='EN' && thisUser.ctryi2 != '' && thisUser.ctryi2.toUpperCase() != 'EN')
            visitorLanguage = this.getCountryLanguage(thisUser.ctryi2);

        var translateButtonCss = lzm_commonTools.clone(myButtonCss);
        openChatHtmlString += lzm_inputControls.createButton('translate-chat', hiddenClass + disabledClass,'showTranslateOptions(\'' + visitorChat + '\', \'' + visitorLanguage + '\');', '', '<i class="fa fa-lg fa-language"></i>', 'lr', translateButtonCss, t('Translate'));
        openChatHtmlString += lzm_inputControls.createButton('visitor-chat-actions', '', 'showVisitorChatActionContextMenu(\'' + this.thisUser.id + '~' + thisUser.b_id + '\', \'actions\', event);', t('Actions'), '<i class="fa fa-wrench"></i>', 'lr', {'margin-left': '4px'},'','','b',1150);
        openChatHtmlString += '<span style="float:right">'+lzm_inputControls.createButton('send-chat-btn', '', 'sendTranslatedChat(grabEditorContents())', t('Send'), '<i class="fa fa-send"></i>', 'lr', {'padding-left': '10px', 'padding-right': '10px','margin-right': '4px'}, t('Send'),'','b',1150)+'</span>';
        openChatHtmlString += '</div>';
    }

    thisChatButtons.html(openChatHtmlString).trigger("create");

    if (typeof lzm_chatDisplay.chatTranslations[visitorChat] != 'undefined' && lzm_chatDisplay.chatTranslations[visitorChat].tmm != null &&
        lzm_chatDisplay.chatTranslations[visitorChat].tvm != null && (lzm_chatDisplay.chatTranslations[visitorChat].tmm.translate ||
        lzm_chatDisplay.chatTranslations[visitorChat].tvm.translate)) {
        $('#translate-chat').addClass('lzm-button-b-active');
    } else
        $('#translate-chat').removeClass('lzm-button-b-active');


    thisChatButtons.css('display', 'block');

    $('.lzm-button').mouseenter(function() {
        $(this).css('background-image', $(this).css('background-image').replace(/linear-gradient\(.*\)/,'linear-gradient(#f6f6f6,#e0e0e0)'));
    });
    $('.lzm-button').mouseleave(function() {
        $(this).css('background-image', $(this).css('background-image').replace(/linear-gradient\(.*\)/,'linear-gradient(#ffffff,#f1f1f1)'));
    });
};

ChatDisplayClass.prototype.showPassiveVisitorChat = function (thisUser, id, b_id) {

    clearEditorContents();
    var thisChatAction = $('#chat-action');
    var thisChatProgress = $('#chat-progress');
    var thisChatQrdPreview = $('#chat-qrd-preview');
    var thisChatButtons = $('#chat-buttons');

    thisChatAction.css('display', 'none');
    setEditorDisplay('none');
    thisChatProgress.css('display', 'block');
    thisChatQrdPreview.css('display', 'block');
    $('#active-chat-panel').css({display: 'block'});


    var noOpenChatHtmlString = '';
    var thisUserChat = lzm_chatServerEvaluation.userChats.getUserChat(id + '~' + b_id);
    var vb = lzm_chatServerEvaluation.visitors.getVisitorBrowser(id, b_id), acceptString = t('Start Chat');
    if (vb[1] != null && vb[1].chat.id != '' && vb[1].chat.cmb == 1 && vb[1].cphone != '')
        acceptString = t('Call now');

    if (thisUserChat != null) {
        var disabledClass = '';
        if (thisUserChat.status == 'left' || thisUserChat.status == 'declined' || thisUserChat.group_chat || !thisUserChat.my_chat)
            disabledClass = 'ui-disabled ';
        noOpenChatHtmlString += '<div style="margin: 6px 0;">';
        noOpenChatHtmlString += lzm_inputControls.createButton('show-visitor-info', '', 'showVisitorInfo(\'' + this.thisUser.id + '\');', '', '<i class="fa fa-info"></i>', 'lr',
                {'margin-left': '4px'}, t('Show information')) +
            lzm_inputControls.createButton('accept-chat', disabledClass, '', acceptString, '<i class="fa fa-check"></i>', 'force-text',{'margin-left': '2px','font-size':'11px',padding:'2px 6px'}, t('Start Chat'), 20, 'd') +
            lzm_inputControls.createButton('decline-chat', disabledClass, '', '', '<i class="fa fa-remove"></i>', 'lr', {'margin-left': '4px'}, t('Decline')) +
            lzm_inputControls.createButton('forward-chat', disabledClass, '', '', '<i class="fa fa-arrow-circle-right"></i>', 'lr',{'margin-left': '4px'}, t('Forward')) +
            lzm_inputControls.createButton('ban-visitor', '', 'showFilterCreation(\'visitor\',\'' + this.thisUser.id + '\');', '', '<i class="fa fa-ban"></i>', 'lr',
                {'margin-left': '4px'}, t('Ban (add filter)'));
        noOpenChatHtmlString += '</div>';
        thisChatButtons.html(noOpenChatHtmlString).trigger("create");
        thisChatAction.css('display', 'none');
        thisChatProgress.css('display', 'block');
        thisChatQrdPreview.css('display', 'block');
        thisChatButtons.css('display', 'block');
    }
    else
        thisChatButtons.html(noOpenChatHtmlString).trigger("create");
};

ChatDisplayClass.prototype.showExternalChat = function () {
    var thisInviteOperator = $('#invite-operator');
    var thisForwardChat = $('#forward-chat');
    var thisLeaveChat = $('#leave-chat');
    $('#decline-chat').css('display', 'none');
    $('#accept-chat').css('display', 'none');
    thisLeaveChat.css('display', 'block');
    thisInviteOperator.css('display', 'block');
    thisForwardChat.css('display', 'block');
};

ChatDisplayClass.prototype.showRefusedChat = function (thisUser) {
    this.createActiveChatPanel(false, true, false);
    this.createHtmlContent(thisUser, thisUser.id + '~' + thisUser.b_id);
    $('#visitor-info').html('');
    $('#chat-action').css('display', 'block');
    $('#chat-progress').css('display', 'block');
    $('#chat-qrd-preview').css('display', 'block');
};

ChatDisplayClass.prototype.showLeaveChat = function (thisUser) {
    this.createActiveChatPanel(false, true, false);
    this.createHtmlContent(thisUser, thisUser.id + '~' + thisUser.b_id);
    $('#visitor-info').html('');
    $('#chat-action').css('display', 'none');
};

ChatDisplayClass.prototype.createChatMemberActionMenu = function(object) {
    var contextMenuHtml = '', disabledClass = '';
    if(object.browserId.length==0){
        contextMenuHtml += '<div onclick="chatInternalWith(\''+object.userId+'\',\'\',\'\');removeChatMembersListContextMenu();"><span id="chat-show-info" class="cm-line cm-click">' + tid('start_chat') + '</span></div>';
    }
    else{

        var activeUserChat = lzm_chatServerEvaluation.userChats.getUserChat(object.userId + '~' + object.browserId);
        var pgid = lzm_chatServerEvaluation.userChats.isInPublicGroupChat(activeUserChat);
        var cRemove = 'removeFromDynamicGroup(\''+object.userId+'~'+object.browserId+'\', \''+object.groupId+'\');';
        var cTake = 'takeChat(\''+object.userId+'\',\''+object.browserId+'\',\''+object.chatId+'\', \''+object.groupId+'\');';

        disabledClass = (!pgid || lzm_chatDisplay.user_status == 3) ? ' class="ui-disabled"' : '';
        contextMenuHtml += '<div' + disabledClass + ' onclick="'+cRemove+cTake+';removeChatMembersListContextMenu();"><span id="chat-show-info" class="cm-line cm-click">' + tid('take') + '</span></div>';

        disabledClass = (activeUserChat.status == 'left') ? ' class="ui-disabled"' : '';
        contextMenuHtml += '<div' + disabledClass + ' onclick="closeChat(\''+object.chatId+'\',\''+object.userId+'\',\''+object.browserId+'\',true);removeChatMembersListContextMenu();"><span id="chat-show-info" class="cm-line cm-click">' + tid('close') + '</span></div>';

        disabledClass = (activeUserChat.status != 'new' || pgid) ? ' class="ui-disabled"' : '';
        contextMenuHtml += '<div' + disabledClass + ' onclick="declineChat(\''+object.userId+'\', \''+object.browserId+'\', \''+object.chatId+'\');removeChatMembersListContextMenu();"><span id="chat-show-info" class="cm-line cm-click">' + tid('decline') + '</span></div>';

        contextMenuHtml += '<div onclick="showFilterCreation(\'visitor\',\''+object.userId+'\');removeChatMembersListContextMenu();"><span id="chat-show-info" class="cm-line cm-click">' + tid('ban_add_filter') + '</span></div>';
    }
    return contextMenuHtml;
}

ChatDisplayClass.prototype.createChatActionMenu = function(myObject) {
    var disabledClass, contextMenuHtml = '';
    var isDynamicGroup = lzm_chatServerEvaluation.groups.isDynamicGroup(myObject.id);

    disabledClass = (myObject.b_id == '') ? ' class="ui-disabled"' : '';
    contextMenuHtml += '<div' + disabledClass + ' onclick="showVisitorInfo(\'' + myObject.id + '\');removeVisitorChatActionContextMenu();"><span id="chat-show-info" class="cm-line cm-click">' + t('Details') + '</span></div><hr />';
    contextMenuHtml += '<div onclick="addQrdToChat(3);removeVisitorChatActionContextMenu();"><span id="chat-send-file" class="cm-line cm-click">' + t('Send File') + '</span></div>';
    contextMenuHtml += '<div onclick="addQrdToChat(2);removeVisitorChatActionContextMenu();"><span id="chat-send-link" class="cm-line cm-click">' + t('Send Url') + '</span></div>';
    contextMenuHtml += '<div onclick="initWebsitePush(\'' + myObject.id + '\');removeVisitorChatActionContextMenu();"><span id="chat-send-link" class="cm-line cm-click">' + tid('website_push') + '</span></div>';

    disabledClass = (typeof myObject.phone == 'undefined' || myObject.phone == '') ? ' class="ui-disabled"' : '';
    contextMenuHtml += '<div' + disabledClass + ' onclick="showPhoneCallDialog(\'' + myObject.id + '~' + myObject.b_id + '\', -1, \'chat\');removeVisitorChatActionContextMenu();"><span id="chat-start-phone-call" class="cm-line cm-click">' + t('Phone Call') + '</span></div><hr />';

    disabledClass = (myObject.b_id == '' || myObject.member_status != 0) ? ' class="ui-disabled"' : '';
    contextMenuHtml += '<div' + disabledClass + ' onclick="forwardChat(\'' + myObject.chat_id + '\', \'forward\');removeVisitorChatActionContextMenu();"><span id="chat-forward-chat" class="cm-line cm-click">' + t('Forward Chat') + '</span></div>';
    disabledClass = (myObject.b_id == '') ? ' class="ui-disabled"' : '';
    contextMenuHtml += '<div' + disabledClass + ' onclick="forwardChat(\'' + myObject.chat_id + '\', \'invite\');removeVisitorChatActionContextMenu();"><span id="chat-invite-operator" class="cm-line cm-click">' + t('Invite Operator') + '</span></div>';
    disabledClass = (myObject.b_id == '' || myObject.member_status != 0) ? ' class="ui-disabled"' : '';
    contextMenuHtml += '<div' + disabledClass + ' onclick="addToDynamicGroup(\'' + myObject.id + '\', \'' + myObject.b_id + '\', \'' + myObject.chat_id + '\');removeVisitorChatActionContextMenu();"><span id="chat-add-dynamic" class="cm-line cm-click">' + t('Add to Dynamic Group') + '</span></div><hr />';
    disabledClass = (myObject.b_id == '') ? ' class="ui-disabled"' : '';
    contextMenuHtml += '<div' + disabledClass + ' onclick="showFilterCreation(\'visitor\',\'' + myObject.id + '\');removeVisitorChatActionContextMenu();"><span id="chat-add-filter" class="cm-line cm-click">' + t('Ban (add filter)') + '</span></div><hr />';
    contextMenuHtml += '<div onclick="leaveChat();removeVisitorChatActionContextMenu();"><span id="chat-leave-chat" class="cm-line cm-click">' + t('Leave Chat') + '</span></div>';
    disabledClass = (!isDynamicGroup) ? ' class="ui-disabled"' : '';
    contextMenuHtml += '<div' + disabledClass + ' onclick="leaveChat();removeFromDynamicGroup(\''+lzm_chatServerEvaluation.myId+'\', \''+myObject.id+'\');removeVisitorChatActionContextMenu();"><span id="chat-leave-chat" class="cm-line cm-click">' + tid('leave_group') + '</span></div><hr />';
    contextMenuHtml += '<div onclick="closeAllInactiveChats();removeVisitorChatActionContextMenu();"><span id="chat-close-all-offline" class="cm-line cm-click">' + t('Close all offline chats') + '</span></div>';
    return contextMenuHtml;
};

ChatDisplayClass.prototype.catchEnterButtonPressed = function (e) {
    var that = this, thisChatInput = $('#chat-input');
    if (e.which == 13 || e.keyCode == 13)
    {
        try {
            var useResource = '';
            for (var i=0; i<shortCutResources.length; i++) {
                if (shortCutResources[i].complete) {
                    useResource = shortCutResources[i].id;
                    break;
                }
            }
            if (useResource != '')
            {
                var resource = lzm_chatServerEvaluation.cannedResources.getResource(useResource);
                if (resource != null && $.inArray(resource.ty, ['2', '3', '4']) != -1 && (that.isApp || that.isMobile) &&
                    lzm_chatUserActions.active_chat_reco != '')
                    sendQrdPreview(useResource, lzm_chatUserActions.active_chat_reco);
                else if (resource != null && $.inArray(resource.ty, ['2', '3', '4']) != -1 && (that.isApp || that.isMobile) && lzm_chatUserActions.active_chat_reco == '')
                {

                }
                else
                    useEditorQrdPreview(useResource);
            }
            else if (thisChatInput.val().indexOf('/') == 0)
            {

            }
            else
            {
                sendTranslatedChat(grabEditorContents());
            }
        } catch(ex) {}
        e.preventDefault();
    }
    if (e.which == 10 || e.keyCode == 10) {
        var tmp = thisChatInput.val();
        thisChatInput.val(tmp + '\n');
    }
};

ChatDisplayClass.prototype.searchButtonChange = function(type) {
    $('#search-'+type).css('background',($('#search-'+type).val().length) ? '#ffffe1' : '#fff');
};

ChatDisplayClass.prototype.searchButtonUp = function(type, myObjects, e, inDialog) {
    e.stopPropagation();
    var thisClass = this,  searchString = '';
    var sid = (inDialog) ? 'd-' : '';
    inDialog = (typeof inDialog != 'undefined') ? inDialog : false;

    if (e.which == 13 || e.keycode == 13 || e.charCode == 13) {
        thisClass.searchButtonUpSet[type] = 0;
        switch (type) {
            case 'qrd':
                thisClass.resourcesDisplay.highlightSearchResults(myObjects,true);
                break;
            case 'ticket':
                searchString = $('#search-ticket').val();
                searchTickets(searchString);
                break;
            case 'archive':
                searchString = $('#search-archive').val();
                if (searchString != '') {
                    $('#clear-archive-search').css({display: 'inline'});
                    thisClass.archiveDisplay.styleArchiveClearBtn();
                    $('#archive-filter').addClass('ui-disabled');
                } else {
                    $('#clear-archive-search').css({display: 'none'});
                    $('#archive-filter').removeClass('ui-disabled');
                }
                searchArchive(searchString);
                break;
            case 'qrd-list':
                searchString = $('#'+sid+'search-resource').val();
                thisClass.resourcesDisplay.fillQrdSearchList(thisClass.resourcesDisplay.qrdChatPartner, inDialog);
                break;
        }
    } else {
        thisClass.searchButtonUpSet[type] = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
        setTimeout(function() {
            if (thisClass.searchButtonUpSet[type] != 0 && lzm_chatTimeStamp.getServerTimeString(null, false, 1) - thisClass.searchButtonUpSet[type] >= 990) {
                switch (type) {
                    case 'qrd':
                        thisClass.resourcesDisplay.highlightSearchResults(myObjects,true);
                        break;
                    case 'ticket':
                        searchString = $('#search-ticket').val();
                        if (searchString != '') {
                            $('#clear-ticket-search').css({display: 'inline'});
                            thisClass.styleTicketClearBtn();
                        } else {
                            $('#clear-ticket-search').css({display: 'none'});
                        }
                        searchTickets(searchString);
                        break;
                    case 'archive':
                        searchString = $('#search-archive').val();
                        if (searchString != '') {
                            $('#clear-archive-search').css({display: 'inline'});
                            thisClass.archiveDisplay.styleArchiveClearBtn();
                        } else {
                            $('#clear-archive-search').css({display: 'none'});
                        }
                        searchArchive(searchString);
                        break;
                    case 'qrd-list':
                        searchString = $('#search-resource').val();
                        thisClass.resourcesDisplay.fillQrdSearchList(thisClass.resourcesDisplay.qrdChatPartner, inDialog);
                        break;
                }
            }
        }, 1000);
    }

};

ChatDisplayClass.prototype.showSubMenu = function(place, category, objectId, contextX, contextY, menuWidth, menuHeight) {
    var i = 0, inDialog;
    var contextMenuHtml = '<div class="cm lzm-unselectable" id="' + place + '-context" onclick="handleContextMenuClick(event);">';
    contextMenuHtml += '<div onclick="showSuperMenu(\'' + place + '\', \'' + category + '\', \'' + objectId + '\', ' + contextX + ', ' + contextY + ', ' + menuWidth + ', ' + menuHeight + ')"><i class="fa fa-caret-left lzm-ctxt-left-fa"></i><span id="show-super-menu" class="cm-line cm-line-icon-left cm-click">' + t('Back') + '</span></div><hr />';
    switch(place)
    {
        case 'qrd-tree':
            if(category=='kb_add')
            {
                inDialog = false;
                contextMenuHtml += '<div onclick="addQrd(1);"><span id="add-qrd-ctxt" class="cm-line">' + tid('text') + '</span></div>';
                contextMenuHtml += '<div onclick="addQrd(2);"><span id="add-qrd-clnk" class="cm-line">' + tid('link') + '</span></div>';
                contextMenuHtml += '<div onclick="addQrd(3);"><span id="add-qrd-cfile" class="cm-line">' + tid('file') + '</span></div>';
                contextMenuHtml += '<div onclick="addQrd(0);"><span id="add-qrd-cfld" class="cm-line">' + tid('resource_folder') + '</span></div>';
            }
            break;
        case 'ticket-list':
        case 'visitor-information':
            var ticket = null, ticketEditor = null, ticketGroup = null;
            for (i=0; i<this.ticketListTickets.length; i++) {
                if(this.ticketListTickets[i].id == objectId) {
                    ticket = this.ticketListTickets[i];
                }
            }
            if (ticket != null) {
                ticketEditor = (typeof ticket.editor != 'undefined' && ticket.editor != false) ? ticket.editor.ed : '';
                ticketGroup = (typeof ticket.editor != 'undefined' && ticket.editor != false && ticket.editor.g != '') ? ticket.editor.g : ticket.gr;
            }
            if(category=='operator')
            {
                var operators = lzm_chatServerEvaluation.operators.getOperatorList();
                for (i=0; i<operators.length; i++)
                    if (operators[i].isbot != '1' && operators[i].id != ticketEditor) {
                        contextMenuHtml += '<div onclick="setTicketOperator(\'' + objectId + '\', \'' + operators[i].id + '\')"><span id="ticket-set-operator-' + operators[i].id + '" class="cm-line cm-click">' + operators[i].name + '</span></div>';
                    }
            }
            else if(category=='group')
            {
                var groups = lzm_chatServerEvaluation.groups.getGroupList();
                for (i=0; i<groups.length; i++) {
                    if (groups[i].id != ticketGroup) {
                        var groupHash = md5(groups[i].id).substr(0,6);
                        contextMenuHtml += '<div onclick="setTicketGroup(\'' + objectId + '\', \'' + groups[i].id + '\')"><span id="ticket-set-group-' + groupHash + '" class="cm-line cm-click">' + groups[i].name + '</span></div>';
                    }
                }
            }
            else if(category=='ticket_priority')
            {
                inDialog = (place == 'ticket-list') ? false : true;
                contextMenuHtml += '<div onclick="setTicketPriority(\'' + objectId + '\',4)"><span class="cm-line cm-line-icon-left cm-click text-red text-bold">' + tid('priority_4') + '</span></div>';
                contextMenuHtml += '<div onclick="setTicketPriority(\'' + objectId + '\',3)"><span class="cm-line cm-line-icon-left cm-click text-orange text-bold">' + tid('priority_3') + '</span></div>';
                contextMenuHtml += '<div onclick="setTicketPriority(\'' + objectId + '\',2)"><span class="cm-line cm-line-icon-left cm-click">' + tid('priority_2') + '</span></div>';
                contextMenuHtml += '<div onclick="setTicketPriority(\'' + objectId + '\',1)"><span class="cm-line cm-line-icon-left cm-click">' + tid('priority_1') + '</span></div>';
                contextMenuHtml += '<div onclick="setTicketPriority(\'' + objectId + '\',0)"><span class="cm-line cm-line-icon-left cm-click">' + tid('priority_0') + '</span></div>';

            }
            else if(category=='ticket_status')
            {
                inDialog = (place == 'ticket-list') ? false : true;
                contextMenuHtml += '<div onclick="changeTicketStatus(0,null,null,null,false)"><i class="fa fa-question-circle" style="color: #5197ff;"></i><span id="set-ticket-open" class="cm-line cm-line-icon-left cm-click">' + t('Open (O)') + '</span></div>';
                contextMenuHtml += '<div onclick="changeTicketStatus(1,null,null,null,false)"><i class="fa fa-gear" style="color: #808080"></i><span id="set-ticket-progress" class="cm-line cm-line-icon-left cm-click">' + t('In Progress (P)') + '</span></div>';
                contextMenuHtml += '<div onclick="changeTicketStatus(2,null,null,null,false)"><i class="fa fa-check-circle" style="color: #009a00;"></i><span id="set-ticket-closed" class="cm-line cm-line-icon-left cm-click">' + t('Closed (C)') + '</span></div>';
                contextMenuHtml += '<div onclick="changeTicketStatus(3,null,null,null,false)"><i class="fa fa-remove" style="color: #cc0000;"></i><span id="set-ticket-deleted" class="cm-line cm-line-icon-left cm-click">' + t('Deleted (D)') + '</span></div>';
            }
            else if(category=='ticket_sub_status')
            {
                var inDialog = (place == 'ticket-list') ? false : true;
                var myStatus = (ticket.editor) ? ticket.editor.st : 0;
                for(key in lzm_chatServerEvaluation.global_configuration.database['tsd'])
                {
                    var elem = lzm_chatServerEvaluation.global_configuration.database['tsd'][key];
                    if(elem.type == 0 && elem.parent == myStatus){
                        contextMenuHtml += '<div onclick="changeTicketStatus(null,\''+elem.name+'\',null,null,false)"><span class="cm-line cm-line-icon-left cm-click">' + elem.name + '</span></div>';
                    }
                }
            }
            else if(category=='ticket_channel')
            {
                var inDialog = (place == 'ticket-list') ? false : true;
                var channels = [t('Web'), t('Email'), t('Phone'), t('Misc'), t('Chat'), tid('feedback')];

                for(key in channels)
                {
                    var elem = channels[key];
                    contextMenuHtml += '<div onclick="changeTicketStatus(null,null,\''+key+'\',null,false)"><span class="cm-line cm-line-icon-left cm-click">' + elem + '</span></div>';
                }
            }
            else if(category=='ticket_sub_channel')
            {
                var inDialog = (place == 'ticket-list') ? false : true;
                var myChannel = ticket.t;
                for(key in lzm_chatServerEvaluation.global_configuration.database['tsd'])
                {
                    var elem = lzm_chatServerEvaluation.global_configuration.database['tsd'][key];
                    if(elem.type == 1 && elem.parent == myChannel){
                        contextMenuHtml += '<div onclick="changeTicketStatus(null,null,null,\''+elem.name+'\',false)"><span class="cm-line cm-line-icon-left cm-click">' + elem.name + '</span></div>';
                    }
                }
            }
            else if(category=='add_to_watch_list')
            {
                var operators = lzm_chatServerEvaluation.operators.getOperatorList('name', '', true);
                for (i=0; i<operators.length; i++)
                    if (operators[i].isbot != 1)
                        contextMenuHtml += '<div onclick="addTicketToWatchList(\'' + objectId + '\',\'' + operators[i].id + '\')"><span id="set-ticket-open" class="cm-line cm-line-icon-left cm-click">' + operators[i].name + '</span></div>';
            }
            break;
    }
    contextMenuHtml += '</div>';

    var myParent = 'body';
    if (place != 'body' && place != 'ticket-details' && place != 'visitor-list-table-div') {
        myParent = '#' + place + '-body';
    } else if (place != 'body') {
        myParent = '#' + place;
    }
    var checkSizeDivHtml = '<div id="context-menu-check-size-div" style="position:absolute; left: -3000px; top: -3000px;' + ' width: 2500px; height: 2500px;"></div>';
    $('body').append(checkSizeDivHtml);
    var testContextMenuHtml = contextMenuHtml.replace(/id="/g, 'id="test-');
    $('#context-menu-check-size-div').html(testContextMenuHtml);
    var contextHeight = $('#test-' + place + '-context').height();
    var contextWidth = (contextHeight > menuHeight) ? menuWidth + lzm_displayHelper.getScrollBarWidth() : menuWidth;
    contextHeight = Math.min(contextHeight, menuHeight);
    var contextTop = (contextHeight >= menuHeight) ? contextY : contextY + Math.round((menuHeight - contextHeight) / 2);

    $('#context-menu-check-size-div').remove();
    this.storedSuperMenu = $('#' + place + '-context').html();
    $('#' + place + '-context').replaceWith(contextMenuHtml);
    var myStyleObject = {left: contextX, width: contextWidth+'px', height: contextHeight+'px', top: contextTop};
    $('#' + place + '-context').css(myStyleObject);
};

ChatDisplayClass.prototype.showSuperMenu = function(place, category, objectId, contextX, contextY, menuWidth, menuHeight) {
    var contextMenuHtml = '<div class="cm lzm-unselectable" id="' + place + '-context" onclick="handleContextMenuClick(event);">' + this.storedSuperMenu + '</div>';
    $('#' + place + '-context').replaceWith(contextMenuHtml);
    var myStyleObject = {left: contextX+'px', width: menuWidth+'px', height: menuHeight+'px', top: contextY+'px'};
    $('#' + place + '-context').css(myStyleObject);
};

ChatDisplayClass.prototype.showContextMenu = function(place, myObject, mouseX, mouseY, button) {
    button = (typeof button != 'undefined') ? button : '';
    var thisClass = this;
    var contextX = mouseX + 'px', contextY = mouseY + 'px', contextMenuName = place;
    var widthOffset = 0;
    $('#' + place + '-context').remove();

    var contextMenuHtml = '<div class="cm lzm-unselectable" id="' + contextMenuName + '-context" onclick="handleContextMenuClick(event);">';
    switch(place) {
        case 'qrd-tree':
            contextMenuHtml += thisClass.resourcesDisplay.createQrdTreeContextMenu(myObject);
            break;
        case 'chat-info':
        case 'ticket-list':
        case 'visitor-information':
            widthOffset = 40;
            contextMenuHtml += thisClass.ticketDisplay.createTicketListContextMenu(myObject, place, widthOffset);
            break;
        case 'ticket-details':
            widthOffset = 20;
            contextMenuHtml += thisClass.ticketDisplay.createTicketDetailsContextMenu(myObject);
            break;
        case 'archive-filter':
            contextMenuHtml += thisClass.archiveDisplay.createArchiveFilterMenu(myObject);
            place = 'chat_page';
            break;
        case 'visitor-list-table-div':
            widthOffset = 20;
            contextMenuHtml += thisClass.visitorDisplay.createVisitorListContextMenu(myObject);
            break;
        case 'operator-list':
            widthOffset = 20;
            contextMenuHtml += thisClass.createOperatorListContextMenu(myObject);
            break;
        case 'report-list':
            contextMenuHtml += thisClass.reportsDisplay.createReportListContextMenu(myObject);
            break;
        case 'report-filter':
            contextMenuHtml += thisClass.reportsDisplay.createReportFilterMenu(myObject);
            place = 'chat_page';
            break;
        case 'all-chats':
            widthOffset = 20;
            contextMenuHtml += thisClass.allchatsDisplay.createAllChatsListContextMenu(myObject);
            break;
        case 'filter-list':
            contextMenuHtml += thisClass.FilterConfiguration.createFilterListContextMenu(myObject);
            break;
        case 'events-list':
            contextMenuHtml += thisClass.EventConfiguration.createEventsListContextMenu(myObject);
            place = 'event-configuration';
            break;
        case 'chat-actions':
            widthOffset = 40;
            contextMenuHtml += thisClass.createChatActionMenu(myObject);
            place = 'chat-container';
            break;
        case 'archive':
            widthOffset = 20;
            contextMenuHtml += thisClass.archiveDisplay.createArchiveContextMenu(myObject);
            break;
        case 'chat-members':
            widthOffset = 20;
            contextMenuHtml += thisClass.createChatMemberActionMenu(myObject);
            break;
    }
    contextMenuHtml += '</div>';

    var myParent = 'body';
    if (place != 'body' && place != 'ticket-details' && place != 'visitor-list-table-div' && place != 'chat-members' && place != 'chat_page' && place != 'chat-container') {
        myParent = '#' + place + '-body';
    } else if (place != 'body')
        myParent = '#' + place;

    if(typeof myObject.parent != 'undefined')
        myParent = '#' + myObject.parent;

    var checkSizeDivHtml = '<div id="context-menu-check-size-div" style="position:absolute; left: -1000px; top: -1000px; width: 800px; height: 800px;"></div>';
    $('body').append(checkSizeDivHtml);
    $('#context-menu-check-size-div').html(contextMenuHtml);

    var parentWidth = $(myParent).width();
    var parentHeight = $(myParent).height();
    var contextWidth = $('#' + contextMenuName + '-context').width();
    var contextHeight = Math.min(parentHeight - 24, $('#' + contextMenuName + '-context').height());

    if (parentHeight != null && parentWidth != null)
    {
        var remainingHeight = parentHeight - mouseY;
        var remainigWidth = parentWidth - mouseX;
        var widthDiff = remainigWidth - contextWidth - 12;
        var heightDiff = remainingHeight - contextHeight - 12;

        if ($.inArray(contextMenuName, ['ticket-filter', 'report-filter', 'archive-filter']) == -1) {
            if (widthDiff < 0) {
                contextX = Math.max((mouseX - contextWidth - 12), 5) + 'px';
            }
            if (heightDiff < 0) {
                contextY = Math.max((mouseY - contextHeight - 12), 5) + 'px';
            }
        } else {
            if (widthDiff < 0) {
                contextX = Math.max((mouseX + widthDiff - 10), 5) + 'px';
            }
            if (heightDiff < 0) {
                contextY = Math.max((mouseY + heightDiff- 10), 5) + 'px';
            }
        }
    }

    $('#context-menu-check-size-div').remove();
    contextMenuHtml = contextMenuHtml.replace(/%CONTEXTX%/g, parseInt(contextX)).replace(/%CONTEXTY%/g, parseInt(contextY)).replace(/%MYWIDTH%/g, parseInt(contextWidth)).replace(/%MYHEIGHT%/g, parseInt(contextHeight));
    $(myParent).append(contextMenuHtml);

    var myStyleObject = {left: contextX, width: (contextWidth+widthOffset)+'px', height: contextHeight+'px'};

    if (button == 'ticket-message-actions')
        myStyleObject.bottom = '32px';
    else if (button == 'chat-actions' && myObject.button == 'actions')
        myStyleObject.bottom = '76px';
    else
        myStyleObject.top = contextY;

    $('#' + contextMenuName + '-context').css(myStyleObject);
};

ChatDisplayClass.prototype.styleTicketClearBtn = function() {
    var ctsBtnWidth = $('#clear-ticket-search').width();
    var ctsBtnHeight =  $('#clear-ticket-search').height();
    var ctsBtnPadding = Math.floor((18-ctsBtnHeight)/2)+'px ' +  Math.floor((18-ctsBtnWidth)/2)+'px ' + Math.ceil((18-ctsBtnHeight)/2)+'px ' +  Math.ceil((18-ctsBtnWidth)/2)+'px';
    $('#clear-ticket-search').css({padding: ctsBtnPadding});
};

ChatDisplayClass.prototype.styleResourceClearBtn = function() {
    var ctsBtnWidth = $('#clear-resource-search').width();
    var ctsBtnHeight =  $('#clear-resource-search').height();
    var ctsBtnPadding = Math.floor((18-ctsBtnHeight)/2)+'px ' +  Math.floor((18-ctsBtnWidth)/2)+'px ' + Math.ceil((18-ctsBtnHeight)/2)+'px ' +  Math.ceil((18-ctsBtnWidth)/2)+'px';
    $('#clear-resource-search').css({padding: ctsBtnPadding});
};

ChatDisplayClass.prototype.createMainMenuPanel = function() {
    var panelHtml = lzm_displayHelper.createMainMenuPanel();
    $('#main-menu-panel').html(panelHtml).trigger('create');
    lzm_displayLayout.resizeMenuPanels();
};

ChatDisplayClass.prototype.createViewSelectPanel = function(target) {
    var viewSelectPanel = lzm_displayHelper.createViewSelectPanel(target);
    $('#new-view-select-panel').html(viewSelectPanel);
};

ChatDisplayClass.prototype.playSound = function(name, sender) {
    if (name == 'message') {
        blinkPageTitle(t('New chat activity'));
    } else if (name == 'ticket') {
        blinkPageTitle(t('New ticket activity'));
    }
    var thisClass = this;
    $('#sound-'+name)[0].volume = thisClass.volume / 100;
    if ($.inArray(sender, thisClass.soundPlayed) == -1) {
        if (typeof lzm_deviceInterface == 'undefined') {
            $('#sound-'+name)[0].play();
          } else {
            try {
                lzm_deviceInterface.playSound(name, thisClass.volume/100);
                if (lzm_chatPollServer.appBackground == 0 && thisClass.vibrateNotifications != 0) {

                } else {

                }
            } catch(ex) {
                deblog('Playing message sound failed.');
            }
        }
    }
    thisClass.addSoundPlayed(sender);
    setTimeout(function() {thisClass.removeSoundPlayed(sender);}, 2000);
};

ChatDisplayClass.prototype.addSoundPlayed = function(sender) {
    if ($.inArray(sender,this.soundPlayed) == -1) {
        this.soundPlayed.push(sender);
    }
};

ChatDisplayClass.prototype.removeSoundPlayed = function(sender) {
    if ($.inArray(sender,this.soundPlayed) != -1) {
        var tmpSoundPlayed = [];
        for (var i=0; i<this.soundPlayed.length; i++) {
            if (this.soundPlayed[i] != sender) {
                tmpSoundPlayed.push(this.soundPlayed[i]);
            }
        }
        this.soundPlayed = tmpSoundPlayed;
    }
};

ChatDisplayClass.prototype.startRinging = function(senderList) {
    blinkPageTitle(t('New chat activity'));
    var thisClass = this;
    var notificationSound;
    if (thisClass.playNewChatSound == 1) {
        notificationSound = 'NONE';
    } else {
        notificationSound = 'DEFAULT';
    }
        var newSender = [];
        var startRinging = false;
        for (var i = 0; i<senderList.length; i++) {
            if ($.inArray(senderList[i], thisClass.ringSenderList) == -1) {
                thisClass.ringSenderList.push(senderList[i]);
                newSender.push(senderList[i]);
            }
            if (typeof thisClass.isRinging[senderList[i]] == 'undefined' || !thisClass.isRinging[senderList[i]]) {
                startRinging = true;
                this.isRinging[senderList[i]] = true;
            }
        }
        var tmpRingSenderList = [];
        for (var j=0; j<thisClass.ringSenderList.length; j++) {
            if ($.inArray(thisClass.ringSenderList[j], senderList) != -1) {
                tmpRingSenderList.push(thisClass.ringSenderList[j]);
            }
        }
        thisClass.ringSenderList = tmpRingSenderList;
        if (startRinging) {

                for (var k=0; k<newSender.length; k++) {
                    var senderId = newSender[k].split('~')[0];
                    var senderBid = newSender[k].split('~')[1];
                    var senderQuestion, senderName;
                    var visitor = lzm_chatServerEvaluation.visitors.getVisitor(senderId);
                    if (visitor != null) {
                        for (var m=0; m<visitor.b.length; m++) {
                            if (visitor.b[m].id == senderBid) {
                                senderName = (typeof visitor.b[m].cname != 'undefined' && visitor.b[m].cname != '') ? visitor.b[m].cname : visitor.unique_name;
                                senderQuestion = (typeof visitor.b[m].chat.eq != 'undefined' && visitor.b[m].chat.eq != '') ?
                                    visitor.b[m].chat.eq : t('New Chat Request');
                            }
                        }
                    }

                    var notificationPushText = t('<!--sender--> wants to chat with you.', [['<!--sender-->', lzm_commonTools.htmlEntities(senderName)]]);
                    if (typeof lzm_deviceInterface != 'undefined') {
                        try {
                            thisClass.lastChatSendingNotification = newSender[k];
                            lzm_deviceInterface.showNotification(t('LiveZilla'), notificationPushText, notificationSound, newSender[k], newSender[k], '0');
                        } catch(ex) {
                            try {
                                lzm_deviceInterface.showNotification(t('LiveZilla'), notificationPushText, notificationSound, newSender[k], newSender[k]);
                            } catch(e) {
                                deblog('Error while showing notification');
                            }
                        }
                    }
                    if (thisClass.selected_view != 'mychats' || $('.dialog-window-container').length > 0) {

                        if(senderQuestion != '')
                            notificationPushText = senderQuestion;

                        if(lzm_commonStorage.loadValue('not_chats_' + lzm_chatServerEvaluation.myId,1)!=0)
                            lzm_displayHelper.showBrowserNotification({
                                text: notificationPushText,
                                sender: senderName,
                                subject: t('New Chat Request'),
                                action: 'openChatFromNotification(\'' + newSender[k] + '\'); closeOrMinimizeDialog();',
                                timeout: 10,
                                icon: 'fa-commenting-o'
                            });
                    }
                }
            thisClass.playRingSound(senderList);
        }
};

ChatDisplayClass.prototype.playRingSound = function (senderList) {
    var thisClass = this;
    var audio = $('#sound-ringtone')[0];
    var playRingSound = false;
    for (var i=0; i<senderList.length; i++) {
        if (typeof this.isRinging[senderList[i]] != 'undefined' && this.isRinging[senderList[i]]) {
            playRingSound = true;
        }
    }
    if (thisClass.playNewChatSound == 1 &&  playRingSound) {
        audio.volume = this.volume / 100;
        if (typeof lzm_deviceInterface == 'undefined') {
            audio.play();
        } else {
            try {
                lzm_deviceInterface.playSound('ringtone', thisClass.volume/100);
            } catch(ex) {
                deblog('Playing ringtone failed.');
            }
        }
        if (thisClass.repeatNewChatSound == 1) {
            setTimeout(function() {
                thisClass.playRingSound(senderList);
            }, 5000);
        }
    }
};

ChatDisplayClass.prototype.playQueueSound = function (counter) {
    var thisClass = this;
    var audio = $('#sound-queue')[0];
    var playQueueSound = false;

    if(counter != null)
    {
        var count = counter.q;
        if(count > 0)
        {
            if(!this.queueSoundCircleActive && lzm_commonStorage.loadValue('repeat_queue_sound_' + lzm_chatServerEvaluation.myId)!=0)
            {
                playQueueSound =
                this.queueSoundCircleActive = true;
            }
            else if(lzm_commonStorage.loadValue('play_queue_sound_' + lzm_chatServerEvaluation.myId,1)!=0)
            {
                if(JSON.stringify(counter.ql) != JSON.stringify(this.queueSoundsPlayed) && JSON.stringify(counter.ql).length >= JSON.stringify(this.queueSoundsPlayed).length)
                {
                    playQueueSound = true;
                }
            }
            this.queueSoundsPlayed = lzm_commonTools.clone(counter.ql);
        }
        else if(this.queueSoundCircleActive)
            this.queueSoundCircleActive = false;
    }
    else
    {
        // from timer
        playQueueSound = this.queueSoundCircleActive;
        this.queueSoundsTimer = null;
    }

    if(!this.isApp && playQueueSound)
    {
        audio.volume = this.volume / 100;
        if (typeof lzm_deviceInterface == 'undefined')
            audio.play();
    }


    if(this.queueSoundCircleActive && this.queueSoundsTimer == null)
        this.queueSoundsTimer = setTimeout(function() {thisClass.playQueueSound(null);}, 30000);
};

ChatDisplayClass.prototype.stopRinging = function(senderList) {
    for (var key in this.isRinging) {
        if (this.isRinging.hasOwnProperty(key)) {
            if ($.inArray(key, senderList) == -1) {
                delete this.isRinging[key];
            }
        }
    }
};

ChatDisplayClass.prototype.showDisabledWarning = function() {
    var that = this;
    if (this.serverIsDisabled && (lzm_chatTimeStamp.getServerTimeString(null, false, 1) - this.lastDiabledWarningTime >= 90000)) {
        if (!this.alertDialogIsVisible) {
            this.alertDialogIsVisible = true;
            var confirmText = t('This LiveZilla server has been deactivated by the administrator.') + '<br />' +
                t('Do you want to logout now?');
            lzm_commonDialog.createAlertDialog(confirmText, [{id: 'ok', name: t('Ok')}, {id: 'cancel', name: t('Cancel')}]);
            $('#alert-btn-ok').click(function() {
                that.alertDialogIsVisible = false;
                logout(false);
            });
            $('#alert-btn-cancel').click(function() {
                that.lastDiabledWarningTime = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
                that.alertDialogIsVisible = false;
                lzm_commonDialog.removeAlertDialog();
            });
        }
    }
};

ChatDisplayClass.prototype.getLanguageDisplayName = function(lang){
    return (typeof this.availableLanguages[lang.toLowerCase()] != 'undefined') ?
        lang + ' - ' + this.availableLanguages[lang.toLowerCase()] :
        (typeof this.availableLanguages[lang.toLowerCase().split('-')[0]] != 'undefined') ?
            lang + ' - ' + this.availableLanguages[lang.toLowerCase().split('-')[0]] :
            lang;
};

ChatDisplayClass.prototype.openPhoneCallDialog = function(myObject, lineNo, caller) {
    var that = this;
    var pcp = lzm_commonStorage.loadValue('ph_cll_prot_' + lzm_chatServerEvaluation.myId);
    if(pcp==null)
        pcp='skype:';

    lineNo = (caller == 'ticket') ? (myObject.messages[lineNo].p != '') ? lineNo : 0 : lineNo;
    var dialogId = (caller == 'ticket') ? lzm_chatDisplay.ticketDialogId[myObject.id] : '';
    var windowId = (caller == 'ticket') ? 'ticket-details' : 'phone-call';
    var menuEntry = (caller == 'ticket') ?
        t('Ticket (<!--ticket_id-->, <!--name-->)',[['<!--ticket_id-->', myObject.id],['<!--name-->', myObject.messages[0].fn]]) :
        (caller == 'chat') ? t('Call chat partner <!--chat_partner-->', [['<!--chat_partner-->', myObject[1].cname]]) : t('Phone Call');
    var headerString = t('Start call');
    var footerString =
        lzm_inputControls.createButton('phone-call-now', '','', t('Call now'), '', 'lr',{'margin-left': '6px'},'',30,'d')+
        lzm_inputControls.createButton('phone-call-cancel', '','', t('Cancel'), '', 'lr',{'margin-left': '6px'},'',30,'d');
    var bodyString = '<div id="phone-call-phonenumber-placeholder"></div>';
    var phoneNumber = (caller == 'ticket') ? myObject.messages[lineNo].p : (caller == 'chat') ? myObject[1].cphone : '';
    var phoneProtocols = [{value: 'callto:', text: tid('callto')},
        {value: 'tel:', text: tid('tel')},
        {value: 'skype:', text: tid('skype')}];
    var phoneContent = '<div id="phone-call-phonenumber-inner" class="lzm-fieldset top-space">' +
        lzm_inputControls.createSelect('phonecall-protocol', '', '', tidc('protocol'), {position: 'right', gap: '0px'},{width: '205px'}, '', phoneProtocols, that.lastPhoneProtocol, '') +
        lzm_inputControls.createInput('phone-number', '', phoneNumber, tidc('number'), '<i class="fa fa-phone"></i>', 'text', 'a') +
        '</div>';

    var dialogData = (caller == 'ticket') ? {'ticket-id': myObject.id, menu: menuEntry} : {menu: menuEntry};

    if (caller == 'ticket') {
        lzm_displayHelper.minimizeDialogWindow(dialogId, windowId, {'ticket-id': myObject.id, menu: menuEntry}, 'tickets', false);
        lzm_displayHelper.createDialogWindow(headerString, bodyString, footerString, windowId, {}, {}, {}, {}, '', dialogData, true, false, dialogId + '_call');
    } else
        lzm_displayHelper.createDialogWindow(headerString, bodyString, footerString, windowId, {}, {}, {}, {}, '', dialogData, true, false);


    lzm_displayHelper.createTabControl('phone-call-phonenumber-placeholder', [{name: t('Start call'), content: phoneContent}]);
    $('#phonecall-protocol-inner-text').html(that.lastPhoneProtocol);

    if (caller == 'ticket')
        lzm_displayLayout.resizeTicketDetails();
    else
        lzm_displayLayout.resizePhoneCall();

    $('#phonecall-protocol').change(function() {
        var selectText = '';
        for (var i=0; i<phoneProtocols.length; i++) {
            if (phoneProtocols[i].value == $('#phonecall-protocol').val()) {
                selectText = phoneProtocols[i].value;
            }
        }
        $('#phonecall-protocol-inner-text').html(selectText);
    });
    $('#phone-call-cancel').click(function() {
        if (caller == 'ticket') {
            lzm_displayHelper.removeDialogWindow('ticket-details');
            lzm_displayHelper.maximizeDialogWindow(dialogId);
        } else {
            lzm_displayHelper.removeDialogWindow('phone-call');
            if (caller == 'chat' && $.inArray(myObject[0].id + '~' + myObject[1].id, lzm_chatUserActions.chatCallBackList) == -1) {
                lzm_chatUserActions.chatCallBackList.push(myObject[0].id + '~' + myObject[1].id);
            }
        }
    });
    $('#phone-call-now').click(function() {
        that.lastPhoneProtocol = $('#phonecall-protocol').val();
        startPhoneCall($('#phonecall-protocol').val(), $('#phone-number').val());
        lzm_commonStorage.saveValue('ph_cll_prot_' + lzm_chatServerEvaluation.myId,that.lastPhoneProtocol);
        $('#phone-call-cancel').click();
    });
    $('#phone-number').focus();
    $('#phone-number').blur();
};

ChatDisplayClass.prototype.getCountryName = function(isoCode,addRegion){
    addRegion = d(addRegion) ? addRegion : true;
    var countryName = isoCode;

    var cobj = lzm_commonTools.GetElementByProperty(lzcil,'alpha2Code',isoCode.toUpperCase());
    if(cobj.length)
    {
        cobj = cobj[0];
        if(d(cobj['name']))
            countryName = cobj['name'];
        if(d(cobj['translations']))
        {
            var mylang = lzm_chatServerEvaluation.operators.getOperator(this.myId).lang.toLowerCase();
            if(d(cobj['translations'][mylang]))
                countryName = cobj['translations'][mylang];
        }
        if(addRegion && d(cobj['subregion']) && lzm_displayLayout.windowWidth > 700)
            countryName += ' (' + cobj['subregion'] + ' / ' + cobj['region'] + ')';
    }
    return countryName;
};

ChatDisplayClass.prototype.getCountryLanguage = function(isoCode){
    var spLanguage = 'EN';
    var cobj = lzm_commonTools.GetElementByProperty(lzcil,'alpha2Code',isoCode.toUpperCase());
    if(cobj.length)
    {
        var cobj = cobj[0];
        if(d(cobj['languages']))
            spLanguage = cobj['languages'][0];
    }
    return spLanguage.toUpperCase();
};

ChatDisplayClass.prototype.showObjectTranslator = function(type, obj) {
    var that=this,headerString = t('Translate'),msgText,dialogId,dialogData='',dialogName,selectedView;
    var footerString = '<span style="float:right;">' + lzm_inputControls.createButton('translate-obj-replace', '', '', t('Replace'), '', 'lr',{'margin-left': '6px', 'margin-top': '-2px'},'',30,'d');

    if(type!='chat_question')
        footerString += lzm_inputControls.createButton('translate-obj-attach', '', '', t('Attach'), '', 'lr',{'margin-left': '6px', 'margin-top': '-2px'},'',30,'d');

    if(type=='ticket')
        footerString += lzm_inputControls.createButton('translate-obj-comment', '', '', t('Comment'), '', 'lr',{'margin-left': '6px', 'margin-top': '-2px'},'',30,'d');

    footerString += lzm_inputControls.createButton('translate-obj-cancel', '', '', t('Cancel'), '', 'lr',{'margin-left': '6px', 'margin-top': '-2px'},'',30,'d') + '</span>';

    if (!lzm_chatDisplay.isApp && !lzm_chatDisplay.isMobile)
        footerString += '<span style="float:left;">' + lzm_inputControls.createButton('translate-obj-retranslate', '', '', t('Translate'), '', 'lr',{'margin-left': '6px', 'margin-top': '-2px'},'',30,'e') + '</span>';

    dialogName = 'obj-translator';

    if(type=='ticket')
    {
        msgText = obj[0].messages[obj[1]].mt;
        dialogId = (typeof lzm_chatDisplay.ticketDialogId[obj[0].id] != 'undefined') ? lzm_chatDisplay.ticketDialogId[obj[0].id] : md5(Math.random().toString());
        var ticketSender = (obj[0].messages[0].fn.length > 20) ? lzm_commonTools.escapeHtml(obj[0].messages[0].fn).substr(0, 17) + '...' : lzm_commonTools.escapeHtml(obj[0].messages[0].fn);
        var menuEntry = t('Ticket (<!--ticket_id-->, <!--name-->)',[['<!--ticket_id-->', obj[0].id],['<!--name-->', ticketSender]]);
        dialogData = {'ticket-id': obj[0].id, menu: menuEntry};
        selectedView = 'tickets';
    }
    else
    {
        msgText = obj[0].innerText;
        dialogId = md5(Math.random().toString());
        dialogData = {};
        selectedView = '';
    }

    var defaultLanguage = lzm_chatServerEvaluation.defaultLanguage, i;
    defaultLanguage = ($.inArray(defaultLanguage, lzm_chatDisplay.translationLangCodes) != -1) ? defaultLanguage : ($.inArray(defaultLanguage.split('-')[0], lzm_chatDisplay.translationLangCodes) -1) ? defaultLanguage.split('-')[0] : 'en';

    var bodyString = '<fieldset id="obj-translator-original" class="lzm-fieldset">' +
        '<legend>' + t('Original') + '</legend><select id="obj-translator-orig-select" class="lzm-select ui-disabled"><br /><option value="">' + t('Auto-Detect') + '</option>';
    bodyString += '</select><textarea id="obj-translator-orig-text" class="obj-reply-text" style="padding: 4px;">' + msgText + '</textarea>' +
        '</fieldset><fieldset id="obj-translator-translation" class="lzm-fieldset" data-role="none" style="margin-top: 5px;">' +
        '<legend>' + t('Translation') + '</legend><select id="obj-translator-translated-select" class="lzm-select"><br />';

    for (i=0; i<lzm_chatDisplay.translationLanguages.length; i++)
    {
        var selectedString = (lzm_chatDisplay.translationLanguages[i].language == defaultLanguage) ? ' selected="selected"' : '';
        bodyString += '<option' + selectedString + ' value="' + lzm_chatDisplay.translationLanguages[i].language + '">' + lzm_chatDisplay.translationLanguages[i].language.toUpperCase() + ' - ' + lzm_chatDisplay.translationLanguages[i].name + '</option>'
    }
    bodyString += '</select><textarea id="obj-translator-translated-text" class="obj-reply-text" style="padding: 4px;"></textarea></fieldset>';

    lzm_displayHelper.minimizeDialogWindow(dialogId, dialogName, dialogData, selectedView, false);
    lzm_displayHelper.createDialogWindow(headerString,bodyString, footerString,dialogName, {}, {}, {}, {}, '', dialogData, false, false, dialogId + '_translator');
    lzm_displayLayout.resizeObjTranslator();

    var fillTranslatedText = function(sourceLanguage, targetLanguage) {
        var gUrl = 'https://www.googleapis.com/language/translate/v2';
        var dataObject = {key: lzm_chatServerEvaluation.otrs,
            target: targetLanguage, q: $('#obj-translator-orig-text').val()};
        if (sourceLanguage != '') {
            dataObject.source = sourceLanguage;
        }
        $.ajax({
            type: "GET",
            url: gUrl,
            data: dataObject,
            dataType: 'json'
        }).done(function(data) {
                $('#obj-translator-translated-text').val(data.data.translations[0].translatedText);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                deblog(jqXHR);
                deblog(jqXHR.status);
                deblog(textStatus);
                deblog(errorThrown);
            });
    };

    function updateChatMsg(text,att)
    {
        var myCurrentChat = lzm_chatServerEvaluation.userChats.getUserChat(that.active_chat_reco);
        var orgpost =  lzm_commonTools.GetElementByProperty(myCurrentChat.messages,'id',obj[1]);
        if(orgpost.length)
        {
            orgpost = orgpost[0];
            lzm_commonTools.RemoveElementByProperty(that.translatedPosts,'id',orgpost.id);
            if(!att)
                that.translatedPosts.push({id:orgpost.id,text:text});
            else
                that.translatedPosts.push({id:orgpost.id,text:orgpost.text + '<br><span class="lz_message_translation">' + text + '</span>'});
            that.createChatHtml();
        }
    }

    fillTranslatedText('', defaultLanguage);
    $('#obj-translator-translated-select').change(function() {
        fillTranslatedText($('#obj-translator-orig-select').val(), $('#obj-translator-translated-select').val());
    });
    $('#obj-translator-orig-select').change(function() {
        fillTranslatedText($('#obj-translator-orig-select').val(), $('#obj-translator-translated-select').val());
    });
    $('#translate-obj-retranslate').click(function() {
        fillTranslatedText($('#obj-translator-orig-select').val(), $('#obj-translator-translated-select').val());
    });
    $('#translate-obj-replace').click(function() {
        var translatedText = $('#obj-translator-translated-text').val();
        $('#translate-obj-cancel').click();
        if(type=='ticket')
            saveTicketTranslationText(obj[0], obj[1], translatedText);
        else
            updateChatMsg(translatedText,false);
    });
    $('#translate-obj-attach').click(function() {
        if(type=='ticket')
            saveTicketTranslationText(obj[0], obj[1], msgText + '\r\n\r\n' + $('#obj-translator-translated-text').val());
        else
            updateChatMsg($('#obj-translator-translated-text').val(),true);
        $('#translate-obj-cancel').click();
    });
    if(type=='ticket')
        $('#translate-obj-comment').click(function() {
            var translatedText = $('#obj-translator-translated-text').val();
            $('#translate-obj-cancel').click();
            if(type=='ticket')
                saveTicketTranslationText(ticket, msgNo, translatedText, 'comment');
        });
    $('#translate-obj-cancel').click(function() {
        lzm_displayHelper.removeDialogWindow(dialogName);
        //lzm_displayHelper.maximizeDialogWindow(dialogId);
    });
};
