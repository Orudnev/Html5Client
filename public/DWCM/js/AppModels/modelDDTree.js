define(["jquery","backbone","utils"],function($,Backbone,Utils){
var instance =
     Backbone.Model.extend({
    defaults: 
    {
        treeData : [],
        lastSelectedNode: null,
        lastPathNodeChain:[]
    },
    doRequestDDtreNodes:function(nodeId)
    {
        var rs = new requestStack();
        rs.pushElement({id:nodeId});
        var token = {areaId:nodeId,that:this,requestStack:rs};
        wmw_getDDareaMembers(App.getSessionId()
                            ,nodeId,token,this.doRequestDDtreNodesHandler);

    },
    doRequestDDtreNodesHandler: function(bResult,xResult,token)
    {
        if (bResult==false)
            console.log(token.areaId+" error " + xResult);
        token.requestStack.popElement(token.areaId);
        App.Controllers.masterPage.isDoInitInProcess = false; 
        if (token.areaId == null)  
        {
            //Init tree
            
            var storageRootNodes = 
                [{id:"AllAreas",
                  text:App.localeData.ddtree_AllAreas,
                  captionClass:Appn.IconTypes.ddTreeMiddleIcons,
                  graphIcon:{src:Appn.Icons.DDtreeIcon.areaIconR,class:Appn.IconTypes.ddTreeMiddleIcons},
                  parentNodeId: "DF",
                  state:{expanded:false},
                  nodes:[]
                 },
                 {id:"AllVolumes",
                  text:App.localeData.ddtree_AllVolumes,
                  captionClass:Appn.IconTypes.ddTreeMiddleIcons,
                  graphIcon:{src:Appn.Icons.DDtreeIcon.allVolumes,class:Appn.IconTypes.ddTreeMiddleIcons},
                  parentNodeId: "DF",         
                  state:{expanded:false},
                  nodes:[]
                 }
                ];

            token.that.set('treeData',
                [  
                {
                    id:"DF",
                    text:App.localeData.ddtree_DF,
                    captionClass: Appn.IconTypes.ddTreeRootIcons,
                    graphIcon:{src:Appn.Icons.DDtreeIcon.storageIcon,class:Appn.IconTypes.ddTreeRootIcons},
                    parentNodeId: null,
                    state:{expanded:false},
                    nodes:storageRootNodes
                },
                {
                    id:"WF",
                    text:App.localeData.ddtree_WF,
                    captionClass:Appn.IconTypes.ddTreeRootIcons,
                    graphIcon:{src:Appn.Icons.DDtreeIcon.wfIcon,class:Appn.IconTypes.ddTreeRootIcons},
                    parentNodeId: null,
                },
                {
                    id:"QST",
                    text:App.localeData.ddtree_QST,
                    captionClass:Appn.IconTypes.ddTreeRootIcons,
                    graphIcon:{src:Appn.Icons.DDtreeIcon.qwestIcon,class:Appn.IconTypes.ddTreeRootIcons},
                    parentNodeId: null,
                }]);
        }
        var isNestedAreas = $(xResult).find('Area').length>0;
        if (!isNestedAreas && token.areaId != null)
        {
            //set terminate area icon
            parentArea = App.Models.ddTree.getNode(token.areaId);
            if (parentArea.parentNodeId!="AllAreas")
            {
                parentArea.graphIcon = {src:Appn.Icons.DDtreeIcon.areaIconT,class:Appn.IconTypes.ddTreeSmallIcons};
            }
            else
            {
                parentArea.graphIcon = {src:Appn.Icons.DDtreeIcon.areaIconRT,class:Appn.IconTypes.ddTreeSmallIcons};
            }
        }
        $(xResult).find('Area').each(
            function(token)
            {
               var isRootArea = (token.areaId == null);
               var iconSrc = (isRootArea?Appn.Icons.DDtreeIcon.areaIconRC:Appn.Icons.DDtreeIcon.areaIconC);   
               var oTreeData = token.that.get('treeData');
               var newArea = {
                   id: $(this).attr('ID'), 
                   text:$(this).attr('Name'),
                   captionClass:Appn.IconTypes.ddTreeSmallIcons,
                   graphIcon:{src:iconSrc,class:Appn.IconTypes.ddTreeSmallIcons},                   
                   nodes: [],
                   parentNodeId: null
               }; 
               var parentArea;    
               if (token.areaId == null)    
                  parentArea = App.Models.ddTree.getNode("AllAreas");
                  
               else
                  parentArea = App.Models.ddTree.getNode(token.areaId);   
               newArea.parentNodeId = parentArea.id;    
               parentArea.nodes.push(newArea); 
                
               token.requestStack.pushElement(newArea);
               var newtoken = {areaId:newArea.id,that:token.that,requestStack:token.requestStack};    
               wmw_getDDareaMembers(App.getSessionId()
                    ,newArea.id,newtoken,App.Models.ddTree.doRequestDDtreNodesHandler);
       
            },[token]);    
        $(xResult).find('Dir').each(
            function(token)
            {
               var oTreeData = token.that.get('treeData');
               var iconId    = $(this).attr('Icon');
               var iconSrc   = Appn.Icons.DDtreeIcon[iconId];    
               var newVolume = {id: $(this).attr('ID'), 
                                text:$(this).attr('Name'),
                                captionClass:Appn.IconTypes.ddTreeSmallIcons,
                                graphIcon:{src:iconSrc,class:Appn.IconTypes.ddTreeSmallIcons},                   
                                color: Appn.Colors.DDtreeColor[iconId],
                                parentNodeId: null}; 
               var parentArea;    
               if (token.areaId == null)    
                  parentArea = App.Models.ddTree.getNode("AllVolumes");
               else
                  parentArea = App.Models.ddTree.getNode(token.areaId); 
               newVolume.parentNodeId = parentArea.id;    
               parentArea.nodes.push(newVolume);    
            },[token]);    
        if (token.requestStack.isEmpty())
        {
            //ddTree loading completed
            App.Models.ddTree.defineTvRowIds();
            var nc = App.Models.ddTree.getPathNodeChain();
            if (nc && nc.length>0 && nc[nc.length -1])
            {
                //set selection to value stored in previous session
                App.Models.ddTree.setSelectedNode(nc[nc.length -1]);       
            }
            else
                App.Models.ddTree.setSelectedNode("DD");
            //App.Views.masterPage.renderDDTree($('.ddtree.active'));
        }
    },
    defineTvRowIds:function()
    {
        var tdata = this.get('treeData');
        var counter = 0;
        scanFunc = function(nodes,counter)
        {
            for (var i=0;i<nodes.length;i++)
            {
                var node = nodes[i];
                if (node.text=="SA1")
                    var stop=1;
                node.tvRowId = counter++;
                if (node.nodes && node.nodes.length>0)
                    counter = scanFunc(node.nodes,counter);
            }
            return counter;
        };
        counter = scanFunc(tdata,counter);
    },
    doDisplayDDTreeeItemsAlphabetically:function()
    {
        list = this.getTreeDataAsSortedList();
        $.each(list,function(i,nodeObj)
        {
            App.Models.ddTree.refreshNodeInfo(nodeObj);
        });
        this.setSelectedNode('AllAreas');
        var allAreasTvRowId = this.get('lastSelectedNode').tvRowId;
        App.Views.masterPage.showAndSelectNode(allAreasTvRowId);
        App.Views.masterPage.renderNavigationGridBrief(list);
    },    
    getVolumesCount:function()
    {
        var allv = this.getNode("AllVolumes");
        if (allv && allv.nodes) return allv.nodes.length;
        return 0;
    },
    getCurrentArea:function()
    {
        var nc = this.getPathNodeChain();
        if (nc.length==1)
            return this.get("treeData")[0];//rerurn "DF" node if there are no selected nodes
        var lastIndex = nc.length -1;
        return nc[lastIndex];
    },
    getNodeByLabel(nodeLabel,parentNode)
    {
        if (parentNode == null)
        {
            var td = this.get('treeData');
            if (nodeLabel == App.localeData.ddtree_DF) return td[0];
            if (nodeLabel == App.localeData.ddtree_WF) return td[1];
            if (nodeLabel == App.localeData.ddtree_QST) return td[2];
            return null;
        }
        
        for(var i=0;i<parentNode.nodes.length;i++)
        {
            var node = parentNode.nodes[i];
            if (node.text == nodeLabel) return node;
        }
        return null;
    },
    getNodeByTvRowId:function(tvRowId)
    {
        var scanFunc = function(nodes,tvRowId)
        {
           for (var i=0;i<nodes.length;i++)
            {
                var node = nodes[i];
                if(node.tvRowId && node.tvRowId == tvRowId) return node;
                if (node.nodes)
                {
                    var rv = scanFunc(node.nodes,tvRowId);
                    if (rv) return rv;
                }
            }
            return null;            
        }
        var rv = scanFunc(this.get('treeData'),tvRowId);
        return rv;
    },
    getNode:function(dirId)
    {
        var td = this.get('treeData');
        if(dirId=="DF") return  td[0];
        if(dirId=="WF") return td[1];
        if(dirId=="QST") return td[2];    
		
        if(dirId=="AllAreas") return td[0].nodes[0];
        if(dirId=="AllVolumes") return td[0].nodes[1];
        
        var nc = this.get('lastPathNodeChain');
        if (nc.length>1)
        {
            for(var i=0;i<nc.length;i++)
            {
                var item = nc[i];
                if (item.id == dirId) return item;
            }
        }
        rv = this.getNodea(this.get('treData'),dirId);
        return rv;
    },
    getNodea:function(node,dirId)
    {
        if (node == null) node = {nodes:this.get('treeData')};
        if (!node.nodes)
            return null;
        for(var i=0;i<node.nodes.length;i++)
        {
            var childNode = node.nodes[i];
            if (childNode.id == dirId) 
                return childNode;
            var nestedNode = this.getNodea(childNode,dirId);
            if (nestedNode != null) return nestedNode;
        }
        return null;
    },
    getPathBarValue: function()
    {
        var pathStr = "";
        var currNode = this.getSelectedNode();
        if (currNode)
        {
            //1 curr node is not empty, calculate path bar by the curr node value    
            for(;;)
            {
                pathStr = currNode.text + ((pathStr=="")?"":"\\") + pathStr;
                if (currNode.parentNodeId == null) break;
                var currNode = this.getNode(currNode.parentNodeId);
            }
            pathStr =  "\\"+Appc.dsn() + ((pathStr)?"\\":"")+pathStr;
        }
        else
        {
            // curr node empty, return last stored path bar value
            pathStr =  App.Models.settings.get(Appn.Model.Settings.lastPathBarValue);
        }
        if (!pathStr) 
        {
            // last stored path bar value is not defined, return root path
            pathStr = "";
            pathStr = "\\"+Appc.dsn() + ((pathStr)?"\\":"")+pathStr;
        }
        App.Models.settings.storePersist(Appn.Model.Settings.lastPathBarValue,pathStr);
        return pathStr;
    },
    getPathNodeChain:function()
    {
        var pathStr = this.getPathBarValue();
        var pathItemListStr = pathStr.split("\\");
        var dsn = App.Models.settings.get(Appn.Model.Settings.dsn);
        var td = this.get('treeData');
        var rootItem = {id:"DD",text:dsn,nodes:[td[0],td[1],td[2]]};
        if (pathItemListStr.length==2) 
        {
            this.set('lastPathNodeChain',[rootItem]);
            return [rootItem];
        }
    
        var chain = [rootItem];
        var td = this.get('treeData');
        var pnode = null;
        for (var i=2;i<pathItemListStr.length;i++)
        {
            var label = pathItemListStr[i];
            var node = this.getNodeByLabel(label,pnode);
            if (node) chain.push(node);
            pnode = node;
        }
        this.set('lastPathNodeChain',chain);
        return chain;
    },
    getSelectedNode: function()
    {
        var selNode = this.get('lastSelectedNode');
        return selNode;
    },
    getTreeDataAsList:function(pnode)
    {
        var nodeList = [];
        if (pnode && pnode.nodes)
        {
            for(var i=0; i<pnode.nodes.length;i++)
            {
                var node = pnode.nodes[i];
                nodeList.push(node);
            }
        }
        return nodeList;
    },
    getTreeDataAsSortedList:function()
    {
        //returns only areas sorted alphabetically
        var getNestedAreas = function(node)
        {
            var rv = [];
            for(var i=0;i<node.nodes.length;i++)
            {
                if (!App.Models.ddTree.isArea(node.nodes[i])) continue;
                var nestedAreas = getNestedAreas(node.nodes[i]);
                rv = rv.concat(nestedAreas);
                var areaItem = node.nodes[i];
                rv.push(areaItem);
            }
            return rv;
        }
        var allAreasAsArray = getNestedAreas(this.getNode("AllAreas"));
        allAreasAsArray.push(this.getNode("AllVolumes"));
        allAreasAsArray.sort(this.nodeCompareFunction_text);
        return allAreasAsArray;
    },
    getVolumeFilter:function(strFilterId,handlerFunc)
    {
        var selNode = this.getSelectedNode();
        for (var i=0;i<selNode.filters.length;i++)
        {
            //find strFilterId in filters
            var item = selNode.filters[i];
            if (item.id == strFilterId)
            {
                var filterName = item.name;
                // read filter from server
                wmw_getVolumeFilter(App.getSessionId(),selNode.text,filterName,item,handlerFunc
                                   );
            }
        }
    },
    getVolumeType:function(node)
    {
        for (var key in Appn.Icons.DDtreeIcon)
        {
            if (node.graphIcon && node.graphIcon.src == Appn.Icons.DDtreeIcon[key])
            {
                 if (key=="standardDirIcon") return App.localeData.volumeType_Standard;
                 if (key=="standardDirIconClosed") return App.localeData.volumeType_StandardClosed;
                 if (key=="standardDirIconConserved") return App.localeData.volumeType_StandardConserved;
                 if (key=="externalDirIcon") return App.localeData.volumeType_External;
                 if (key=="externalDirIconClosed") return App.localeData.volumeType_ExternalClosed;
                 if (key=="externalDirIconConserved") return App.localeData.volumeType_ExternalConserved;
                 if (key=="virtualDirIcon") return App.localeData.volumeType_Virtual;
            }
        }
        return "unknown volume type";
    },
	findPhysicalVolNodeByName:function(volName){
		var allVolList = App.Models.ddTree.getNode("AllVolumes").nodes;
		for(var i=0;i<allVolList.length;i++){
			volNode = allVolList[i];
			if (volNode.text==volName){
				return volNode;
			}
		}
		return null;
	},
    isArea:function(node)
    {
        if (node.id=="DD") return true;
        for (var key in Appn.Icons.DDtreeIcon)
        {
            if (node.graphIcon.src == Appn.Icons.DDtreeIcon[key])
                return (key.indexOf('Dir')==-1 && node.parentNodeId!=null);
        }
        return false;
    },
    isVolume:function(node)
    {
        var isRoot = (node.parentNodeId == null);
        return !this.isArea(node) && !isRoot;
    },
    initialize: function()
    {
    },
    nodeCompareFunction_text:function(a, b)
    {
        var aName = a.text.toLowerCase();
        var bName = b.text.toLowerCase(); 
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    },
    onBeforeContexMenuShown: function(e)
    {
        var tvNodeId = $(e.currentTarget).attr('data-nodeid');
        var tvNode = $('.ddtree.active').treeview('getNode',tvNodeId);
        var isVolume =  ($(tvNode).attr('icon') != Appn.Icons.DDtreeIcon.areaIcon);
        var rv = {doNotShowMenu: !isVolume};
        return rv;
    },
    readSelectedVolumeInfo:function()
    {
        var selNode = this.getSelectedNode();
        wmw_getVolumeInfo(App.getSessionId(),selNode.text,selNode,
        function(bresult,result,errorStr,dataToken)          
        {
            if (bresult)
            {
                dataToken.volumeInfo = result; 
                App.Views.masterPage.renderDfVolTabContainer("VolumeInfo");
            }
        }
        );
        wmw_getVolumeFilters(App.getSessionId(),selNode.text,selNode,
        function(bresult,result,errorStr,dataToken)          
        {
            if (bresult)
            {
                dataToken.filters = result; 
                //"result" is the list of DFM Filters
                App.Models.ddTree.readStoredUdFilters();
                App.Views.masterPage.renderDfVolTabContainer("Filters");
            }
        }
        );
        
        wmw_getVolumeGroupings(App.getSessionId(),selNode.text,selNode,
        function(bresult,result,errorStr,dataToken)          
        {
            if (bresult)
            {
                dataToken.groupings = result; 
                App.Views.masterPage.renderDfVolTabContainer("Groupings");
            }
        }
        );
        
    },
    readStoredUdFilters:function(){
        var selNode = App.Models.ddTree.getSelectedNode();
        volName = selNode.text;
        if (selNode.volumeInfo) volName = selNode.volumeInfo.name;
        var volSettings = new AppHelper_VolumeSettingsClass(volName); 
        var udFilters  = volSettings.settings.udFilters;
        var dfmFltCount = selNode.filters.length;
        for(var i=0;i<udFilters.length;i++){
            var udFilter = udFilters[i];
            var newItem = {id:i.toString(),name:udFilter.caption,allowEdit:true};  
            selNode.filters.push(newItem);
        }
    },
    refreshNodeInfo: function(node)
    {
        node.nodeInfo = 
            {typeNode:"", typePosition:"Unknown Type",subAreas:0,volumes:0,parentNodeCaption:"<none>"};
        for (var key in Appn.Icons.DDtreeIcon)
        {
            if (node.graphIcon && node.graphIcon.src == Appn.Icons.DDtreeIcon[key])
            {
                var isVolume = (key.indexOf('Dir')!=-1);
                if (isVolume)
                {
                    node.nodeInfo.typeNode = App.localeData.ddtreeNodeType_Volume;
                    node.nodeInfo.typeVolume = App.Models.ddTree.getVolumeType(node);
                }
                else
                {
                    node.nodeInfo.typeNode = App.localeData.ddtreeNodeType_Area;
                }
                var isRoot = false;
                var isTerminal = false;
                if ( key=="areaIconR" ||
                     key=="areaIconRT" || key=="areaIconRC")
                    isRoot = true;
                if ( key=="areaIconT" ||
                     key=="areaIconRT")
                    isTerminal = true;
                var posName = 
        ((isTerminal)?App.localeData.ddtreeNodeTypePosition_Terminal:App.localeData.ddtreeNodeTypePosition_NonTerminal)+
        ((isRoot)?","+App.localeData.ddtreeNodeTypePosition_Root:"");
                node.nodeInfo.typePosition = posName;
            }
        }
        var parentNode = App.Models.ddTree.getNode(node.parentNodeId);
        if (parentNode) 
            node.nodeInfo.parentNodeCaption = parentNode.text;

        if (node.nodes)
        {
            for(var i=0;i<node.nodes.length;i++)
            {
                var child = node.nodes[i];
                if (App.Models.ddTree.isArea(child))
                    node.nodeInfo.subAreas++;
                else
                    node.nodeInfo.volumes++;
            }
        }
    },
    reLoadAll: function()
    {
        this.doRequestDDtreNodes(null);
    },
    setSelectedNode: function(nodeObjOrDirId)
    {
        var dirId = nodeObjOrDirId;
        var selNodeObj = nodeObjOrDirId;
        if (nodeObjOrDirId && nodeObjOrDirId.id)
        {
            //Node object passed
            dirId = nodeObjOrDirId.id;
        }
        else
        {
            //DirId passed
            if (nodeObjOrDirId)
                selNodeObj = this.getNode(dirId);
        }
        this.set('lastSelectedNode',selNodeObj);
        var nc = this.getPathNodeChain();
        var list = null;
        if (dirId=='DD')
           list = nc[0];
        if (dirId=='DF')
        {
           //skip automatically from "DF" to "AllAreas"
           selNodeObj = this.getNode("AllAreas"); 
           this.set('lastSelectedNode',selNodeObj);    
           list = selNodeObj.nodes; 
        }
		//2do remove when "WF" and "QST" parts will be implemented  -- begin
		if (dirId=='DD' || dirId=="DF" || dirId=="WF" || dirId=="QST") 
		{
 		   //skip automatically to "AllAreas"
           selNodeObj = this.getNode("AllAreas"); 
           this.set('lastSelectedNode',selNodeObj);    
           list = selNodeObj.nodes; 
		}
		//2do remove when "WF" and "QST" parts will be implemented  -- end

		
        
        App.Views.masterPage.renderPathBar();
        if (selNodeObj && selNodeObj.id && this.isArea(selNodeObj))
        {
            if (selNodeObj.id=="AllAreas" &&
            App.Models.settings.get(Appn.Model.Settings.ddTreeSortOrder)==Appn.MenuCommands.NavGridOrder_Abc)
            {
                // Display all areas as a table sorted alphabetically
                return;
            }
            $.each(selNodeObj.nodes,function(i,nodeObj)
            {
                App.Models.ddTree.refreshNodeInfo(nodeObj);
            });
            list = this.getTreeDataAsList(selNodeObj);
        }
        //automatically switch order to ".NavGridOrder_Struct"
        if (nodeObjOrDirId)
        {
            //switch only in case node was selected (do not when node was unselected otherwise the order will be toggled)
            App.Models.settings.set(Appn.Model.Settings.ddTreeSortOrder,Appn.MenuCommands.NavGridOrder_Struct,{validate:true});
        }
        if (selNodeObj && App.Models.ddTree.isVolume(selNodeObj))
        {
            App.Views.masterPage.renderDfVolTabContainer();  
            return;
        }
        if (list)
            App.Views.masterPage.renderNavigationGridBrief(list);
    }
    
    }); 
	
return instance;	
});
