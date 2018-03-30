define(["jquery","backbone","utils"],function($,Backbone,Utils){
var instance =
    Backbone.Model.extend({
    defaults: 
    {
		attMode:"zip",
		currRowAttachments:null,
		emailTo:"",
		emailCc:"",
		emailBcc:"",
		includeAllAttachments:false,
		messageBody:"",
		mainDocSelected:true,
		nameGenRule:"",
		nameGenRulePreview:"",
		nameGenRuleLastAddedFields:[],
		subject:"",
		volFields:[],
		volumeName:"",
		selectedRows:[]
    },
	isMultipleDocs:function()
	{
		return (this.get("selectedRows").length>1);
	},
	onCmbFieldsClosed:function()
	{
		this.set("nameGenRuleLastAddedFields",[]);
		this.set("nameGenRule",this.get("nameGenRulePreview"));
	},
	onCmbFieldsChanged:function(e,index,newValue,oldValue)
	{
		var that = App.Models.emailSendDlg;
		var lastAddedFields = that.get("nameGenRuleLastAddedFields");
		var selField = App.Views.emailSendDlg.getSelectedFieldByIndex(index);
		var selFieldsMacro = "";
		if (!newValue)
		{
			//remove unchecked field from the list
			var index = lastAddedFields.indexOf(selField);
			if (index > -1) {
				lastAddedFields.splice(index, 1);
			}			
		}
		else
		{
			//add new field to array
			lastAddedFields.push(selField);
		}
		for(var i=0;i<lastAddedFields.length;i++)
		{
			var fldName = lastAddedFields[i];
			selFieldsMacro += "{"+fldName+"}";
		}
		that.set("nameGenRuleLastAddedFields",lastAddedFields);
		var nameGenRule = that.get("nameGenRule") + selFieldsMacro;
		that.set("nameGenRulePreview",nameGenRule);
	},
	getDocumentName:function(doc,errorArray)
	{
		var nameGenRule = this.get("nameGenRule");
		if (!doc)
		{
			var selectedDocs = this.get("selectedRows");
			doc = selectedDocs[0];
		}
		var macroResult = AppHelper_compileMacro(nameGenRule,doc);
		if (macroResult.errorStr && errorArray)
				errorArray.push({name:"nameGenRule",message:macroResult.errorStr});
		return macroResult.data;
	},
	prepareEmlMsgInfo:function()
	{
		var selectedDocs = this.get("selectedRows");
		var docInfoList = [];
		var includeAllAtt = selectedDocs.length>1 && this.get("includeAllAttachments");
		for(var i=0; i<selectedDocs.length;i++)
		{
			var doc = selectedDocs[i];
			var docName = this.getDocumentName(doc);
			//add docInfo for main document
			if (this.get("mainDocSelected"))
			{
				var docInfo = {
						id:doc.sys_docId,
						mainDocName:docName,
						isAttachment:false,
						includeAllAtt:includeAllAtt,
						attName:""
				};
				docInfoList.push(docInfo);
			}
			//add selected attachments (if needed)
			if (!includeAllAtt)
			{
				var selAttList = App.Views.emailSendDlg.getSelectedAttachments();
				for (var j=0;j<selAttList.length;j++)
				{
					var attName= selAttList[j];
					var attInfo = {
						id:doc.sys_docId,
						mainDocName:docName,
						isAttachment:true,
						includeAllAtt:false,
						attName:attName
					}
					docInfoList.push(attInfo);
				}
			}
		}
		var smtpSettings = App.Models.settings.get("smtpSettings");
		var emailModel  = $.extend({},smtpSettings,this.attributes);
		showWaitIndicator();
		wmw_sendDocumentsByEmailEx(
			App.getSessionId(),
			emailModel,
			docInfoList,
			this,
			this.onEmailSendResult
		);
	},
	onEmailSendResult(bresult,result,errorStr,dataToken)
	{
		hideWaitIndicator();
		App.Views.emailSendDlg.renderResult(errorStr);
	},
	readSettings:function()
	{
		var storedSettings = App.Models.settings.restoreObject(
			Appn.Model.Settings.emailSendDlgSettings,this.attributes);
	},
	saveSettings:function()
	{
		var settingsToStore = {
			attMode:this.get("attMode"),
			emailTo:this.get("emailTo"),
			emailCc:this.get("emailCc"),
			emailBcc:this.get("emailBcc"),
			messageBody:this.get("messageBody"),
			subject:this.get("subject")
		};
		var volName = this.get("volumeName");
		var volSettings = new AppHelper_VolumeSettingsClass(volName);
		volSettings.settings.nameGenRule = this.get("nameGenRule");
		volSettings.save();
		App.Models.settings.saveObject(Appn.Model.Settings.emailSendDlgSettings,settingsToStore);
	},
	update:function(handler)
	{
		this.readSettings();
		this.set("selectedAtt",[]);
		var volModel = Appc.getActiveVolumeModelObject();
		var volName = volModel.get("msd").volumeName;
		var volSettings = new AppHelper_VolumeSettingsClass(volName);
		this.set("nameGenRule",volSettings.settings.nameGenRule);
		this.set("volFields",volModel.get("msd").jFields);
		this.set("volumeName",volName);
		var selectedRows = volModel.get("mainView").getSelectedRows();
		if(selectedRows.length == 0) 
		{
			var currRow = volModel.get("currentRow");
			if (!currRow) return;
			selectedRows = [currRow];
		}
		this.set("selectedRows",selectedRows);
		if (selectedRows.length==1)
		{
			var token = {modelInstance:this,handler:handler};
			//request attachments
			volModel.getAttachments(currRow,token,
				function(data,token)
				{
					token.modelInstance.set("currRowAttachments",data);
					token.handler();
				});
			return;
		}
		handler();
	},
	validate:function(attr,options)
	{
		var token = null;
		if (!options.errors) options.errors = [];
		if (options.token) token = options.token;
		var skipOtherValidations = false;
		if (token && token.validationMethod)
		{
			this[token.validationMethod](attr,options.errors);
			skipOtherValidations = true;
		}
		if (skipOtherValidations) return;
		
	},
	validatepage1:function(attr,errors)
	{
		AppHelper_Validate.notEmpty(attr,"emailTo",errors);
	},
	validatepage2:function(attr,errors)
	{
		AppHelper_Validate.notEmpty(attr,"nameGenRule",errors);
		App.Models.emailSendDlg.getDocumentName(null,errors);
	},
    initialize: function()
    {
    }
 }); 
	
return instance;	
});
