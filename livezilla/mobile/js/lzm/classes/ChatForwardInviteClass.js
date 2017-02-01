/****************************************************************************************
 * LiveZilla ChatForwardInviteClass.js
 *
 * Copyright 2016 LiveZilla GmbH
 * All rights reserved.
 * LiveZilla is a registered trademark.
 *
 ***************************************************************************************/

function ChatForwardInvite(){
    this.userObject = null;
    this.browserId = '';
    this.userId = '';
    this.chatId = '';
    this.type = '';
    this.groupCount = 0;
    this.selectedGroupId = ''
}

ChatForwardInvite.prototype.showForwardInvite = function(chatId, type) {
    type = (d(type)) ? type : 'forward';
    var thisUser = lzm_chatServerEvaluation.visitors.getVisitorBrowser(null, null, chatId);
    if (thisUser[0] != null && thisUser[1] != null) {
        var id = thisUser[0].id, b_id = thisUser[1].id;
        if (lzm_commonPermissions.checkUserPermissions('', 'chats', 'forward', {})) {
            var storedForwardId = '';
            for (var key in lzm_chatDisplay.StoredDialogs) {
                if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
                    if (lzm_chatDisplay.StoredDialogs[key].type == 'operator-invitation' &&
                        typeof lzm_chatDisplay.StoredDialogs[key].data['visitor-id'] != 'undefined' &&
                        lzm_chatDisplay.StoredDialogs[key].data['visitor-id'] == id + '~' + b_id) {
                        storedForwardId = key;
                    }
                }
            }
            if (storedForwardId != '') {
                lzm_displayHelper.maximizeDialogWindow(storedForwardId);
            }
            else
            {
                var activeUserChat = lzm_chatServerEvaluation.userChats.getUserChat(lzm_chatDisplay.active_chat_reco);
                if (lzm_chatDisplay.selected_view == 'mychats' && activeUserChat != null) {
                    saveChatInput(lzm_chatDisplay.active_chat_reco);
                    removeEditor();
                }
                this.createOperatorForwardInviteHtml(type, thisUser[0], id, b_id, chatId);
            }
        }
        else
            showNoPermissionMessage();
    }
};

ChatForwardInvite.prototype.createOperatorForwardInviteHtml = function (type, thisUser, userId, b_id, chat_id) {
    saveChatInput(lzm_chatDisplay.active_chat_reco);

    this.type = type;
    this.userObject = thisUser;
    this.userId = userId;
    this.browserId = b_id;
    this.chatId = chat_id;


    var that=this,headerString = t('Forward chat to operator');
    if (this.type != 'forward')
        headerString = t('Invite operator to chat');

    var footerString =
        lzm_inputControls.createButton('fwd-button', '', '', t('Ok'), '', 'lr', {'margin-left': '4px'},'',30,'d') +
        lzm_inputControls.createButton('cancel-operator-forward-selection', '', '', t('Cancel'), '', 'lr', {'margin-left': '4px'},'',30,'d');

    var dialogData = {'visitor-id': this.userId+'~'+this.browserId, 'chat-partner': this.userId + '~' + this.browserId, 'chat-id': this.chatId};
    lzm_displayHelper.createDialogWindow(headerString, this.createForwardInviteBody(), footerString, 'operator-forward-selection', {}, {}, {}, {}, '', dialogData, true);

    $('#cancel-operator-forward-selection').click(function() {
        lzm_displayHelper.removeDialogWindow('operator-forward-selection');
        var activeUserChat = lzm_chatServerEvaluation.userChats.getUserChat(lzm_chatDisplay.active_chat_reco);
        if (lzm_chatDisplay.selected_view == 'mychats' && activeUserChat != null)
        {
            var myText = loadChatInput(lzm_chatDisplay.active_chat_reco);
            initEditor(myText, 'CancelFilterCreation', lzm_chatDisplay.active_chat_reco);
        }
    });
    $('#fwd-button').click(function() {
        var row = $('#forward-receiver-table tr.selected-table-line')[0];
        var selectedOpUserId = $(row).data('id');
        if(d(selectedOpUserId) && that.selectedGroupId != '')
        {
            var selectedOperator = lzm_chatServerEvaluation.operators.getOperator(selectedOpUserId, 'id');
            selectOperatorForForwarding(that.userId, that.browserId, that.chatId, selectedOperator.id, selectedOperator.name, that.selectedGroupId, $('#forward-text').val(), 0);
            lzm_chatUserActions.forwardData.forward_text = $('#forward-text').val();
            lzm_chatUserActions.forwardChat(that.userObject, that.type);
            $('#cancel-operator-forward-selection').click();
        }
    });

    this.applyEvents();
    lzm_displayLayout.resizeOperatorForwardSelection();
};

ChatForwardInvite.prototype.applyEvents = function (){
    var that = this;
    $('#fwd-button').removeClass('ui-disabled');
    if(this.groupCount>0)
    {
        $('#forward-group-select').change(function() {
            $('#forward-receiver-table').html();
            that.selectedGroupId = $('#forward-group-select').val();
            $('#forward-receiver-table').html(lzm_chatDisplay.createUsersList({id:''},that.getMatchingGroupOperators(that.selectedGroupId,that.type),false,true,-1,'forward','selectInviteOperatorLine','nf','nf'));

            $($('#forward-receiver-table tr.operator-forwardlist-line')[0]).addClass('selected-table-line');
        });
        $('#forward-group-select').change();
    }
    else
    {
        $('#fwd-button').addClass('ui-disabled');
        $('#forward-group-select').append($('<option>', {value: 1,text: tid('none')}));
        $('#forward-receiver').html('<div class="text-xxxl text-gray" style="margin-top:18%;">'+tid('none')+'</div>');
        $('#forward-receiver, #forward-text, #forward-group-select').addClass('ui-disabled');
    }
};

ChatForwardInvite.prototype.updateForwardOperators = function(){
    $('#operator-forward-selection-body').html(this.createForwardInviteBody());
    this.applyEvents();
};

ChatForwardInvite.prototype.getMatchingGroupOperators = function(gId,type){
    var memberList = [], i,that=this;
    for (var bInd=0; bInd<this.userObject.b.length; bInd++)
        if (this.userObject.b[bInd].id == this.browserId) {
            memberList = this.userObject.b[bInd].chat.pn.memberIdList;
            break;
        }
    var operators = lzm_chatServerEvaluation.operators.getOperatorList();
    var availableOperators = lzm_chatServerEvaluation.operators.getAvailableOperators(that.userId + '~' + that.browserId);
    var soperators = [];
    for (i=0; i<operators.length; i++)
        if (operators[i].userid != lzm_chatDisplay.myLoginId && $.inArray(gId, operators[i].groups) != -1 && (typeof operators[i].isbot == 'undefined' || operators[i].isbot != 1) && (operators[i].status != 2 && operators[i].status != 3) && $.inArray(operators[i].id, memberList) == -1 && ((type == 'forward' && $.inArray(operators[i].id, availableOperators.fIdList) != -1) || (type != 'forward' && $.inArray(operators[i].id, availableOperators.iIdList) != -1)))
            soperators.push(operators[i]);
    return soperators;
};

ChatForwardInvite.prototype.createForwardInviteBody = function (){

    var groups = lzm_chatServerEvaluation.groups.getGroupList(),selected,i;
    var bodyString = '<div class="lzm-fieldset" data-role="none">' +
        '<div id="selection-div"><label for="forward-group-select">'+tidc('group')+'</label>' +
        '<select id="forward-group-select" data-role="none" data-selected-group="">';

    if(this.selectedGroupId=='')
        this.selectedGroupId = this.userObject.b[0].chat.gr;

    this.groupCount = 0;
    for (i=0; i<groups.length; i++)
        if (d(groups[i].id)){
            var opcount = this.getMatchingGroupOperators(groups[i].id,this.type).length;
            if(opcount>0){
                this.groupCount++;
                selected = (groups[i].id==this.selectedGroupId) ? ' selected' : '';
                bodyString += '<option value="' +groups[i].id + '"'+selected+'>' + groups[i].name + ' (' + opcount + ')</option>';
            }
        }

    bodyString += '</select></div>';
    bodyString += '<div class="top-space"><label>'+tidc('operator')+'</label><div id="forward-receiver" class="border-s"><table id="forward-receiver-table" class="tight"></table></div></div>';
    bodyString += '<div class="top-space">' + lzm_inputControls.createInput('forward-text','','',tidc('fwd_additional_info'),'','text','') + '</div>';
    bodyString += '</div>';
    return bodyString;
};