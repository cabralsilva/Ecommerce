/****************************************************************************************
 * LiveZilla FeedbacksViewerClass.js
 *
 * Copyright 2016 LiveZilla GmbH
 * All rights reserved.
 * LiveZilla is a registered trademark.
 *
 ***************************************************************************************/

function FeedbacksViewer() {
    this.m_Page = 1;
    this.m_PagesTotal = 1;
    this.m_SelectedFeedbackId = '';
}

FeedbacksViewer.prototype.showFeedbacksViewer = function() {

    this.m_PagesTotal = lzm_chatServerEvaluation.feedbacksTotal / lzm_chatServerEvaluation.feedbacksPage;

    if(this.m_PagesTotal%1!=0 || this.m_PagesTotal<1)
        this.m_PagesTotal++;

    this.m_PagesTotal = Math.floor(this.m_PagesTotal);

    var headerString = tid('feedbacks');
    var footLineHtml = this.createFooterLine(false);

    var dialogData = {};
    var bodyString = this.createFeedbacksHtml();
    lzm_displayHelper.createDialogWindow(headerString, bodyString, footLineHtml, 'feedbacks-viewer', {}, {}, {}, {}, '', dialogData, false, true, 'feedbacks_viewer_dialog');

    $('#feedbacks-viewer-body').css({'overflow': 'auto'});

    this.createFooterLine(true);
};

FeedbacksViewer.prototype.createFooterLine = function(logic){

    if(!logic){
        var footLineHtml = '<span>';
        var leftDisabled = (this.m_Page == 1) ? ' ui-disabled' : '', rightDisabled = (this.m_Page == this.m_PagesTotal) ? ' ui-disabled' : '';
        footLineHtml += lzm_inputControls.createButton('feedbacks-page-all-backward', 'feedbacks-list-page-button' + leftDisabled, 'pageFeedbacksViewer(1);', '',
            '<i class="fa fa-fast-backward"></i>', 'l', {'border-right-width': '1px'}) +
            lzm_inputControls.createButton('feedbacks-page-one-backward', 'feedbacks-list-page-button' + leftDisabled, 'pageFeedbacksViewer(' + (this.m_Page - 1) + ');', '', '<i class="fa fa-backward"></i>', 'r',{'border-left-width': '1px'}) +
            '<span style="padding: 0 15px;">' + tid('page_of_total',[['<!--this_page-->', this.m_Page], ['<!--total_pages-->', this.m_PagesTotal]]) + '</span>' +
            lzm_inputControls.createButton('feedbacks-page-one-forward', 'feedbacks-list-page-button' + rightDisabled, 'pageFeedbacksViewer(' + (this.m_Page + 1) + ');', '', '<i class="fa fa-forward"></i>', 'l',{'border-right-width': '1px'}) +
            lzm_inputControls.createButton('feedbacks-page-all-forward', 'feedbacks-list-page-button' + rightDisabled, 'pageFeedbacksViewer(' + this.m_PagesTotal + ');', '', '<i class="fa fa-fast-forward"></i>', 'r',{'border-left-width': '1px'});

        footLineHtml += '</span><span style="float:right;">';
        footLineHtml += lzm_inputControls.createButton('fv-close-btn', '', '', tid('close'), '', 'lr',{'margin-left': '4px'},'',30,'d');
        footLineHtml += '</span>';
        return footLineHtml;
    }
    else{
        $('#fv-close-btn').click(function() {
            lzm_displayHelper.removeDialogWindow('feedbacks-viewer');
            lzm_chatDisplay.FeedbacksViewer = null;
        });
        $('#feedbacks-viewer-footline').css({'text-align': 'center'});
    }
};

FeedbacksViewer.prototype.initUpdateViewer = function(page){
    this.switchLoading(true);
    this.m_Page=page;
    lzm_chatPollServer.feedbacksUpdateTimestamp='';
    $('#feedbacks-viewer-footline').html(this.createFooterLine(false));
    this.createFooterLine(true);
    lzm_chatPollServer.stopPolling();
    lzm_chatPollServer.startPolling();
};

FeedbacksViewer.prototype.updateViewer = function(){
    $('#feedbacks-table').replaceWith(this.createFeedbacksHtml());
    this.switchLoading(false);
};

FeedbacksViewer.prototype.createFeedbacksHtml = function() {
    var bodyString = '<table class="visible-list-table alternating-rows-table lzm-unselectable" id="feedbacks-table"><thead><tr>' +
        '<th>' + tid('date') + '</th><th>' + tid('operator') + '</th><th>' + tid('group') + '</th>' +
        '<th>' + tid('name') + '</th><th>' + tid('email') + '</th><th>' + tid('company') + '</th>' +
        '<th>' + tid('phone') + '</th><th>' + tid('ticket') + '</th><th>' + tid('chat') + '</th>';

    var thtext='',thicon='';
    for(var key in lzm_chatServerEvaluation.global_configuration.database['fbc'])
        if(lzm_chatServerEvaluation.global_configuration.database['fbc'][key].type == '0')
            thicon += '<th class="text-center">'+lzm_chatServerEvaluation.global_configuration.database['fbc'][key].name+'</th>';
        else
            thtext += '<th style="min-width:200px;">'+lzm_chatServerEvaluation.global_configuration.database['fbc'][key].name+'</th>';

    bodyString += thtext + thicon;
    bodyString += '</tr></thead><tbody>' + this.getFeedbackLines() + '</tbody></table>';
    return bodyString;
};

FeedbacksViewer.prototype.getFeedbackLines = function() {
    var linesHtml = '',maxCreated=lzm_chatPollServer.lzm_commonStorage.loadValue('last_fb' + lzm_chatPollServer.lzm_chatServerEvaluation.myId);
    if(maxCreated==null)
        maxCreated = 0;

    for (var i=0; i<lzm_chatServerEvaluation.feedbacksList.length; i++){
        linesHtml += this.getFeedbackLine(lzm_chatServerEvaluation.feedbacksList[i]);
        maxCreated = Math.max(lzm_chatServerEvaluation.feedbacksList[i].cr,maxCreated);
    }

    if(maxCreated>0)
        lzm_chatPollServer.lzm_commonStorage.saveValue('last_fb' + lzm_chatPollServer.lzm_chatServerEvaluation.myId,maxCreated);
    return linesHtml;
};

FeedbacksViewer.prototype.getFeedbackLine = function(fb) {

    var key,crit,edTime = lzm_chatTimeStamp.getLocalTimeObject(parseInt(fb.cr * 1000), true);
    var edString = lzm_commonTools.getHumanDate(edTime, '', lzm_chatDisplay.userLanguage) + ' ';
    var onclickAction = (!lzm_chatDisplay.isApp && !lzm_chatDisplay.isMobile) ? ' onclick="selectFeedbacksLine(event, \'' + fb.i + '\');"' : ' onclick="openFeedbacksListContextMenu(event, \'' + fb.i + '\');"';
    var onconetxtMenuAction = (!lzm_chatDisplay.isApp && !lzm_chatDisplay.isMobile) ? ' oncontextmenu="openFeedbacksListContextMenu(event, \'' + fb.id + '\');"' : '';
    var ondblclickAction =  (!lzm_chatDisplay.isApp && !lzm_chatDisplay.isMobile) ? ' ondblclick="showFeedbacks(\'' + fb.i + '\', true);"' : '';

    if(this.m_SelectedFeedbackId=='')
        this.m_SelectedFeedbackId = fb.i;

    var opname = '-',grname = '-';
    var operator = lzm_chatServerEvaluation.operators.getOperator(fb.o);
    if(operator != null)
        opname = operator.userid;

    var group = lzm_chatServerEvaluation.groups.getGroup(fb.g);
    if(group != null)
        grname = group.id;

    var selectedLine = (this.m_SelectedFeedbackId==fb.i) ? ' selected-table-line' : '';
    var fbhtml = '<tr id="feedbacks-list-line-'+fb.i+'" '+onclickAction+onconetxtMenuAction+ondblclickAction+' class="feedbacks-list-line'+selectedLine+'">' +
        '<td>&nbsp;'+edString+'&nbsp;</td>' +
        '<td>'+opname+'</td><td>'+grname+'</td>'+
        '<td class="text-center">'+lzm_commonTools.htmlEntities(fb.UserData.f111)+'</td>' +
        '<td class="text-center">'+lzm_commonTools.htmlEntities(fb.UserData.f111)+'</td>' +
        '<td class="text-center">'+lzm_commonTools.htmlEntities(fb.UserData.f113)+'</td>' +
        '<td class="text-center">'+lzm_commonTools.htmlEntities(fb.UserData.f116)+'</td>' +
        '<td class="text-center">'+lzm_commonTools.htmlEntities(fb.t)+'</td>' +
        '<td class="text-center">'+lzm_commonTools.htmlEntities(fb.c)+'</td>';

    for(key in lzm_chatServerEvaluation.global_configuration.database['fbc']){
        crit = lzm_chatServerEvaluation.global_configuration.database['fbc'][key];
        if(crit.type=='1')
            fbhtml += this.getCriteriaField(crit,fb);
    }
    for(key in lzm_chatServerEvaluation.global_configuration.database['fbc']){
        crit = lzm_chatServerEvaluation.global_configuration.database['fbc'][key];
        if(crit.type=='0')
            fbhtml += this.getCriteriaField(crit,fb);
    }
    return fbhtml + '</tr>';
};

FeedbacksViewer.prototype.getCriteriaField = function(crit,fb){
    var chtml = '',data = lzm_commonTools.GetElementByProperty(fb.Criteria,'i',crit.id);
    if(data == null || !data.length)
        return '-';
    else
        data = data[0];

    if(crit.type == '0'){
        var rate = parseInt(data.Value);
        var col = (rate > 2) ? 'green' : ((rate > 1) ? 'orange' : 'orange');
        for(var i=0;i<5;i++)
            chtml += '<i style="margin-right:2px;" class="fa icon-small fa-circle '+((i<rate) ? 'icon-'+col : 'icon-light' )+' nobg"></i>';
        return '<td class="text-center noibg">' + chtml + '</td>';
    }
    else
        return '<td style="word-wrap:normal;word-break:break-word;white-space:normal;">'+lzm_commonTools.htmlEntities(data.Value)+'</td>';
};

FeedbacksViewer.prototype.switchLoading = function(show){
    if(show){
        var loadingHtml = '<div id="feedbacks-viewer-loading"><div class="lz_anim_loading"></div></div>';
        $('#feedbacks-viewer-body').append(loadingHtml).trigger('create');
        $('#feedbacks-viewer-loading').css({position: 'absolute', left: 0, top: 0, bottom: 0, right:0,'background-color': '#ffffff', 'z-index': 1000});
    }
    else
        $('#feedbacks-viewer-loading').remove();
}







