define([],function(){
var instance =
{
		showLoginDlg:function()
			 {
				 var pgHtml = compileTemplate(App.Templates.loginPage.html,null);
				 $(".pageContainer").empty().append(pgHtml);
				 $(".panel-body .selectpicker").selectpicker();
				 $("#cmbSelectLanguage").off("changed.bs.select").on("changed.bs.select",
				 	App.Controllers.loginPage.onLanguageSelected);
				 
				 if (App.Models.settings.get(Appn.Model.Settings.rememberCredentials)) 
				 {
					var token = {rootNodeSelector:"#LoginPage"}; 	
					AppHelper_WholeMainPaneDialog.setValues_ModelToGui(App.Models.settings,token);
				 }
				 else
				 {
					$("#cmbSelectLanguage").selectpicker("val",App.Models.settings.get("language"));
				 }

				 $("#mainMenuItems a[dwcmCommand]").off('click').on('click',
							  App.Controllers.loginPage.onMenuCommand);
				 $("#btnConnectToServer").off("click").on("click",App.Controllers.loginPage,function(event)
					{
						//store GUI values to model attributes (without validation)
						AppHelper_WholeMainPaneDialog.setValues_GuiToModel(
							App.Models.settings.attributes,
							{rootNodeSelector:"#LoginPage"}
						);

						var controllersInstance = event.data;
						var token = {rootNodeSelector:"#LoginPage",validationMethod:"validateCredentials"}; ///

						//store GUI values to model propeties with validation
						var commitResult = 
							AppHelper_WholeMainPaneDialog.setValues_GuiToModel(App.Models.settings,token);
						if (commitResult)
						{
							controllersInstance.showDsnList();
						}
					}
					);
			 },
			 onLanguageSelected:function(event,index,newValue,oldValue){
				var localeCode="en";
				if (index==1) localeCode = "it";	
				localStorage.setItem("currLanguageCode",localeCode)
				location.reload();
			 },
			 onMenuCommand:function(evt)
			 {
				 var cmdId=$(evt.target).attr("dwcmCommand");
				 if (cmdId==Appn.MenuCommands.About)
				 {
					var formHtml = App.Templates.aboutDialog.html;
					formHtml = compileTemplate(formHtml,null);
					var $formHtml = $(formHtml)
					var model = {title: App.localeData.about,strHtmlContent:$formHtml[0].outerHTML};
					AppHelper_ShowWholeMainPaneDialog(model,
						function(token)
						{
							//remove main menu button (with its container) 
							$(".WholeMainPaneDialog .menuBtnDiv").remove();
						},
						null,{that:App.Controllers.loginPage});				 
				 }
			 },
			 closeLoginDlg:function()
			 {
			   $('#'+Appn.Dialogs.LoginDialog).modal('hide');  
			 },
			 showDsnList : function()
			 {
				App.Models.commonParams.UpdateDsnList(
						function()
						{
							//check, if only DSN is exists, select it automatically
							//and don't show DSN list
							if (App.Models.commonParams.get(Appn.Model.DsnList).length==1)
							{
								var dsn = App.Models.commonParams.get(Appn.Model.DsnList)[0];
								App.Models.commonParams.set(Appn.Model.selectedDsn,dsn);
								App.Controllers.loginPage.onDsnListDlgOk();
								return;
							}
							
							require(["viewSelectDsnDlg"],function(SelectDsnDlg){
								if (App.Views.selectDsnDlg == null)
								{
									App.Views.selectDsnDlg = new SelectDsnDlg();
									App.Views.selectDsnDlg.model=App.Models.commonParams;
								}
								if (App.Views.selectDsnDlg)
									App.Views.selectDsnDlg.render();
								else
									App.navigate('',{trigger: true, replace: true}); 
							});
						});
			 },
			 onDsnListDlgOk: function()
			 {
				var newDsn = App.Models.commonParams.get(Appn.Model.selectedDsn);
				App.Models.settings.storePersist(Appn.Model.Settings.dsn,newDsn);
				App.Controllers.loginPage.doLogin(); 
			 },
			doLogin: function()
			{
				App.Controllers.loginPage.closeLoginDlg()
				showWaitIndicator(true);
				wmw_Login(App.Models.settings.get(Appn.Model.Settings.userName)
						  ,App.Models.settings.get(Appn.Model.Settings.userPassword)
						  ,App.Models.settings.get(Appn.Model.Settings.dsn)
						  ,App.Controllers.loginPage.doLoginHandler);
			},
			doLoginHandler: function(bresult,data)
			{
				if (bresult)
				{
					var sessionId = $(data).find('sessionId')[0].textContent;
					App.Models.settings.set(Appn.Model.Settings.lastSessionId, sessionId,{validate:false});
					localStorage.setItem(Appn.Model.Settings.lastSessionId, sessionId);
					console.log("doLoginHandler sessionId=",sessionId,App.getSessionId())
					require(["viewMasterPage"],function(MasterPage)
					{
						App.Views.masterPage = new MasterPage();
						App.Views.masterPage.model = App.Models.commonParams;
						App.navigate.MasterPage();
					});
				}
				else
				{
					showError(data);
					App.navigate.LoginPage("");
				}
			}	
	
}

return instance;	
});