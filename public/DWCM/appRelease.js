var appStartingUrlPrefix = ((location.href.indexOf("/dfm_web/")!=-1)?"/dfm_web/":"/");
require.config(
	 {
		 waitSeconds: 120,
		 paths:{
			 "jquery":"https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min",
			 "jqueryMobile":"https://ajax.googleapis.com/ajax/libs/jquerymobile/1.4.5/jquery.mobile.min",
			 "bootstrap":"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min",
			 "backbone":"https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.3.3/backbone-min",
			 "underscore":"https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min",
			 "bootstrapTreeview":appStartingUrlPrefix+"DWCM/js/bootstrap-treeview/bootstrap-treeview.min",
			 "bootstrapTable":appStartingUrlPrefix+"DWCM/js/bootstrapTable/bootstrap-table",			 
			 "spin":appStartingUrlPrefix+"DWCM/js/spin",
			 "rx":appStartingUrlPrefix+"DWCM/js/rx",
			 
			 //React modules
			 "react":appStartingUrlPrefix+"DWCM/js/react/react",
			 "reactDom":appStartingUrlPrefix+"DWCM/js/react/react-dom",
			 "babel":appStartingUrlPrefix+"DWCM/js/react/babel-browser.min",
			 "jsx":appStartingUrlPrefix+"DWCM/js/require/jsx",
			 "text":appStartingUrlPrefix+"DWCM/js/require/text",
			 //jsx modules
			 "glbSearch":appStartingUrlPrefix+"DWCM/jsx/globalSearch",
			 "ddGallery":appStartingUrlPrefix+"DWCM/jsx/ddGallery",
			 
 			 "bootstrapTable_TapRow": appStartingUrlPrefix+"DWCM/js/bootstrapTable_Plugins/tapRow",

			 
			 "ctrlLoginPg":appStartingUrlPrefix+"DWCM/js/AppControllers/ctrlLoginPg",
			 "ctrlMasterPg":appStartingUrlPrefix+"DWCM/js/AppControllers/ctrlMasterPg",
			 "ctrlEmailSending":appStartingUrlPrefix+"DWCM/js/AppControllers/ctrlEmailSending",
			 "ctrlRelations":appStartingUrlPrefix+"DWCM/js/AppControllers/ctrlRelations",
			 "ctrlSendingHistory":appStartingUrlPrefix+"DWCM/js/AppControllers/ctrlSendingHistory",
			 "ctrlDfmForms":appStartingUrlPrefix+"DWCM/js/AppControllers/ctrlDfmForms",		 
			 "modelControllers":appStartingUrlPrefix+"DWCM/js/AppControllers/ctrlAll",
			 "modelApp":appStartingUrlPrefix+"DWCM/js/AppModels/modelApp",
			 "modelAutoFilterDlg":appStartingUrlPrefix+"DWCM/js/AppModels/modelAutoFilterDlg",
			 "modelDdTree":appStartingUrlPrefix+"DWCM/js/AppModels/modelDDTree",
			 "modelSettings":appStartingUrlPrefix+"DWCM/js/AppModels/modelSettings",
			 "modelCommonParams":appStartingUrlPrefix+"DWCM/js/AppModels/modelCommonParams",
			 "modelDfmGrouping":appStartingUrlPrefix+"DWCM/js/AppModels/modelDfmGrouping",
			 "modelDfmVolume":appStartingUrlPrefix+"DWCM/js/AppModels/modelDfmVolume",
			 "modelEmailSendDlg":appStartingUrlPrefix+"DWCM/js/AppModels/modelEmailSendDlg",
			 "viewSelectDsnDlg":appStartingUrlPrefix+"DWCM/js/AppViews/viewSelectDsnDlg",
			 "viewMasterPage":appStartingUrlPrefix+"DWCM/js/AppViews/viewMasterPage",
			 "viewDfmGrouping":appStartingUrlPrefix+"DWCM/js/AppViews/viewDfmGrouping",
			 "viewDfmVolume":appStartingUrlPrefix+"DWCM/js/AppViews/viewDfmVolume",
			 "viewAutoFilterDlg":appStartingUrlPrefix+"DWCM/js/AppViews/viewAutoFilterDlg",
			 "viewAppSettings":appStartingUrlPrefix+"DWCM/js/AppViews/viewAppSettingsDlg",
			 "viewEmailSendDlg":appStartingUrlPrefix+"DWCM/js/AppViews/viewEmailSendDlg",
			 "utils":appStartingUrlPrefix+"DWCM/js/utils",
			 "waitIndicator":appStartingUrlPrefix+"DWCM/js/waitIndicator",
			 
			 
			 "jqueryForm":appStartingUrlPrefix+"DWCM/js/jqueryForm/jquery.form",
			 "bootstrapSelectPicker":appStartingUrlPrefix+"DWCM/js/bootstrap-select-1.12.1/js/bootstrap-select",
			 "vidgets":appStartingUrlPrefix+"DWCM/js/vidgets",
			 "webMethodWrap":appStartingUrlPrefix+"DWCM/js/webMethodWrap"

		 }
	 }
 );	

require(["jquery","backbone","modelApp"],
		function($,Backbone,ModelApp){
	
			require(["modelControllers"
					 ,"modelSettings","modelCommonParams","modelDdTree","webMethodWrap","vidgets"],
			function(ModelControllers,ModelSettings,ModelCommonParams,ModelDDTree,waitIndicator){
			wmw_getServerVersion();	
			App.Controllers = ModelControllers;
			App.Models.settings = new ModelSettings();
			App.Models.commonParams =  new ModelCommonParams();  
			App.Models.ddTree = new ModelDDTree();    
			App.Models.settings.set(Appn.Model.Settings.currLanguageCode,"en",{validate:true});    
			App.Templates.loadTemplates();
			});
			Appc.loadReact();
	
});




