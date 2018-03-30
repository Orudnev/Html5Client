define(['backbone'],function(Backbone){
var instance =
    Backbone.Model.extend({
    defaults: 
    {
		volumeId:null,
		volumeName:"",
        msd : '',
		lastSelectedField:{},
		lastSqlInExpr:"",
		fieldsUsedInSqlExpr:[],
		selectedValues:{},
		mainView:null
    },
	buildFilterExpr:function(handler)
	{
		var volName = this.get("volumeName");
		var allSelVal = this.get("selectedValues");
		var fltTmpl = '&lt;column name="{0}" condition="IN ({1})"/&gt;';
		var resultFilter = "";
		var fieldsUsedInSqlExpr = [];
		for (var fldName in allSelVal)
		{
			var fldInfo = this.getFieldInfoByName(fldName);
			var fldFltValues = allSelVal[fldName];
			if (!fldFltValues || fldFltValues.length==0) continue;
			fieldsUsedInSqlExpr.push(fldInfo);
			var inStatement = "";
			for (var i=0;i<fldFltValues.length;i++)
			{
				var item = fldFltValues[i];
				var itemValue = item.fval;
				if (fldInfo.type == "String") itemValue = "&amp;quot;" + itemValue + "&amp;quot;";
				inStatement += ((inStatement=="")?"":";") + itemValue;
			}
			resultFilter += stringFormat(fltTmpl,[fldName,inStatement]);
		}
		this.set("fieldsUsedInSqlExpr",fieldsUsedInSqlExpr);
		wmw_ConvertFilterXmlToQuery(App.getSessionId(),volName,resultFilter,this,handler);
	},
	checkSelection(fldName,value)
	{
		var selValues = this.get("selectedValues");	
		if (!selValues[fldName] || selValues[fldName].length==0) return true;
		var fldSelValues = selValues[fldName];
		for (var i=0;i<fldSelValues.length;i++)
		{
			var item = fldSelValues[i];
			if (item.fval == value) return true;
		}
		return false;
	},
	getFieldInfoByName:function(fldName)
	{
		var fields = this.get("msd").jFields;
		for(var i=0;i<fields.length;i++)
		{
			var field = fields[i];
			if (fldName==field.name) return field;
		}
		return null;
	},		
	isFieldUsedInSqlExpr:function(fldName)	
	{
		var exprFields = this.get("fieldsUsedInSqlExpr");
		for(var i=0;i<exprFields.length;i++)
		{
			if (fldName==exprFields[i].name) return true;
		}
		return false;
	},
	onFirstValuesReceived:function(bresult,dataObj,errStr,modelInstance)
	{
		var selValues = modelInstance.get("selectedValues");
		var currField = modelInstance.get("lastSelectedField");
		var currFldValues = [];
		for (var i=0;i<dataObj.length;i++)
		{
			var value = $(dataObj[i]).text();
			//var select = modelInstance.checkSelection(currField,value);
			//currFldValues.push({selected: select,fval:value});
			currFldValues.push({selected: true,fval:value});
		}
		selValues[currField.name] = currFldValues;
		modelInstance.get("mainView").render();
	},
		
	onMsdReceived:function(bresult,dataObj,modelInstance)
	{
		modelInstance.set("msd",dataObj.oMSD);
		var volName = dataObj.oMSD.volumeName;
		modelInstance.set("volumeName",volName);
		var fldName = modelInstance.get("lastSelectedField").name;
		var filter = "";//onMsdReceived calls only once, during instance creation, so filter="" 
		if (!fldName)
		{
			fldName = dataObj.oMSD.jFields[0].name
			modelInstance.set("lastSelectedField", dataObj.oMSD.jFields[0]);
		}
		wmw_getFirstFieldValuesEx(
			App.getSessionId(),volName,fldName,filter,modelInstance,modelInstance.onFirstValuesReceived
		);
	},
	onOkButtonPressed:function()
	{
		this.buildFilterExpr(
					function(bresult,dataObj,errStr,modelInstance)
					{
						modelInstance.set("lastSqlInExpr",dataObj);
						App.Controllers.masterPage.doAutofilter(dataObj);
					});
	},
	start: function()
	{
		//this method calls when instance of modelAotoFilterDlg is already exists (instead of "new") 	
		var volName = this.get("volumeName");
		var fldName = this.get("lastSelectedField").name;
		var filter = this.get("lastSqlInExpr");
		this.buildFilterExpr(
					function(bresult,dataObj,errStr,modelInstance)
					{
						filter = dataObj;
						modelInstance.set("lastSqlInExpr",filter);
						wmw_getFirstFieldValuesEx(
							App.getSessionId(),volName,fldName,filter,modelInstance,
								modelInstance.onFirstValuesReceived);		
					});
	},
    initialize: function(volId)
    {
		this.set("volumeId",volId);
		App.Views.AutoFilter.model = this;
		this.set("mainView",App.Views.AutoFilter);
		wmw_getMSD(App.getSessionId(),volId,"","",this,this.onMsdReceived);
    }
});//    C o m m o n P a r a m s              END

return instance;	
});
	