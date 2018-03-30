define(["ctrlEmailSending","bootstrapSelectPicker"],function(){
var instance =	{
groupOperationResult:{
	itemCount_All: 0,
	itemCount_Processed: 0,
	itemCount_Ok:0,
	errMessageList:[],
},
groupOperationResultEx:{
	model: null,
	items:[],
	stepResults:null,
	stepCount:1,
	setItems:function(items,model,stepCount)
	{
		this.model = model;
		this.items = items;
		if (stepCount) this.stepCount = stepCount;
		this.stepResults = new Array(this.stepCount);
		for(var i=0;i<this.stepResults.length;i++){
			this.stepResults[i] = {itemResults:new Array(this.items.length)};
			for(var j=0;j<this.stepResults[i].itemResults.length;j++){
				this.stepResults[i].itemResults[j] = "";
			}
		}
	},
	itemProcessed:function (stepIndex,itemIndex,errMessage)
	{
		try{
			if (errMessage){
				var errJsonStr = this.stepResults[stepIndex].itemResults[itemIndex];
				if (errJsonStr)	
					var errors = $.parseJSON(errJsonStr);
				else
					errors = [];
				errors.push(errMessage);
				this.stepResults[stepIndex].itemResults[itemIndex] = JSON.stringify(errors);
			}
			return (itemIndex+1 == this.items.length);
		}
		catch(err){
			var s="stop";
		}					
	},
	hasErrors:function(stepIndex,itemIndex)
	{
		if(!stepIndex){
			//find errors in all steps
			for (var i=0;i<this.stepResults.length;i++)
			{
				if (this.stepResults[i].itemResults[itemIndex]){
					return true; 
				}
			}
			return false;
		}
			
		return this.stepResults[stepIndex].itemResults[itemIndex];
	},
	getItemErrors:function(itemIndex){
			var errors = [];
			for(var step=0;step<this.stepResults.length;step++){
				var errJsonStr = this.stepResults[step].itemResults[itemIndex];
				if (errJsonStr){	
					var stepErrors = $.parseJSON(errJsonStr);
					for(var i=0;i<stepErrors.length;i++){
						errors.push(stepErrors[i]);
					}
				}
			}
			return errors;
	},
	getInfo:function(){
			var okItems = 0;
			var errorItems = 0;
			var allItems = this.items.length;
			for(var step=0;step<this.stepResults.length;step++){
				for(var itemIndex=0;itemIndex<this.stepResults[step].itemResults.length;itemIndex++){
					if (this.stepResults[step].itemResults[itemIndex])
					{
						errorItems++;
					}
				}
			}
			okItems = allItems - errorItems;
			return {allItems:allItems,okItems:okItems,errorItems:errorItems};
	}
},	
getSelectedRows:function()
{
	var volModel = Appc.getActiveVolumeModelObject();
	var selectedRows = volModel.get("mainView").getSelectedRows();
	if(selectedRows.length == 0) 
	{
		var currRow = volModel.get("currentRow");
		if (!currRow) return null;
		selectedRows = [currRow];
	}
	return selectedRows;
},
isSmtpSettingsCorrect:function()
{
	var errs = [];
	App.Models.settings.validateSmtpSettings(null, errs);
	if (errs.length>0)
	{
		showError(App.localeData.srrSmtpSettingsEmpty);
		return; 
	}
	return (errs.length==0);
},
selectSendingType:	function(){
	
	var contentHtml = compileTemplate(App.Templates.dialogs.SelectEmailSendingType); 
	$("#dialogContLvl1").dwcmDialog({
	title: App.localeData.email_selectSendingType,
	buttons:{btnOk:true,btnCancel:true,btnMenu:false},
	model:{sendingType:"simple"},	
	contentHtml: contentHtml,
	context: this,	
	onOkBtnClicked:this.onSendingTypeSelected
	});
},
onSendingTypeSelected: function(ev,evData) 
{
	var thisInstance = evData.dlgInstance.options.context;
	var sendingType = evData.dlgInstance.options.model.sendingType;
	$("#dialogContLvl1").dwcmDialog("remove");	
	if (sendingType == "simple")
	{
		if (!thisInstance.isSmtpSettingsCorrect()) return; 
		thisInstance.doSendSimple();
	}
	else if (sendingType == "massive")
	{
		if (!thisInstance.isSmtpSettingsCorrect()) return; 
		thisInstance.sndMassive_ShowMapDlg();
	}
	else if (sendingType=="pec")
	{
		thisInstance.sndPec_ShowPecDlg();
	}
},
onGroupOperationCompleted: function(){
	$("#dialogContLvl1").dwcmDialog("setWaitIndicator",false);
	var strMessage = stringFormat(App.localeData.msgNofMDocumentsAreSent,
								  [this.groupOperationResult.itemCount_Ok,this.groupOperationResult.itemCount_All]);
	var htmlResult = "";
	var className = "inlineSuccess";
	var detailHtml = "";
	if (this.groupOperationResult.itemCount_Ok<this.groupOperationResult.itemCount_All)
	{
		if(this.groupOperationResult.itemCount_Ok==0) 
			className = "inlineError";
		else
			className = "inlineWarning";
		
		detailHtml = 
'<a data-toggle="collapse" href="#detailDescription" aria-expanded="false" '+
'aria-controls="detailDescription" style="padding-left:10px" >'+
'{0}'+
'</a>'+
'<div class="collapse" id="detailDescription">'+
  '<div class="well">'+
  '{1}'+			
  '</div>'+
'</div>';		
		detailHtml = stringFormat(detailHtml,[App.localeData.clickForDetail,this.getAllErrHtml()]);
	}
	htmlResult =  stringFormat("<div class='{0}'>{1}{2}</div>",[className,strMessage,detailHtml]);
	
	$("#dialogContLvl1").dwcmDialog("appendHtml",[htmlResult]);
	
},
onGroupOperationExCompleted:function(briefMessage){
	$("#dialogContLvl1").dwcmDialog("setWaitIndicator",false);
	$("#dialogContLvl1").dwcmDialog("getOptions").buttons.btnCancel = false;
	$("#dialogContLvl1").dwcmDialog("refreshButtons");
	var htmlResult = "";
	var className = "inlineSuccess";
	var detailHtml = "";
	var grOperInfo = this.groupOperationResultEx.getInfo.apply(this.groupOperationResultEx);
	
	if (grOperInfo.errorItems>0)
	{
		if(grOperInfo.okItems==0) 
			className = "inlineError";
		else
			className = "inlineWarning";
		
		detailHtml = 
'<a data-toggle="collapse" href="#detailDescription" aria-expanded="false" '+
'aria-controls="detailDescription" style="padding-left:10px" >'+
'{0}'+
'</a>'+
'<div class="collapse" id="detailDescription">'+
  '<div class="well">'+
  '{1}'+			
  '</div>'+
'</div>';	
		
		var $allDetailInfo = $('<div></div>');
		for(var itemIndex=0;itemIndex<this.groupOperationResultEx.items.length;itemIndex++){
			var itemErrors = this.groupOperationResultEx.getItemErrors(itemIndex);
			var $itemTemplate = 	$('<div></div>');			
			$itemTemplate.text(itemIndex+1);
			if (itemErrors.length==0){
				var $messageTemplate = 	$('<div style="display:inline-block"></div>');
				$messageTemplate.addClass("inlineSuccess").text("OK");
				$itemTemplate.append($messageTemplate);
			}else{
				for(var errIndex=0; errIndex<itemErrors.length;errIndex++){
					var errItem = itemErrors[errIndex];
					$messageTemplate = 	$('<div></div>');
					$messageTemplate.addClass("inlineError").text(errItem);
					if (errIndex==0)
						$messageTemplate.css("display","inline-block");
					$itemTemplate.append($messageTemplate);
				}
			}
			$allDetailInfo.append($itemTemplate);
		}
		var allDetailInfo = $allDetailInfo[0].outerHTML;
		detailHtml = stringFormat(detailHtml,[App.localeData.clickForDetail,allDetailInfo]);
	}
	htmlResult =  stringFormat("<div class='{0}'>{1}{2}</div>",[className,briefMessage,detailHtml]);
	
	$("#dialogContLvl1").dwcmDialog("appendHtml",[htmlResult]);
},	
getAllErrHtml:function(){
	var rv = "";
	for (var i=0;i<this.groupOperationResult.errMessageList.length;i++)
	{
		var newErr = $('<div />').text(this.groupOperationResult.errMessageList[i]).html();
		rv += stringFormat('<div class="inlineError">{0}</div>',[newErr]);
	}
	return rv;
},
doSendSimple:function()
{
	require(["modelEmailSendDlg","viewEmailSendDlg","bootstrapSelectPicker"],
		function(modelClass,viewClass){
			if (!App.Models.emailSendDlg)
			{
				App.Models.emailSendDlg = new modelClass();
				App.Views.emailSendDlg = new viewClass();
			}
			App.Models.emailSendDlg.update(
				function()
				{
					App.Views.emailSendDlg.render();
				}
			);
		});	
},
sndMassive_ShowMapDlg:function(){
	var contentHtml = compileTemplate(App.Templates.dialogs.MassiveSending,null);
	var vs = new AppHelper_VolumeSettingsClass();
	$("#dialogContLvl1").dwcmDialog({
		title: App.localeData.email_Type_Massive,
		buttons:{btnOk:true,btnCancel:true,btnMenu:false},
		model: vs.settings.massiveSendingMap,
		contentHtml: contentHtml,
		context: this,	
		onOkBtnClicked:this.sndMassive_PrepareMsg
	}); 
},
sndPec_ShowPecDlg:function(){
	var contentHtml = compileTemplate(App.Templates.dialogs.PecSending,null);
	var vs = new AppHelper_VolumeSettingsClass();
	$("#dialogContLvl1").dwcmDialog({
		title: App.localeData.email_Type_PEC,
		buttons:{btnOk:true,btnCancel:true,btnMenu:false},
		model: vs.settings.pecSendingCfg,
		contentHtml: contentHtml,
		context: this,	
		onOkBtnClicked:$.proxy(this.sndPec_onOkBtnClicked,this),
		onGuiValueChanged:$.proxy(this.sndPec_onGuiCtrlValueChanged,this),
		onRendered:$.proxy(this.sndPec_setControlState, this)
	}); 
},
sndPec_onGuiCtrlValueChanged:function(event,eventData){
	if ($(eventData.target).attr("disabledChanges")) return;
	if (eventData.target.tagName == "INPUT" && $(eventData.target).attr("type")=="checkbox")
	{
		this.sndPec_setControlState(event,eventData.dlgInstance);
		return;
	}
	var model = eventData.dlgInstance.options.model;
	console.log(model.disableChanges);
	model[eventData.dataField] += "{"+eventData.strValue+"}";
	AppHelper_WholeMainPaneDialog.setValues_ModelToGui(model);
	$(eventData.target).attr("disabledChanges",true);
	$(eventData.target).selectpicker('deselectAll');
	setTimeout(function(target)
   	{
		$(target).attr("disabledChanges","");
	},200,eventData.target);
},
sndPec_setControlState:function(ev,dlgInstance)
{
	var model = dlgInstance.options.model;
	if (model.useMacro)
		dlgInstance.$element.find(".compose").removeClass("nullHeight");
	else
		dlgInstance.$element.find(".compose").addClass("nullHeight");
},
sndPec_onOkBtnClicked:function(ev,evData)	
{
	// 1. save GUI changes in volume settings
	var model = evData.dlgInstance.options.model;
	var vs = new AppHelper_VolumeSettingsClass();
	vs.settings.pecSendingCfg = model;
	vs.save()	
	// 2. compile macros if any
	AppHelper_WholeMainPaneDialog.removeErrors(ctrlSubjMacro,errors);
	var selectedRows = this.getSelectedRows();
	var metadataChanges = [];
	this.groupOperationResultEx.setItems.apply(this.groupOperationResultEx,[selectedRows,model,2]);
	for (var i=0;i<selectedRows.length;i++){
		var doc = selectedRows[i];
		var subjectValue = AppHelper_compileMacro(model.subjectMacro,doc);
		if (subjectValue.errorStr){
			var errors = [{message:subjectValue.errorStr}];
			var ctrlSubjMacro = AppHelper_WholeMainPaneDialog.getControlsByField("subjectMacro")[0];
			AppHelper_WholeMainPaneDialog.showErrors(ctrlSubjMacro,errors);
			return;
		}
		var bodyValue = AppHelper_compileMacro(model.bodyMacro,doc);
		if (bodyValue.errorStr){
			errors = [{message:bodyValue.errorStr}];
			var ctrlBodyMacro = AppHelper_WholeMainPaneDialog.getControlsByField("bodyMacro")[0];
			AppHelper_WholeMainPaneDialog.showErrors(ctrlBodyMacro,errors);
			return;
		}
		// 3 Save new values of the fields "subjectMacro" and "bodyMacro"		
		$("#dialogContLvl1").dwcmDialog("remove");	
		this.showResultDialog("PEC sending result");
		$("#dialogContLvl1").dwcmDialog("setWaitIndicator",true);

		//check that "to" field is not empty
		if (!doc._L_PECA){
			var errStr = App.localeData.errEmailRecipientAddressIsEmpty;
			this.groupOperationResultEx.itemProcessed.apply(this.groupOperationResultEx,[0,i,errStr]);
		}

		
		if (model.useMacro){
		var updFieldsData = {
				method:"updateMetadata",
				volumeName: Appc.getCurrVolumeName(),
				docUid: doc.sys_docId, 
				fieldValues:[
					{name:"_L_PECTIT",valueStr:subjectValue.data},
					{name:"_L_PECTXT",valueStr:bodyValue.data}
				]
			 };
			AppHelper_JsonWsEx("updateMetadata",updFieldsData,
			   this.sndPec_onRowValueChangesStored,this,true,i);
		}
		
	}
	if (!model.useMacro)
	{
		this.sndPec_onAllRowValueChangesCompleted();
	}
},
sndPec_onRowValueChangesStored:function(resultObj,itemIndex)
{
	var errStr = "";
	if (!resultObj.bResult)
	{
		errStr = resultObj.exception.detailMessage;
	}
	var isAllItemsProcessed = 
		this.groupOperationResultEx.itemProcessed.apply(this.groupOperationResultEx,[0,itemIndex,errStr]);
	if (isAllItemsProcessed)
		this.sndPec_onAllRowValueChangesCompleted();
},
sndPec_onAllRowValueChangesCompleted:function()
{
	var pecSendingData = {
		volumeName: Appc.getCurrVolumeName(),
		docUidArray: [],
		includeMainDoc: this.groupOperationResultEx.model.includeMainDoc,
		includeAttachments: this.groupOperationResultEx.model.includeAttachments
	}
	
	for(var i=0;i<this.groupOperationResultEx.items.length;i++)
	{
		
		if (!this.groupOperationResultEx.hasErrors(0,i)){
			//step 0 is OK, add document for pecSending operation
			pecSendingData.docUidArray.push(this.groupOperationResultEx.items[i].sys_docId);
		}
	}
	AppHelper_JsonWsEx("pecSending",pecSendingData,
		   this.sndPec_onPecSendingCompeted,this,true);
},
sndPec_onPecSendingCompeted:function(resultObj)
{
	for (var i=0;i<resultObj.data.length;i++){
		this.groupOperationResultEx.itemProcessed.apply(this.groupOperationResultEx,[1,i,resultObj.data[i]]);
	}
	var info = this.groupOperationResultEx.getInfo()
	var briefResult = stringFormat(App.localeData.msgPecSendingBriefResult,[info.okItems,info.allItems]);
	this.onGroupOperationExCompleted(briefResult);
},
sndMassive_PrepareMsg:function(ev,evData)
{
	var thisInstance = evData.dlgInstance.options.context;
	// 1. save GUI changes in volume settings
	var model = evData.dlgInstance.options.model;
	var vs = new AppHelper_VolumeSettingsClass();
	vs.settings.massiveSendingMap = model;
	vs.save()
	$("#dialogContLvl1").dwcmDialog("remove");	
	// 2. prepare docInfo
	var selectedRows = thisInstance.getSelectedRows();
	thisInstance.groupOperationResult.itemCount_All = selectedRows.length;
	thisInstance.groupOperationResult.itemCount_Processed=0;

	var smtpSettings = App.Models.settings.get("smtpSettings");
	for(var i=0; i<selectedRows.length;i++)
	{
		var doc = selectedRows[i];
		//main document
		var docInfo = {
				id:doc.sys_docId,
				mainDocName:"mainDoc",
				isAttachment:false,
				includeAllAtt:vs.settings.includeAttachments,
				attName:""
		};
		var emailModel  = {
			emailTo:doc[vs.settings.massiveSendingMap.to],
			emailCc:doc[vs.settings.massiveSendingMap.cc],
			emailBcc:doc[vs.settings.massiveSendingMap.cc],
			subject:doc[vs.settings.massiveSendingMap.title],
			messageBody:doc[vs.settings.massiveSendingMap.messageBody],
			attMode:"sep"
		};
		emailModel  = $.extend({},smtpSettings,emailModel);
		wmw_sendDocumentsByEmailEx(
			App.getSessionId(),
			emailModel,
			[docInfo],
			thisInstance,
			thisInstance.sndMassive_onItemSendResult
		);
	}
	thisInstance.showResultDialog("Massive sending result");
	$("#dialogContLvl1").dwcmDialog("setWaitIndicator",true);
},
sndMassive_onItemSendResult:function(bresult,result,errorStr,dataToken){
	var thisInstance = dataToken;
	thisInstance.groupOperationResult.itemCount_Processed++;
	if (!bresult)
	{
		thisInstance.groupOperationResult.errMessageList.push(errorStr);
	}
	else
	{
		thisInstance.groupOperationResult.itemCount_Ok++;
	}
	if (thisInstance.groupOperationResult.itemCount_Processed ==
		thisInstance.groupOperationResult.itemCount_All)
	{
		thisInstance.onGroupOperationCompleted();
	}
},
showResultDialog:function(title){
	$("#dialogContLvl1").dwcmDialog({
		title: title,
		buttons:{btnOk:true,btnCancel:true,btnMenu:false},
		model: null,
		contentHtml: "",
		context: this,	
		onOkBtnClicked:function(ev,evData){
			$("#dialogContLvl1").dwcmDialog("remove");	
			App.getCurrentVolume().model.open();
		}
	}); 	
}	
} //instance

return instance;		

});
