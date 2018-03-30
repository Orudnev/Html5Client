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
			 "babel":appStartingUrlPrefix+"js/react/babel-browser.min",
			 "jsx":appStartingUrlPrefix+"js/require/jsx",
			 "text":appStartingUrlPrefix+"js/require/text",
			 "app":appStartingUrlPrefix+"js/react/app",
			 
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

var showDialog = function(formHtml,title)
{
	formHtml = compileTemplate(formHtml,null);
	var $formHtml = $(formHtml)
	var model = {title: title,strHtmlContent:$formHtml[0].outerHTML};
	AppHelper_ShowWholeMainPaneDialog(model,
		function(token)
		{
			//remove main menu button (with its container) 
			$(".WholeMainPaneDialog .menuBtnDiv").remove();
		},
		null,{that:App.Controllers.loginPage});		
}

var loadDialogsTmpl = function(handler)
{
$.ajax({
    url: "DialogsTmpl.xml",
    type: "GET",
    contentType: "text/xml",
    dataToken:handler,     
    success: function(data)
    {
		$(data.documentElement).find("Dialog").each(
			function()
			{
				var dlgId = $(this).attr("id");
				var dlgHtml = $(this).text();
				App.Templates.dialogs[dlgId] = dlgHtml;
			}
												   );
		var handler = this.dataToken;
		if(handler) handler();
    },
    processData: false
    });    
}

var Rx = null;

require(["jquery","backbone","underscore","modelApp","bootstrapSelectPicker","rx"],
		function($,Backbone,_,ModelApp,bsp,rx){
			Rx = rx;
			require(["bootstrap", "modelSettings","modelCommonParams","modelDdTree","utils","webMethodWrap","vidgets","bootstrapTreeview"],
			function(ModelSettings,ModelCommonParams,ModelDDTree,utils){
				
			App.CompileTest_html = function(dlgTitle,selector)
			{
				var srcHtml = $(selector)[0].innerHTML;
				//srcHtml = srcHtml.replace("&lt;","<").replace("&gt;",">");
				srcHtml = srcHtml.replace(new RegExp("&lt;", 'g'), "<")
						         .replace(new RegExp("&gt;", 'g'), ">");
				//showDialog(srcHtml,dlgTitle);
				
				
				srcHtml =
					'<iframe src="<%= this.model.url %>" '+
						'style="width: 100%;height: 95%;">'+
					'</iframe>';
				var contentHtml = compileTemplate(srcHtml,{url:'http://megaline.kg'});
				$("#dialogContLvl1").dwcmDialog({
					title:'',
					buttons:{btnOk:false,btnCancel:true,btnMenu:false},
					contentHtml: contentHtml,
					onRendered: testReact
				});
			}
				
			$.getJSON( "locale/dwcm-locale-en.json", function( data ) {
				App.localeData= data;
				loadDialogsTmpl(function()
				{				
					testDialog();
				}
							   );

			})
			
				
			});
	
});

/// *********** entry point ************** ////
var testDialog = function()
{

	
	var dlgTitle = App.localeData.dgrid_menuCmd_SaveSelected;
	var containerSelector = "#volumeFormStdContainer";
	App.CompileTest_html(dlgTitle,containerSelector);
	
	//rxtest();

	//$('#bbb').popover();
}




function testReact()
{
	$("#mainMenuDiv.dropdown").on("shown.bs.dropdown",function(e){
		var $menuCont = $(e.target).parent();
		var $menuDropDown = $(e.target).find("ul");
		var dropDownHeight = 
			$menuCont.height() - $menuDropDown.position().top -
				($menuDropDown.outerHeight(true) - $menuDropDown.height());
		$menuDropDown.height(dropDownHeight);
	});
	$("#mainMenuDiv.dropdown ul").on("scroll",function(e){
		console.log("scroll");
	});
	return;
	//shown.bs.dropdown
	//load react libraties
	require(["react", "reactDom"],
	function(react,reactDOM)
	{
		  React = react;
		  ReactDOM = reactDOM;
		  doReactTest();
	});
}

function doReactTest(){
		  require(['jsx!app'], function(tmpl){
			  //var app = new App();
			  var s="stop";	
			  ReactDOM.render(tmpl, $("button[command='menu']")[0]);
		  });
}


function drawNavigator(){
	$("#NavigatorContainer").dwcmNavigator({
		minIndex:1,
		maxIndex:5,
		currentIndex:1
	});
}


function rh1(x){
	console.log(x)
}

var o = null;
var counter;

function fireEvent(){
	var myEvent = new Event("myEvent");
	document.dispatchEvent(myEvent);
}

function rxtest(){
	counter = 0;
	
	$("#btn1").on("click",function(){
		fireEvent();
	});
	
	tttt();
	return;
	st1 = Rx.Observable.fromEvent($("#btn1"),"click").take(5);
	st2 = Rx.Observable.fromEvent($("#btn2"),"click").take(5);
	var st3 = Rx.Observable.fromEvent(document,"myEvent").take(3);
	
	
	
	//var getJSONAsObservable = Rx.Observable.bindCallback(jQuery.getJSON);
	//var result = getJSONAsObservable('locale/dwcm-locale-en.json');
	
	
	st3.subscribe(x => console.log(x), e => console.log("e"),()=>console.log("complete"));
	fireEvent();
	fireEvent();
	fireEvent();
	//sb.unsubscribe();
	//st1.subscribe(onNext,error=>console.log("err"),()=>console.log("complete"));
	//Rx.Observable.concat(st1,st2).subscribe(rh1);
	//var src = st1.toPromise();
	//src.then((data)=>console.log("data")).catch((err)=>console.log("err"));
}

function onNext(data){
	counter++;
	console.log("data")
}

function tttt(){
	//console.log(sum([1,2,3,4,5]));
	myexception();
}
function sum(){
   var  sum=0;
   for(var i=0;i<arguments.length;i++){
       sum+=arguments[i];
   }
   return sum;
}
function myexception(){
	try{
     //throw ("my exception");
	 a="blablabla";
	 console.log(a.prototype instanceof String) 	
}
catch(err){
    console.log(err);
}
}
