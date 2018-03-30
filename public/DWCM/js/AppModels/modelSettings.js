define(["jquery","backbone","utils"],function($,Backbone,Utils){
var instance =
    Backbone.Model.extend({
    defaults: 
    {
        defaultLanguage: {name:"English",code:"en"},
        currLanguageCode: AppHelper_Settings_GetStrResource(Appn.Model.Settings.currLanguageCode,"en"),
        languageList: [
                {name:"English",code:"en"},
                {name:"Italian",code:"it"},
                {name:"German",code:"de"}
            ],
        currentLanguage: "",
		emailSendDlgSettings:null,
		commonPersistantSettings:[],
        userName: "",
        userPassword: "",
		smtpSettings:{}
    },
    onChange: function(model,options)
    {
    },
    onChangedByView:function(event)
     {
         var dataFieldId = $(this).attr('datafield');
         var dataFieldIdNew = dataFieldId +"_new";
         var isSaveWithoutValidation = $(this).hasClass('saveWithoutValidation');
         var newValue = event.currentTarget.value;
         var stype = $(event.currentTarget).attr('type');
         if (stype == 'checkbox') newValue = event.currentTarget.checked;
         if (dataFieldId!=null && newValue != null) 
             App.Models.settings.set(dataFieldIdNew,newValue);
         if (isSaveWithoutValidation)
             App.Models.settings.set(dataFieldId,newValue);
     },
	validate:function(attr,options)
	{
		var errors = [];
		var token = null;
		if (options.token) token = options.token;
		var skipOtherValidations = false;
		if (token && token.validationMethod)
		{
			this[token.validationMethod](attr,errors);
			skipOtherValidations = true;
		}
		if (!skipOtherValidations)
		{
			AppHelper_Validate.stringAsInteger(attr,Appn.Model.Settings.doclistPageSize,errors,true);
			this.validateSmtpSettings(attr,errors);
		}
		if (errors.length > 0) 
		{
			if (options ) options.errors = errors;
			return errors;
		}
		else
		{
			if (App.Models.settings)
			{
				var propNameArray = _.keys(this.changedAttributes());
				for(var i=0;i<propNameArray.length;i++)
				{
					var name = propNameArray[i];
					if (name==Appn.Model.Settings.smtpSettings) continue;
					var newValue = this.get(name);
					localStorage.setItem(name, newValue);
				}
			}
		}
	},
	validateSmtpSettings:function(attr,errors)
	{
		if(!attr) attr = this.attributes;
		AppHelper_Validate.notEmpty(attr,"smtpSettings.host",errors);
		AppHelper_Validate.notEmpty(attr,"smtpSettings.senderAddress",errors);
		AppHelper_Validate.notEmpty(attr,"smtpSettings.recipientAddress",errors);
		if (attr.authentication != "NONE")
		{
			AppHelper_Validate.notEmpty(attr,"smtpSettings.userName",errors);
			AppHelper_Validate.notEmpty(attr,"smtpSettings.smtpPassword",errors);
		}
	},
    validateCredentials:function(attr,errors)
    {
		AppHelper_Validate.notEmpty(attr,"userName",errors);
		AppHelper_Validate.notEmpty(attr,"userPassword",errors);
		if (errors.length==0)
		{
			this.storePersist("userName",this.get("userName"));
			this.storePersist("userPassword",this.get("userPassword"));
			this.storePersist("rememberCredentials",this.get("rememberCredentials"));
		}
    },
    getLanguageByCode: function(code,languageList){
        for(var i=0;i<languageList.length;i++)
        {
            if (languageList[i].code==code) return languageList[i];
        }
        return null;
    },
	onSendTestingMessageBtnClicked:function()
	{
		var smtpSettings = this.get("smtpSettings");
		smtpSettings.subject = App.localeData.smtpSendTestingMessageSubject;
		wmw_sendDocumentsByEmail(
			App.getSessionId(),
			smtpSettings,
			this,
			function(bresult,data,errorStr,dataToken)
			{
				if(!bresult)
				{
					App.Views.appSettings.renderSendTestMessageResult(bresult,errorStr);
				}
				else
				{
					App.Views.appSettings.renderSendTestMessageResult(bresult,App.localeData.msgSmtpTestingMessageOK);
				}
			}
			);
	},
	refreshSmtpSettings: function()
	{
		var defaultSmtpSettings = {
				port:"25",
				timeout:"30",
				securityLayer:"0",
				authentication:"0",
				senderAddress:"",
				personal:"",
				recipientAddress:"",
				ccAddress:"",
				bccAddress:"",
				subject:"",
			    userName:"",
				password:"",
			 };		
		 var smtpStr =   AppHelper_Settings_GetStrResource(Appn.Model.Settings.smtpSettings,JSON.stringify(defaultSmtpSettings));
		 try
		 {
			 var smtpObj = JSON.parse(smtpStr);
			 $.extend( defaultSmtpSettings, smtpObj );
			 this.set(Appn.Model.Settings.smtpSettings,defaultSmtpSettings);
			 return defaultSmtpSettings;
		 }
		 catch(err)
		 {
			 this.set(Appn.Model.Settings.smtpSettings,defaultSmtpSettings);
			 return defaultSmtpSettings;	
		 }
	},
	restoreObject:function(propName,defaultVal)
	{
		var strVal = AppHelper_Settings_GetStrResource(propName,null);
		var objVal = defaultVal;
		if (strVal)
		{
			try
			{
				 var storedValObj = JSON.parse(strVal);
				 var resultValObj = defaultVal;
				 $.extend( resultValObj, storedValObj);
				 this.set(propName,resultValObj);
				 return resultValObj;
			}
			catch(err)
			{
			}
		}
		return defaultVal;	
	},
	saveObject:function(propName,propVal)
	{
		var strVal = JSON.stringify(propVal);
		localStorage.setItem(propName, strVal);
	},
	saveSmtpSettings: function()
	{
		var smtpStr = JSON.stringify(this.get(Appn.Model.Settings.smtpSettings));
		localStorage.setItem(Appn.Model.Settings.smtpSettings, smtpStr);
	},
	storePersist:function(propName,propValue)
	{
		this.set(propName,propValue,{validate:false});
		localStorage.setItem(propName,propValue);
	},
    initialize: function(initComplete)
    {
         var currLanguageCode = this.get(Appn.Model.Settings.currLanguageCode);
         this.set(Appn.Model.Settings.currentLanguage,
                    this.getLanguageByCode(currLanguageCode,this.get(Appn.Model.Settings.languageList)));
         App.localeData = App.setLocale(currLanguageCode,initComplete);
        //                                {
        //                                    //App.localeData= data;
        //                                    console.log('App.setLocale OK');
        //                                });
         var userName = AppHelper_Settings_GetStrResource(Appn.Model.Settings.userName,"");
         var userPassword = AppHelper_Settings_GetStrResource(Appn.Model.Settings.userPassword,"");
         var rememberCredentials = AppHelper_Settings_GetResourceAsBool(Appn.Model.Settings.rememberCredentials,false);
         var docListPageSize = AppHelper_Settings_GetResourceAsInt(Appn.Model.Settings.doclistPageSize,50);
         var lastPathBarValue = AppHelper_Settings_GetStrResource(Appn.Model.Settings.lastPathBarValue,"");
		
         if (!rememberCredentials)
         {
             userName = "";
             userPassword = "";
         }
         this.set(Appn.Model.Settings.userName,userName,{validate:true});
         this.set(Appn.Model.Settings.userPassword,userPassword,{validate:true});
         this.set(Appn.Model.Settings.rememberCredentials,rememberCredentials,{validate:true});
         this.set(Appn.Model.Settings.doclistPageSize,docListPageSize,{validate:true});
        
         this.set(Appn.Model.Settings.dsn,
                  AppHelper_Settings_GetStrResource(Appn.Model.Settings.dsn,""),{validate:true});
         this.set(Appn.Model.Settings.lastSessionId,
                  AppHelper_Settings_GetStrResource(Appn.Model.Settings.lastSessionId,""),{validate:true});
         this.set(Appn.Model.Settings.ddTreeSortOrder,
                  AppHelper_Settings_GetStrResource(Appn.Model.Settings.ddTreeSortOrder,
                  Appn.MenuCommands.NavGridOrder_Struct),{validate:true});
         this.set(Appn.Model.Settings.lastPathBarValue,lastPathBarValue,{validate:true});
		 this.refreshSmtpSettings();
         this.listenTo(this,'change',this.onChange);
    }
 }); 
	
return instance;	
});
