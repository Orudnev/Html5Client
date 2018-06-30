define(["jquery","backbone","utils"],function($,Backbone,Utils){
var instance =
		Backbone.View.extend({
    tagName: 'div',
    template: {},
	close:function()
	{
		App.winResize.removeHandler("AppSettingsDialog");
		$("#AutoFilterDialog .toolbarBtn").off("click");
		$("#AutoFilterDialog select.selectpicker").off("changed.bs.select");
		
		$("#AutoFilterDialog ").remove();
		$("#mpall").removeClass("nullHeight");
		$("#mpMainPane").removeClass("nullHeight"); 
	},
	onButtonClick:function(ev)
	{
		var cmd = $(this).attr("command");
		var viewInstance =  ev.data;
		if (cmd=="ok")
		{
			viewInstance.commitGridChanges(null);
			viewInstance.model.onOkButtonPressed();
			viewInstance.close();
		}
		if (cmd=="cancel")
		{
			viewInstance.close();
		}
	},
	onWindowResize:function(e)
    {
		var dlgContainerHeight = 
			$(window).height() - $(".WholeMainPaneDialog #AppSettingsDlgContainer").position().top;
		$(".WholeMainPaneDialog #AppSettingsDlgContainer").css("height",dlgContainerHeight+"px");
    },
	render: function()
	{
		var formHtml = App.Templates.dialogs[Appn.Dialogs.AppSettingsDlg];
		formHtml = compileTemplate(formHtml,null);
		var $formHtml = $(formHtml)
		var model = {title: App.localeData.settings,strHtmlContent:$formHtml[0].outerHTML};
		
		AppHelper_ShowWholeMainPaneDialog(model,
			  function(token)
			  {
				
				//remove main menu button (with its container) and get control of the form via ajaxForm plugin
				$(".WholeMainPaneDialog .menuBtnDiv").remove();
				// Add Ok button 	
				var btnOkHtml = 
					'<button type="button" style="margin-top:3px;margin-bottom:3px; margin-right:3px;"'+
					'command="ok"'+
					'class="toolbarBtn btn btn-success menuBtn pull-right glyphicon glyphicon-ok">'+
					'</button>';
			
				$(".WholeMainPaneDialog .toolbarDiv").append(btnOkHtml);
				$("select.selectpicker").selectpicker();
			
				// define values for input controls
				AppHelper_WholeMainPaneDialog.setValues_ModelToGui(App.Models.settings);
				
				//Disable "UserName" and "Password" fields if "Authentication"="None"
				$(".WholeMainPaneDialog .selectpicker[dataField='smtpSettings.authentication']")
					.on("changed.bs.select",function(e,index)
					{
						var selValue=$(this).find("option[dataIndex='"+index+"']").val();
					    if (selValue=="NONE")
						{
							//disable
							$(".WholeMainPaneDialog input[dataField='smtpSettings.userName']").attr("disabled","");
							$(".WholeMainPaneDialog input[dataField='smtpSettings.password']").attr("disabled","");
						}
						else
						{
							$(".WholeMainPaneDialog input[dataField='smtpSettings.userName']").removeAttr("disabled");
							$(".WholeMainPaneDialog input[dataField='smtpSettings.password']").removeAttr("disabled");
						}
					});

			
				// adjust height after expanding accordion section
				$(".WholeMainPaneDialog .panel-collapse").on("shown.bs.collapse",
						 function(viewInstance)
						 {
							App.Views.appSettings.onWindowResize();
						 }
						);
				
				$(".WholeMainPaneDialog .toolbarBtn[command='ok']").on('click', token,
					function(event)
					{
						var viewInstance = event.data.that;
						if (!viewInstance.commitGuiChanges())
						{
							return;
						}
						App.Models.settings.saveSmtpSettings();
						$("#AppSettingsDlgContainer .btnSubmit").off('click');
						AppHelper_RemoveWholeMainPaneDialog();
					}
			    );
				$(".WholeMainPaneDialog .btnSendTestingMessage").on('click', token,
					function(event)
					{
						var viewInstance = event.data.that;
						if(!$(this).find("i").hasClass("rotateIcon"))
						{
							App.Models.settings.set("validateSmtpSettings",true);
							var commitResult = viewInstance.commitGuiChanges();
							App.Models.settings.set("validateSmtpSettings",false);
							if (!commitResult) return;
							$(this).find("i").addClass("rotateIcon");
							App.Models.settings.onSendTestingMessageBtnClicked();
						}
					}
				);
																	
					
			
			  },null,{that:this});
	},
	renderSendTestMessageResult(bresult,message)
	{
		var btn = $(".WholeMainPaneDialog .btnSendTestingMessage");
		btn.find("i").removeClass("rotateIcon");
		var errItem = {message:message};
		AppHelper_WholeMainPaneDialog.showErrors(btn,[errItem]);
		if (bresult)
		{
			var top = $(".WholeMainPaneDialog .inlineError").css("color","green");
		}

		var top = $($(".WholeMainPaneDialog .inlineError")[0]).position().top;
		$("#AppSettingsDlgContainer").scrollTop(top+100);
	},
	commitGuiChanges:function()		
	{
		if (!AppHelper_WholeMainPaneDialog.setValues_GuiToModel(App.Models.settings))
		{
			//show accordion section containing the first error
			$($(".WholeMainPaneDialog .inlineError")[0]).parents(".panel-collapse").collapse("show");
			var top = $($(".WholeMainPaneDialog .inlineError")[0]).position().top;
			$("#AppSettingsDlgContainer").scrollTop(top);
			return false;
		}
		return true;
	},
	initialize: function()
	{
		App.winResize.addHandler("AppSettingsDialog",this,this.onWindowResize);
	}
 });

	
return instance;	
});
