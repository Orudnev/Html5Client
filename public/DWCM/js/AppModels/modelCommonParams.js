define(['backbone'],function(Backbone){
var instance =
    Backbone.Model.extend({
    defaults: 
    {
        dsnList : '',
        selectedDsn: '',
        currentVol:{model:{},view:{}},
        currentFilteredVol: {model:{},view:{}},
        currentGrouping: {model:{}},
		globalSearchStr:'',
		globalSearchLastResult:[]
    },
    getDsnListAsFieldArray: function()
    {
        var dsnlist = this.get(Appn.Model.DsnList);
        var rv = [];
        for(var i=0;i<dsnlist.length;i++)
        {
            rv.push({"DSN":dsnlist[i]});
        }
        return rv;
    },
    initialize: function()
    {
        this.set(Appn.Model.selectedDsn,App.Models.settings.get(Appn.Model.Settings.dsn));
    },
    UpdateDsnList: function(handler)
    {
        wmw_GetDsnList(App.Models.settings.get(Appn.Model.Settings.userName),this,
                   function(dsnList,_this)
                   {
                        if (dsnList.length == 0)
                        {
                            showError(
                                stringFormat(App.localeData.errMesNoDsnForCurrUser,[App.Models.settings.get(Appn.Model.Settings.userName)])
                                        );
                            return;
                        }
                        _this.set(Appn.Model.DsnList,dsnList);
                        handler();
                    });        
    },
    getPathBarRootValue:function()
    {
        return "\\"+App.Models.commonParams.get(Appn.Model.selectedDsn);
    }
});//    C o m m o n P a r a m s              END

return instance;	
});
	