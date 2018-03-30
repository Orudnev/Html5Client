define(["jquery","backbone","utils"],function($,Backbone,Utils){
Appc.ViewDfmVolumeClass =
		Backbone.View.extend({
    tagName: 'div',
	highlightSelectedRow:function(row,$element)
	{
		$element.parents("tbody").find("tr.selectedRow").removeClass("selectedRow");
		var selectRowColumnIsVisible = 
			$element.parents("table").bootstrapTable('getOptions').columns[0][0].visible;
		if (!selectRowColumnIsVisible)
        	$element.addClass("selectedRow");
	},
	docTypeIconFunction: function(value, row, rowIndex)
	{
		var iconSrc = AppHelper_GetDocTypeIcon(row.sys_docType);
		var viewAttListHandler = 
			stringFormat("App.Controllers.masterPage.onMenuCommandDataGrid('{0}')",[Appn.MenuCommands.DGridShowAttList]);
		var attFmtStr = '<img height="20px;" onClick="{0}" src="DWCM/image/clip.svg">';
		var attachmentIconHtml = 
			row.sys_hasAttachment=="true"?stringFormat(attFmtStr,[viewAttListHandler]):'';
		var shtml = stringFormat(
			'<img height="20px;" src="{0}">{1}',
			[iconSrc,attachmentIconHtml]);
		return shtml;
	},
	attTypeIconFunction: function(value, row, rowIndex)
	{
		var iconSrc = AppHelper_GetDocTypeIcon(row.sys_attType);
		var shtml = stringFormat('<img height="20px;" src="{0}">',[iconSrc]);
		return shtml;
	},
	getSelectedRows: function()
	{
		var filterQuery = this.model.get("query");
		var selector = "#DocListGrid";
		if (filterQuery)
		    selector = "#DocListGrid_ExtTab";
		var rv = $(selector).bootstrapTable('getSelections');
		return rv;
	},
	getSelectedAttRows: function()
	{
		return $("#attListDataGrid").bootstrapTable("getSelections");	
	},
    render:function(selector){
        //store refference to model instance to DOM
        $(selector).data("modelInstance",this.model);
        
        $(selector).bootstrapTable('destroy');
        var rowData = this.model.get('rowData');
        var gridHeight;
        if (this.model.get("groupingName"))
        {
            gridHeight = parseInt($("#docGridContainer").css("max-height"))-50;
        }
        else
        {
            gridHeight = this.getDataGridHeight();
        }
		
		var cols = this.model.get('columns');
		cols[0].visible = false; // make "SelectRow" column invisible
		var onDblClickHandler = (AppHelper_IsMobileOrTablet()?null:this.onDblClickRow);
        $(selector).bootstrapTable(
            {columns: this.model.get('columns'), 
             ajax: this.model.onRequestRows,
             pagination: true,
             sidePagination: "server",
             striped:true,
             locale:'en-US',
             pageSize: App.Models.settings.get(Appn.Model.Settings.doclistPageSize),
			 onClickRow: this.model.onClickRow,
			 onRowTap: $.proxy(function (ev,row){
				this.bootstrapTable('showColumn', 'SelectRow'); 
				var index = $(ev.currentTarget).attr('data-index');
				this.bootstrapTable('check', index); 
			 },$(selector)),
             onSort: this.model.onSort,
			 onDblClickRow: onDblClickHandler,
			 onLoadSuccess: function(data)
			 {
				if (this.modelInstance.get('currentRow')==null)
				{
					//select 1-st row
					setTimeout(
						function(that,selector)
						{
							var el = $(selector+" tbody tr")[0];
							var row = that.modelInstance.get("rowData").rows[0];
							that.modelInstance.onClickRow(row,$(el),that.modelInstance);
						},200,this,selector);
				}
			 },
             backboneModel: this.model,
             height: gridHeight
            });
			$(document).off(Appn.Events.MainMenuClosed).on(Appn.Events.MainMenuClosed,
														   $.proxy(this.onMainMenuCollapsed,{view:this,dataGrid:$(selector)}));
    },
	renderAddAttachmentForm:function()
	{
		var formHtml = App.Templates.dialogs[Appn.Dialogs.AddAttachmentForm];
		formHtml = compileTemplate(formHtml,null);
		var $formHtml = $(formHtml);
		//Insert form into WholeMainPaneDialog
		var model = {title: App.localeData.dgrid_menuCmd_AddAttachment,strHtmlContent:$formHtml[0].outerHTML};
		AppHelper_ShowWholeMainPaneDialog(model,
			  function(that)
			  {
				// on appended	
				//3. remove main menu button (with its container) and get control of the form via ajaxForm plugin
				$(".WholeMainPaneDialog .menuBtnDiv").remove();
				//4. Add Ok button 	
				var btnOkHtml = 
					'<button type="button" style="margin-top:3px;margin-bottom:3px; margin-right:3px;"'+
					'command="ok"'+
					'class="toolbarBtn btn btn-success menuBtn pull-right glyphicon glyphicon-ok">'+
					'</button>';
			
				$(".WholeMainPaneDialog .toolbarDiv").append(btnOkHtml);
			
			
				$("#file-choosen").change(function()
				{
					var fileName = $("#file-choosen")[0].files[0].name;
					$(".form-control[name='attachmentName'").val(ue=fileName);
				}); 
				$(".WholeMainPaneDialog .toolbarBtn[command='ok']").on('click', 
				   function(e) 
				   {
						// Submit button pressed
						if (!$("#volumeFormStdContainer #file-choosen").val())
						{
							//document is not selected
							showError(App.localeData.errMesDocumentWasNotSelected, App.localeData.errInputError);
							return;
						}
						$("#AddAttachmentForm")
							.ajaxSubmit(that.model.getDocumentSubmitOptins(that.model,"attachmentAdd"));	
					});
			
			  },null,this);
		
	},
	renderAddDocForm:function()
	{
	   // template for volume fields	
		var fieldHtml = 
			'<div class="form-group">'+
				'<label class="control-label col-sm-2" for="email"></label>'+
				'<div class="col-sm-10">'+
				  '<input class="form-control" >'+
				'</div>'+
			'</div>';
		
		// file - browse button
		var browseFile_ButtonHtml = 
			'<div class="form-group">'+
				'<label class="control-label col-sm-2" for="email"></label>'+
				'<div class="col-sm-10">'+
					 '<input id="file-choosen" type="file" name="file" size="50">'+
				'</div>'+
			'</div>';
		
		//1.	build form
		var formHtml = App.Templates.dialogs[Appn.Dialogs.VolumeForm];
		formHtml = compileTemplate(formHtml,null);
		var $formHtml = $(formHtml)
		var $form = $formHtml.find("form");
		var msd = this.model.get("msd");
		for (var i=msd.jFields.length-1;i>-1;i--)
		{
			var field = msd.jFields[i];
			if (field.name.toLowerCase()=="timestamp") continue;
			var caption = ((field.caption)?field.caption:field.name);
			var $fieldItemBody = $(fieldHtml);
			$fieldItemBody.find("label").text(caption);
			$fieldItemBody.find("input").attr("name",field.name);
			$form.prepend($fieldItemBody);
		}
		$form.prepend(browseFile_ButtonHtml);
		
		//2.	Insert form into WholeMainPaneDialog
		var model = {title: App.localeData.dgrid_menuCmd_AddDocument,strHtmlContent:$formHtml[0].outerHTML};
		AppHelper_ShowWholeMainPaneDialog(model,
			  function(that)
			  {
				// on appended	
				//3. remove main menu button (with its container) and get control of the form via ajaxForm plugin
				$(".WholeMainPaneDialog .menuBtnDiv").remove();
				//4. Add Ok button 	
				var btnOkHtml = 
					'<button type="button" style="margin-top:3px;margin-bottom:3px; margin-right:3px;"'+
					'command="ok"'+
					'class="toolbarBtn btn btn-success menuBtn pull-right glyphicon glyphicon-ok">'+
					'</button>';
			
				$(".WholeMainPaneDialog .toolbarDiv").append(btnOkHtml);
				
				$(".WholeMainPaneDialog .toolbarBtn[command='ok']").on('click', 
				   function(e) 
				   {
						// Submit button pressed
						if (!$("#volumeFormStdContainer #file-choosen")[0].value)
						{
							//document is not selected
							$(".WholeMainPaneDialog #volumeFormStdContainer #volumeFormStd").scrollTop(0);
							showError(App.localeData.errMesDocumentWasNotSelected, App.localeData.errInputError);
							return;
						}
						$("#volumeFormStd")
							.ajaxSubmit(that.model.getDocumentSubmitOptins(that.model,"documentAdd"));	
					});
			
			  },null,this);
	},	
	renderAttList: function(attList)
	{
		var strHtml = App.Templates.dialogs[Appn.Dialogs.AttachmentPaneContent];
    	strHtml = compileTemplate(strHtml,null);		
		var modelForTemplate = {title:App.localeData.attachmentPaneTitle,strHtmlContent:strHtml};
		
		var columns=
			[
				{field:"SelectRow",checkbox:true},
				{field:"sys_attType",formatter:this.attTypeIconFunction,width:20},
				{field:"name",title:App.localeData.Name}
			];

		var dataToken = {columns:columns, attList:attList,volumeModel:this.model};
		var onAppend = function(dataToken)
		{
			dataToken.columns[0].visible = false;
			$("#attListDataGrid").bootstrapTable(
				{
					columns:dataToken.columns,
					onClickRow: dataToken.volumeModel.onClickAttachment,
					data:dataToken.attList.rows,
					striped:true,
					volumeModel: dataToken.volumeModel,
					height:$(window).height()-80
				});
			// highlight the 0 row
			setTimeout(
			function(volModel,row)
			{
				var el = $("#attListDataGrid tbody tr")[0];
				volModel.onClickAttachment(row,$(el),volModel);
			},200,dataToken.volumeModel,dataToken.attList.rows[0]);
		};
		AppHelper_RemoveWholeMainPaneDialog();
		AppHelper_ShowWholeMainPaneDialog(modelForTemplate,onAppend,this.renderAttPaneMenu,dataToken);
	},
	renderAttPaneMenu:function()
	{
		var selectedVolumeObj = Appc.getActiveVolumeModelObject();
		if (!selectedVolumeObj) return;
		var currAttIndex = selectedVolumeObj.get('attachments').currentRowIndex;
		var currAtt = selectedVolumeObj.get('attachments').rows[currAttIndex];

		var menuHtml = [];
		var volumeRights = selectedVolumeObj.get("volumeRights");
		var selectedRowsCount = selectedVolumeObj.get("mainView").getSelectedAttRows().length;
		var multipleDocsSelected = selectedRowsCount>1;
		
		if (selectedVolumeObj.get('currentRow'))
		{
				var currRow = selectedVolumeObj.get('currentRow');
				var volumeRights = selectedVolumeObj.get("volumeRights");
				if (volumeRights.AddDocRight)			
				{
					menuHtml.push(stringFormat(
					'<li><a href="#" dwcmVolCommand="'
					+Appn.MenuCommands.DGridAddAttachment
					+'">'
					+'<span class="glyphicon glyphicon-plus" style="padding-right: 5px;"></span>{0}</a></li>',
					[App.localeData.dgrid_menuCmd_AddAttachment]));	
				}
		}
				if (volumeRights.DeleteDocRight && selectedRowsCount>0)
				{
					// at least 1 document checkbox is checked
 					menuHtml.push(stringFormat(
					'<li><a href="#" dwcmVolCommand="'
					+Appn.MenuCommands.DGridDeleteAttachment
					+'">'
					+'<span class="glyphicon glyphicon-minus" style="padding-right: 5px;"></span>{0}</a></li>',
					[App.localeData.dgrid_menuCmd_DeleteAttachment]));	
				}

		
		
		if (!multipleDocsSelected && AppHelper_IsViewableDocType(currAtt.sys_attType))
		{
			menuHtml.push(stringFormat(
			'<li><a href="#" dwcmVolCommand="'
			+Appn.MenuCommands.DGridViewAttachment
			+'">'
			+'<span class="glyphicon glyphicon-eye-open" style="padding-right: 5px;"></span>{0}</a></li>',
			[App.localeData.dgrid_menuCmd_ViewAttachment]));	
		}
		if (!multipleDocsSelected )
		{
			menuHtml.push(stringFormat(
			'<li><a href="#" dwcmVolCommand="'
			+Appn.MenuCommands.DGridSaveSelectedAtt
			+'">'
			+'<span class="glyphicon glyphicon-download-alt" style="padding-right: 5px;"></span>{0}</a></li>',
			[App.localeData.dgrid_menuCmd_SaveSelected]));	
		}
		
		
		$("#menuItems").empty();
		for(var i=0;i<menuHtml.length;i++)
		{
			$("#menuItems").append(menuHtml[i]);
		}
		
		$("#menuItems a[dwcmVolCommand]").off('click').on('click',
															  App.Controllers.masterPage.onMenuCommandDataGrid);
		
	},
	renderEditMetadataForm:function()
	{
		var fieldHtml = 
			'<div class="form-group">'+
				'<label class="control-label col-sm-2" for="email"></label>'+
				'<div class="col-sm-10">'+
				  '<input class="form-control" >'+
				'</div>'+
			'</div>';
		var formHtml = App.Templates.dialogs[Appn.Dialogs.VolumeForm];
		formHtml = compileTemplate(formHtml,null);
		var $formHtml = $(formHtml)
		var $form = $formHtml.find("form");
		var msd = this.model.get("msd");
		for (var i=msd.jFields.length-1;i>-1;i--)
		{
			var field = msd.jFields[i];
			if (field.name.toLowerCase()=="timestamp") continue;
			var caption = ((field.caption)?field.caption:field.name);
			var $fieldItemBody = $(fieldHtml);
			$fieldItemBody.find("label").text(caption);
			$fieldItemBody.find("input").attr("name",field.name);
			$form.prepend($fieldItemBody);
		}
		//2.	Insert form into WholeMainPaneDialog
		var model = {title: App.localeData.dgrid_menuCmd_EditMetadata,strHtmlContent:$formHtml[0].outerHTML};
		AppHelper_ShowWholeMainPaneDialog(model,
			  function(that)
			  {
				var msd = that.model.get("msd");
				var currRow = that.model.get("currentRow");
				for (var i=msd.jFields.length-1;i>-1;i--)
				{
					var field = msd.jFields[i];
					var selector = stringFormat("#volumeFormStd input[name='{0}']",[field.name]);
					$(selector).val(currRow[field.name]);
				}
				// on appended	
				//3. remove main menu button (with its container) and get control of the form via ajaxForm plugin
				$(".WholeMainPaneDialog .menuBtnDiv").remove();
				//4. Add Ok button 	
				var btnOkHtml = 
					'<button type="button" style="margin-top:3px;margin-bottom:3px; margin-right:3px;"'+
					'command="ok"'+
					'class="toolbarBtn btn btn-success menuBtn pull-right glyphicon glyphicon-ok">'+
					'</button>';
			
				$(".WholeMainPaneDialog .toolbarDiv").append(btnOkHtml);
				
				$(".WholeMainPaneDialog .toolbarBtn[command='ok']").on('click', that.model.documentEditMetadata);
			
			  },null,this);
	},
    show: function(placeholderObj)
    {
        this.render();
        $(placeholderObj).append(this.el);
    },
	onMainMenuCollapsed : function(){
	   this.dataGrid.bootstrapTable('uncheckAll'); 	
	   this.dataGrid.bootstrapTable('hideColumn', 'SelectRow');
	},
	onDblClickRow:function(e)
	{
		App.Controllers.masterPage.onMenuCommandDataGrid(Appn.MenuCommands.DGridViewDocument);
	},
    onWindowResize:function(e)
    {
        var that = e.data;
        var newHeight = that.getDataGridHeight();
        var tables = $('.VolDocumentGrid');
        for (var i=0;i<tables.length;i++)
        {
            var tblItem = tables[i];
            $(tblItem).bootstrapTable( 'resetView' , {height: newHeight} );    
        }
    },
    getDataGridHeight: function()
    {
        var pWidth = $('#mpMainPane').width();
        var pHeight = $('#mpMainPane').height();
        if (pWidth > pHeight) 
        {
            // landscape
            return pHeight-30; 
        }
        else
        {
            // portrait
            return pHeight-80;
        }
    },
    initialize: function()
    {
        //$( "#mpMainPane" ).resize(this,this.onWindowResize); 
        App.winResize.addHandler("DfmVolume",this,this.onWindowResize);
    }
    });

	
return Appc.ViewDfmVolumeClass;	
});