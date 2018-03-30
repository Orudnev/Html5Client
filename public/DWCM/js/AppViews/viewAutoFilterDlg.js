define(["jquery","backbone","utils"],function($,Backbone,Utils){
var instance =
		Backbone.View.extend({
    tagName: 'div',
    template: {},
	close:function()
	{
		App.winResize.removeHandler("AutofilterDialog");
		$("#AutoFilterDialog .toolbarBtn").off("click");
		$("#AutoFilterDialog select.selectpicker").off("changed.bs.select");
		
		$("#AutoFilterDialog ").remove();
		$("#mpall").removeClass("nullHeight");
		$("#mpMainPane").removeClass("nullHeight"); 
	},
	commitGridChanges:function(fldInfo)
	{
		if (fldInfo==null)
			fldInfo = this.model.get("lastSelectedField"); 
	    var allSelectedVal = this.model.get("selectedValues");
		var currFldSelVal = allSelectedVal[fldInfo.name];
		var gridAllValues = $(".valueSelector .valueSelectorTable").bootstrapTable('getData');
		var gridSelValues = $(".valueSelector .valueSelectorTable").bootstrapTable('getSelections');
		
		var SALL = (gridAllValues.length==gridSelValues.length);
		var SSOME = (gridSelValues.length>0);
		var SNONE = (gridSelValues.length==0);
		 
		if (SALL)
		{
			return;
		}
		if (SNONE)
		{
			//disable combobox and OK button
			return;
		}
		if (SSOME)
		{
			currFldSelVal = gridSelValues;
			allSelectedVal[fldInfo.name] = currFldSelVal;
		}
		this.renderFldListCombo();
		return;
	},
 	docTypeIconFunction: function(value, row, rowIndex)
	{
		var iconSrc = AppHelper_GetDocTypeIcon(row.sys_docType);
		var shtml = stringFormat('<img height="20px;" src="{0}">',[iconSrc]);
		return shtml;
	},
	getDataGridHeight: function()
	{
		var delta = ((AppHelper_isPortrait())?15:50);
		rv = $(".valueSelector").height() - delta;
		return 	rv;
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
	onFieldSelected:function(ev,rowIndex)
	{
		var viewInstance = ev.data;
		var modelInstance = ev.data.model;
		var oldField = modelInstance.get("lastSelectedField");
		var newField = modelInstance.get("msd").jFields[rowIndex];
		modelInstance.set("lastSelectedField",newField);
		viewInstance.commitGridChanges(oldField);
		modelInstance.start();
	},
	onWindowResize:function(e)
    {
		var newHeight = App.Views.AutoFilter.getDataGridHeight();
		$("#AutoFilterDialog .valueSelector .valueSelectorTable").bootstrapTable("resetView",{height:newHeight});
    },
	setEnabled:function(state)
	{
		$("#AutoFilterDialog .btn-group button").prop('disabled', !state);	
		$("#AutoFilterDialog button[command='ok']").prop('disabled', !state);
	},
	render: function()
	{
		$("#mpall").addClass("nullHeight"); //hide panes
		$("#mpMainPane").addClass("nullHeight"); //hide panes
		var containerHtml = App.Templates.dialogs[Appn.Dialogs.AutoFilterDialog];
		containerHtml = compileTemplate(containerHtml,null);
		$containerHtml = $(containerHtml);
		var fields = this.model.get("msd").jFields;
		$("body").append($containerHtml);		
		$("#AutoFilterDialog .toolbarBtn").off("click").on("click",this,this.onButtonClick)
		
		
		this.renderFldListCombo();
		var fldName = this.model.get("lastSelectedField").name;
		var data = this.model.get("selectedValues")[fldName];
		$("#AutoFilterDialog .valueSelector .valueSelectorTable").bootstrapTable(
			{data:data,height:this.getDataGridHeight()});
		$("#AutoFilterDialog .valueSelector .valueSelectorTable").off(
			"check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table").on(
			"check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table",this,this.checkChanged);
	},
	checkChanged:function(ev)		
	{
		viewInstance = ev.data;
		var gridSelValues = $(".valueSelector .valueSelectorTable").bootstrapTable('getSelections');
		var enabled = (gridSelValues.length>0);
		viewInstance.setEnabled(enabled);
	},
	renderFldListCombo:function()
	{
		var $fldCombo = $("#AutoFilterDialog .fieldSelector .selectpicker");
		$fldCombo.empty();
		var fields = this.model.get("msd").jFields;
		var firstRender = $("#AutoFilterDialog .fieldSelector .selectpicker").prev().length == 0;
		var currField = this.model.get("lastSelectedField");
		var selFieldValues = this.model.get("selectedValues");
		for(var i=0;i<fields.length;i++)
		{
			var fld = fields[i];
			var $option = $("<option fldName=''></option>");
			$option.attr("fldName",fld.name);
			$option.text(fld.caption);
			if (this.model.isFieldUsedInSqlExpr(fld.name) && selFieldValues && 
						selFieldValues[fld.name] &&
			   			selFieldValues[fld.name].length>0)
				$option.attr("data-icon","glyphicon-filter");
			$fldCombo.append($option);
		}
		if (firstRender)
			$("select.selectpicker").selectpicker();
		else
			$("select.selectpicker").selectpicker("refresh");
		$("#AutoFilterDialog select.selectpicker").selectpicker('val', currField.caption);
		$("#AutoFilterDialog select.selectpicker").off("changed.bs.select").on("changed.bs.select",
																	   this,this.onFieldSelected);
	},
	initialize: function()
	{
		App.winResize.addHandler("AutofilterDialog",this,this.onWindowResize);
		//$(window).resize(this,this.onWindowResize); 
	}
 });

	
return instance;	
});
