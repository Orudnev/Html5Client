define([],function(){
var instance =	{
	volModel:null,
	currDoc:null,
	selectedRelation: "",
	selectedRelationFilter:"",
	relations:[],
	templates: {
		listContainer: '<div class="list-group"></div>',
		listItem: '<a href="#" class="list-group-item btListActiveColor"></a>'
	},
	selectRelation:function(){
		this.volModel = Appc.getActiveVolumeModelObject();
		this.currDoc= this.volModel.get("currentRow");
		this.relations = this.volModel.get("volConfig").relations;
		var $listCont = $(this.templates.listContainer);
		if (this.relations.length == 1){
			this.selectedIndex = 0;
			this.onRelationSelected();
			return;
		}
		for (var i=0;i<this.relations.length;i++){
			var itemName = this.relations[i];
			var $listItem = $(this.templates.listItem);
			$listItem.attr("index",i).text(itemName);
			$listCont.append($listItem);
		}
		var contentHtml = $listCont[0].outerHTML; 
		$("#dialogContLvl1").dwcmDialog({
			title: App.localeData.selectRelation,
			buttons:{btnOk:true,btnCancel:true,btnMenu:false},
			buttonsDisabled:{btnOk:true,btnCancel:false,btnMenu:false},
			contentHtml: contentHtml,
			context: this,	
			onContentElementClicked: $.proxy(this.onItemSelected,this),
			onOkBtnClicked: $.proxy(this.onRelationSelected,this)
		});
	},
	onItemSelected:function(ev,dataObj){
		var selectedIndex = parseInt(dataObj.targetElement.attr("index"));
		this.selectedRelation = this.relations[selectedIndex];
		dataObj.targetElement.parent(".list-group").find("a").removeClass("active");
		dataObj.targetElement.addClass("active");
		dataObj.dlgInstance.options.buttonsDisabled.btnOk = false;
		dataObj.dlgInstance.refreshButtons();
	},
	onRelationSelected:function(){
		var relationName = this.selectedRelation;
		AppHelper_JsonWsEx("Document_GetRelationSearchQuery",[this.currDoc.sys_docId,relationName],
		   this.doOpenRelation,this,true);
		
	},
	doOpenRelation:function(resultObj){
				 $("#dialogContLvl1").dwcmDialog("remove");		
				 this.selectedRelationFilter = resultObj.data;	
				 require(["modelDfmVolume","viewDfmVolume"],$.proxy(function(VolModel,VolView)
				 {
					 encodedStrExpr = AppHelper_HtmlEnDeCode().htmlEncode(this.selectedRelationFilter);
					 encodedStrExpr = // it is strange, but server works correctly only if filter expr encoded 2 times
						 AppHelper_HtmlEnDeCode().htmlEncode(encodedStrExpr);  
					 
					 var selNode = App.Models.ddTree.getSelectedNode();
					 var volumeName = selNode.volumeInfo.name;
					 var srchVol = Appc.getCurrentFilteredVol();
					 srchVol.model = new VolModel();
					 srchVol.model.set("volId",-1);
					 srchVol.model.set("volumeName",volumeName);
					 srchVol.model.set("query",encodedStrExpr);
					 srchVol.view = new VolView(); 
					 srchVol.view.model = srchVol.model;
					 srchVol.model.set('mainView', srchVol.view);
					 App.Views.masterPage.renderFilterGroupingTab(Appn.Icons.DDtreeIcon.relationIcon,"");
					 srchVol.model.open();
					 
				 },this));		
	}
} // instance

return instance;		

});
