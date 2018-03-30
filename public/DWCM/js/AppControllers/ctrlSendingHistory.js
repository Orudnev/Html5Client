define(["bootstrapTreeview"],function(){
var instance =	{
	settings:{
		currDoc:null,
		historyType:"" //"FPA", "PEC"	
	},
	selectedNode:null,
	volumeName: "",
	buildMenu:function(){
		var menuItems = [
			{commandId:Appn.MenuCommands.ViewHistoryItem,
			 commandCaption:App.localeData.view,
			 icon:"glyphicon glyphicon-plus"},
			{commandId:Appn.MenuCommands.ViewHistoryItemAsXml,
			 commandCaption:App.localeData.viewXml,icon:"glyphicon glyphicon-plus"}
		];
		$("#dialogContLvl1").dwcmDialog("refreshMenu",[menuItems]);	
	},
	treeData:null,
	init:function(currDoc){
		this.volumeName = Appc.getActiveVolumeModelObject().get("volumeName");
		this.settings.currDoc=currDoc;
		if (currDoc._L_FPAMID && currDoc._L_PECMID){
			this.selectHistoryType();
			return;
		} 
		if(currDoc._L_FPAMID) {
			this.settings.historyType = "FPA";
			this.showFpaHistoryDlg();
		} else {
			this.settings.historyType = "PEC";
		} 
		this.showHistory();
	},
	getHistory: function(){
		var reqObj = {
			volumeName:Appc.getCurrVolumeName(),
			messageId:this.settings.currDoc._L_FPAMID
		};
		if (this.settings.historyType == "PEC"){
			var methodName = "getPECHistory";
				reqObj.messageId = this.settings.currDoc._L_PECMID;
		}else{ 
				methodName = "getFPAHistory";
				reqObj.messageId = this.settings.currDoc._L_FPAMID;
		}
		
		AppHelper_JsonWsEx(methodName,reqObj,
		   function(resultObj)
		   {
				var xml = $.parseXML(resultObj.data);
				this.parseHistory(xml.children[0]);
		   }
		   ,this,true);

	},
	getParentMessage: function(node){
		if(typeof node.parentId != "undefined")	{
			return $('#dialogContLvl1 #historyTree').treeview("getNode",node.parentId);
		}
		return null;
	},
	onMenuItemClicked:function(ev,dataObj){
		var that = dataObj.dlgInstance.options.context;
	    var cmd = dataObj.menuItem.attr("command");
		var selNode = $("#dialogContLvl1 #historyTree").treeview("getSelected")[0];
		var timeStamp = "";
		if((cmd=="ViewHistoryItem")||cmd=="ViewHistoryItemAsXml"){
			var msgNode = selNode;
			var bodyType = "&FPA=MessageBody";
			var additionalAttr = "";
			if (selNode.type!="message") {
				bodyType = "&FPA=NotificationBody";
				msgNode = that.getParentMessage(selNode);
				additionalAttr = "&ID="+selNode.notifId;
				timeStamp = "&timeStamp=" + selNode.dt+additionalAttr;
			}
			if (cmd=="ViewHistoryItem") {
				var urlSuffix = 
				bodyType
				+"&volName=" + that.volumeName
				+"&msgId=" + msgNode.msgId
				+ timeStamp;
				var dataObj = {
					type: "historyMessage",
					urlSuffix: urlSuffix
				};
				AppHelper_ShowDocumentViaDocLens(dataObj);
			} else {
				// ViewHistoryItemAsXml
				var strURL =  getUrlBase()
						+ "FileViewerServlet?sessionId=" + App.getSessionId()
						+"&FPA=XMLbody"
						+"&volName=" + that.volumeName
						+"&msgId=" + msgNode.msgId;
				window.open(strURL, '_blank');; 				
			}
		}
	},
	onTreenodeSelected:function(event, node){
		var selNodes = $("#dialogContLvl1 #historyTree").treeview("getSelected");
		$("#dialogContLvl1").dwcmDialog("getOptions").buttonsDisabled.btnMenu = (selNodes.length==0);
		$("#dialogContLvl1").dwcmDialog("refreshButtons");
	},
	parseHistory: function(xnode,treeNode){
			var isPEC = this.settings.historyType=="PEC"
			var itemRootNode = ((isPEC)?"PECXML":"FPAXML");
			if (xnode.tagName != itemRootNode){
				throw "parseFpaHistory error: xNode is not "+itemRootNode+"L:"+xNode.outerHTML;
			}
			if (!treeNode) {
				this.treeData = [{}];
				treeNode = this.treeData[0];
			}
			treeNode.type = "message";
			treeNode.msgId = xnode.getAttribute("MSG_ID");
			var histAddrNode = ((isPEC)?"PECAddr":"FPAAddr");
			var emlToAttr = ((isPEC)?"PEC_TO":"FPA_TO");
			treeNode.emailTo = $(xnode).children(histAddrNode).attr(emlToAttr);
			treeNode.text = treeNode.msgId;
			treeNode.icon = "glyphicon glyphicon-envelope text-success";
			treeNode.nodes = [];
			if(!isPEC){
				var notifications = $(xnode).children("FPAAddr").children("Notifications").children("Notif");
				for(var i=0;i<notifications.length;i++){
					var notif = notifications[i];
					var newItem = {type:"notification"};
					newItem.dt = $(notif).attr("dt");
					newItem.notifId = $(notif).attr("ID");
					newItem.type = $(notif).attr("type");
					newItem.description = $(notif).attr("type");
					newItem.text = newItem.dt + " - " + newItem.type + " - " + newItem.description;
					if(newItem.type.toLowerCase().indexOf("error")==-1)
						newItem.icon = "glyphicon glyphicon-info-sign text-info";
					else
						newItem.icon = "glyphicon glyphicon-info-sign text-danger";
					treeNode.nodes.push(newItem);
				}
			}
			var prevSendings = $(xnode).children("PREVIOUS_SENDINGS");
			if (prevSendings.length>0){
				var nestedMessage = prevSendings.children(itemRootNode);
				if (nestedMessage.length>0){
					var newMessageItem = {};
					treeNode.nodes.push(newMessageItem);
					this.parseHistory(nestedMessage[0],newMessageItem);
				}
			}
			$("#dialogContLvl1").dwcmDialog("setWaitIndicator",[false]);
			$('#dialogContLvl1 #historyTree').treeview({data: this.treeData});	
			$("#dialogContLvl1").dwcmDialog("getOptions").buttons.btnMenu = true;
			$("#dialogContLvl1").dwcmDialog("refreshButtons");
			$("#dialogContLvl1 #historyTree").on('nodeSelected',$.proxy(this.onTreenodeSelected,this)); 
			$("#dialogContLvl1 #historyTree").on('nodeUnselected',$.proxy(this.onTreenodeSelected,this)); 
	}, 
	selectHistoryType:function(){
		var contentHtml = compileTemplate(App.Templates.dialogs.SelectHistoryType); 
		$("#dialogContLvl1").dwcmDialog({
			title: App.localeData.selectHistoryType,
			buttons:{btnOk:false,btnCancel:true,btnMenu:false},
			contentHtml: contentHtml,
			context: this,	
			onCustomButtonClicked: function(ev,dataObj){
				var that = dataObj.dlgInstance.options.context;
				that.settings.historyType = dataObj.targetElm.attr("histType");
				that.showHistoryDlg();
			}
		});
	},
	showHistoryDlg:function(){
		var contentHtml = compileTemplate(App.Templates.dialogs.SendingHistory,null);
		if (this.settings.historyType == "PEC"){
			var title = App.localeData.sendingHistoryPEC;
		}else{
				title = App.localeData.sendingHistoryFPA;
		}
		$("#dialogContLvl1").dwcmDialog({
			title: title,
			buttons:{btnOk:false,btnCancel:true,btnMenu:false},
			buttonsDisabled:{btnOk:false,btnCancel:false,btnMenu:true},
			contentHtml: contentHtml,
			context: this,
			onMenuBtnClicked: this.buildMenu,
			onMenuItemClicked: this.onMenuItemClicked
		}); 
		$("#dialogContLvl1").dwcmDialog("setWaitIndicator",[true]);
		this.getHistory();
	}
		
} // instance

return instance;		

});
