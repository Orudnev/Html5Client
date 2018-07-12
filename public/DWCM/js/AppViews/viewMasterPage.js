define(["jquery","backbone","utils"],function($,Backbone,Utils){
var instance =
		Backbone.View.extend({
    tagName: 'div',
    template: {},
 	docTypeIconFunction: function(value, row, rowIndex)
	{
		var iconSrc = AppHelper_GetDocTypeIcon(row.sys_docType);
		var shtml = stringFormat('<img height="20px;" src="{0}">',[iconSrc]);
		return shtml;
	},
	
	render: function()
	{
	 this.$el.html(this.template(this.model.toJSON() ));
	 $(".pageContainer").empty().append(this.el);
	 $(".cmdbutton").off('click').on('click',App.Controllers.masterPage.onToolbarButtonClick);
	 $("#DdTreeDropDownContainer").off('click').on('click',
	   function(e)                                  
	   {
		 // prevent closing of dropdown container after clicking on ddtree items
		 if ($(e.target)[0].nodeName.toUpperCase() != "BUTTON")
					e.stopImmediatePropagation();
	   });
	 $("#DdTreeDropDownContainer").off('show.bs.dropdown').on('show.bs.dropdown',
	   function(e)                                  
	   {
		 var oDropDown = $("#DdTreeDropDownContainer").find('.dropdown-menu');
		 var popupHeight = $(window).height() - $(e.currentTarget).offset().top;
		 oDropDown.css("height",popupHeight - 50);
	   });
	 $("#mainMenuBtn").off("click").on("click",this.renderMainMenu);
	 $("#mainMenuBtn").parent().off("hide.bs.dropdown").on("hide.bs.dropdown", 
							   function(){
		 							$(document).trigger(Appn.Events.MainMenuClosed,null);
	 						   });	
	 return this; 
	},
    renderRootNodePane:function()
	{
		 var templStr = App.Templates.rootNodePane.html;
		 var htmlStr = compileTemplate(templStr);
		 $("#mpMainPane").empty().append(htmlStr);
		 $(".cmdbutton").off('click').on('click',App.Controllers.masterPage.onToolbarButtonClick);
	},
	renderDDTree: function(ddtree)
	{
		var options = {
		  bootstrap2: false, 
		  showTags: false,
		  levels: 0,
		  disableManualUnselectNode: true,    
		  data: App.Models.ddTree.get('treeData'),
		  onRendered: function()
		  {
			  //Add context menu  
			  $(".ddtree.active li").contextMenu({
				menuSelector: "#contextMenuDDtree",
				menuBeforeSelected: function(e)
				  {
					 return App.Models.ddTree.onBeforeContexMenuShown(e); 
				  },
				menuSelected: function (invokedOn, selectedMenu) {
					App.Controllers.masterPage.onMenuCommandDdTree(invokedOn, selectedMenu);
					}
				}); 
			  App.Views.masterPage.renderPathBar();
		  }
		};
		$(ddtree).treeview(options);               
		$(ddtree).off('nodeExpanded');
		$(ddtree).on('nodeExpanded',function(event,node)
		{
			//store SelectedNode and Expanded node
			$('.ddtree').off('nodeExpanded');
			var mnode = App.Models.ddTree.getNode(node.id);
			if (mnode)
			{
				mnode.state = {expanded:true};
				setTimeout(function()
						   {
					//App.Models.ddTree.doRequestDDtreNodes(node.id);
				},200);
			}
		}
		 );
		$(ddtree).on('nodeCollapsed',function(event,node)
		{
			$('.ddtree').off('nodeCollapsed');
			var mnode = App.Models.ddTree.getNode(node.id);
			mnode.state = {expanded:false};
			var loadingNode = {id:'-1',text:App.localeData.ddtree_loading};
			App.Views.masterPage.renderDDTree();
		}
		);

		$(ddtree).on('nodeSelected nodeUnselected',function(event,node)
		{
			if (event.type=="nodeSelected")
			{
				App.Models.ddTree.setSelectedNode(node); 
			}
			else
			{
				App.Models.ddTree.setSelectedNode(null); 
			}
		}
		);

		//this.ddDrawSelection();

	},
	renderDFTabContainer: function(activeTab)
	{
		var templStr = App.Templates.dialogs[Appn.Dialogs.DFTabContainer];
		var htmlStr = compileTemplate(templStr);
		
		$('#DocListGrid').bootstrapTable('destroy');
		$("#mpMainPane").empty().append(htmlStr);

		$('#DF_tabContainer a[data-toggle="tab"]').off('show.bs.tab').on('show.bs.tab', function (e) {
			if ($(e.target).attr('href')=="#AllVolumesPane")
			{
				App.Models.ddTree.setSelectedNode("AllVolumes");
			}
			else
			{
				App.Models.ddTree.setSelectedNode("AllAreas");
			}
		});
	}, 
	renderMainMenu: function(event,cmObjType,cmObjIndex)
	{
		var selectedVolumeObj = Appc.getActiveVolumeModelObject();

		var mainMenuHtml = [];
		if (!cmObjType){
		// regular (not context ) menu begin
			if (selectedVolumeObj && selectedVolumeObj.get)
			{
				var volumeRights = selectedVolumeObj.get("volumeRights");
				var currRow = selectedVolumeObj.get('currentRow');
				var selectedRowsCount = selectedVolumeObj.get("mainView").getSelectedRows().length;
				var multipleDocsSelected = selectedRowsCount>1;
				// 1 add volume menu items
				if (currRow)
				{
					// 1.1  add menu items related to a single document
					if (volumeRights.AddDocRight)
					{
						mainMenuHtml.push(stringFormat(
						'<li><a href="#" dwcmVolCommand="'
						+Appn.MenuCommands.DGridAddDocument
						+'">'
						+'<span class="glyphicon glyphicon-plus" style="padding-right: 5px;"></span>{0}</a></li>',
						[App.localeData.dgrid_menuCmd_AddDocument]));	
						if(!multipleDocsSelected)
						{
							mainMenuHtml.push(stringFormat(
							'<li><a href="#" dwcmVolCommand="'
							+Appn.MenuCommands.DGridAddAttachment
							+'">'
							+'<span class="glyphicon glyphicon-plus" style="padding-right: 5px;"></span>{0}</a></li>',
							[App.localeData.dgrid_menuCmd_AddAttachment]));	
						}
					}
					if (!multipleDocsSelected && volumeRights.ModifyDocRight)
					{
						mainMenuHtml.push(stringFormat(
						'<li><a href="#" dwcmVolCommand="'
						+Appn.MenuCommands.DGridEditDocumentMetadata
						+'">'
						+'<span class="glyphicon glyphicon-pencil" style="padding-right: 5px;"></span>{0}</a></li>',
						[App.localeData.dgrid_menuCmd_EditMetadata]));	
					}
					if (volumeRights.DeleteDocRight && selectedRowsCount>0)
					{
						// at least 1 document checkbox is checked
						mainMenuHtml.push(stringFormat(
						'<li><a href="#" dwcmVolCommand="'
						+Appn.MenuCommands.DGridDeleteDocument
						+'">'
						+'<span class="glyphicon glyphicon-minus" style="padding-right: 5px;"></span>{0}</a></li>',
						[App.localeData.dgrid_menuCmd_DeleteDocument]));	
					}
					if (AppHelper_IsViewableDocType(currRow.sys_docType) && !multipleDocsSelected)
					{
						mainMenuHtml.push(stringFormat(
						'<li><a href="#" dwcmVolCommand="'
						+Appn.MenuCommands.DGridViewDocument
						+'">'
						+'<span class="glyphicon glyphicon-eye-open" style="padding-right: 5px;"></span>{0}</a></li>',
						[App.localeData.dgrid_menuCmd_ViewDocument]));	
					}
					if(selectedVolumeObj.get("volConfig").forms.length>0)
					{
						if ($(window).width()>=1024 && $(window).height()>=768){
							mainMenuHtml.push(stringFormat(
							'<li><a href="#" dwcmVolCommand="'
							+Appn.MenuCommands.DGridForms
							+'">'
							+'<span class="glyphicon glyphicon glyphicon-list" style="padding-right: 5px;"></span>{0}</a></li>',
							[App.localeData.dgrid_menuCmd_Forms]));	
						}
					}
					if (currRow || selectedRowsCount>0)
					{
						mainMenuHtml.push(stringFormat(
						'<li><a href="#" dwcmVolCommand="'
						+Appn.MenuCommands.DGridSaveSelected
						+'">'
						+'<span class="glyphicon glyphicon-download-alt" style="padding-right: 5px;"></span>{0}</a></li>',
						[App.localeData.dgrid_menuCmd_SaveSelected]));
					}
					if (!multipleDocsSelected && currRow.sys_hasAttachment.toLowerCase()=="true")
					{
						mainMenuHtml.push(stringFormat(
						'<li><a href="#" dwcmVolCommand="'
						+Appn.MenuCommands.DGridShowAttList
						+'">'
						+'<span class="glyphicon glyphicon-paperclip" style="padding-right: 5px;"></span>{0}</a></li>',
						[App.localeData.dgrid_menuCmd_ShowAttachments]));
					}
					mainMenuHtml.push(stringFormat(
					'<li><a href="#" dwcmVolCommand="'
					+Appn.MenuCommands.DGridEmailSend
					+'">'
					+'<span class="glyphicon glyphicon-envelope" style="padding-right: 5px;"></span>{0}</a></li>',
					[App.localeData.dgrid_menuCmd_EmailSend]));
					if ((currRow || selectedRowsCount>0) 
						&& (Appc.getCurrVolConfigParam("isPecVolume") || Appc.getCurrVolConfigParam("isPassiveFpaVolume"))
						&& (currRow._L_FPAMID || currRow._L_PECMID)){
						mainMenuHtml.push(stringFormat(
						'<li><a href="#" dwcmVolCommand="'
						+Appn.MenuCommands.DGridViewSendingHistory
						+'">'
						+'<span class="glyphicon glyphicon-envelope" style="padding-right: 5px;"></span>{0}</a></li>',
						[App.localeData.dgrid_menuCmd_ViewSendingHistory]));
					}
					if(selectedVolumeObj.get("volConfig").relations.length>0){
						mainMenuHtml.push(stringFormat(
						'<li><a href="#" dwcmVolCommand="'
						+Appn.MenuCommands.DGridViewRelatedDocs
						+'">'
						+'<span class="glyphicon glyphicon-link" style="padding-right: 5px;"></span>{0}</a></li>',
						[App.localeData.dgrid_menuCmd_ViewRelatedDocs]));
					}

				}
			}
			
			// 2 add volume-context items
			var vinfo = App.Models.ddTree.get('lastSelectedNode').volumeInfo 
			if ( vinfo){
				mainMenuHtml.push(stringFormat(
				'<li><a href="#" dwcmCommand="'
				+Appn.MenuCommands.UDFilter
				+'">'
				+'<span class="glyphicon glyphicon-filter" style="padding-right: 5px;"></span>{0}</a></li>',
				[App.localeData.dgrid_menuCmd_Filter]));

				mainMenuHtml.push(stringFormat(
				'<li><a href="#" dwcmCommand="'
				+Appn.MenuCommands.AutoFilter
				+'">'
				+'<span class="glyphicon glyphicon-filter" style="padding-right: 5px;"></span>{0}</a></li>',
				[App.localeData.dgrid_menuCmd_Autofilter]));

				mainMenuHtml.push(stringFormat(
				'<li><a href="#" dwcmCommand="'
				+Appn.MenuCommands.Grouping
				+'">'
				+'<span class="glyphicon glyphicon-paperclip" style="padding-right: 5px;"></span>{0}</a></li>',
				[App.localeData.menuCmd_Grouping]));


			}
			else{
				//global search
				mainMenuHtml.push(stringFormat(
				'<li><a href="#" dwcmCommand="'
				+Appn.MenuCommands.GlobalSearch
				+'">'
				+'<span class="glyphicon glyphicon-search" style="padding-right: 5px;"></span>{0}</a></li>',
				[App.localeData.dgrid_menuCmd_Search]));
				
			}
			
			// 3 add constant menu items
			if (mainMenuHtml.length>0)
				mainMenuHtml.push('<li role="separator" class="divider"></li>'); // add delimiter
			
			
			
			mainMenuHtml.push(stringFormat(
			'<li><a href="#" dwcmCommand="AppSettings"><span class="glyphicon glyphicon-cog" style="padding-right: 5px;"></span>{0}</a></li>',
			[App.localeData.settings]));
			mainMenuHtml.push(stringFormat(
			'<li><a href="#" dwcmCommand="Logout"><span class="glyphicon glyphicon-log-out" style="padding-right: 5px;"></span>{0}</a>',
			[App.localeData.disconnect]));	
		// regular (not context ) menu end
		}else{
		// context menu
			mainMenuHtml.push(stringFormat(
			'<li >'+
				'<a href="#" dwcmCommand="CmApply" objType="{0}" itemIndex="{1}">'+
					'<span class="glyphicon glyphicon-ok" style="padding-right: 5px;"></span>{2}'+
				'</a>'+
			'</li>',
			[cmObjType,cmObjIndex,App.localeData.cont_menuCmd_Apply]));
			if(cmObjType === 'udfilter'){
				// show "edit" command for user defined filters and don't show for groupings
				mainMenuHtml.push(stringFormat(
				'<li >'+
					'<a href="#" dwcmCommand="CmEdit" objType="{0}" itemIndex="{1}">'+
						'<span class="glyphicon glyphicon-pencil" style="padding-right: 5px;"></span>{2}'+
					'</a>'+
				'</li>',
				[cmObjType,cmObjIndex,App.localeData.cont_menuCmd_Edit]));
			}
			mainMenuHtml.push(stringFormat(
			'<li >'+
				'<a href="#" dwcmCommand="CmDelete" objType="{0}" itemIndex="{1}">'+
					'<span class="glyphicon glyphicon-remove" style="padding-right: 5px;"></span>{2}'+
				'</a>'+
			'</li>',
			[cmObjType,cmObjIndex,App.localeData.cont_menuCmd_Delete]));
			
		}
	
		$("#mainMenuItems").empty();
		for(var i=0;i<mainMenuHtml.length;i++)
		{
			$("#mainMenuItems").append(mainMenuHtml[i]);
		}

		$("#mainMenuItems a[dwcmCommand]").off('click').on('click',App.Controllers.masterPage.onToolbarButtonClick);
		$("#mainMenuItems a[dwcmVolCommand]").off('click').on('click',
															  App.Controllers.masterPage.onMenuCommandDataGrid);
	},
	renderDDGallery: function(){
		require(['jsx!ddGallery'],function(fjsx){
			fjsx();
		});
	},
	renderNavigationGridBrief: function(itemList)    
	{
		$("#infoPane").remove();
		var $placeHolder = $("#mpMainPane");
		var nc = App.Models.ddTree.get('lastPathNodeChain');
		if (nc.length==1)
		{
			//"DD" node
			this.renderRootNodePane();
			return;
		}
		else if (nc.length==2)
		{
			//"DF" or "WF" or "QST" node
			if (nc[1].id=="DF")
				return; // do not render "DF" node (it must automatically skip to AllAreas or AllVolumes)
		}
		else if (nc.length>=3)
		{
			if($("#DF_tabContainer").length==0) 
			{
				this.renderDFTabContainer(nc[2].id);
			}
			//"AllAreas" or "AllVolumes" node
			$("#DF_tabContainer .active").removeClass("active");
			if (nc[2].id=="AllAreas")
			{
				//AllAreas
				$("#DF_tabContainer .AllAreasPane").addClass("active");
				$placeHolder = $("#DF_tabContainer .tab-content .AllAreasPane");
			}
			else
			{
				//AllVolumes
				$("#DF_tabContainer .AllVolumesPane").addClass("active");
				$placeHolder = $("#DF_tabContainer .tab-content .AllVolumesPane");
			}
		}

		$placeHolder.empty();
		var itemTmpl = 
			"<div class='itemCell' tvRowId=''>"+  
			  "<div class='graphIcon ddTreeMiddleIcons' >"+
				"<img height='100%'>"+    
			  "</div>"+    
			  "<div class='itemText'></div>"+
			"</div>";

		for(var i=0;i<itemList.length;i++)
		{
			var itemData = itemList[i];
			var $itemTmpl = $(itemTmpl);
			$itemTmpl.attr('tvRowId',itemData.tvRowId);
			$itemTmpl.find('img').attr('src',itemData.graphIcon.src);
			$itemTmpl.find('.itemText').text(itemData.text);

			$placeHolder.append($itemTmpl);
		}
		$placeHolder.find(".itemCell div").off('click').on('click',function(e)
		{
			var tvRowId = parseInt($(e.currentTarget).parent().attr('tvRowId'));
			var td = App.Models.ddTree.get('treeData');
			var node = App.Models.ddTree.getNodeByTvRowId(tvRowId);
			App.Models.ddTree.setSelectedNode(node);
			App.Views.masterPage.showAndSelectNode(node);                
		}
												  );
	},
	renderNavigationGridDetail: function(itemList)
	{
		$("#infoPane").remove();
		$('#navGrid').bootstrapTable('destroy');
		var navGridPlaceHolder_html = 
			"<div id='navGridCont'>"+  
					  "<table id='navGrid' >"+
					  "</table>"+
			"</div>";
		$("#DFPane").empty().append(navGridPlaceHolder_html);

		if (!itemList || itemList.length==0) return;
		$('#navGrid').bootstrapTable(
			{
				showHeader:false,
				columns:
				[
					{field:'nodeImg',width:'10%',
					 formatter:function(value,row)
					 {
						 if (!row.graphIcon) return;
						 var imgtmpl = 
					 '<div class="graphIcon ddTreeMiddleIcons">'+
						 '<img height="100%" src="{0}">'+
					 '</div>';
						 return stringFormat(imgtmpl,[row.graphIcon.src]);
					 }
					},
					{field:'nodeInfo',formatter:function(value,row)
					 {
						var templStr = ""; 
						if(!row.nodeInfo) return;
						if (row.nodeInfo.typeNode == App.localeData.ddtreeNodeType_Area)
						   templStr = App.Templates.dialogs[Appn.Dialogs.ddtTblAreaInfoColumn];
						if (row.nodeInfo.typeNode == App.localeData.ddtreeNodeType_Volume) 
						   templStr = App.Templates.dialogs[Appn.Dialogs.ddtTblVolumeInfoColumn];    
						var htmlStr = compileTemplate(templStr,row);
						return htmlStr;
					 }
					}
				],
				data: itemList,
				onClickRow: function(row,elem)
				{
					App.Models.ddTree.setSelectedNode(row);
					App.Views.masterPage.showAndSelectNode(row);
				},
				height: $('#mpMainPane').height()-50
			});
	},
	renderPathBar: function()
	{
		require(['jsx!pathBar'],function(fjsx){
			fjsx();
		});

		/*
		var itemChain = App.Models.ddTree.getPathNodeChain();
		$('#pathBarContainer').pathControl({
		data: itemChain,
		onItemClicked:function(event,item)
		{
			App.Models.ddTree.setSelectedNode(item);
			App.Views.masterPage.ddDrawSelection();
		}
		});
		 */
     },
	renderInfo:function(dialogId)
	{
	 var htmlStr = "";
	 if (dialogId)
	 {
		 var templStr = App.Templates.dialogs[Appn.Dialogs.InfoDD];
		 htmlStr = compileTemplate(templStr);
	 }
	 $("#infoPane").remove();
	 $('#DocListGrid').bootstrapTable('destroy');
	 $("#mpMainPane").append(htmlStr);
	},
	renderDfVolTabContainer:function(mode)
	{
		//Volume Summary Tab
		var selNode = App.Models.ddTree.getSelectedNode();
		if (!mode)
		{
			// render whole dfVolTabContainer, make "Volume Info" section active
			var templStr = App.Templates.dfVolTabContainer.html;
			selNode.volumeType = Appc.getVolueType(selNode.graphIcon.src);
			var htmlStr = compileTemplate(templStr,selNode);
			$("#mpMainPane").empty().append(htmlStr);
			if (selNode && selNode.graphIcon)
				$("#dfVolSumaryPageR1C0 img").attr("src",selNode.graphIcon.src);
			// render Filter and groupings sections
			App.Models.ddTree.readSelectedVolumeInfo();
			$('#DF_VolTabContainer a[data-toggle="tab"]').off('show.bs.tab').on('show.bs.tab', 
					App.Controllers.masterPage.onToolbarButtonClick);

		}
		//fill "Volume Info" fields, render "Filter" and "Grouping" sections
		if (mode=="VolumeInfo")
		{
			$('#accrdInfo .bindable').each(function(index,obj,token)
			{
				var selNode = App.Models.ddTree.getSelectedNode();
				var fieldName = $(obj).attr("datafield");
				var fieldValue = selNode.volumeInfo[fieldName];
				if (fieldValue)
					$(obj).text(fieldValue);
			});
		}


		var renderFltGroup = function($placeHolder,itemList,imgsrc,mode)
		{
			var itemTmpl = 
				"<div class='itemCell' >"+  
				  "<div class='graphIcon ddTreeMiddleIcons' >"+
					"<img height='100%'>"+    
				  "</div>"+    
				  "<div class='itemText'></div>"+
				"</div>";
			$placeHolder.empty();	
			for(var i=0;i<itemList.length;i++)
			{
				var item = itemList[i];
				var imgsrcCurr = imgsrc;
				var $itemTmpl = $(itemTmpl);
				$itemTmpl.attr('itemId',item.id);
				if (imgsrc.indexOf("filter")>-1)
					$itemTmpl.attr('type',"filter");
				if (item.allowEdit && mode=="Filters"){
					imgsrcCurr = Appn.Icons.DDtreeIcon.udFilterIcon;
					$itemTmpl.attr('type',"udfilter");
				}
	
				if (imgsrc.indexOf("grouping")>-1)
					$itemTmpl.attr('type',"grouping");
				if (item.allowEdit && mode=="Groupings"){
					imgsrcCurr = Appn.Icons.DDtreeIcon.udGroupingIcon;
					$itemTmpl.attr('type',"udGrouping");
				}
				$itemTmpl.find('img').attr('src',imgsrcCurr);
				$itemTmpl.find('.itemText').text(item.name);
				$placeHolder.append($itemTmpl);
			}
		}
		var $placeHolder;
		if (mode=="Filters")
		{
			$placeHolder = $("#accrdFilters .VolSumTabObjCont");
			if (selNode.filters && selNode.filters.length>0){ 
				renderFltGroup($placeHolder,selNode.filters,Appn.Icons.DDtreeIcon.filterIcon,mode);
			}
		}
		if (mode=="Groupings")
		{
			$placeHolder = $("#accrdGroupings .VolSumTabObjCont");
			if (selNode.groupings && selNode.groupings.length>0)
				renderFltGroup($placeHolder,selNode.groupings,Appn.Icons.DDtreeIcon.groupingIcon,mode);
		}
		if ($placeHolder)
		{
			// click on Filter or Grouping item
			$placeHolder.find(".itemCell div").off('click').on('click',function(e)
			{
				if($(this).data("tapEventFired")){
					e.preventDefault();
					$(this).removeData("tapEventFired");
					return;
				}
					
				var itemId = $(e.currentTarget).parent().attr("itemId");
				if ($(e.currentTarget).parent().attr("type")=="filter")
				{
					App.Models.ddTree.getVolumeFilter(itemId,
						function(bresult,result,errorStr,dataToken)
						{
							dataToken.filter = result;
							App.Controllers.masterPage.doOpenFilter(dataToken);
						}
													 );
				}
				if ($(e.currentTarget).parent().attr("type")=="udfilter"){
					App.Controllers.masterPage.applyUdFilter(itemId);	
				}
				if ($(e.currentTarget).parent().attr("type")=="grouping")
				{
					App.Controllers.masterPage.onGroupingClicked(itemId);
				}
			});
			AppHelper_DisableSysContextMenu(true);
			$placeHolder.find('.itemCell[type="udfilter"] div').off('taphold').on('taphold',function(event){
				$(this).data("tapEventFired", true);
				var itemId = $(event.currentTarget).parent().attr("itemId");
				if (!AppHelper_IsMobileOrTablet()) itemId = -1;
				$('#mainMenuBtn').trigger('click',['udfilter',itemId]);
				$(this).off('mouseup').on('mouseup',function(e){
					setTimeout(function(elm) {
						$(this).off('mouseup');
						var itemId = $(elm).parent().attr("itemId");
						$('#mainMenuBtn').trigger('click',['udfilter',itemId]);
					}, 100,this);
				});
			});
			$placeHolder.find('.itemCell[type="udGrouping"] div').off('taphold').on('taphold',function(event){
				$(this).data("tapEventFired", true);
				var itemId = $(event.currentTarget).parent().attr("itemId");
				if (!AppHelper_IsMobileOrTablet()) itemId = -1;
				$('#mainMenuBtn').trigger('click',['udGrouping',itemId]);
				$(this).off('mouseup').on('mouseup',function(e){
					setTimeout(function(elm) {
						$(this).off('mouseup');
						var itemId = $(elm).parent().attr("itemId");
						$('#mainMenuBtn').trigger('click',['udGrouping',itemId]);
					}, 100,this);
				});
			});

		}
	         },
	renderFilterGroupingTab:function(strIcon, tabButtonText, doNotRenderFilterGrid)
	{
	// remove 'active' state from all tab buttons of DF_VolTabContainer 
	$("#DF_VolTabContainer li").removeClass('active');  
	// remove 'active' state from all tabs of DF_VolTabContainer  
	$("#DF_VolTabContainer .tab-content .tab-pane").removeClass('active');  

	var extTabButtonHtml= 
		'<li class="extTabButton active" role="presentation">'+
		'   <a  href="#VolDocumentListPaneExt"'+
		'       aria-controls="profile"'+ 
		'       role="tab"'+ 
		'       dwcmCommand="OpenVolumeFilterOrGrouping"'+
		'       data-toggle="tab"> '+ 
		'       <img src="{0}" style="height: 17px;display: inline-block; padding-right: 3px;">{1}'
		'   </a> '+
		'</li> ';
	var filterGridHtml =  '<table id="DocListGrid_ExtTab" class="VolDocumentGrid"></table> ';
	if  (doNotRenderFilterGrid) filterGridHtml = ""; 
	var extTabContentHtml=        
		'<div role="tabpanel" class="tab-pane DocListDataGrid active" id="VolDocumentListPaneExt"> '+
		'    <div style="width:100%; height:0.5rem"></div> '+  
		filterGridHtml +
		'</div>';

	extTabButtonHtml = stringFormat(extTabButtonHtml,[strIcon,tabButtonText]);

	$("#DF_VolTabContainer .extTabButton").remove()
	$("#DF_VolTabContainer .nav.nav-tabs").append(extTabButtonHtml); 
	$("#VolDocumentListPaneExt").remove(); 
	$("#DF_VolTabContainer .tab-content").append(extTabContentHtml);
	$('#DF_VolTabContainer a[data-toggle="tab"]').off('show.bs.tab').on('show.bs.tab', 
					App.Controllers.masterPage.onToolbarButtonClick); 
	},
	renderUDFilterForm:function(msd,filterCaption)
	{
		var formHtml = App.Templates.dialogs[Appn.Dialogs.UDFilterForm];
		formHtml = compileTemplate(formHtml,null);
		var $formHtml = $(formHtml)
		if (!filterCaption) filterCaption = App.localeData.NewFilter;
		var model = {	title: filterCaption,
						allowTitleEdit:true,
						strHtmlContent:$formHtml[0].outerHTML,
						titleIcon:'glyphicon-filter'};
		
		AppHelper_ShowWholeMainPaneDialog(model,
			  function(token)
			  {
				var volSettings = new AppHelper_VolumeSettingsClass(token.msd.volumeName);
			    var exprLst = []; 
				try
				{
					 var udFilters  = volSettings.settings.udFilters;
					 if(token.filterCaption){
						var result = udFilters.find(function(item){return item.caption==token.filterCaption});
						if (result)
							exprLst = result.exprList;
					 }
				}
				catch(err)
				{}
				$("#exprEditor").expressionEditor({
				fields:token.msd.jFields,
				exprList: exprLst
				});
				//remove main menu button (with its container) and get control of the form via ajaxForm plugin
				$(".WholeMainPaneDialog .menuBtnDiv").remove();
				
				// make space for toolbar buttons wider
				//$($(".WholeMainPaneDialog .row div")[0]).removeClass("col-xs-8").addClass("col-xs-6")			
				//$($(".WholeMainPaneDialog .row div")[1]).removeClass("col-xs-4").addClass("col-xs-6")			
				// Add Ok button 	
				var btnOkHtml = 
					'<button type="button" style="margin-top:3px;margin-bottom:3px; margin-right:3px;"'+
					'command="ok"'+
					'class="toolbarBtn btn btn-success menuBtn pull-right glyphicon glyphicon-ok">'+
					'</button>'+
					'<button type="button" style="margin-top:3px;margin-bottom:3px; margin-right:3px;"'+
					'command="save"'+
					'class="toolbarBtn btn btn-primary menuBtn pull-right glyphicon glyphicon-floppy-disk">'+
					'</button>';
			
				$(".WholeMainPaneDialog .toolbarDiv").append(btnOkHtml);
			
				$(".WholeMainPaneDialog .toolbarBtn[command='ok']").on('click', token,
					function(event)
					{
						$("#searchFormContainer .btnSubmit").off('click');
						var exprList = $("#exprEditor").expressionEditor("getExprList");
					    var strSql = AppHelper_BuildFilterExpression(exprList,event.data.msd.jFields);
						var filterCaption = $('.WholeMainPaneDialog.lvl0 h3 input').val();

						AppHelper_RemoveWholeMainPaneDialog();
						App.Controllers.masterPage.doFilter(strSql,filterCaption);
					}
			    );
				$(".WholeMainPaneDialog .toolbarBtn[command='save']").on('click', token,
					function(event)
					{
						var token = event.data;
						var filterCaption = $('.WholeMainPaneDialog.lvl0 h3 input').val();
						if (!filterCaption) filterCaption = App.localeData.NewFilter; 
						var exprList = $("#exprEditor").expressionEditor("getExprList");
						App.Controllers.masterPage.saveFilter(filterCaption,exprList);
						App.Models.ddTree.readStoredUdFilters();
						App.Views.masterPage.renderDfVolTabContainer("Filters");
					}
			    );
			  },null,{that:this,msd:msd,filterCaption:filterCaption});
	},
	renderUDGroupingForm:function(msd,groupingCaption)
	{
		contentHtml = 	'<table id="SelectFieldTable">'+

						'</table>';
		var grpDlgModel = {
			volumeName: msd.volumeName,
			groupingCaption: "",
			rows:[],
			onSelectionChanged:function(){
				var selRows = $('#SelectFieldTable').bootstrapTable('getSelections');
				$("#dialogContLvl1").dwcmDialog('setBtnState',['ok',selRows.length==0]);
				$("#dialogContLvl1").dwcmDialog('setBtnState',['customBtnCmd',selRows.length==0]);	
			},
			onSaveButtonClicked:function(){
				var grpCaption = $('#dialogContLvl1 h3 input').val();
				this.groupingCaption = grpCaption; 
				var selRows = $('#SelectFieldTable').bootstrapTable('getSelections');
				var selectedFields = [];
				for(var i=0;i<selRows.length;i++){
					selectedFields.push(selRows[i].fldName);	
				}
				App.Controllers.masterPage.saveUdGrouping(grpCaption,selectedFields);
				App.Models.ddTree.readStoredUdGroupings();
				App.Views.masterPage.renderDfVolTabContainer("Groupings");
			},
			onOkButtonClicked:function(){
				var selRows = $('#SelectFieldTable').bootstrapTable('getSelections');
				var fldList = [];
				for(var i=0;i<selRows.length;i++){
					fldList[i] = selRows[i].fldName;
				}
				this.grpCaption = $('#dialogContLvl1 h3 input').val();
				$("#dialogContLvl1").dwcmDialog("remove");
				App.Controllers.masterPage.applyUdGrouping(this.volumeName,fldList,this.grpCaption);
			}
		};
		for(var i=0;i<msd.jFields.length;i++){
			var rowItem = {isSelected:false,fldName:msd.jFields[i].name};
			grpDlgModel.rows.push(rowItem);
		}

		if (!groupingCaption) groupingCaption = App.localeData.NewGrouping;
		$("#dialogContLvl1").dwcmDialog({
			title: groupingCaption,
			allowTitleEdit:true,
			titleGlyphIcon:"glyphicon-paperclip",
			buttons:{btnOk:true,btnCancel:true,btnMenu:false,btnCustomCmd:true},
			buttonsDisabled:{btnOk:true,btnCancel:false,btnMenu:false,btnCustomCmd:true},
			btnCustomCmdGlyphIcon:"glyphicon-floppy-disk",
			onBtnCustomCmdClicked: $.proxy(grpDlgModel.onSaveButtonClicked,grpDlgModel),
			contentHtml: contentHtml,
			context: this,
			onRendered: $.proxy(function(){
							$('#SelectFieldTable').bootstrapTable({
                        	columns : [
								{	field: 'isSelected',
									checkbox: true
									},
								{	field: 'fldName',
									title: "Select grouping fields"}	
									],
							data: grpDlgModel.rows,
							onCheck:grpDlgModel.onSelectionChanged,
							onUncheck:grpDlgModel.onSelectionChanged,
							onCheckAll:grpDlgModel.onSelectionChanged,
							onUncheckAll:grpDlgModel.onSelectionChanged
							});
								      							
						},grpDlgModel),	
			onOkBtnClicked: $.proxy(grpDlgModel.onOkButtonClicked,grpDlgModel)
			});
	},
	getBtnDDTreeAsTblOrderAttrs:function()
	{
		//set the "next" command as "set order to Abc" and current state as "Order = struct"
		var rv = {dwcmCommand:Appn.MenuCommands.NavGridOrder_Abc,glyphIcon:"dwcmIcon-tree"};  //"structured" order
		if(App.Models.settings.get(Appn.Model.Settings.ddTreeSortOrder)==Appn.MenuCommands.NavGridOrder_Abc)
		{
			//toggle the "next" command as "set struct order" and set current state as "Order = Abc"
			rv = {dwcmCommand:Appn.MenuCommands.NavGridOrder_Struct,glyphIcon:"glyphicon-th-list"}; //"flat" order
		}
		return rv;
	},
	ddSwitchActiveDDTree:function($oldElement,$newElement)
	{
		$oldElement.removeClass('active');
		$newElement.addClass('active');
		this.renderDDTree($newElement); 
		var ddm = $newElement.find('.dropdown-menu');
	},
	ddDrawSelection: function()
	{
		var selNode = App.Models.ddTree.getSelectedNode(); 
		if (!selNode) return; 
		if (selNode.id=="DD")  
		{
			var selnodes = $('.ddtree.active').treeview('getSelected',treeNode,{ silent: false });
			$('.ddtree.active').treeview('unselectNode',selnodes[0],{ silent: false });
			return;
		}
		var selNodeId = selNode.tvRowId;
		if (selNodeId == -1) return;
	},
	showAndSelectNode:function(nodeOrTvNodeId)
	{
	 var nodeId = nodeOrTvNodeId;
	 if(nodeOrTvNodeId.nodeId) nodeId = nodeOrTvNodeId.nodeId;
	 setTimeout(function(){
	 },200);
	},
			
	onWindowResize:function(e)
	{
	},        
	initialize: function()
	{
	//console.log("Console:"+App.Templates.masterPage.html); 
	this.template = _.template(App.Templates.masterPage.html);
	}
        
    });

	
return instance;	
});
