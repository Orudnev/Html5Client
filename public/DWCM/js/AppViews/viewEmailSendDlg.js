define(["jquery","backbone","utils"],function($,Backbone,Utils){
var instance =
   		Backbone.View.extend({
     tagName: 'div',
     template: {},
	getSelectedFields:function()
	{
		var selectedFields = [];
		$(".WholeMainPaneDialog #selectVolFields").parent().find("ul li.selected").each(
			function(){ 
				var strIndex = $(this).attr("data-original-index");
				var selField = $($(".WholeMainPaneDialog #selectVolFields option")[strIndex]).attr("value")
				selectedFields.push(selField);
			});
		return selectedFields;
	},
	getSelectedAttachments:function()
	{
		var selectedAtt = [];
		$(".WholeMainPaneDialog #selectAttachments").parent().find("ul li.selected").each(
			function(){
				var index = $(this).attr("data-original-index");
				var value = $($(".WholeMainPaneDialog #selectAttachments option")[index]).text();
				selectedAtt.push(value);
			});		
		return selectedAtt;
	},
	getSelectedFieldByIndex:function(index)
	{
		var selField = $($(".WholeMainPaneDialog #selectVolFields option")[index]).attr("value");
		return selField;
	},
	render: function()
	{
		var formHtml = App.Templates.emailSendDialog.html;
		formHtml = compileTemplate(formHtml,null);
		var model = {title: App.localeData.dgrid_menuCmd_EmailSend,strHtmlContent:formHtml};
		
		AppHelper_ShowWholeMainPaneDialog(model,
			  function(token)
			  {
				if (App.Models.emailSendDlg.isMultipleDocs())
				{
					$(".WholeMainPaneDialog	#selObjects_singleDoc").remove();
					//prevent selection "Attachments" checkbox without selection "Main document"
					$(".WholeMainPaneDialog input.bindable[type='checkbox']")
						.off("click").on("click",
					function(e)
					{
						var dataField = $(this).attr("dataField");
						var isChecked = $(this).prop("checked");
						if (dataField=="mainDocSelected" && !isChecked )
						{
							$(".WholeMainPaneDialog input[dataField='includeAllAttachments']")
								.prop("checked",false);	
						}
						if (dataField=="includeAllAttachments" && isChecked)
						{
							$(".WholeMainPaneDialog input[dataField='mainDocSelected']")
								.prop("checked",true);	
						}
					});
				}
				else
				{
					//build "Select attachments" combobox 
					$(".WholeMainPaneDialog	#selObjects_multipleDocs").remove();
					//insert attachment list
					var attList = App.Models.emailSendDlg.get("currRowAttachments").rows;
					for (var i=0;i<attList.length;i++)
					{
						var item = attList[i];
						var $attListItemTmpl = $("<option></option>");
						$attListItemTmpl.text(item.name);
						$(".WholeMainPaneDialog #selectAttachments").append($attListItemTmpl);
					}
				}
				
				// build "Select fields" combobox (for name generation rule)
				var volFields = App.Models.emailSendDlg.get("volFields");
				for (var i=0;i<volFields.length;i++)
				{
					var item = volFields[i];
					var itemLabel = item.name;
					if (item.caption!=item.name)
						itemLabel = item.caption+" ("+item.name+")";
					var $itemTmpl = $("<option></option>");
					$itemTmpl.attr("value",item.name).text(itemLabel);
					$(".WholeMainPaneDialog #selectVolFields").append($itemTmpl);
				}
			
				$(".WholeMainPaneDialog select.selectpicker").selectpicker();	

				// Name generation rule combobox -- Begin
				$(".WholeMainPaneDialog #selectVolFields").off("show.bs.select").on( "show.bs.select",
					function(){
					    var lastNameGenRuleValue = $(".WholeMainPaneDialog .bindable[dataField='nameGenRule']").prop("value");
						App.Models.emailSendDlg.set("nameGenRule",lastNameGenRuleValue);
				});
			
				$(".WholeMainPaneDialog #selectVolFields").off("changed.bs.select").on("changed.bs.select",
					function(e,index,newValue,oldValue){
						App.Models.emailSendDlg.onCmbFieldsChanged(e,index,newValue,oldValue);
						AppHelper_WholeMainPaneDialog.updateGuiField("nameGenRule",
												  App.Models.emailSendDlg.get("nameGenRulePreview"));
				});
			
				$(".WholeMainPaneDialog #selectVolFields").off("hidden.bs.select").on( "hidden.bs.select",
					function(){
						App.Models.emailSendDlg.onCmbFieldsClosed();
						$(".WholeMainPaneDialog #selectVolFields").selectpicker("deselectAll");
						AppHelper_WholeMainPaneDialog.updateGuiField("nameGenRule",
												  App.Models.emailSendDlg.get("nameGenRule"));
				});
				// Name generation rule combobox -- End
					
					
				//remove main menu button (with its container) and get control of the form via ajaxForm plugin
				$(".WholeMainPaneDialog .menuBtnDiv").remove();
				
				// define values for input controls
				AppHelper_WholeMainPaneDialog.setValues_ModelToGui(App.Models.emailSendDlg);
				
				// Next page, prev. page
				$(".WholeMainPaneDialog #wizardPageSwitcher button").off("click").on("click",token,
					 function(event)
					 {
						var viewInstance = event.data.that;
						var currPageId = $(".WholeMainPaneDialog .panel.active").attr("id");
						var strCommand = $(this).attr("command");
					    var newPageId = "";
						var doCheck = true;
						$(".WholeMainPaneDialog .toolbarBtn[command='cancel']").removeClass(
							"btn-success glyphicon-ok").addClass("btn-danger glyphicon-remove");
						
						
						if (currPageId=="page1" && strCommand == "right")
							newPageId = "page2";
						if (currPageId=="page2" && strCommand == "right")
						{
							$(".WholeMainPaneDialog .toolbarBtn[command='cancel']").removeClass(
								"btn-danger glyphicon-remove").addClass("btn-success glyphicon-ok");
							$(".WholeMainPaneDialog .page3Result").addClass("nullHeightEx");
							newPageId = "page3";
						}
						if (currPageId=="page2" && strCommand == "left")
						{
							newPageId = "page1";
							doCheck = false;
						}
						if (currPageId=="page3" )
						{
							newPageId = "page2";
							doCheck = false;
						}
						var bresult = viewInstance.setActivePage(currPageId,newPageId,doCheck);
						if (bresult && newPageId == "page3")
						{
							App.Models.emailSendDlg.saveSettings();
							App.Models.emailSendDlg.prepareEmlMsgInfo();
						}
					 });
			    var thisView = token.that;
				thisView.onWindowResize();													
					
			
			  },null,{that:this});
	},
	renderResult(errMessage)
	{
		if(errMessage)
		{
			$(".WholeMainPaneDialog #page3Error").removeClass("nullHeightEx").text(errMessage);
		}
		else
		{
			$(".WholeMainPaneDialog #page3OkResult").removeClass("nullHeightEx");
		}
	},
	setActivePage:function(oldPageId,newPageId,doCheck)
	{
		var token = {validationMethod:"validate"+oldPageId}; 
		if (doCheck) 
		{
			if (!this.commitGuiChanges(token)) return false;
		}
		var oldPageSelector = ".WholeMainPaneDialog #"+oldPageId;
		var newPageSelector = ".WholeMainPaneDialog #"+newPageId;
		$(".WholeMainPaneDialog .panel").removeClass("active");
		$(oldPageSelector).addClass("nullHeightEx");
		$(newPageSelector).removeClass("nullHeightEx");
		$(newPageSelector).addClass("active");
		return true;
	},
	onWindowResize:function(e)
	{
		var dlgToolbarHeight = $(".WholeMainPaneDialog .row").outerHeight();
		var wzrdTitleHeight = $(".WholeMainPaneDialog .panel-heading").outerHeight();
		var dlgBodyHeight = $(window).height() - dlgToolbarHeight - wzrdTitleHeight-5;
		$(".WholeMainPaneDialog .panel-body").css("height",dlgBodyHeight+"px");	},	
	commitGuiChanges:function(token)		
	{
		if (!AppHelper_WholeMainPaneDialog.setValues_GuiToModel(App.Models.emailSendDlg,token))
		{
			AppHelper_ScrollToVisibleArea("div.panel.active .panel-body",".WholeMainPaneDialog .inlineError");
			return false;
		}
		return true;
	},			
	initialize: function()
	{
		App.winResize.addHandler("EmailSendDialog",this,this.onWindowResize); 
	}
});    

	
return instance;	
});





 
                    