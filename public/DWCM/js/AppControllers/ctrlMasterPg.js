define(["ctrlEmailSending"],function(){
var instance =	
{
		isDoInitInProcess: false,
			 doInit: function()
			 {
				if (App.Controllers.masterPage.isDoInitInProcess) return;
				require(["viewMasterPage"],function(MasterPage)
				{
					App.Views.masterPage = new MasterPage();
					App.Views.masterPage.model = App.Models.commonParams;
					App.Views.masterPage.render(); 
					App.Models.ddTree.reLoadAll();
					App.Controllers.masterPage.isDoInitInProcess = true; 
				});
			 },
			 onToolbarButtonClick:function(e)
			 {
				 var strCommand = $(e.currentTarget).attr('dwcmCommand');
				 if (!strCommand) return; 
				 if (strCommand ==Appn.MenuCommands.ShowDDTree)
				 {
					 //Show DDTree in popup
					 App.Views.masterPage.ddSwitchActiveDDTree($('#ddtreeLeftPane'),$('#ddtreeDropDown'));
					 $('.dropdown-toggle').dropdown();
				 }
				 else if(strCommand ==Appn.MenuCommands.AppSettings)
				 {
					require(["viewAppSettings",,"bootstrapSelectPicker"],function(viewAppSettingsClass)
				 	{					 
					 if (App.Views.AppSettings==undefined)
					 	App.Views.appSettings = new viewAppSettingsClass();
					 App.Views.appSettings.render();
					});
					return;
					/*	
					 AppHelper_ShowDialogEx(Appn.Dialogs.GenSettingsDialog,Appn.Model.Settings,false,
							function(e)
							{
								var dlgSelector = e.data;
								$("#"+dlgSelector).modal('hide');
							}
							);                
							*/
				 }
				 else if(strCommand == Appn.MenuCommands.GoToDF ||
						 strCommand == Appn.MenuCommands.GoToWF ||
						 strCommand == Appn.MenuCommands.GoToQST
						)
				 {
					 if(strCommand == Appn.MenuCommands.GoToDF) App.Models.ddTree.setSelectedNode("DF");
					 if(strCommand == Appn.MenuCommands.GoToWF) App.Models.ddTree.setSelectedNode("WF");
					 if(strCommand == Appn.MenuCommands.GoToQST) App.Models.ddTree.setSelectedNode("QST");
				 }
				 else if(strCommand ==Appn.MenuCommands.Logout)
				 {
					 wmw_Logout(App.getSessionId(),
						function(){
						 App.Models.settings.storePersist(Appn.Model.Settings.lastSessionId,"");
						 App.navigate.LoginPage("");
					 	}
							   );
				 }
				 else if(strCommand ==Appn.MenuCommands.OpenVolume)
				 {
					 App.Controllers.masterPage.doOpenVolume();
				 }
				 else if(strCommand == Appn.MenuCommands.UDFilter)
				 {
					 App.Controllers.masterPage.openSearchDialog();
				 }
				 else if(strCommand == Appn.MenuCommands.GlobalSearch)
				 {
					 require(['jsx!glbSearch'],function(fjsx){
						 fjsx();
					 });
				 }				 
				 else if(strCommand == Appn.MenuCommands.AutoFilter)
				 {
					 App.Controllers.masterPage.openAutoFilterDialog();
				 }
				 else if(strCommand == Appn.MenuCommands.OpenVolumeFilterOrGrouping)
				 {
					 setTimeout(
						 function() 
						 {
							// resize event firing need to force App_ViewClasses.DfmVolume.onWindowResize calling  
							// it need to fix this case: user opens "All documents" in portrait orientation,
							// then opens filter in landscape orientation then changes tab from "Filter" to
							// "All documents" as result table in "All documents" displays as "Portrait" 
							// when actuallly orientation is "Landscape" 
							$(window).trigger('resize');    
						 },200);
				 }
			 },
			 onMenuCommandDdTree:function(invokedOn, selectedMenu)
			 {
				 var tvNodeId = $(invokedOn).attr('data-nodeid');
				 var cmdId = $(selectedMenu).attr('commandId');
				 var isDDTreePopup = $('.ddtree.active').attr('id')=="ddtreeDropDown";
				 if (isDDTreePopup)
				 {
					 //close popup ddTree window, since menu command is executed
					 $('.dropdown.open').removeClass('open');
				 }
				 var ddTreeNodeId = $($('.ddtree.active').treeview('getNode',tvNodeId)).attr('id');
			 },
			 onPdfViewerCloseButtonClicked:function()
			 {
				 AppHelper_ShowHidePdfDocument("hide");
			 },
			 onMenuCommandDataGrid:function(cmdId)
			 {
				 var volModel = Appc.getActiveVolumeModelObject();
				 var row = volModel.get("currentRow");
				 if (!cmdId || typeof(cmdId)!="string" )
					cmdId = $(this).attr("dwcmVolCommand");
				 if(cmdId == Appn.MenuCommands.DGridViewDocument)
				 {
					 AppHelper_ShowDocument(row);
				 }
				 if(cmdId == Appn.MenuCommands.DGridForms)
				 {
					require(["ctrlDfmForms"],function(ctrlDfmForms){
							ctrlDfmForms.init();
						});
				 }				 
				 if(cmdId == Appn.MenuCommands.DGridAddDocument)
				 {
					 volModel.get("mainView").renderAddDocForm();
				 }				 
				 if(cmdId == Appn.MenuCommands.DGridEditDocumentMetadata)
				 {
					 volModel.get("mainView").renderEditMetadataForm();
				 }				 
				 if(cmdId == Appn.MenuCommands.DGridAddAttachment)
				 {
					 volModel.get("mainView").renderAddAttachmentForm();
				 }
				 if(cmdId == Appn.MenuCommands.DGridDeleteDocument)
				 {
					 volModel.documentDelete();
				 }	
				 if(cmdId == Appn.MenuCommands.DGridDeleteAttachment)
				 {
					 volModel.attachmentDelete();
				 }		
				 if(cmdId == Appn.MenuCommands.DGridEmailSend)
				 {
					require(["ctrlEmailSending"],function(ctrlEmailSending){
						ctrlEmailSending.selectSendingType();
					});
					return;
				 }
				 if(cmdId == Appn.MenuCommands.DGridViewRelatedDocs){
					require(["ctrlRelations"],function(ctrlRelations){
						ctrlRelations.selectRelation();
					});
					return;
				 }
				 if(cmdId == Appn.MenuCommands.DGridViewSendingHistory)
				 {
					require(["ctrlSendingHistory"],function(ctrlSendingHistory){
							ctrlSendingHistory.init(row);
						});
					 
				 }
				 if(cmdId == Appn.MenuCommands.DGridViewAttachment)
				 {
					 var currAttIndex = volModel.get('attachments').currentRowIndex;
					 var currAtt = volModel.get('attachments').rows[currAttIndex];
					 AppHelper_ShowAttachment(currAtt);
				 }
				 if(cmdId == Appn.MenuCommands.DGridSaveSelected)
				 {
					 var selectedRows = volModel.get("mainView").getSelectedRows();
					 if (selectedRows.length<2){
						 //save single document
						 wmw_ViewDocument(App.getSessionId(),row.sys_docId,this,
						 function(bresult,docUrl,context)
						 {
							 window.downloadFile(docUrl);
						 });
					 }
					 else
					 {
						 //save multiple documents
						 var countOfPdfs = 0;
						 for (var i=0;i<selectedRows.length;i++)
						 {
							 var item = selectedRows[i];
							 if (item.sys_docType.toLowerCase().endsWith("pdf")) countOfPdfs++;
						 }
						 if (countOfPdfs>1){
							 //more than 1 PDF are selected,
							 //show options dialog ("save as zip/save in a single pdf")
							 var isNonPdf = (selectedRows.length != countOfPdfs);
							 var contentHtml = compileTemplate(App.Templates.dialogs.SaveSelectedAs);
							 $("#dialogContLvl1").dwcmDialog({
								title: App.localeData.dgrid_menuCmd_SaveSelected,
								buttons:{btnOk:true,btnCancel:true,btnMenu:false},
								contentHtml: contentHtml,
								isNonPdf: isNonPdf,
								onOkBtnClicked:function(ev,evData) 
								{
									var value = $('#SaveSelectedForm').find("input:checked").attr('value');
									$("#dialogContLvl1").dwcmDialog("remove");
									
									if (value == "zip")
									{
										App.Controllers.masterPage.doSaveAsZip(selectedRows);			
									}
									else
									{
										var pdfs = [];
										for(var i=0;i<selectedRows.length;i++)
										{
											var item = selectedRows[i];
											if (item.sys_docType.toLowerCase().endsWith("pdf"))
												pdfs.push(item);
										}
										App.Controllers.masterPage.doSaveInSinglePDF(pdfs);	
									}
								},
								onContentElementClicked:function(ev,evData) 
								{
									var value = $('#SaveSelectedForm').find("input:checked").attr('value');
									evData.dlgInstance.$wrapper.find(".inlineError").remove();
									if (value == "pdf")
									{
										if (evData.dlgInstance.options.isNonPdf)
										{
											var errorHtml = stringFormat('<div class="inlineError">{0}</div>',[App.localeData.wrnSomeOfSelectedDocsAreNotPDF]);
											
											evData.dlgInstance.$wrapper.find("form").append(errorHtml);
										}
									}
								}
							 });

						 }
						 else
						 {
							 //1 or none PDF is selected
							 App.Controllers.masterPage.doSaveAsZip(selectedRows);
						 }
					 }
				 }
				 if(cmdId == Appn.MenuCommands.DGridSaveSelectedAtt)
				 {
					 var checkedAttCount = volModel.get("mainView").getSelectedAttRows().length;
					 if(checkedAttCount>1) return; //is not implemented yet
					 var att = null;
					 if(checkedAttCount==1)
					 {
						 att = volModel.get("mainView").getSelectedAttRows()[0];	
					 }
					 else
					 {
						 //no attachments checked, save highlighted att
						 var currAttIndex = volModel.get('attachments').currentRowIndex;
						 att = volModel.get('attachments').rows[currAttIndex];
					 }
					 var attUrl = AppHelper_GetDownloadUrlAttachment(att);
					 window.downloadFile(attUrl);
				 }
				 if(cmdId == Appn.MenuCommands.DGridShowAttList)
				 {
					 //wait until row of attachment icon becomes current row
					 setTimeout(
						 function()
						 {
							 var volModel = Appc.getActiveVolumeModelObject();
							 var row = volModel.get("currentRow");
							 volModel.showAttachments(row);	 
						 },200);
				 }
				 
			 },
			 onGroupingClicked:function(groupId)
			 {
				 require(["modelDfmGrouping","viewDfmGrouping"],function(GrpModel,GrpView)
				 {
				 var selNode = App.Models.ddTree.getSelectedNode();
				 var volumeName = selNode.volumeInfo.name;
				 var newGgrouping = Appc.getCurrentGrouping(); 
				 newGgrouping.model = new GrpModel();
				 var view = new GrpView();
				 view.model = newGgrouping.model;
				 newGgrouping.model.set("volumeName",volumeName);
				 newGgrouping.model.set("mainView",view);
				 newGgrouping.model.set("mainViewSelector","#VolDocumentListPaneExt");
				 newGgrouping.model.readGrouping(groupId);
				 });
			 },
			 doOpenVolume:function()
			 {
				 require(["modelDfmVolume","viewDfmVolume"],function(VolModel,VolView)
				 {
					 var selNode = App.Models.ddTree.getSelectedNode();
					 var volumeId = selNode.id;
				 	 var currVol = App.Models.commonParams.get(Appn.Model.currentVol);
					 currVol.model = new VolModel();
					 currVol.model.set('volId',volumeId);					 
					 currVol.view = new VolView();
					 currVol.view.model = currVol.model;
					 currVol.model.set('mainView',currVol.view);
					 currVol.model.open();
				 });
			 },
			 doOpenFilter:function(filterObject)
			 {
				 require(["modelDfmVolume","viewDfmVolume"],function(VolModel,VolView)
				 {
					 var selNode = App.Models.ddTree.getSelectedNode();
					 var volumeId = selNode.id;
					 var volumeName = selNode.volumeInfo.name;
					 var fltVol = Appc.getCurrentFilteredVol();
					 fltVol.model = new VolModel();
					 fltVol.model.set("volId",-1);
					 fltVol.model.set("volumeName",volumeName);
					 fltVol.model.set("query",filterObject.filter.query);
					 fltVol.view = new VolView(); 
					 fltVol.view.model = fltVol.model;
					 fltVol.model.set('mainView', fltVol.view);
					 App.Views.masterPage.renderFilterGroupingTab(Appn.Icons.DDtreeIcon.filterIcon,filterObject.name);
					 fltVol.model.open();
				 });
			 },
		    doSaveAsZip:function(selectedRows)
			{
				 //save selected documents as zip
				 var dataToken = {isCancelled:false};
				 $("body").waitDialog({title:App.localeData.downloading,dataToken:dataToken,
				  onCancelButtonClicked: function(ev)
				  {
					  ev.data.dataToken.isCancelled = true;
				  } 
									  });
				 wmw_Document_GetZipLink(App.getSessionId(),selectedRows,dataToken,
					 function(bresult,docUrl,errorStr,dataToken)
					 {
					 	if(!bresult)
						{
							showError(errorStr);
							return;
						}
						if (!dataToken.isCancelled)
							window.downloadFile(docUrl);
						$("body").waitDialog("remove");
					 });	
			},
			doSaveInSinglePDF:function(selectedRows)
			{
				 var dataToken = {isCancelled:false};
				 $("body").waitDialog({title:App.localeData.downloading,dataToken:dataToken,
				  onCancelButtonClicked: function(ev)
				  {
					  ev.data.dataToken.isCancelled = true;
				  } 
									  });
				 wmw_Document_GetMergedPDFLink(App.getSessionId(),selectedRows,dataToken,
					 function(bresult,docUrl,errorStr,dataToken)
					 {
					 	if(!bresult)
						{
							showError(errorStr);
							return;
						}
						if (!dataToken.isCancelled)
							window.downloadFile(docUrl);
						$("body").waitDialog("remove");
					 });	
				
			},
			doUdFilter:function(sqlStr,JSONstr)
			{
				 require(["modelDfmVolume","viewDfmVolume"],function(VolModel,VolView)
				 {
					 encodedStrExpr = AppHelper_HtmlEnDeCode().htmlEncode(sqlStr);
					 encodedStrExpr = // it is strange, but server works correctly only if filter expr encoded 2 times
						 AppHelper_HtmlEnDeCode().htmlEncode(encodedStrExpr);  
					 
					 var selNode = App.Models.ddTree.getSelectedNode();
					 var volumeName = selNode.volumeInfo.name;
	 				 var volSettings = new AppHelper_VolumeSettingsClass(volumeName);
					 volSettings.settings.SearchExpression = JSONstr;
					 volSettings.save();
					 var srchVol = Appc.getCurrentFilteredVol();
					 srchVol.model = new VolModel();
					 srchVol.model.set("volId",-1);
					 srchVol.model.set("volumeName",volumeName);
					 srchVol.model.set("query",encodedStrExpr);
					 srchVol.view = new VolView(); 
					 srchVol.view.model = srchVol.model;
					 srchVol.model.set('mainView', srchVol.view);
					 App.Views.masterPage.renderFilterGroupingTab(Appn.Icons.DDtreeIcon.udFilterIcon,App.localeData.NewFilter);
					 srchVol.model.open();
				 });
			},
			doOpenUDFilter:function(volumeName,searchStr){
				require(["modelDfmVolume","viewDfmVolume"],function(VolModel,VolView)
				{
					 newSelNode = App.Models.ddTree.findPhysicalVolNodeByName(volumeName);
					 if (!newSelNode) 
						 throw "doOpenUDFilter: volume "+volumeNmae+" is not found";
					 App.Models.ddTree.setSelectedNode(newSelNode);
					 var srchVol = Appc.getCurrentFilteredVol();
					 srchVol.model = new VolModel();
					 srchVol.model.set("volId",-1);
					 srchVol.model.set("volumeName",volumeName);
					 srchVol.model.set("searchStr",searchStr);
					 srchVol.view = new VolView(); 
					 srchVol.view.model = srchVol.model;
					 srchVol.model.set('mainView', srchVol.view);					 
					 App.Views.masterPage.renderFilterGroupingTab(Appn.Icons.DDtreeIcon.udFilterIcon,"");
					 srchVol.model.open();
				});
			},
			doAutofilter:function(sqlStr)
			{
				 require(["modelDfmVolume","viewDfmVolume"],function(VolModel,VolView)
				 {
					 encodedStrExpr = AppHelper_HtmlEnDeCode().htmlEncode(sqlStr);
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
					 App.Views.masterPage.renderFilterGroupingTab(Appn.Icons.DDtreeIcon.filterAutoIcon,"");
					 srchVol.model.open();
				 });
			},
		
			openSearchDialog:function()
			{
				require(["modelDfmVolume","viewDfmVolume","bootstrapSelectPicker"],function(VolModel,VolView)
				{ 
					var selNode = App.Models.ddTree.getSelectedNode();
					var volumeId = selNode.id; 
					wmw_getMSD(App.getSessionId(),volumeId,"","",null,
					function (bresult,dataObj,token)
					{
						App.Views.masterPage.renderUDFilterForm(dataObj.oMSD);
					});		
				});
			},
			openAutoFilterDialog:function()
			{
				require(["modelAutoFilterDlg","viewAutoFilterDlg","bootstrapSelectPicker"],
				function(AutoFilterModel,AutoFilterView)
				{ 
					var selNode = App.Models.ddTree.getSelectedNode();
					var volumeId = selNode.id; 
					App.Views.AutoFilter = new AutoFilterView();
					if(App.Models.AutoFilter==null || App.Models.AutoFilter.get("volumeId")!=volumeId)
						App.Models.AutoFilter = new AutoFilterModel(volumeId);
					else
						App.Models.AutoFilter.start();
				});
			},
			onSessionExpired:function()
			{
				App.navigate.LoginPage("");
			}		
	}
return instance;	
});