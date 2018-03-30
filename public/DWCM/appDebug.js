var appStartingUrlPrefix = ((location.href.indexOf("/dfm_web/")!=-1)?"/dfm_web/":"/");
require.config(
	 {
		 waitSeconds: 120,
		 paths:{
			 "jquery":appStartingUrlPrefix+"DWCM/js/jquery/jquery-1.11.2",
			 "jqueryMobile":appStartingUrlPrefix+"DWCM/js/jquerymobile/jquery.mobile",
			 "bootstrap":appStartingUrlPrefix+"DWCM/js/bootstrap/3.3.2/js/bootstrap",
			 "backbone":appStartingUrlPrefix+"DWCM/js/backbone/backbone",
			 "underscore":appStartingUrlPrefix+"DWCM/js/backbone/underscore",
			 "bootstrapTreeview":appStartingUrlPrefix+"DWCM/js/bootstrap-treeview/bootstrap-treeview.min",
			 "bootstrapTable":appStartingUrlPrefix+"DWCM/js/bootstrapTable/bootstrap-table",
			 "less":"",
			 "spin":appStartingUrlPrefix+"DWCM/js/spin",
			 "rx":appStartingUrlPrefix+"DWCM/js/rx",

			 //React modules
			 "react":appStartingUrlPrefix+"DWCM/js/react/react",
			 "reactDom":appStartingUrlPrefix+"DWCM/js/react/react-dom",
			 "babel":appStartingUrlPrefix+"DWCM/js/react/babel-browser.min",
			 "jsx":appStartingUrlPrefix+"DWCM/js/require/jsx",
			 "text":appStartingUrlPrefix+"DWCM/js/require/text",
			 //jsx modules
			 "glbSearch":appStartingUrlPrefix+"GetStaticRes_dwcm?Module=DWCM/jsx/globalSearch",
			 
			 
			 
 			 "bootstrapTable_TapRow":
			 appStartingUrlPrefix+"GetStaticRes_dwcm?Module=DWCM/js/bootstrapTable_Plugins/tapRow.js",

			 
			 "ctrlLoginPg":appStartingUrlPrefix+"GetStaticRes_dwcm?Module=DWCM/js/AppControllers/ctrlLoginPg.js",
			 "ctrlMasterPg":appStartingUrlPrefix+"GetStaticRes_dwcm?Module=DWCM/js/AppControllers/ctrlMasterPg.js",
			 "ctrlEmailSending":appStartingUrlPrefix+"GetStaticRes_dwcm?Module=DWCM/js/AppControllers/ctrlEmailSending.js",
			 "ctrlRelations":appStartingUrlPrefix+"GetStaticRes_dwcm?Module=DWCM/js/AppControllers/ctrlRelations.js",
			 "ctrlSendingHistory":appStartingUrlPrefix+"GetStaticRes_dwcm?Module=DWCM/js/AppControllers/ctrlSendingHistory.js",			 
			 "ctrlDfmForms":appStartingUrlPrefix+"GetStaticRes_dwcm?Module=DWCM/js/AppControllers/ctrlDfmForms.js",	 
			 "modelControllers":appStartingUrlPrefix+"GetStaticRes_dwcm?Module=DWCM/js/AppControllers/ctrlAll.js",
			 "modelApp":appStartingUrlPrefix+"GetStaticRes_dwcm?Module=DWCM/js/AppModels/modelApp.js",
			 "modelAutoFilterDlg":appStartingUrlPrefix+"GetStaticRes_dwcm?Module=DWCM/js/AppModels/modelAutoFilterDlg.js",
			 "modelDdTree":appStartingUrlPrefix+"GetStaticRes_dwcm?Module=DWCM/js/AppModels/modelDDTree.js",
			 "modelSettings":appStartingUrlPrefix+"GetStaticRes_dwcm?Module=DWCM/js/AppModels/modelSettings.js",
			 "modelCommonParams":appStartingUrlPrefix+"GetStaticRes_dwcm?Module=DWCM/js/AppModels/modelCommonParams.js",
			 "modelDfmGrouping":appStartingUrlPrefix+"GetStaticRes_dwcm?Module=DWCM/js/AppModels/modelDfmGrouping.js",
			 "modelDfmVolume":appStartingUrlPrefix+"GetStaticRes_dwcm?Module=DWCM/js/AppModels/modelDfmVolume.js",
			 "modelEmailSendDlg":appStartingUrlPrefix+"GetStaticRes_dwcm?Module=DWCM/js/AppModels/modelEmailSendDlg.js",
			 "viewSelectDsnDlg":appStartingUrlPrefix+"GetStaticRes_dwcm?Module=DWCM/js/AppViews/viewSelectDsnDlg.js",
			 "viewMasterPage":appStartingUrlPrefix+"GetStaticRes_dwcm?Module=DWCM/js/AppViews/viewMasterPage.js",
			 "viewDfmGrouping":appStartingUrlPrefix+"GetStaticRes_dwcm?Module=DWCM/js/AppViews/viewDfmGrouping.js",
			 "viewDfmVolume":appStartingUrlPrefix+"GetStaticRes_dwcm?Module=DWCM/js/AppViews/viewDfmVolume.js",
			 "viewAutoFilterDlg":appStartingUrlPrefix+"GetStaticRes_dwcm?Module=DWCM/js/AppViews/viewAutoFilterDlg.js",
			 "viewAppSettings":appStartingUrlPrefix+"GetStaticRes_dwcm?Module=DWCM/js/AppViews/viewAppSettingsDlg.js",
			 "viewEmailSendDlg":appStartingUrlPrefix+"GetStaticRes_dwcm?Module=DWCM/js/AppViews/viewEmailSendDlg.js",
			 "utils":appStartingUrlPrefix+"GetStaticRes_dwcm?Module=DWCM/js/utils.js",
			 "waitIndicator":appStartingUrlPrefix+"GetStaticRes_dwcm?Module=DWCM/js/waitindicator.js",
			 
			 
			 
			 "jqueryForm":appStartingUrlPrefix+"DWCM/js/jqueryForm/jquery.form",
			 "bootstrapSelectPicker":appStartingUrlPrefix+"DWCM/js/bootstrap-select-1.12.1/js/bootstrap-select",
			 "vidgets":appStartingUrlPrefix+"GetStaticRes_dwcm?Module=DWCM/js/vidgets.js",
			 "webMethodWrap":appStartingUrlPrefix+"GetStaticRes_dwcm?Module=DWCM/js/webMethodWrap.js"

		 }
	 }
 );	

require(["jquery","backbone","modelApp"],
		function($,Backbone,ModelApp){
	
			require(["modelControllers"
					 ,"modelSettings","modelCommonParams","modelDdTree","bootstrap","webMethodWrap","vidgets"],
			function(ModelControllers,ModelSettings,ModelCommonParams,ModelDDTree){
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




