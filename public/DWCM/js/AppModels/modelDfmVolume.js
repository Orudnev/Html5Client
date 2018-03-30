define(["backbone","waitIndicator"],function(Backbone){
Appc.ModelDfmVolumeClass =
	Backbone.Model.extend(
{
    defaults: {
		attachments:{},
        columns:[],
        currentRow:null,
        docCount:0,
		position:0,
        groupingName:"",
		groupOperation:null,
        mainView:null,
        msd:null,
        onAjaxPageLoadedSuccess: null,
        onAjaxPageLoadedComplete: null,
        query:"",
        rowData:{},
		searchStr:"",
        sortField:null,
        sortOrder:null,
        volId: null,
		volConfig: null,        
		volumeRights:null,
        xmlRows:null
    },
    applyMsd:function(dataObj)
    {
        this.set('msd',dataObj.oMSD);
        this.set('volId',dataObj.volId);
        this.set('docCount',dataObj.docCount);  
        this.set('volumeName',dataObj.oMSD.volumeName); 
        this.readVolumeConfiguration();
        var cols = this.get('columns');
        var colItem = {field:"SelectRow",checkbox:true};
        cols.push(colItem);
		cols.push({field:"DocTypeIcon",title:"ccccc",class:"DocTypeColumn",
				   formatter:this.get('mainView').docTypeIconFunction});
        for(i=0;i<dataObj.oMSD.jFields.length;i++)
        {
             var jfItem = dataObj.oMSD.jFields[i];
             colItem = {field:jfItem.name,title:jfItem.caption,sortable:true};
             if (colItem.field == this.get('sortField'))
             {
                 colItem.order = this.get('sortOrder').toLowerCase();
             }
             cols.push(colItem);
        }
        this.set('columns',cols);
    },
	attachmentAdd:function(form)
	{
		//Build "Metadata" string
		var volFields = this.get("msd").jFields;
		var fileName = form.data.get("file").name;
		var fileType = fileName.substr(fileName.indexOf("."));
		var attName = form.data.get("attachmentName");
		if (!attName) attName = fileName;
		var docId = this.get("currentRow").sys_docId;
		var metaDataStr = stringFormat('&lt;doc type="{0}" fileName="{1}" attName="{2}" docid="{3}" IsAttachment="true"&gt;',[fileType,fileName,attName,docId]);
		metaDataStr += "&lt;/doc&gt;";
		wmw_DocumentAdd(App.getSessionId(),this.get('volId'),metaDataStr,this,
			function(bresult,result,errorStr,volModel)
			{
				if (bresult)
				{
					AppHelper_RemoveWholeMainPaneDialog();
					var dlgList = $(".WholeMainPaneDialog");
					if (!dlgList || dlgList.length==0)
					{
						//"Add attachment" command started from Document list pane
						volModel.open();
					}
					else
					{
						//"Add attachment" command started from Attachment pane 
						App.Controllers.masterPage.onMenuCommandDataGrid(Appn.MenuCommands.DGridShowAttList);
					}
				}
				else
				{
					showError(errorStr,App.localeData.dgrid_menuCmd_AddDocument);
				}
			}
		   );
	},
	attachmentDelete:function()
	{
		var selectedRows = this.get("mainView").getSelectedAttRows();
		if(selectedRows.length == 0) return;
		this.set("groupOperation",{selectedRows:selectedRows, counter:0, errorStr:""});
		
		$("body").waitDialog();		
		
		for(var i=0;i<selectedRows.length;i++)
		{
			var row = selectedRows[i];
			wmw_AttachmentDelete(
				App.getSessionId(),
				row.sys_docId,
				row.name,
				this,
				function(bresult,result,errorStr,volModel)
				{
					var groupOperation = volModel.get("groupOperation");
					groupOperation.errorStr += errorStr;
					groupOperation.counter++;
					$("body").waitDialog("renderInfo",stringFormat("{0}/{1})",
									   [groupOperation.counter,groupOperation.selectedRows.length]));
					if (groupOperation.counter>=groupOperation.selectedRows.length)
					{
						$("body").waitDialog("remove");	
						if (groupOperation.errorStr)
						{
							showError(groupOperation.errorStr);		
						}
						else
						{
							App.Controllers.masterPage.onMenuCommandDataGrid(Appn.MenuCommands.DGridShowAttList);
						}
					}
				}
			);	
		}
		
	},
    clearDefaults: function()
    {
        this.set('msd',null);
        this.set('columns',[]);
        this.set('xmlRows',null);
        this.set('rowData',[]);
    },
	documentAdd:function(form)
	{
		//Build "Metadata" string
		var volFields = this.get("msd").jFields;
		var fileName = form.data.get("file").name;
		var fileType = fileName.substr(fileName.indexOf("."));
		var metaDataStr = stringFormat('&lt;doc type="{0}" fileName="{1}"&gt;',[fileType,fileName]);
		for(var i=0;i<volFields.length;i++)
		{
			var field = volFields[i];
			if (field.name.toLowerCase()=="timestamp") continue;
			var fieldValue = form.data.get(field.name);
			if (fieldValue==null) fieldValue = ""; 
			var newfldValue = stringFormat('&lt;{0}&gt;{1}&lt;/{0}&gt;',[field.name,fieldValue]);
			metaDataStr += newfldValue;
		}
		metaDataStr += "&lt;/doc&gt;";
		wmw_DocumentAdd(App.getSessionId(),this.get('volId'),metaDataStr,this,
			function(bresult,result,errorStr,volModel)
			{
				if (bresult)
				{
					AppHelper_RemoveWholeMainPaneDialog();
					volModel.open();
				}
				else
				{
					showError(errorStr,App.localeData.dgrid_menuCmd_AddDocument);
				}
			}
					   );
	},
	documentDelete:function()
	{
		var selectedRows = this.get("mainView").getSelectedRows();
		if(selectedRows.length == 0) return;
		this.set("groupOperation",{selectedRows:selectedRows, counter:0, errorStr:""});
		
		$("body").waitDialog();		
		
		for(var i=0;i<selectedRows.length;i++)
		{
			var row = selectedRows[i];
			wmw_DocumentDelete(
				App.getSessionId(),
				row.sys_docId,
				this,
				function(bresult,result,errorStr,volModel)
				{
					var groupOperation = volModel.get("groupOperation");
					groupOperation.errorStr += errorStr;
					groupOperation.counter++;
					$("body").waitDialog("renderInfo",stringFormat("{0}/{1})",
									   [groupOperation.counter,groupOperation.selectedRows.length]));
					if (groupOperation.counter>=groupOperation.selectedRows.length)
					{
						$("body").waitDialog("remove");	
						if (groupOperation.errorStr)
						{
							showError(groupOperation.errorStr);		
						}
						else
						{
							volModel.open();
						}
					}
				}
			);	
		}
		
	},
	documentEditMetadata:function()
	{
		//1. Build metadata
		var volModel = Appc.getActiveVolumeModelObject();
		var msd = volModel.get("msd");
		var metadataStr = "";
		var metadataFmtStr = 
			'&lt;doc status="edited" &gt;{0}&lt;/doc&gt;';
		var fldMetadataFmtStr = '&lt;{0} type="user"&gt;&lt;![CDATA[{1}]]&gt;&lt;/{0}&gt;';
		var fldMetadataStr = "";
		var currRow = volModel.get("currentRow");
		for (var i=0;i<msd.jFields.length;i++)
		{
			var field = msd.jFields[i];
			var selector = stringFormat("#volumeFormStd input[name='{0}']",[field.name]);
			fldMetadataStr += stringFormat(fldMetadataFmtStr,[field.name,$(selector).val()]);
		}
		metadataStr = stringFormat(metadataFmtStr,[fldMetadataStr]);
		wmw_DocumentUpdateMetadata(App.getSessionId(),currRow.sys_docId,metadataStr,
			volModel,
			function(bresult,result,errorStr,volModel)
		   	{
				if (bresult)
				{
					AppHelper_RemoveWholeMainPaneDialog();
					volModel.open();
				}
				else
				{
					showError(errorStr,App.localeData.dgrid_menuCmd_EditMetadata);
				}
			});
	},
	getDocumentSubmitOptins:function(volModel,onDocUploadedHandlerFuncName)
	{
		//this - form object
		var uploadUrl = getUrlBase()+"FileUploadServlet?sessionId="+App.getSessionId();
		var rv = 
		{
			type:"POST",
			url:uploadUrl,
			dataToken:volModel,
			success : function (response) {
				if (response=="Session is invalid.")
				{
					AppHelper_RemoveWholeMainPaneDialog();
					showError(App.localeData.constErrSessionExpired,"",
						function()
						{
							App.Controllers.masterPage.onSessionExpired();
						}
					);
					return;
				}
				//4. Selected file is succesfully uploaded
				var fileName = this.data.get("file").name;
				volModel[onDocUploadedHandlerFuncName](this);
			},
			error: function (jqXHR, textStatus )
			{
			  showError(jqXHR.responseText,'renderAddDocForm'); 
			}		
		}
		return rv;
	},
    getRange: function(position,count)
    {
		if (this.get("docCount")==0)
		{
			//this request returns 0 rows
			var rowData = {total:0,rows:[]};
			this.set('rowData',rowData); 
			//apply empty rowData to bootstrapTable instance
			this.get("onAjaxPageLoadedSuccess")(rowData);
			this.get("onAjaxPageLoadedComplete")();	
			return;
		}
        wmw_DocList_GetRange(App.getSessionId(),this.get('volId'),position,count,this,
                             function (bresult,xmlData,_this)
                             {
                                var rowData = {total:_this.get("docCount"),rows:[]};
                                if (bresult)    
                                {
                                     _this.set('xmlRows',xmlData);
                                     var fields = $('Field',xmlData);  
                                     for(i=0;i<xmlData.length;i++)   
                                     {
                                         var xDocItem = xmlData[i];
                                         var docId = $(xDocItem).find('DocumentID').text();
                                         var smetaData = $(xDocItem).find('Metadata').text();
                                         var xmetaData = $.parseXML(smetaData);
										 if (i==0)
										 {
											 // set volume rights
											 var volRights = {};
											 volRights.AddDocRight = 
												 $(xmetaData).find('Document').attr('Add')=="true";
											 volRights.DeleteDocRight =
												 $(xmetaData).find('Document').attr('Delete')=="true";
											 volRights.ModifyDocRight = 
												 $(xmetaData).find('Document').attr('Modify')=="true";
										 	 _this.set("volumeRights",volRights);
										 }
                                         var docType = $(xmetaData).find('Document').attr('Type');
                                         var hasAttachment = $(xmetaData).find('Document').attr('Attachment');
                                         var xFields = $(xmetaData).find('Field');
                                         var rowItem = {sys_docId: docId,
                                                        sys_docType: docType,
                                                        sys_hasAttachment: hasAttachment
                                                       };
                                         for (indf = 0; indf < xFields.length; indf++)
                                         {
                                             var xfield = xFields[indf];
                                             var fldName =  $(xfield).attr('Name');
                                             var fldValue = $(xfield).text();
                                             rowItem[fldName] = fldValue;
                                         }
                                     rowData.rows.push(rowItem);       
                                     }
                                }
                                _this.set('rowData',rowData); 
                                //apply received rowData to bootstrapTable instance
                                _this.get("onAjaxPageLoadedSuccess")(rowData);
                                _this.get("onAjaxPageLoadedComplete")();
                             });
    },   
	getAttachments:function(row,token,handler)
	{
		if (!row)
			row = this.get("currentRow");
		var tokenEx = {token:token,handler:handler,modelInstance:this};
		wmw_DocumentGetAttachments(App.getSessionId(),row.sys_docId,tokenEx,
		   function(bresult,strAttXml,errStr,tokenEx)
		   {
				var that = tokenEx.modelInstance;
				if (!bresult) return;
	  			var rowData = {rows:[]};			
				var attXml = $.parseXML(strAttXml);
				var docId = $(attXml.documentElement).attr("docId");
				var xattList = $(attXml.documentElement).find("attachment");
				rowData.total = xattList.length;
			    rowData.currentRowIndex = 0;
				for(var i=0;i<xattList.length;i++)
				{
				  var xitem = xattList[i];
				  var complexName = $(xitem).find("Name").text();
				  var infoStr = complexName.substring(complexName.indexOf("(")+1,complexName.indexOf(")"));
				  var infoArr = infoStr.split(",");
				  var name = complexName.substring(0,complexName.indexOf("(")).trim();
				  var attTtype = $(xitem).attr("Type");
				  var newAtt = {sys_rowIndex:i,sys_docId:docId,sys_complexName:complexName,sys_attType:attTtype,name:name};
				  rowData.rows.push(newAtt);
				}
				if (tokenEx.handler)
					tokenEx.handler(rowData,tokenEx.token);
		   });	
	},
	parseForms:function()
	{
		var forms = this.get("volConfig").forms;
		for (var i=0; i<forms.length;i++){
			var form = forms[i];
			var xform = $(form.xmlLayout)[2];
			form.width = $(xform).attr("width");
			form.height = $(xform).attr("height");
			var controls = $(xform).children();
			form.controls = [];
			for (var j=0; j<controls.length;j++){
				var xctrl = controls[j];
				var $xctrl = $(xctrl);
			    var ctrl = {};
				ctrl.type = xctrl.tagName;
				ctrl.x = $xctrl.attr("x");
				ctrl.y = $xctrl.attr("y");
				ctrl.width = $xctrl.attr("width");
				ctrl.height = $xctrl.attr("height");
				ctrl.visible = $xctrl.attr("visible");
				ctrl.caption = $xctrl.attr("caption");
				ctrl.srcFieldName = $xctrl.attr("srcFieldName");
				ctrl.color = $xctrl.attr("color");
				ctrl.backgroundColor = $xctrl.attr("backgroundColor");
				ctrl.checkedValue = $xctrl.attr("checkedValue");
				ctrl.uncheckedValue = $xctrl.attr("uncheckedValue");
				ctrl.data = $xctrl.attr("data");
				ctrl.showAvailable = $xctrl.attr("showAvailable");
				form.controls.push(ctrl);
			}
		}
	},
	readVolumeConfiguration:function()
	{
		AppHelper_JsonWs({method:"getVolumeConfiguration",volumeName:this.get("volumeName")},
						 this,
						 function(result,volModel)
						 {
							if(result.bResult)
							{
								volModel.set("volConfig",result.data);
								if (result.data.forms.length>0)
								{
									volModel.parseForms();
								}
							}
						 }
						);
	},
	showAttachments:function(row)
	{
		this.getAttachments(row,this,
			function(data,that)
			{
			    that.set("attachments",data);
				that.get("mainView").renderAttList(data);
			}
		);	
	},
    initialize: function()
    {
    },
    onClickRow: function(row, $element,that)
    {
		if (!that)
		   that = this.backboneModel;
        that.set('currentRow',row); 
		that.set('position',parseInt($element.attr("data-index")));
		that.get('mainView').highlightSelectedRow(row, $element);
    },
	onClickAttachment: function(row, $element, volModel)
	{
		if (!volModel) volModel = this.volumeModel;
		volModel.get("attachments")
		volModel.get("attachments").currentRowIndex = row.sys_rowIndex;
		volModel.get("mainView").highlightSelectedRow(row, $element);
	},
    onRequestRows: function(params)
    {
        // this function requests automatically by vidget "bootstrapTable"
        var parObj = params.data;
        var rowsPerPage = parObj.limit;
        var offset = parObj.offset;
        var order = parObj.order;
        var _that = this.$el.data("modelInstance");
        // store links to callback functions of bootstrapTable
        _that.set("onAjaxPageLoadedSuccess",params.success);
        _that.set("onAjaxPageLoadedComplete",params.complete);        
        _that.getRange(offset,rowsPerPage);
    },
    onSort: function(fldName,order)
    {
        order = order.toUpperCase(); 
        //"this" - bootstrapTable.options
        this.backboneModel.set('sortField',fldName); 
        this.backboneModel.set('sortOrder',order);  
        this.backboneModel.reopen(fldName,order);
    },
    open: function() 
    {
        this.clearDefaults();    
        var filterQuery = this.get("query"); 
		var searchStr = this.get("searchStr");
        var volumeName = this.get("volumeName");
        if (filterQuery||searchStr)
        {
			var handleOpen = function (bresult,dataObj,_this)
            {
                _this.applyMsd(dataObj);
                _this.get("mainView").render('#DocListGrid_ExtTab');
            };
			if(searchStr){
				this.set("query",searchStr);
            	wmw_openSearch(App.getSessionId(),volumeName,searchStr,this,handleOpen);
			}else{
            	wmw_openFilter(App.getSessionId(),volumeName,filterQuery,this,handleOpen);
			} 
        }
        else
        {
            wmw_getMSD(App.getSessionId(),this.get('volId'),this.get('sortField'),this.get('sortOrder'),this,
            function (bresult,dataObj,_this)
            {
                _this.applyMsd(dataObj);
                _this.get('mainView').render('#DocListGrid');
            });
        }
    },
    reopen:function()
    {
		this.open();
		/*
        wmw_getMSD(App.getSessionId(),this.get('volId'),this.get('sortField'),this.get('sortOrder'),this,
                   function (bresult,msd,docCount,_this)
                   {
                   });
				   */
    }    
    
}); 
return Appc.ModelDfmVolumeClass;	
});
	