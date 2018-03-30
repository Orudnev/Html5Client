define(["rx"],function(Rx){
var instance =	{
	volModel:null,
	currDoc:null,
	selectedForm: "",
	forms:[],
	templates: {
		listContainer: '<div class="list-group"></div>',
		listItem: '<a href="#" class="list-group-item btListActiveColor"></a>',
		frmCont:'<div></div>',
		frmGroup:'<div class="form-group"></div>', 
		ctrlLabel: '<div style="position:absolute;"></div>',
		ctrlEditBox: '<input type="text" style="position:absolute;" class="form-control bindable">',
		ctrlRadioBtn: 
		'<div style="position:absolute;">'+
			'<label>'+
				'<input type="radio" class="bindable" >' +
				'<span></span>'+
			'</label>'+
		'</div>',
		ctrlCheckBox:
		'<label style="position:absolute;">'+
			'<input type="checkbox" class="bindable" style="margin:0" >' +
			'<span></span>'+
		'</label>',
		ctrlGroupBox:
		'<div style="position: absolute;'+
				'border-style: dotted;'+
    			'border-width: 1px;">'+
			'<label class="active" style="position: relative;top: -18px;left: 5px;"></label>'+
		'</div>',
		ctrlComboBox:
		'<select class="selectpicker bindable" >'+
		'</select>',
		ctrlComboBoxItem:
		'<option></option>'
	},
	init:function(){
		this.volModel = Appc.getActiveVolumeModelObject();
		this.currDoc= this.volModel.get("currentRow");
		this.forms = this.volModel.get("volConfig").forms;
		var $listCont = $(this.templates.listContainer);
		if (this.forms.length == 1){
			this.selectedForm = this.forms[0];
			this.onFormSelected();
			return;
		}
		for (var i=0;i<this.forms.length;i++){
			var itemName = this.forms[i].name;
			var $listItem = $(this.templates.listItem);
			$listItem.attr("index",i).text(itemName);
			$listCont.append($listItem);
		}
		var contentHtml = $listCont[0].outerHTML; 
		$("#dialogContLvl1").dwcmDialog({
			title: App.localeData.selectDfmForm,
			buttons:{btnOk:true,btnCancel:true,btnMenu:false},
			buttonsDisabled:{btnOk:true,btnCancel:false,btnMenu:false},
			contentHtml: contentHtml,
			context: this,	
			onContentElementClicked: $.proxy(this.onFormListItemSelected,this),
			onOkBtnClicked: $.proxy(this.doOpenForm,this),
		});
	},
	onFormListItemSelected:function(ev,dataObj){
		var selectedIndex = parseInt(dataObj.targetElement.attr("index"));
		this.selectedForm = this.forms[selectedIndex];
		dataObj.targetElement.parent(".list-group").find("a").removeClass("active");
		dataObj.targetElement.addClass("active");
		dataObj.dlgInstance.options.buttonsDisabled.btnOk = false;
		dataObj.dlgInstance.refreshButtons();
	},
	onFieldValuesChangesStored:function(resultObj){
		if (!resultObj.bResult){
			showError(resultObj.exception.cause.detailMessage)
			return; 
		}
		$("#dialogContLvl1").dwcmDialog("remove");	
		this.volModel.open();
	},
	onFormOkButtonClicked:function(){
		var newValuesModel = $("#dialogContLvl1").dwcmDialog("getOptions").model;
		var fields = this.volModel.get("msd").jFields;
		var fieldValues = [];
		for (var i=0;i<fields.length;i++){
			var field = fields[i];
			var fieldValue = {name:field.name,valueStr:newValuesModel[field.name]};
			fieldValues.push(fieldValue);
		}
		var updFieldsData = {
				method:"updateMetadata",
				volumeName: Appc.getCurrVolumeName(),
				docUid: this.currDoc.sys_docId, 
				fieldValues:fieldValues
			 };
			AppHelper_JsonWsEx("updateMetadata",updFieldsData,
			   this.onFieldValuesChangesStored,this,true,0);		
	},
	onFormRendered:function(){
		var comboBoxes = $("#dialogContLvl1").find(".btn-group.bootstrap-select");
		for (var i=0; i<comboBoxes.length; i++)
		{
			$cmbItem = $(comboBoxes[i]);
			$selNode = $cmbItem.find(".selectpicker");
			$cmbItem.css("position","absolute");
			$cmbItem.css("top",$selNode.css("top"));
			$cmbItem.css("left",$selNode.css("left"));
		}
		var position = this.volModel.get("position");
		var pagelength = this.volModel.get("rowData").rows.length;
		$("#NavigatorContainer").dwcmNavigator({
			minIndex:position,
			maxIndex:position+pagelength-1,
			currentIndex:position,
			onCurrentIndexChanged:$.proxy(this.onCurrentRecordChanged,this)
		});
	},
	onFormDestroing:function(){
		$("#NavigatorContainer").dwcmNavigator("remove");	
	},
	onCurrentRecordChanged:function(e,dataObject){
		this.currDoc = this.volModel.get("rowData").rows[dataObject.newIndex];
		$("#dialogContLvl1").dwcmDialog("setModel",[this.currDoc]);
	},										   
	onComboDataReceived:function(resultObj,data){
		//data for single field is received
		if (!resultObj.bResult)
			throw("err:onComboDataReceived");
		for (var i=0;i<resultObj.data.length;i++){
			resultObj.data[i] = resultObj.data[i].replace(String.fromCharCode(65533),"");
			var $cmbItem = $(this.templates.ctrlComboBoxItem);
			$cmbItem.attr("value",resultObj.data[i]);
			$cmbItem.attr("dataIndex",i);
			$cmbItem.text(resultObj.data[i]);
			data.$ctrl.append($cmbItem);
		}
		var fldValue = this.currDoc[data.ctrl.srcFieldName];
		if (!resultObj.data.find((elm,index,array)=>elm==fldValue)){
			//current value is not found in value list, add it 
			$cmbItem = $(this.templates.ctrlComboBoxItem);
			$cmbItem.attr("value",fldValue);
			$cmbItem.attr("dataIndex",i);
			$cmbItem.text(fldValue);
			data.$ctrl.append($cmbItem);
		}
		var myEvent = new Event(Appn.Events.GrOperItemCompleted);
		document.dispatchEvent(myEvent);
	},
	doOpenForm:function(resultObj){
  	 	$("#dialogContLvl1").dwcmDialog("remove");	
		var $frm = $(this.templates.frmCont); 
		this.dataForCmbRowsRequest = [];
		var buildCtrl = $.proxy(function(attrList,$frm,$ctrl,ctrl){
				if (attrList.indexOf("left,top,width")>-1){
					var topOffset = 70;
					$ctrl.css("left",ctrl.x+"px");
					$ctrl.css("top",parseInt(ctrl.y)+topOffset+"px");
					$ctrl.css("width",ctrl.width+"px");
					$ctrl.css("height",ctrl.height+"px");
				}
				if (attrList.indexOf("caption")>-1){
					var $txtCtrl = $ctrl;
					if ($ctrl.find("span").length>0) $txtCtrl = $ctrl.find("span");
					$txtCtrl.text(ctrl.caption);
				}
				if (attrList.indexOf("labelCaption")>-1){
					$lblCtrl = $ctrl.find("label");
					$lblCtrl.text(ctrl.caption);
				}
				if (attrList.indexOf("datafield")>-1||attrList.indexOf("value")>-1){
					var $ictrl = $ctrl;
					if ($ctrl[0].tagName!="INPUT") $ictrl = $ctrl.find("input");
					if ($ctrl[0].tagName=="SELECT") 
						$ictrl = $ctrl;
					if (attrList.indexOf("datafield")>-1)
						$ictrl.attr("dataField",ctrl.srcFieldName);
					if (attrList.indexOf("value")>-1)
						$ictrl.attr("value",ctrl.caption);
					if (attrList.indexOf("checkedUncheckedValue")>-1){
						$ictrl.attr("checkedValue",ctrl.checkedValue);
						$ictrl.attr("uncheckedValue",ctrl.uncheckedValue);
					}
					if (attrList.indexOf("valign")>-1)
						$ictrl.css("margin-top",8);
					if (attrList.indexOf("comboItems")>-1){
						if (ctrl.showAvailable && ctrl.showAvailable=="true"){
							//values of combobox are field values and must be requested from server
							this.dataForCmbRowsRequest.push({$ctrl:$ctrl,ctrl:ctrl});
						}else{
							//values of combobox contained in the "data" property 
							var items = ctrl.data.split("\n");
							for (var i=0;i<items.length;i++){
								var item = items[i];
								var $item = $(this.templates.ctrlComboBoxItem);	
								$item.attr("value",item);
								$item.attr("dataIndex",i);
								$item.text(item);
								$ctrl.append($item);
							}
						}
					}
				}
				if (ctrl.type=="RADIOBUTTON"){
					$frmGroup = $frm.find("div.form-group[dataField='"+ctrl.srcFieldName+"']");
					if ($frmGroup.length == 0){
						$frmGroup = $(this.templates.frmGroup);
						$frmGroup.attr("dataField",ctrl.srcFieldName);
						$frm.append($frmGroup);	
					}
					$frmGroup.append($ctrl);
				}else{
					$frm.append($ctrl);	
				}
				
			},this);		
		for (var i=0;i<this.selectedForm.controls.length;i++){
			var ctrl = this.selectedForm.controls[i];
			if (ctrl.srcFieldName && ctrl.srcFieldName.toUpperCase()=="TIMESTAMP") continue;
			if (ctrl.type=="STATIC"){
				buildCtrl("left,top,width,caption",$frm,$(this.templates.ctrlLabel),ctrl);
			}
			if (ctrl.type=="EDITBOX" || ctrl.type=="DATAPICKER"){
				buildCtrl("left,top,width,datafield",$frm,$(this.templates.ctrlEditBox),ctrl); 
			}
			if (ctrl.type=="RADIOBUTTON"){
				buildCtrl("left,top,width,caption,datafield,value",$frm,$(this.templates.ctrlRadioBtn),ctrl); 
			}
			if (ctrl.type=="CHECKBOX"){
				buildCtrl("left,top,width,caption,datafield,checkedUncheckedValue,valign",
						  $frm,$(this.templates.ctrlCheckBox),ctrl); 
			}
			if (ctrl.type=="FRAME"){
				buildCtrl("left,top,width,labelCaption",
						  $frm,$(this.templates.ctrlGroupBox),ctrl); 
			}
			if (ctrl.type=="COMBOBOX"){
				buildCtrl("left,top,width,labelCaption,datafield,comboItems",
						  $frm,$(this.templates.ctrlComboBox),ctrl); 
			}
		} // -- for
		var buildDlg = $.proxy(function(){
			var contentHtml = $frm[0].innerHTML;
			$("#dialogContLvl1").dwcmDialog({
				title: this.selectedForm.name,
				buttons:{btnOk:true,btnCancel:true,btnMenu:false},
				contentHtml: contentHtml,
				model: this.currDoc,
				context: this,	
				onContentElementClicked: $.proxy(this.onItemSelected,this),
				onOkBtnClicked: $.proxy(this.onFormOkButtonClicked,this),
				onRendered: $.proxy(this.onFormRendered,this),
				onDestroing: $.proxy(this.onFormDestroing,this)
		});
		},this);
		if (this.dataForCmbRowsRequest.length>0){
			var obs = Rx.Observable.fromEvent(document,Appn.Events.GrOperItemCompleted)
						.take(this.dataForCmbRowsRequest.length);
			
			obs.subscribe(null,null,buildDlg); //launch buildDlg when values for all requested fields will be received
		
			for (i=0;i<this.dataForCmbRowsRequest.length;i++)
			{
				var data = this.dataForCmbRowsRequest[i];
				AppHelper_JsonWsEx("GetFirstFieldValues",
				   [this.volModel.get("volumeName"),data.ctrl.srcFieldName],
					this.onComboDataReceived,this,true,data);
			}
		}
		else{
			buildDlg();
		}
		
	}
} // instance

return instance;		

});
