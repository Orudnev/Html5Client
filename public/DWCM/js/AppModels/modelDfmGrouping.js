define(["backbone","modelDfmVolume","viewDfmVolume"],function(Backbone,DFMVolumeModel){
var instance =
	Backbone.Model.extend(
{
    defaults: {
        groupingName: "",
        mainView:null,
        mainViewSelector:null,
        selectedGroupId: -1,
        volumeName:"",
        underlyingVolumeObject:null
    },
    readGrouping:function(strGroupingId)
    {
        var selNode = App.Models.ddTree.getSelectedNode();
        for (var i=0;i<selNode.groupings.length;i++)
        {
            //find strGroupingId in groupings
            var item = selNode.groupings[i];
            if (item.id == strGroupingId)
            {
                var groupingName = item.name;
                this.set("groupingName",groupingName);
                // read grouping from server
                showWaitIndicator();
                wmw_getVolumeGrouping(App.getSessionId(),selNode.text,groupingName,this,
                                      this.onReadGroupingCompleted);
                break;
            }
        }        
    },
    onReadGroupingCompleted:function(bresult,result,errorStr,that)
    {
        hideWaitIndicator();
        that.set("groupingObject",result);
        App.Views.masterPage.renderFilterGroupingTab(Appn.Icons.DDtreeIcon.groupingIcon,result.name,true);
        that.set("selectedGroupId",0);
        that.get('mainView').render();
        that.openGrouping(result.data[0]);
    },
    openGrouping:function(groupingObject)
    {
		var volm = new Appc.ModelDfmVolumeClass();
		var query = groupingObject.sysGroup_Query;
		var volumeModel = new Appc.ModelDfmVolumeClass();
		volumeModel.set("volId",-1);
		volumeModel.set("volumeName",this.get("volumeName"));
		volumeModel.set("query",query);
		volumeModel.set("groupingName",this.get("groupingName"));
		var volumeMainView = new Appc.ViewDfmVolumeClass();
		volumeMainView.model = volumeModel;
		volumeModel.set("mainView",volumeMainView);
		this.set("underlyingVolumeObject",volumeModel);
		volumeModel.open();
    },
    selectGrouping:function(rowId,row)
    {
        this.set("selectedGroupId",rowId);
        this.get('mainView').highlightSelectedGrouping();
        this.openGrouping(row);
    },
    initialize: function()
    {
        
    }
}); 

return instance;	
});
	