var appStartingUrlPrefix = ((location.href.indexOf("/dfm_web/")!=-1)?"/dfm_web/":"/");
require.config(
	 {
		 waitSeconds: 120,
		 paths:{
			 "jquery":appStartingUrlPrefix+"js/jquery/jquery-1.11.2",
			 "jqueryMobile":appStartingUrlPrefix+"js/jquerymobile/jquery.mobile",
			 "bootstrap":appStartingUrlPrefix+"js/bootstrap/3.3.7/js/bootstrap",
			 "backbone":appStartingUrlPrefix+"js/backbone/backbone",
			 "underscore":appStartingUrlPrefix+"js/backbone/underscore",
			 "bootstrapTreeview":appStartingUrlPrefix+"js/bootstrap-treeview/bootstrap-treeview.min",
			 "bootstrapTable":appStartingUrlPrefix+"js/bootstrapTable/bootstrap-table",	
			 "less":"",
			 "spin":appStartingUrlPrefix+"DWCM/js/spin",
			 "rx":appStartingUrlPrefix+"js/rx",
			 "react":appStartingUrlPrefix+"js/react/react",
			 "reactDom":appStartingUrlPrefix+"js/react/react-dom",
			 "reactDataGrid":appStartingUrlPrefix+"js/reactDataGrid/react-data-grid",
			 "babel":appStartingUrlPrefix+"js/react/babel-browser.min",
			 "jsx":appStartingUrlPrefix+"js/require/jsx",
			 "text":appStartingUrlPrefix+"js/require/text",
			 "glbSearch":appStartingUrlPrefix+"jsx/globalSearch",
			 
			 "modelApp":appStartingUrlPrefix+"js/AppModels/modelApp",
			 "modelAutoFilterDlg":appStartingUrlPrefix+"js/AppModels/modelAutoFilterDlg",
			 "modelDdTree":appStartingUrlPrefix+"js/AppModels/modelDDTree",
			 "modelSettings":appStartingUrlPrefix+"js/AppModels/modelSettings",
			 "modelCommonParams":appStartingUrlPrefix+"js/AppModels/modelCommonParams",
			 "modelDfmGrouping":appStartingUrlPrefix+"js/AppModels/modelDfmGrouping",
			 "modelDfmVolume":appStartingUrlPrefix+"js/AppModels/modelDfmVolume",
			 "modelEmailSendDlg":appStartingUrlPrefix+"js/AppModels/modelEmailSendDlg",
			 "viewSelectDsnDlg":appStartingUrlPrefix+"js/AppViews/viewSelectDsnDlg",
			 "viewMasterPage":appStartingUrlPrefix+"js/AppViews/viewMasterPage",
			 "viewDfmGrouping":appStartingUrlPrefix+"js/AppViews/viewDfmGrouping",
			 "viewDfmVolume":appStartingUrlPrefix+"js/AppViews/viewDfmVolume",
			 "viewAutoFilterDlg":appStartingUrlPrefix+"js/AppViews/viewAutoFilterDlg",
			 "viewAppSettings":appStartingUrlPrefix+"js/AppViews/viewAppSettingsDlg",
			 "viewEmailSendDlg":appStartingUrlPrefix+"js/AppViews/viewEmailSendDlg",
			 "utils":appStartingUrlPrefix+"js/utils",
			 "waitIndicator":appStartingUrlPrefix+"js/waitindicator",
			 
			 
			 
			 "jqueryForm":appStartingUrlPrefix+"js/jqueryForm/jquery.form",
			 "bootstrapSelectPicker":appStartingUrlPrefix+"js/bootstrap-select-1.12.1/js/bootstrap-select",
			 "vidgets":appStartingUrlPrefix+"js/vidgets",
			 "webMethodWrap":appStartingUrlPrefix+"js/webMethodWrap"

		 },
		 
		 shim : {
    		"react": {
      		"exports": "React"
    		}
  		 },
		 
		 config: {
			  babel: {
			  sourceMaps: "inline", // One of [false, 'inline', 'both']. See https://babeljs.io/docs/usage/options/
			  fileExtension: ".jsx" // Can be set to anything, like .es6 or .js. Defaults to .jsx
			  }
		 }
 });	

var Rx = null;

require(["jquery","backbone","underscore","modelApp","bootstrapSelectPicker","rx"],
	function($,Backbone,_,ModelApp,bsp,rx){
		Rx = rx;
		require(["bootstrap", "modelSettings","modelCommonParams","modelDdTree","utils","webMethodWrap","vidgets","bootstrapTreeview"],
		function(ModelSettings,ModelCommonParams,ModelDDTree,utils){
				$.getJSON("locale/dwcm-locale-en.json", function( data ){
					App.localeData = data;
					runTest();
				});
		});
	}
);





/// *********** entry point ************** ////
var runTest = function()
{
	var dlgTitle = App.localeData.dgrid_menuCmd_SaveSelected;
	
	require(["react", "reactDom"],
	function(react,reactDOM)
	{
		  React = react;
		  ReactDOM = reactDOM;
		  doReactTest();
	});
}


function doReactTest(){
		  require(['jsx!glbSearch'], function(rDataGrid,instance){
			  var containerSelector = "#volumeFormStdContainer";
			  //ReactDOM.render(<instance />, $(containerSelector)[0]);
		  });
}





