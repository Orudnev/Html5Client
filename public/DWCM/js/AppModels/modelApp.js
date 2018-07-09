define(['backbone'],function(Backbone){
window.Appn = 
{
 Events:{
	 GrOperItemCompleted: 'GrOperItemCompleted',
	 MainMenuClosed: 'MainMenuClosed'
 },	
 Model:
 {
	 Settings:
	 {
		 defaultLanguage: 'defaultLanguage',
		 currLanguageCode: 'currLanguageCode',
		 languageList: 'languageList',
		 currLanguageCode: 'currLanguageCode',
		 currentLanguage: 'currentLanguage',
		 rememberCredentials: 'rememberCredentials',
		 userName : 'userName',
		 userPassword: 'userPassword',
		 dsn: 'dsn',
		 emailSendDlgSettings:'emailSendDlgSettings',
		 lastSessionId: 'lastSessionId',
		 doclistPageSize: 'doclistPageSize',
		 ddTreeSortOrder: 'ddTreeSortOrder',
		 lastPathBarValue: 'lastPathBarValue',
		 smtpSettings:'smtpSettings'
	 },
	 DsnList: 'dsnList',
	 selectedDsn: 'selectedDsn',
	 currentVol: 'currentVol',
	 currentFilteredVol: 'currentFilteredVol',
	 currentGrouping: 'currentGrouping',
	 currentVolSearch: 'currentVolSearch',
	 emailSendDlg:'emailSendDlg'
 },
 MenuCommands:
 {
	 ShowDDTree:"ShowDDTree",
	 NavGridOrder_Struct:"NavGridOrder_Struct",
	 NavGridOrder_Abc:"NavGridOrder_Abc",
	 About:"About",
	 AppSettings:"AppSettings",
	 Logout:"Logout",
	 OpenVolume:  "OpenVolume",
	 OpenVolumeFilterOrGrouping: "OpenVolumeFilterOrGrouping",
	 VolumeSearch: "VolumeSearch",
	 GlobalSearch: "GlobalSearch",
	 ViewHistoryItem: "ViewHistoryItem",
	 ViewHistoryItemAsXml: "ViewHistoryItemAsXml",
	 AutoFilter:"AutoFilter",
	 UDFilter:"UDFilter",
	 Grouping:"Grouping",
	 DGridAddDocument: "AddDocument",
	 DGridAddAttachment: "AddAttachment",
	 DGridDeleteDocument: "DeleteDocument",
	 DGridDeleteAttachment:"DeleteAttachment",
	 DGridEditDocumentMetadata:"EditDocumentMetadata",
	 DGridEmailSend:"EmailSend",
	 DGridViewDocument:	"ViewDocument",
	 DGridForms:	"Forms",
	 DGridViewAttachment:	"ViewAttachment",
	 DGridViewRelatedDocs: "ViewRelatedDocs",
	 DGridViewSendingHistory: "ViewSendingHistory",
	 DGridSaveSelected:	"SaveSelected",
	 DGridSaveSelectedAtt:	"SaveSelectedAtt",
	 DGridShowAttList:	"ShowAttList",
	 GoToDF: "GoToDF", //switch between "DF","WF" and "QST" partitions
	 GoToWF: "GoToWF", //switch between "DF","WF" and "QST" partitions
	 GoToQST: "GoToQST" //switch between "DF","WF" and "QST" partitions
 },
 Colors:
 {
	 DDtreeColor:{
		 standardDirIcon: "#000000",
		 standardDirIconClosed: "#000000",
		 standardDirIconConserved: "#000000",
		 externalDirIcon: "#000000",
		 externalDirIconClosed: "#000000",
		 externalDirIconConserved: "#000000",
		 virtualDirIcon: "#0000FF"
	 }
 },
 Constants:
 {
	 BScreen:{
				minWidth:1201,
				minHeight:801
			 }

 },
 IconTypes:
 {
	 ddTreeRootIcons: "ddTreeRootIcons",
	 ddTreeMiddleIcons: "ddTreeMiddleIcons",
	 ddTreeSmallIcons: "ddTreeSmallIcons"
 },
 Icons:
 {
	 DDtreeIcon:{
		 storageIcon:   "DWCM/image/DirIcons/Archive.svg",
		 wfIcon:        "DWCM/image/DirIcons/workflow.svg",
		 qwestIcon:     "DWCM/image/DirIcons/Quest.svg",
		 areaIconR:  "DWCM/image/DirIcons/FolderStart.svg",
		 areaIconT:  "DWCM/image/DirIcons/FolderEnd.svg",
		 areaIconC:  "DWCM/image/DirIcons/FolderMiddle.svg",
		 areaIconRT: "DWCM/image/DirIcons/FolderStart.svg",
		 areaIconRC: "DWCM/image/DirIcons/FolderStart.svg",
		 allVolumes: "DWCM/image/DirIcons/FolderStart.svg",
		 standardDirIcon: "DWCM/image/DirIcons/VolumeStd.svg",
		 standardDirIconClosed: "DWCM/image/DirIcons/VolumeStdConserved.svg",
		 standardDirIconConserved: "DWCM/image/DirIcons/VolumeStdConserved.svg",
		 externalDirIcon: "DWCM/image/DirIcons/VolumeExt.svg",
		 externalDirIconClosed: "DWCM/image/DirIcons/VolumeStdConserved.svg",
		 externalDirIconConserved: "DWCM/image/DirIcons/VolumeStdConserved.svg",
		 virtualDirIcon: "DWCM/image/DirIcons/VolumeVV.svg",
		 filterIcon: "DWCM/image/DirIcons/filter.svg",
		 udFilterIcon: "DWCM/image/DirIcons/filterGreen.svg",
		 udGroupingIcon: "DWCM/image/DirIcons/groupingGreen.svg",
		 filterAutoIcon:"DWCM/image/DirIcons/filterAuto.svg",
		 groupingIcon: "DWCM/image/DirIcons/grouping.svg",
		 searchIcon: "DWCM/image/DirIcons/search.svg",
		 relationIcon: "DWCM/image/DirIcons/relation.svg"
	 }
 },
 Dialogs:
 {
	LoginDialog: "LoginDialog",
	DocViewDialog:"DocViewDialog",
	GenSettingsDialog:"GenSettingsDialog", 
	VolumeNameLabel:"VolumeNameLabel",
	InfoDD:"InfoDD",
	DFTabContainer:"DF_tabContainer", 
	ddtTblAreaInfoColumn:"ddtTblAreaInfoColumn",
	ddtTblVolumeInfoColumn:"ddtTblVolumeInfoColumn",
	WholeMainPaneDialog:"WholeMainPaneDialog",
	AttachmentPaneContent:"AttachmentPaneContent",
	VolumeForm:"VolumeForm" ,
	SearchForm:"SearchForm",
	AppSettingsDlg:"AppSettingsDlg", 
	AddAttachmentForm:"AddAttachmentForm",
	AutoFilterDialog:"AutoFilterDialog",
	SaveSelectedAs:"SaveSelectedAs",
	UDFilterForm:"UDFilterForm" 
 }
};

	
	
window.App = {
     version:"1.0.0.63",
	 serverVersion: "",
     Models:{},
     Views:{},
     Controllers:{},
     settings:{},
     router:{},
     localeData: {},
     getSessionId: function(){return App.Models.settings.get(Appn.Model.Settings.lastSessionId)},
     getCurrentVolume: function(){return App.Models.commonParams.get(Appn.Model.currentVol)},
	 navigate:{
		 LoginPage:function()
		 {
			if (App.localeData == null)
			{
				App.setLocale(App.Models.settings.get(Appn.Model.Settings.currLanguageCode)
							  ,App.Controllers.loginPage.showLoginDlg);
				return;
			}
			App.Controllers.loginPage.showLoginDlg(); 
		 },
		 MasterPage:function()
		 {
			 App.Controllers.masterPage.doInit();
		 }
	 },
     Templates:{
         loginPage: {url:'DWCM/DwcmLoginTmpl.html',html:''},
		 aboutDialog:{url:'DWCM/AboutDlgTmpl.html',html:''},
		 emailSendDialog:{url:'DWCM/EmailSendDlgTmpl.html',html:''},
         selectDsnDlg: {url:'DWCM/SelectDsnDlgTmpl.html',html:''},
         masterPage: {url:'DWCM/MasterPageTmpl.html',html:''},
         rootNodePane:{url:'DWCM/RootNodePaneTmpl.html',html:''},
         dfVolTabContainer:{url:'DWCM/DfVolTabContainerTmpl.html',html:''},
         dialogs:{
                    url:'DWCM/DialogsTmpl.xml',
                    html:'',
                    XmlCdata:true
                 },
         loadTemplates:function()
         {
            for (var key in App.Templates) 
            {
                if ($.type(App.Templates[key])==="function") continue;
                if (Object.prototype.hasOwnProperty.call(App.Templates, key)) 
                {
                    var tmpl = App.Templates[key];
                    AppHelper_getStaticResource.call(key,tmpl.url,
                        function(data,url)
                        {
                            var propName = this.toString();
                            App.Templates[propName].html = data;
                            if (App.Templates[propName].hasOwnProperty('XmlCdata'))
                            {
                                var wholeXml = $.parseXML(data);
                                var dlgArray = $(wholeXml).find('Dialog');
                                for(var i=0;i<dlgArray.length;i++)
                                {
                                    var dlgName = $(dlgArray[i]).attr('id')
                                    var htmlContent = $(dlgArray[i]).text();
                                    App.Templates.dialogs[dlgName]= htmlContent
                                }
                            }
                            if (App.Templates.isAllTemplatesLoaded())
                            {
                                console.log('load templates completed');
                                App.onAppItitializationCompleted();
                            }
                        }
                    );
                }
            }         
         },
         isAllTemplatesLoaded:function()
         {
            for (var key in App.Templates) 
            {
                if ($.type(App.Templates[key])==="function") continue;
                if (Object.prototype.hasOwnProperty.call(App.Templates, key)) 
                {
                    var tmpl = App.Templates[key];
                    if (tmpl.html == '') return false;
                }
            }
            return true;  
         }
     },
     onAppItitializationCompleted: function()
     {
		console.log("onAppItitializationCompleted sessionId=",App.getSessionId());
		wmw_getResidualSessionTime(App.getSessionId(),null,function(bresult,result,errorStr,dataToken){
			if (bresult && result>0)
			{
				App.navigate.MasterPage();	
			}
			else
			{
				App.navigate.LoginPage();
			}
		});
     },
     setLocale: function(localeCode,handler)
     {
		 if (!localeCode && !handler)
		 {
			 var localeIndex = AppHelper_Settings_GetStrResource("language","0");
			 var localeCode = "en";
			 if (localeIndex=="1") localeCode = "it";
			 if (App.Models.settings)
 			 	App.Models.settings.set("currLanguageCode",localeCode);
		 }
         AppHelper_getStaticResource('DWCM/locale/dwcm-locale-'+localeCode+'.json',
                function(data)
                {
                    var jsonObj = $.parseJSON(data);
                    App.localeData= jsonObj;
                    if (handler!=null)
                            handler();
                });
         return null;                             
     },
	 winResize:{
		 		handlers:[],
		 		addHandler:function(strUid,paramObj,handlerFunc)
							{
								$( window ).resize(App.winResize.onResize);
								var hndlr = App.winResize.findHandler(strUid);
								if (hndlr)
								{
									hndlr.handler = handlerFunc;
								    hndlr.param = paramObj;
								}
								else
								{
									var newHandler = {name:strUid,param:paramObj,handler:handlerFunc};
									App.winResize.handlers.push(newHandler);
								}
							},
		 		findHandler:function(strUid)
		 					{
								for(var i=0;i<App.winResize.handlers.length;i++)
								{
									var item = App.winResize.handlers[i];
									if (item.name == strUid) return item;
								}
								return null;
							},
		 		removeHandler:function(strUid)
		 					{
								for(var i=0;i<App.winResize.handlers.length;i++)
								{
									var item = App.winResize.handlers[i];
									if (item.name == strUid) 
									{
										App.winResize.handlers.splice(i,1);
										return;
									}
								}
							},
		 		onResize:function(ev)
		 					{
								var lastIndex = App.winResize.handlers.length-1;
								if (lastIndex<0) return;
								var item = App.winResize.handlers[lastIndex];
								ev.data = item.param;
								item.handler(ev);
							}
	 		   }

 };    
	
window.Appc = {
	 getActiveVolumeModelObject: function()
	 {
			var activeTab = $("#DF_VolTabContainer li.active").find("a").attr("href"); 
				//possible values: #VolSummaryPane,#VolDocumentListPane,#VolDocumentListPaneExt
			var selectedVolumeObj = null;
			if (activeTab=="#VolDocumentListPane") 
				selectedVolumeObj = App.getCurrentVolume().model; //All Documents
			if (activeTab=="#VolDocumentListPaneExt")
			{
				// Filter or Grouping or search
				if ($("#VolDocumentListPaneExt .DfmGrpContent").length == 0)
					selectedVolumeObj = Appc.getCurrentFilteredVol().model; //Filter
				else
					selectedVolumeObj = Appc.getCurrentGrouping().model.get("underlyingVolumeObject");	//Grouping  
			}
		 	return selectedVolumeObj;
	 },
	 getCurrVolumeName: function()
	 {
		var selVol = Appc.getActiveVolumeModelObject(); 
		if (selVol)
			return selVol.get("volumeName");
		else
			return null;
	 },
	 getFldListOfCurrVol: function(insertEmptyToTop)
	 {
		var fldList = Appc.getActiveVolumeModelObject().get("msd").jFields.slice();
		if (insertEmptyToTop)
				fldList.unshift("");
		return fldList;
	 },
	 getMsdOfSelectedNode: function(handler){
		var currVolModel = Appc.getActiveVolumeModelObject(); 
		var selNode = App.Models.ddTree.getSelectedNode();
		if(currVolModel && currVolModel.get('volumeName') === selNode.volumeInfo.name){
			handler(true,currVolModel.get('msd'),this);
			return;
		} 
        wmw_getMSD(App.getSessionId(),selNode.id,null,null,handler,
		function(bresult,dataObj,handler){handler(bresult,dataObj.oMSD,this)});
	 },
     getVolumeCount: function()
            {return App.Models.ddTree.getVolumesCount();},
     getCurrentLocale:function()
     {
        rv =  App.Models.settings.get(Appn.Model.Settings.currLanguageCode);  
        if (rv == 'en') rv = 'en-US'; 
        return rv;
     },
     getCurrentFilteredVol:function()
     {
        return App.Models.commonParams.get(Appn.Model.currentFilteredVol);  
     },
     getCurrentGrouping:function()
     {
         return App.Models.commonParams.get(Appn.Model.currentGrouping);
     },	 
	 getCurrVolConfigParam: function(parName)
	 {
		// returns combined volume data (isPecVolume: false, isPassiveFpaVolume: true, forms: Array(0)...
		var cv = App.Models.commonParams.get(Appn.Model.currentVol);
		if (cv)
		{
			var config = Appc.getActiveVolumeModelObject().get('volConfig');
			if (config)
			{
				if(parName) 
					return config[parName];
				else
				    return config;	
			}
			return null;
		}
		return  null;
	 },
	 getVolueType: function(iconSrc)
	 {
		if (iconSrc===Appn.Icons.DDtreeIcon.standardDirIcon) 
			return App.localeData.volumeType_Standard; 
		if (iconSrc===Appn.Icons.DDtreeIcon.standardDirIconClosed) 
			return App.localeData.volumeType_StandardClosed; 
		if (iconSrc===Appn.Icons.DDtreeIcon.standardDirIconConserved) 
			return App.localeData.volumeType_StandardConserved; 
		if (iconSrc===Appn.Icons.DDtreeIcon.externalDirIcon) 
			return App.localeData.volumeType_External; 
		if (iconSrc===Appn.Icons.DDtreeIcon.externalDirIconClosed) 
			return App.localeData.volumeType_ExternalClosed; 
		if (iconSrc===Appn.Icons.DDtreeIcon.externalDirIconConserved) 
			return App.localeData.volumeType_ExternalConserved; 
		if (iconSrc===Appn.Icons.DDtreeIcon.virtualDirIcon) 
			return App.localeData.volumeType_Virtual
	 },
     propAccessor:function(propId,value)
     {
         if (value!=null)
             return App.Models.settings.set(propId,value,{validate:true});
         return App.Models.settings.get(propId);
     },
     propAccessorEx:function(propId,cmd,autoInitNewValue)
     {
         //cmd = null - returns stored value
         //cmd = "new" - returns value entered manually
         //cmd = "save" - stores manually entered value
         var propIdNew = propId+"_new";
         var storedValue = Appc.propAccessor(propId);
         var newValue = Appc.propAccessor(propIdNew);
         if (autoInitNewValue && newValue==null)
         {
             newValue = storedValue;
             Appc.propAccessor(propIdNew,newValue); //create "_new" property
         }
         if (cmd==null)
         {
             return storedValue;
         }
         if (cmd=="new") 
             return newValue;
         Appc.propAccessor(propId,newValue); //store new value
     },
     dsn:function(){return App.Models.settings.get(Appn.Model.Settings.dsn)},
     userName:function(cmd)  
     {
         return Appc.propAccessorEx(Appn.Model.Settings.userName,cmd,Appc.rememberCredentials);
     },
     password:function(cmd)
     {
         return Appc.propAccessorEx(Appn.Model.Settings.userPassword,cmd,Appc.rememberCredentials);
     },
     rememberCredentials:function(cmd)
     {
         return Appc.propAccessorEx(Appn.Model.Settings.rememberCredentials,cmd,false);
     },	 
	 setCurrentFilteredVol:function(value)
     {
        return App.Models.commonParams.set(Appn.Model.currentFilteredVol,value);   
     },
	 loadReact:function(jsxModuleName){
		 require(["react", "reactDom"],
			function(react,reactDOM)
			{
				  window.React = react;
				  window.ReactDOM = reactDOM;
			});		 
		 }

 }	
	
return window.App;	
});
	